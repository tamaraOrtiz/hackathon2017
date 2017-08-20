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
    let self = this;
    let title = "Costos por departamento";
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
      this.map = L.map('map').setView([-23.88, -60.76], 5);

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
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            });
            self.map.fitBounds((layer as any).getBounds());
            info.update(feature.properties);
          });
        }
      }).addTo(this.map);

      var overlays = {
      "Mapa": this.geo
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
          '<b>' + props.departamen + '</b><br />' + (1500 * Math.random()) + ' Gs'
          : 'Seleccione un departamento');
      };

      info.addTo(this.map);

      L.control.layers(null, overlays).addTo(this.map);

      var legend = (L as any).control({position: 'bottomright'});

      legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
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
  }

  style(feature) {
    let self = this;
    let d = (1500 * Math.random());//feature.properties.count;
    return {
      fillColor:self.getColor(d),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
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
    console.log(feature);
    /*layer.on({
        mouseover: function (e) {
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
        },
        mouseout: this.resetHighlight,
      click: this.zoomToFeature
    });*/
  }


}
