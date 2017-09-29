import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import { AppHelper } from '../../helpers/app-helper';
import * as html2canvas from "html2canvas";
import * as L from 'leaflet';
import 'leaflet-search';

@Component({
  selector: 'page-show-nivel',
  templateUrl: 'show-linea-accion.html',
  providers: [LineaAccionData]
})

export class ShowLineaAccionPage extends ShowBasePage  {

  item: any
  chartsData: Array<any>
  paraguayGeoJson: any
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
  }
  ionViewDidEnter() {
    let self = this;
    let title = "Avances por departamento";
    let op = 0;
    let maxInversion = Number.MIN_VALUE
    let maxAvance = Number.MIN_VALUE
    this.dataService.getParaguayMap().then(map => {
      this.paraguayGeoJson = map.features;

      this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id), true).then(records => {
        this.chartsData = (records as any).info_departamento;
        this.paraguayGeoJson.forEach( departamento => {
          for(let name of Object.keys(this.chartsData)) {
            let record = self.chartsData[name];
            if (departamento.properties.departamen === name) {
              departamento.properties['name'] = name;
              departamento.properties['unidad'] = (records as any).unidad;
              departamento.properties['meta'] = record.cant_prog;
              departamento.properties['avance'] = record.cant_avance;
              departamento.properties['value'] = {};
              departamento.properties['value']['Avances'] =  record.cant_avance + record.cant_promedio/(record.cantidad_denominador ? record.cantidad_denominador : 1);
              departamento.properties['value']['Metas vs Avances'] =  Math.round(1000 * departamento.properties['value']['Avances'] / record.cant_prog)/10;
              maxAvance = departamento.properties['value']['Avances'] > maxAvance ? departamento.properties['value']['Avances'] : maxAvance;
            }
          }
          if (departamento.properties.name == undefined) {
            departamento.properties['name'] = departamento.properties.departamen;
            departamento.properties['unidad'] = '';
            departamento.properties['meta'] = -1;
            departamento.properties['avance'] = -1;
            departamento.properties['value'] = {};
            departamento.properties['value']['Avances'] = -1;
            departamento.properties['value']['Metas vs Avances'] = -1;
            maxInversion = -1;
            maxAvance = -1;
          }
        });
        self.ranges = {
          "Metas vs Avances": [100, 95, 90, 85, 80, 75, 70, 60, 40, 20, 10, 0],
          "Avances": this.appHelper.getRange(0, maxAvance, 10)
        }
        this.map = L.map('map').setView([-23.88, -55.76], 6);


        let geoPorcentaje = new L.GeoJSON(this.paraguayGeoJson, {
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
        }).addTo(this.map);

        let geoAvances = new L.GeoJSON(this.paraguayGeoJson, {
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

        let searchControl = new (L.Control as any).Search({
          layer: this.geo,
          propertyName: 'name',
          marker: false,
          moveToLocation: function(latlng, title, map) {
            var zoom = map.getBoundsZoom(latlng.layer.getBounds());
            map.setView(latlng, zoom);
          }
        }).addTo(this.map);

        let overlays = {
          "Metas vs Avances": geoPorcentaje,
          "Avances": geoAvances
        };

        var info = (L as any).control();

        info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };

        info.update = function (props, layer) {
          this._div.innerHTML = `<h4>${title}</h4>` +  (props ?
            '<b>' + props.name + '</b><br />' + (props.value[layer] == -1 ? 'Sin Datos' : props.value[layer])
            : 'Seleccione un departamento');
        };

        info.addTo(this.map);

        L.control.layers(overlays, {}, {position: 'bottomleft'}).addTo(this.map);

        let legend = (L as any).control({position: 'bottomright'});

        legend.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info legend');
          this.update('Avances');
          return this._div;
        }

        this.map.on('baselayerchange', function (eventLayer) {
          legend.update(eventLayer.name);
        });

        legend.update = function (layer){
          let grades = self.ranges[layer];
          this._div.innerHTML = '';
          for (var i = 0; i < grades.length -1; i++) {
            this._div.innerHTML +=
              '<i style="background:' + self.getColor(grades[i] + 1, layer) + '"></i> ' +
              grades[i] +' - '+ grades[i + 1] + ' %<br>';
          }
        };

        legend.addTo(this.map);

        });
      })
    }

    style(feature, layer) {
      let self = this;
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
