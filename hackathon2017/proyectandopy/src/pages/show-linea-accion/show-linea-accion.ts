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
  openbar: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: LineaAccionData, public appHelper: AppHelper) {
    super(navCtrl, navParams, appHelper);
    this.item = navParams.get('item');
    this.openbar = appHelper.isDeskTop();


  }

  ionViewDidEnter() {
    let self = this;
    let title = "Avances por departamento";
    let op = 0;
    this.dataService.getParaguayMap().then(map => {
      this.paraguayGeoJson = map.features;

    this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id), true).then(records => {
      this.chartsData = (records as any).info_departamento;
      console.log(this.chartsData);
      for(let record of Object.keys(this.chartsData)) {
        this.paraguayGeoJson.forEach( departamento => {
          if (departamento.properties.departamen === record) {
            departamento.properties['name'] = record;
            departamento.properties['unidad'] = (records as any).unidad;
            departamento.properties['meta'] = self.chartsData[record].cant_prog;
            departamento.properties['avance'] = self.chartsData[record].cant_avance;
            departamento.properties['value'] =  Math.round(1000 * self.chartsData[record].cant_avance / self.chartsData[record].cant_prog)/10;
          }
        });
      }
      this.map = L.map('map').setView([-23.88, -55.76], 6);

      this.geo = new L.GeoJSON(this.paraguayGeoJson, {
        style: function (feature) {
          return (self.style(feature));
        },
        onEachFeature: function (feature: any, layer) {
          layer.on('click', function (e) {
            Object.keys(self.geo._layers).map (key => {
              self.geo.resetStyle(self.geo._layers[key]);
            });

            (layer as any).setStyle({
              weight: 5,
              color: '#c599ea',
              dashArray: '',
              fillOpacity: 0.7
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties);
          });
        }
      }).addTo(this.map);

      let searchControl = new (L.Control as any).Search({
        layer: this.geo,
        propertyName: 'name',
        marker: false,
        moveToLocation: function(latlng, title, map) {
          //map.fitBounds( latlng.layer.getBounds() );
          var zoom = map.getBoundsZoom(latlng.layer.getBounds());
          map.setView(latlng, zoom); // access the zoom
        }
      }).addTo(this.map);

      searchControl.on('search:locationfound', function(e) {

        //console.log('search:locationfound', );

        //map.removeLayer(this._markerSearch)

        e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
        if(e.layer._popup)
        e.layer.openPopup();

      }).on('search:collapsed', function(e) {

        self.geo.eachLayer(function(layer) {	//restore feature color
          self.geo.resetStyle(layer);
        });
      });

      var overlays = {
        "Metas vs Avances": this.geo,
      };

      var info = (L as any).control();

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      info.update = function (props) {
        this._div.innerHTML = `<h4>${title}</h4>` +  (props ?
          '<b>' + props.name + '</b><br />' + props.avance + '/' + props.meta + ' ' + props.unidad
          : 'Seleccione un departamento');
        };

        info.addTo(this.map);

        L.control.layers(null, overlays, {position: 'bottomleft'}).addTo(this.map);

        var legend = (L as any).control({position: 'bottomright'});

        legend.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info legend'),
          grades = [100, 95, 90, 85, 80, 75, 70, 60, 40, 20, 10, 0],
          labels = [];

          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length -1; i++) {
            div.innerHTML +=
            '<i style="background:' + self.getColor(grades[i] + 1) + '"></i> ' +
            grades[i] +' - '+ grades[i + 1] + ' %<br>';
          }

          return div;
        };

        legend.addTo(this.map);

      });
      })
    }

    style(feature) {
      let self = this;
      let d = feature.properties.value;
      return {
        fillColor:self.getColor(d),
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
    getColor(d) {
      return d >= 95 ? '#109483' :
             d >= 90 ? '#6b9373' :
             d >= 85 ? '#979163' :
             d >= 80 ? '#bb8d53' :
             d >= 75 ? '#dc8841' :
             d >= 70 ? '#e67932' :
             d >= 60 ? '#da6427' :
             d >= 40 ? '#cd4d1d' :
             d >= 20 ? '#c03313' :
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
