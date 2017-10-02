import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import { AppHelper } from '../../helpers/app-helper';
import * as html2canvas from "html2canvas";
import * as L from 'leaflet';
import * as d3 from "d3";
import 'leaflet-search';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: LineaAccionData, public appHelper: AppHelper) {
      super(navCtrl, navParams, appHelper);
      this.item = navParams.get('item');
      this.openbar = appHelper.isDeskTop();
      this.tabactive = 'mapa';
    }
    changetab(_text){
      this.tabactive = _text;
      if(_text == 'barra'){
        this.generateStackChart();
      }
    }

    ionViewDidEnter(){
      this.generateMap();
    }

    generateStackChart() {
      let self = this;

      let n = 4;
      let m = 2;
      console.log(this.item.avance_metas);
      var xz = d3.range(m),
    yz = d3.range(n).map(function() { return bumps(m); }),
    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
    yMax = d3.max(yz, function(y) { return d3.max(y); }),
    y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

var svg = d3.select(this.graph.nativeElement);
let
    margin = {top: 40, right: 10, bottom: 20, left: 10};
    let width  = 600 - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .domain(xz)
    .rangeRound([0, width])
    .padding(0.08);

var y = d3.scaleLinear()
    .domain([0, y1Max])
    .range([height, 0]);

var color = d3.scaleOrdinal()
    .domain(d3.range(n))
    .range(d3.schemeCategory20c);

var series = g.selectAll(".series")
  .data(y01z)
  .enter().append("g")
    .attr("fill", function(d, i) { return color(i); });

var rect = series.selectAll("rect")
  .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); });

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .tickSize(0)
        .tickPadding(6));
      function bumps(m) {
  var values = [], i, j, w, x, y, z;

  // Initialize with uniform random values in [0.1, 0.2).
  for (i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (j = 0; j < 5; ++j) {
    x = 1 / (0.1 + Math.random());
    y = 2 * Math.random() - 0.5;
    z = 10 / (0.1 + Math.random());
    for (i = 0; i < m; i++) {
      w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}
    }

    generateMap() {
      let self = this;
      let maxAvance = Number.MIN_VALUE;
      let maxMeta = Number.MIN_VALUE;
      let unidad = null;
      let alcanceNacional = null;
      this.dataService.getDepartamentoParaguayMap().then(map => {
        this.departamentoGeoJson = map.features;

        this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id), true).then(records => {
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
                departamento.properties['value']['Metas vs Avances'] =  Math.round(1000 * departamento.properties['value']['Avances'] / record.cant_prog)/10;
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
                alcanceNacional.properties['value']['Metas vs Avances'] =  Math.round(1000 * alcanceNacional.properties['value']['Avances'] / record.cant_prog)/10;
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
            var info = (L as any).control();

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
                for (var i = 0; i < grades.length -1; i++) {
                  this._div.innerHTML +=
                  '<i style="background:' + self.getColor(grades[i] + 1, layer) + '"></i> ' +
                  self.appHelper.numberFormatter(grades[i]) +' - '+ self.appHelper.numberFormatter(grades[i + 1]) + '<br>';
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
          return 'gray';
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
        var layer = e.target;
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
