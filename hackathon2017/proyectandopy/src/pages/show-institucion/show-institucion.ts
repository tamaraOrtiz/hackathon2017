import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';


@Component({
  selector: 'page-show-institucion',
  templateUrl: 'show-institucion.html',
  providers: [InstitucionData]
})

export class ShowInstitucionPage extends ShowBasePage {

  meta: Array<any>

  charts: Array<any>

  chartsData: any

  presupuestos: Array<string>

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams);
    this.dataService = dataService;
    this.charts = [];
  }

  ionViewDidLoad() {
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelid, this.item.entidadid, undefined)).then(records => {
      this.chartsData = this.structResumenPrograma(records);
      this.presupuestos = Object.keys(this.chartsData);
    });
  }
  toggleGroup(event, _class, col, h_id) {
    if(document.getElementById(col)){
      if (event.classList.contains(_class)) {
        document.getElementById(col).style.display = 'none';
        document.getElementById(_class).style.display = 'block';
        document.getElementById(h_id).style.display = 'none';
        event.classList.remove(_class);
      } else{
        document.getElementById(col).style.display = 'block';
        document.getElementById(_class).style.display = 'none';
        document.getElementById(h_id).style.display = 'block';
        event.classList.add(_class);
      }
    }
  }

  isGroupShown(event, _class, col) {
    console.log("fffffff");
    if (document.getElementById(col).classList.contains(_class)) {
      return true;
    } else{
      return false;
    }
  }

  pushItem(record: any) {

  }

  structResumenPrograma (meta):any {
    let presupuestos = {};

    for(let row of meta) {
      if(presupuestos[row.tipo_presupuesto_id] === undefined){
        presupuestos[row.tipo_presupuesto_id] = {nombre: row.tipo_presupuesto_nombre, nombre_programas: [], programas: []};
      }
      presupuestos[row.tipo_presupuesto_id].nombre_programas.push(row.programa_nombre);
      presupuestos[row.tipo_presupuesto_id].programas.push({name: row.programa_nombre, value: row.cantidad_total});
      presupuestos[row.tipo_presupuesto_id].nombre_programas = presupuestos[row.tipo_presupuesto_id].nombre_programas.sort();
    };
    return presupuestos;
  }

}
