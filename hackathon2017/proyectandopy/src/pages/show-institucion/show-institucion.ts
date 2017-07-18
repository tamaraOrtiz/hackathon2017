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

  lineasAccion: any

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
    this.dataService.getQuery(this.dataService.getLineasAccion(this.item.id, "periodo = '2017'")).then(records => {
      this.lineasAccion = this.structLineasAccion(records);
    });
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

  structLineasAccion (records: Array<any>):any {
    let lineasAccion = [];
    records.forEach(function (la) {
      lineasAccion.push({
        id: la.la_id,
        nombre: la.la_nombre,
        periodo: la.periodo,
        instanciaId: la.ila_id,
        meta: la.ila_meta,
        unidadMedida: la.la_um_descp
      });
    });
    return lineasAccion;
  }

  structLineasAccionDetalle (records:Array<any>):any {
    let periodos = {};
    records.forEach(function (a) {
        if(periodos[a.periodo] === undefined){
          periodos[a.periodo] = {
            periodos: a.periodo,
            lineasAccion: {}
          }
        }
        if(periodos[a.periodo].lineasAccion[a.la_id] === undefined){
          periodos[a.periodo].lineasAccion[a.la_id] = {
            id: a.la_id,
            nombre: a.la_nombre,
            metaAnual: a.ila_meta,
            unidadMedida: a.la_um_descp,
            acciones: {}};
        }
        if(periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id] === undefined){
          periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id] = {
            id: a.accion_id,
            nombre: a.ac_nombre,
            peso: a.accion_peso,
            fechaIni: a.accion_fecha_ini,
            fechaFin: a.accion_fecha_fin,
            unidadMedidaId: a.ac_um_id,
            unidadMedida: a.ac_um_descp,
            meta1: a.m1,
            meta2: a.m2,
            meta3: a.m3,
            meta4: a.m4,
            avances: {}
          };
        }
        if(periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id].avances[a.avance_id] === undefined){
          periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id].avances[a.avance_id] = {
            id: a.avance_id,
            fecha: a.avance_fecha,
            cantidad: a.avance_cant,
            unidadMedida: a.ac_um_descrip,
            cronogramas: {}
          }
        }
        if(periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id].avances[a.avance_id].cronogramas[a.crono_id] === undefined){
          periodos[a.periodo].lineasAccion[a.la_id].acciones[a.accion_id].avances[a.avance_id].cronogramas[a.crono_id] = {
            id: a.crono_id,
            nombre: a.crono_nombre,
            proporcion: a.crono_prop,
            peso: a.crono_peso,
            unidadMedidaId: a.crono_um_id,
            unidadMedida: a.crono_um_descp,
            acumulable: a.acumula,
            tipoId: a.crono_tipo_id,
            tipo: a.crono_tipo_nombre,
            departamentoId: a.depto_id,
            departamento: a.depto_nombre,
            distritoId: a.dist_id,
            distrito: a.dist_nombre
          }
        }
    });
    return periodos;
  }

}
