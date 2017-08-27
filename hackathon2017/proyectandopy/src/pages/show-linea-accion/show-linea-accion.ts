import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { LineaAccionData } from '../../providers/linea-accion';
import 'leaflet';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: LineaAccionData) {
    super(navCtrl, navParams);
    this.item = navParams.get('item');

  }

  ionViewDidLoad() {
    let self = this;
    let title = "Avances por distrito";
    let multiplicador = [10000, 0.5, 1];
    let op = 0;
    this.dataService.getParaguayMap().then(map => {
      this.paraguayGeoJson = map.features;

    this.dataService.getQuery(this.dataService.getLineasAccionDetalle(this.item.id, undefined)).then(records => {
      this.chartsData = records;
      for(let record of records) {
        this.paraguayGeoJson.forEach( distrito => {
          if (distrito.properties.dpto_desc === record.dist_nombre) {
            distrito.properties['name'] = record.dist_nombre;
            distrito.properties['value'] = multiplicador[op] * (record.m1 + record.m2 + record.m3 + record.m4);
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
        "Costos": this.geo,
        "Avances": this.geo,
        "Metas": this.geo
      };

      var info = (L as any).control();

      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      info.update = function (props) {
        console.log(props);
        this._div.innerHTML = `<h4>${title}</h4>` +  (props ?
          '<b>' + props.distrito + '</b><br />' + Math.round(1500 * Math.random()) + ' Km'
          : 'Seleccione un distrito');
        };

        info.addTo(this.map);

        L.control.layers(null, overlays, {position: 'bottomleft'}).addTo(this.map);

        var legend = (L as any).control({position: 'bottomright'});

        legend.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info legend'),
          grades = [1000, 500, 200, 100, 50, 20, 10, 0],
          labels = [];

          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + self.getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }

          return div;
        };

        legend.addTo(this.map);

      });
      })
    }

    style(feature) {
      let self = this;
      let d = Math.round(1500 * Math.random());
      return {
        fillColor:self.getColor(d),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
      };
    }

    getColor(d) {
      return d > 1000 ? '#0a3656' :
      d > 500  ? '#134e79' :
      d > 200  ? '#266a9c' :
      d > 100  ? '#3490d4' :
      d > 50   ? '#6fbcf5' :
      d > 20   ? '#b2d9f5' :
      d > 10   ? '#d4e7f5' :
      '#fbfbfb';
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
