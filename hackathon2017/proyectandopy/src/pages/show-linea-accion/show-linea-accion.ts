import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import 'leaflet';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: LineaAccionData) {
    super(navCtrl, navParams);
    this.item = navParams.get('item');
    this.dataService.getParaguayMap().then(map => {
      this.paraguayGeoJson = map.features;
    })
  }

  ionViewDidLoad() {
    this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id, undefined)).then(records => {
      this.chartsData = records;
      for(let record of records) {
        this.paraguayGeoJson.forEach( departamento => {
            if (departamento.properties.dpto_desc === record.depto_nombre) {
              departamento.properties['name'] = record.depto_nombre;
              departamento.properties['value'] = record.m1 + record.m2 + record.m3 + record.m4;
            }
        });
      }
      let mapboxAccessToken = 'pk.eyJ1IjoicnViYnIiLCJhIjoiY2o1YnJkZjJtMDFzZDMyb2E0cmM1bmw2ZiJ9.mGsWDEew_RCoZt4ij-mDFQ';
      this.map = L.map('map').setView([-23.88, -60.76], 5);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
        id: 'mapbox.light',
      }).addTo(this.map);

      this.geo = new L.GeoJSON(this.paraguayGeoJson, {
        style: this.style,
        onEachFeature: this.onEachFeature
      }).addTo(this.map);
    });
  }

  style(feature) {
    let d = feature.properties.value;
    return {
      fillColor:

        d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
        d > 200  ? '#E31A1C' :
        d > 100  ? '#FC4E2A' :
        d > 50   ? '#FD8D3C' :
        d > 20   ? '#FEB24C' :
        d > 10   ? '#FED976' :
        '#FFEDA0',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  getColor(d) {

  }

  highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
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

  onEachFeature(feature, layer) {
    layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature
    });
  }


}
