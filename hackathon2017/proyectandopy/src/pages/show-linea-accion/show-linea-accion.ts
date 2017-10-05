import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import { AppHelper } from '../../helpers/app-helper';
import * as html2canvas from "html2canvas";
import * as L from 'leaflet';
import * as d3 from "d3";
import 'leaflet-search';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-show-nivel',
  templateUrl: 'show-linea-accion.html',
  providers: [LineaAccionData]
})

export class ShowLineaAccionPage extends ShowBasePage  {
  @ViewChild('graph') graph;
  item: any
  chartsData: Array<any>
  paraguayGeoJson: any
  departamentoGeoJson: any
  geo: any
  map: any
  tabactive: any
  openbar: any;
  ranges: {}
  count_view = 0
  count_download = 0
  events: any;
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
      this.tabactive = _text;
      if(_text == 'barra'){
        this.generateStackChart();
      }
    }

    ionViewDidEnter(){
      this.generateMap();
      this.dataService.getEvents("lineasAccion", this.item.institucion+"_"+this.item.id).then(data => {
        this.events = data;
        if("view" in this.events){
          this.count_view = this.events["view"]
        }
        if("download" in this.events){
          this.count_download = this.events["download"]
        }
      });
    }

    generateStackChart() {
      let self = this;

      // set the dimensions and margins of the graph
      let margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 900,
      height = 700;

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
      y0.domain(this.departamentoGeoJson.map(function(d) { return d.properties.name; }));
      y1.domain(keys).rangeRound([0, y0.bandwidth()]);

      x.domain([0, d3.max(this.departamentoGeoJson, function(d) {
        return d3.max(keys, function(key) { return d.properties.value[key]; });
      })]).nice();

      let svg = d3.select(this.graph.nativeElement)
                .append("svg")
                .attr("fill", "white")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("width", width/2)
                .attr("height", height-margin.bottom-margin.top)
                .attr("transform", "translate(100, 5)");
      svg.selectAll("g")
         .data(this.departamentoGeoJson)
         .enter().append("g")
         .attr("transform", function(d) { return "translate(0, " + y0(d.properties.name) + ")"; })
         .selectAll("rect")
         .data(function(d) { return keys.map(function(key) { return {key: key, value: d.properties.value[key]}; }); })
         .enter().append("rect")
         .attr("y", function(d) { return y1(d.key); })
         .attr("x", margin.left)
         .attr("height", y1.bandwidth())
         .attr("width", function(d) { return x(d.value >= 0 ? d.value : 0); })
         .attr("fill", function(d) { return z(d.key); });

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
      let maxAvance = Number.NEGATIVE_INFINITY;
      let maxMeta = Number.NEGATIVE_INFINITY;
      let unidad = null;
      let alcanceNacional = null;
      this.dataService.getDepartamentoParaguayMap().then(map => {
        this.departamentoGeoJson = map.features;
        console.log(this.item);
        this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id, this.item.nivel, this.item.entidad, this.item.institucion), true).then(records => {
          this.chartsData = (records as any).info_departamento;
          unidad = (records as any).unidad;
          this.departamentoGeoJson.forEach( departamento => {
            for(let name of Object.keys(this.chartsData)) {
              let record = self.chartsData[name];
              if (departamento.properties.departamen === name) {
                departamento.properties['name'] = name;
                departamento.properties['unidad'] = unidad;
                departamento.properties['meta'] = record.cant_prog;
                departamento.properties['avance'] = record.cant_avance;
                departamento.properties['value'] = {};
                departamento.properties['value']['Metas'] = record.cant_prog;
                departamento.properties['value']['Avances'] =  record.cant_avance + record.cant_promedio/(record.cantidad_denominador > 0 ? record.cantidad_denominador : 1);
                let porcentaje = (departamento.properties['value']['Avances'] / (record.cant_prog > 0 ? record.cant_prog : 1));
                departamento.properties['value']['Metas vs Avances'] =  Math.round(1000 * (porcentaje <= 1 ? porcentaje : 1))/10;
                maxAvance = departamento.properties['value']['Avances'] > maxAvance ? departamento.properties['value']['Avances'] : maxAvance;
                maxMeta = departamento.properties['value']['Metas'] > maxMeta ? departamento.properties['value']['Metas'] : maxMeta;
              }

              if (name === 'ALC. NACIONAL') {
                alcanceNacional = {properties: {}};
                alcanceNacional.properties['name'] = name;
                alcanceNacional.properties['unidad'] = unidad;
                alcanceNacional.properties['meta'] = record.cant_prog;
                alcanceNacional.properties['avance'] = record.cant_avance;
                alcanceNacional.properties['value'] = {};
                alcanceNacional.properties['value']['Metas'] = record.cant_prog;
                alcanceNacional.properties['value']['Avances'] =  record.cant_avance + record.cant_promedio/(record.cantidad_denominador > 0 ? record.cantidad_denominador : 1);
                let porcentaje = alcanceNacional.properties['value']['Avances'] / (record.cant_prog > 0 ? record.cant_prog : 1);
                alcanceNacional.properties['value']['Metas vs Avances'] =  Math.round(1000 * (porcentaje <= 1 ? porcentaje : 1))/10;
                maxAvance = alcanceNacional.properties['value']['Avances'] > maxAvance ? alcanceNacional.properties['value']['Avances'] : maxAvance;
                maxMeta = alcanceNacional.properties['value']['Metas'] > maxMeta ? alcanceNacional.properties['value']['Metas'] : maxMeta;
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
          this.dataService.getParaguayMap().then(map => {
            this.paraguayGeoJson = map.features;
            if(alcanceNacional){
              this.paraguayGeoJson.forEach( paraguay => {
                paraguay.properties = alcanceNacional.properties;
              });
            }

            self.ranges = {
              "Metas vs Avances": [100, 95, 90, 85, 80, 75, 70, 60, 40, 20, 10, 0],
              "Avances": this.appHelper.getRange(0, maxAvance, 10),
              "Metas": this.appHelper.getRange(0, maxMeta, 10)
            }

            let unidades = {
              "Metas vs Avances": {"nombre":"Porcentaje", "simbolo": "%", "titulo": "Progreso por departamento"},
              "Avances": {"nombre": unidad, "simbolo": unidad, "titulo": "Avances por departamento"},
              "Metas": {"nombre": unidad, "simbolo": unidad, "titulo": "Metas por departamento"},
            }

            this.map = L.map('map').setView([-23.88, -55.76], 6);

            let geoPorcentaje = new L.GeoJSON(this.departamentoGeoJson, {
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
                    fillOpacity: 0.7
                  });
                  self.map.fitBounds((layer as any).getBounds());
                  info.update(feature.properties, 'Metas vs Avances');
                });
              }
            });

            let geoMetas = new L.GeoJSON(this.departamentoGeoJson, {
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
                    fillOpacity: 0.7
                  });
                  self.map.fitBounds((layer as any).getBounds());
                  info.update(feature.properties, 'Metas');
                });
              }
            });

            let geoAvances = new L.GeoJSON(this.departamentoGeoJson, {
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
                    fillOpacity: 0.7
                  });
                  self.map.fitBounds((layer as any).getBounds());
                  info.update(feature.properties, 'Avances');
                });
              }
            }).addTo(this.map);

            let type = 'Avances';

            let geoAlcanceNacional = new L.GeoJSON(this.paraguayGeoJson, {
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
                    fillOpacity: 0.7
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

            if(alcanceNacional){
              Object.assign(capas, {"Alcance Nacional": geoAlcanceNacional});
            }
            let info = (L as any).control();

            info.onAdd = function (map) {
              this._div = L.DomUtil.create('div', 'info');
              this.update(null, 'Avances');
              return this._div;
            };

            info.update = function (props, layer) {
              console.log(props);
              this._div.innerHTML = `<h4>${unidades[layer].titulo}</h4>` +  (props ?
                '<b>' + props.name + '</b><br />' + (props.value[layer] == -1 ? 'Sin Datos' : `${self.appHelper.numberFormatter(props.value[layer])} ${unidades[layer]["simbolo"]}`)
                : 'Seleccione un departamento');
              };

              info.addTo(this.map);

              L.control.layers(overlays, capas, {position: 'bottomleft'}).addTo(this.map);

              let legend = (L as any).control({position: 'bottomright'});

              legend.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info legend');
                this.update('Avances');
                return this._div;
              }

              this.map.on('baselayerchange', function (eventLayer) {
                if(eventLayer.name == 'Avances') {
                  Object.keys((geoPorcentaje as any)._layers).map (key => {
                    (geoPorcentaje as any).resetStyle((geoPorcentaje as any)._layers[key]);
                  });
                } else {
                  Object.keys((geoAvances as any)._layers).map (key => {
                    (geoAvances as any).resetStyle((geoAvances as any)._layers[key]);
                  });
                }
                type = eventLayer.name;
                if(self.map.hasLayer(geoAlcanceNacional)){
                  self.map.removeLayer(geoAlcanceNacional);
                  Object.keys((geoAlcanceNacional as any)._layers).map (key => {
                    (geoAlcanceNacional as any).resetStyle((geoAlcanceNacional as any)._layers[key]);
                  });
                  geoAlcanceNacional.addTo(self.map)
                  geoAlcanceNacional.bringToFront();
                }
                legend.update(eventLayer.name);
                info.update(null, eventLayer.name);

              });

              legend.update = function (layer){
                let grades = self.ranges[layer];
                this._div.innerHTML = `<h4>${unidades[layer]["nombre"]}</h4>`;
                for (let i = 0; i < grades.length -1; i++) {
                  this._div.innerHTML +=
                  '<i style="background:' + self.getColor(grades[i] + 1, layer) + '"></i> ' +
                  self.appHelper.numberFormatter(grades[i]) +' - '+ self.appHelper.numberFormatter(grades[i + 1]) + '<br>';
                }
                if(grades.length == 0) {
                  this._div.innerHTML +=
                  '<i style="background:#F0F0F0;"></i>0<br>';
                }
              };

              legend.addTo(this.map);
            });
          });
        })
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
          fillOpacity: 0.7
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
            return '#F0F0F0';
          }
        }
        return d >= range[0] ? '#109483' :
        d >= range[1] ? '#6b9373' :
        d >= range[2] ? '#979163' :
        d >= range[3] ? '#bb8d53' :
        d >= range[4] ? '#dc8841' :
        d >= range[5] ? '#e67932' :
        d >= range[6] ? '#da6427' :
        d >= range[7] ? '#cd4d1d' :
        d >= range[8] ? '#c03313' :
        d == -1 ? 'gray'    :
        '#790606';
      }



      highlightFeature(e) {
        let layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#5E1A75',
          dashArray: '',
          fillOpacity: 0.7

        });
        if (!L.Browser.ie && !L.Browser.edge) {
          layer.bringToFront();
        }
      }

      resetHighlight(e) {
        this.geo.resetStyle(e.target);
      }

      zoomToFeature(e) {
        this.map.fitBounds(e.target.getBounds());
      }

    }
