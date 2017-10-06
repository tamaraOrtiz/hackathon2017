import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import { AppHelper } from '../../helpers/app-helper';
import * as html2canvas from "html2canvas";
import * as L from 'leaflet';
import * as d3 from "d3";
import 'leaflet-search';
import { Slides } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-show-nivel',
  templateUrl: 'show-linea-accion.html',
  providers: [LineaAccionData]
})

export class ShowLineaAccionPage extends ShowBasePage  {
  item: any;
  chartsData: Array<any>;
  paraguayGeoJson: any;
  departamentoGeoJson: any;
  map: any;
  tabactive: any;
  openbar: any;
  alcanceNacional: any;
  ranges: {};
  count_view = 0;
  count_download = 0;
  events: any;
  maxAvance = Number.NEGATIVE_INFINITY;
  maxMeta = Number.NEGATIVE_INFINITY;
  unidad = null;


  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: LineaAccionData, public eventHandler: Events, public appHelper: AppHelper) {
      super(navCtrl, navParams, appHelper);
      this.item = navParams.get('item');
      this.openbar = appHelper.isDeskTop();
      this.tabactive = 'mapa';
      this.eventHandler.subscribe('lineasAccion:view:saved:success', (data) => {
        this.count_view = data;
      });
      this.eventHandler.subscribe('lineasAccion:download:saved:success', (data) => {
        this.count_download = data;
      });

    }
    changetab(_text){
      let self = this;
      self.tabactive = _text;
      if(_text == 'mapa') {
        setTimeout(function(){
          self.generateMap();
        }, 1000);
      } else if(_text == 'barra') {
        setTimeout(function(){
          self.generateStackChart();
        }, 1000);
      }
    }

    ionViewDidEnter(){
      let self = this;
      self.dataService.getEvents("lineasAccion", self.item.institucion+"_"+self.item.id).then(data => {
        self.events = data;
        if("view" in self.events){
          self.count_view = self.events["view"]
        }
        if("download" in self.events){
          self.count_download = self.events["download"]
        }
        self.getGeoJsonData().then(() => {
          self.generateMap();
        });
      });
    }

    goToSlide() {
      this.slides.slideNext(100);
    }

    gobackSlide() {
      this.slides.slidePrev(100);
    }

    getGeoJsonData() {
      let self = this;
      return new Promise<any>((resolve, reject) => {
        self.dataService.getDepartamentoParaguayMap().then(map => {
          self.departamentoGeoJson = map.features;
          self.dataService.getQuery(self.dataService.getLineasAccionDetalle(self.item.id, self.item.nivel, self.item.entidad, self.item.institucion), true).then(records => {
            self.chartsData = (records as any).info_departamento;
            self.unidad = (records as any).unidad;
            self.departamentoGeoJson.forEach( departamento => {
              for(let name of Object.keys(self.chartsData)) {
                let record = self.chartsData[name];
                if (departamento.properties.departamen === name) {
                  departamento.properties['name'] = name;
                  departamento.properties['unidad'] = self.unidad;
                  departamento.properties['meta'] = record.cant_prog;
                  departamento.properties['avance'] = record.cant_avance;
                  departamento.properties['value'] = {};
                  departamento.properties['value']['Metas'] = record.cant_prog;
                  departamento.properties['value']['Avances'] =  record.cant_avance + record.cant_promedio/(record.cantidad_denominador > 0 ? record.cantidad_denominador : 1);
                  let porcentaje = (departamento.properties['value']['Avances'] / (record.cant_prog > 0 ? record.cant_prog : 1));
                  departamento.properties['value']['Metas vs Avances'] =  Math.round(1000 * (porcentaje <= 1 ? porcentaje : 1))/10;
                  self.maxAvance = departamento.properties['value']['Avances'] > self.maxAvance ? departamento.properties['value']['Avances'] : self.maxAvance;
                  self.maxMeta = departamento.properties['value']['Metas'] > self.maxMeta ? departamento.properties['value']['Metas'] : self.maxMeta;
                }

                if (name === 'ALC. NACIONAL') {
                  self.alcanceNacional = {properties: {}};
                  self.alcanceNacional.properties['name'] = name;
                  self.alcanceNacional.properties['unidad'] = self.unidad;
                  self.alcanceNacional.properties['meta'] = record.cant_prog;
                  self.alcanceNacional.properties['avance'] = record.cant_avance;
                  self.alcanceNacional.properties['value'] = {};
                  self.alcanceNacional.properties['value']['Metas'] = record.cant_prog;
                  self.alcanceNacional.properties['value']['Avances'] =  record.cant_avance + record.cant_promedio/(record.cantidad_denominador > 0 ? record.cantidad_denominador : 1);
                  let porcentaje = self.alcanceNacional.properties['value']['Avances'] / (record.cant_prog > 0 ? record.cant_prog : 1);
                  self.alcanceNacional.properties['value']['Metas vs Avances'] =  Math.round(1000 * (porcentaje <= 1 ? porcentaje : 1))/10;
                  self.maxAvance = self.alcanceNacional.properties['value']['Avances'] > self.maxAvance ? self.alcanceNacional.properties['value']['Avances'] : self.maxAvance;
                  self.maxMeta = self.alcanceNacional.properties['value']['Metas'] > self.maxMeta ? self.alcanceNacional.properties['value']['Metas'] : self.maxMeta;
                }
              }
              if (departamento.properties.name == undefined) {
                departamento.properties['name'] = departamento.properties.departamen;
                departamento.properties['unidad'] = '';
                departamento.properties['meta'] = -1;
                departamento.properties['avance'] = -1;
                departamento.properties['value'] = {};
                departamento.properties['value']['Metas'] = -1;
                departamento.properties['value']['Avances'] = -1;
                departamento.properties['value']['Metas vs Avances'] = -1;
              }
            });
            self.dataService.getParaguayMap().then(map => {
              self.paraguayGeoJson = map.features;
              if(self.alcanceNacional){
                self.paraguayGeoJson.forEach( paraguay => {
                  paraguay.properties = self.alcanceNacional.properties;
                });
              };
              resolve(true);
            });
          });
        });
      });
    }

    generateStackChart() {
      let self = this;

      // set the dimensions and margins of the graph
      let margin = {top: 20, right: 20, bottom: 20, left: 20};
      let data = this.departamentoGeoJson.filter(function(d) { d.properties.meta != -1; });

      let width = 900;

      let height = data.length >= 10 ? 700 : data.length >= 5 ? 500 : 300 ;

      let y0 = d3.scaleBand()
      .rangeRound([margin.top, height-margin.bottom-margin.top])
      .paddingInner(0.1);

      let y1 = d3.scaleBand()
      .padding(0.05);

      let x = d3.scaleLinear()
      .rangeRound([0, width/2]);

      let z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6"]);

      let keys = ['Avances', 'Metas'];

      if(this.alcanceNacional){
        Object.assign(data, this.alcanceNacional);
      }
      y0.domain(data.map(function(d) { return d.properties.name; }));
      y1.domain(keys).rangeRound([0, y0.bandwidth()]);

      x.domain([0, d3.max(data, function(d) {
        return d3.max(keys, function(key) { return d.properties.value[key]; });
      })]).nice();

      let svg = d3.select("#graph")
      .append("svg")
      .attr("fill", "white")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("width", width/2)
      .attr("height", height-margin.bottom-margin.top)
      .attr("transform", "translate(100, 5)");
      svg.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d) { return "translate(0, " + y0(d.properties.name) + ")"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d.properties.value[key]}; }); })
      .enter().append("rect")
      .attr("y", function(d) { return y1(d.key); })
      .attr("x", margin.left)
      .attr("height", y1.bandwidth())
      .attr("width", function(d) { return x(d.value >= 0 ? d.value : 0); })
      .attr("fill", function(d) { return z(d.key); })
      .append("text")
      .attr("fill", "white")
      .text(function(d) { return x(d.value >= 0 ? d.value : 0); });

      svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y0))
      .attr("transform", "translate(" + margin.left + ", 0)");

      svg.append("g")
      .attr("class", "axis")
      .call(d3.axisBottom(x).ticks(null, "s"))
      .attr("transform", "translate("+ margin.left + ", "+ (height-margin.bottom-margin.top) +")")
      .append("text")
      .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5)
      .attr("dx", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Beneficiarios");

      let legend = d3.select("#pie-info-legend");

      legend.selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      keys.slice().reverse().forEach( key => {
        legend.append("p")
        .html(`<i style="background:${z(key)}"></i>
        <div style="margin-left: 18px;">
        <p class="program-name">${key}</p>
        </div>`);
      })
    }

    generateMap() {
      let self = this;

      self.ranges = {
        "Metas vs Avances": [100, 95, 90, 85, 80, 75, 70, 60, 40, 20, 10, 0],
        "Avances": self.appHelper.getRange(0, self.maxAvance, self.maxAvance < 10 ? 4 : 11),
        "Metas": self.appHelper.getRange(0, self.maxMeta, self.maxMeta < 10 ? 4 : 11)
      }

      let unidades = {
        "Metas vs Avances": {"nombre":"Porcentaje", "simbolo": "%", "titulo": "Progreso por departamento"},
        "Avances": {"nombre": self.unidad, "simbolo": self.unidad, "titulo": "Avances por departamento"},
        "Metas": {"nombre": self.unidad, "simbolo": self.unidad, "titulo": "Metas por departamento"},
      }

      self.map = L.map('map').setView([-23.88, -55.76], 6);

      let geoPorcentaje = new L.GeoJSON(self.departamentoGeoJson, {
        style: function (feature) {
          return (self.style(feature, 'Metas vs Avances'));
        },
        onEachFeature: function (feature: any, layer) {
          layer.on('click', function (e) {
            Object.keys((geoPorcentaje as any)._layers).map (key => {
              (geoPorcentaje as any).resetStyle((geoPorcentaje as any)._layers[key]);
            });

            (layer as any).setStyle({
              weight: 8,
              color: '#fcf9ff',
              dashArray: '',
              fillOpacity: 1
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties, 'Metas vs Avances');
          });
        }
      }).addTo(self.map);

      let geoMetas = new L.GeoJSON(self.departamentoGeoJson, {
        style: function (feature) {
          return (self.style(feature, 'Metas'));
        },
        onEachFeature: function (feature: any, layer) {
          layer.on('click', function (e) {
            Object.keys((geoMetas as any)._layers).map (key => {
              (geoMetas as any).resetStyle((geoMetas as any)._layers[key]);
            });

            (layer as any).setStyle({
              weight: 8,
              color: '#fcf9ff',
              dashArray: '',
              fillOpacity: 1
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties, 'Metas');
          });
        }
      });

      let geoAvances = new L.GeoJSON(self.departamentoGeoJson, {
        style: function (feature) {
          return (self.style(feature, 'Avances'));
        },
        onEachFeature: function (feature: any, layer) {
          layer.on('click', function (e) {
            Object.keys((geoAvances as any)._layers).map (key => {
              (geoAvances as any).resetStyle((geoAvances as any)._layers[key]);
            });

            (layer as any).setStyle({
              weight: 8,
              color: '#fcf9ff',
              dashArray: '',
              fillOpacity: 1
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties, 'Avances');
          });
        }
      });

      let type = 'Metas vs Avances';

      let geoAlcanceNacional = new L.GeoJSON(self.paraguayGeoJson, {
        style: function (feature) {
          return (self.style(feature,type));
        },
        onEachFeature: function (feature: any, layer) {
          layer.on('click', function (e) {
            Object.keys((geoAlcanceNacional as any)._layers).map (key => {
              (geoAlcanceNacional as any).resetStyle((geoAlcanceNacional as any)._layers[key]);
            });

            (layer as any).setStyle({
              weight: 8,
              color: '#fcf9ff',
              dashArray: '',
              fillOpacity: 1
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties, type);
          });
        }
      });

      let overlays = {
        "Metas vs Avances": geoPorcentaje,
        "Avances": geoAvances,
        "Metas": geoMetas
      };

      let capas = {};

      if(self.alcanceNacional){
        Object.assign(capas, {"Alcance Nacional": geoAlcanceNacional});
      }
      let info = (L as any).control();

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update(null, 'Metas vs Avances');
        return this._div;
      };

      info.update = function (props, layer) {
        this._div.innerHTML = `<h4>${unidades[layer].titulo}</h4>` +  (props ?
          '<b>' + props.name + '</b><br />' + (props.value[layer] == -1 ? 'Sin Datos' : `${self.appHelper.numberFormatter(props.value[layer])} ${unidades[layer]["simbolo"]}`)
          : 'Seleccione un departamento');
        };

        info.addTo(self.map);

        L.control.layers(overlays, capas, {position: 'bottomleft'}).addTo(self.map);

        let legend = (L as any).control({position: 'bottomright'});

        legend.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info legend');
          this.update('Metas vs Avances');
          return this._div;
        }

        self.map.on('baselayerchange', function (eventLayer) {
          if(eventLayer.name == 'Avances') {
            Object.keys((geoPorcentaje as any)._layers).map (key => {
              (geoPorcentaje as any).resetStyle((geoPorcentaje as any)._layers[key]);
            });
            Object.keys((geoMetas as any)._layers).map (key => {
              (geoMetas as any).resetStyle((geoMetas as any)._layers[key]);
            });

          } else if(eventLayer.name == 'Metas') {
            Object.keys((geoAvances as any)._layers).map (key => {
              (geoAvances as any).resetStyle((geoAvances as any)._layers[key]);
            });
            Object.keys((geoPorcentaje as any)._layers).map (key => {
              (geoPorcentaje as any).resetStyle((geoPorcentaje as any)._layers[key]);
            });
          } else if(eventLayer.name == 'Meta vs Avances') {
            Object.keys((geoAvances as any)._layers).map (key => {
              (geoAvances as any).resetStyle((geoAvances as any)._layers[key]);
            });
            Object.keys((geoMetas as any)._layers).map (key => {
              (geoMetas as any).resetStyle((geoMetas as any)._layers[key]);
            });
          }
          type = eventLayer.name;
          if(self.map.hasLayer(geoAlcanceNacional)){
            self.map.removeLayer(geoAlcanceNacional);
            geoAlcanceNacional.addTo(self.map);
            Object.keys((geoAlcanceNacional as any)._layers).map (key => {
              let layer = (geoAlcanceNacional as any)._layers[key];
              (geoAlcanceNacional as any).resetStyle(layer);
              (geoAlcanceNacional as any)._layers[key].setStyle(self.style(layer.feature, type));
            });
            geoAlcanceNacional.bringToFront();
          }
          legend.update(eventLayer.name);
          info.update(null, eventLayer.name);

        });

        self.map.on('overlayadd', function (eventLayer) {
          Object.keys((geoAlcanceNacional as any)._layers).map (key => {
            let layer = (geoAlcanceNacional as any)._layers[key];
            (geoAlcanceNacional as any).resetStyle(layer);
            (geoAlcanceNacional as any)._layers[key].setStyle(self.style(layer.feature, type));
          });
        });

        legend.update = function (layer){
          let grades = self.ranges[layer];
          this._div.innerHTML = `<h4>${unidades[layer]["nombre"]}</h4>`;
          for (let i = 0; i < grades.length -1; i++) {
            this._div.innerHTML +=
            '<i style="background:' + self.getColor(grades[i + 1], layer) + '"></i> ' +
            self.appHelper.numberFormatter(grades[i]) +' - '+ self.appHelper.numberFormatter(grades[i + 1]) + '<br>';
          }
          if(grades.length == 0) {
            this._div.innerHTML +=
            '<i style="background:#E5E5E5;"></i>0<br>';
          }
        };

        legend.addTo(self.map);

      }

      style(feature, layer) {
        let self = this;
        if(feature.properties.value === undefined){
          return;
        }
        let d = feature.properties.value[layer];
        return {
          fillColor:self.getColor(d, layer),
          weight: 1,
          opacity: 1,
          color: 'white',
          dashArray: '1',
          fillOpacity: 1
        };
      }

      opensidebar(){
        this.openbar = true;
      }

      closesidebar(){
        this.openbar = false;
      }

      getColor(d, layer) {
        let range = this.ranges[layer];
        if(range == undefined){
          return '';
        }
        if(range.length == 0){
          if(d == -1){
            return 'gray';
          } else if(d == 0) {
            return '#E5E5E5';
          }
        }
        return d >= range[1] ? '#109483' :
        d >= range[2] ? '#6b9373' :
        d >= range[3] ? '#979163' :
        d >= range[4] ? '#bb8d53' :
        d >= range[5] ? '#dc8841' :
        d >= range[6] ? '#e67932' :
        d >= range[7] ? '#da6427' :
        d >= range[8] ? '#cd4d1d' :
        d >= range[9] ? '#c03313' :
        d >= range[10] ? '#a3210d' :
        d == -1 ? 'gray'    :
        '#790606';
      }



      highlightFeature(e) {
        let layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#5E1A75',
          dashArray: '',
          fillOpacity: 1

        });
        if (!L.Browser.ie && !L.Browser.edge) {
          layer.bringToFront();
        }
      }

      zoomToFeature(e) {
        this.map.fitBounds(e.target.getBounds());
      }

    }
