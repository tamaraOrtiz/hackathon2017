import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ShowLineaAccionPage } from '../show-linea-accion/show-linea-accion';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import * as d3 from "d3";
import { Http } from '@angular/http';
import { AppHelper } from '../../helpers/app-helper';


@Component({
  selector: 'page-show-institucion',
  templateUrl: 'show-institucion.html',
  providers: [InstitucionData, RatingData]
})

export class ShowInstitucionPage extends ShowBasePage {

  ratingService: RatingData

  meta: Array<any>

  charts: Array<any>

  tabs: string = "info";

  presupuestos: Array<string>

  lineasAccion: any = []

  csvItems: any

  loadProgress: any
  calificacion: any
  openbar: any
  tabactive:any
  myParseInt: any
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData, public raService: RatingData,
    private iab: InAppBrowser, public events: Events,
    public socialSharing: SocialSharing, public plt: Platform, public http: Http) {
    super(navCtrl, navParams, socialSharing, plt);
    this.ratingService = raService;
    this.dataService = dataService;
    this.openbar = plt.is('core');
    this.tabactive = 'info'
    this.myParseInt = parseInt;
  }

  openLink(link){
    this.iab.create(link,'_system',{location:'yes'});
  }

  opensidebar(){
    this.openbar = true;
  }

  changetab(_text){
    this.tabactive = _text;

  }

  closesidebar(){
    this.openbar = false;
  }

  progress(p, a){
    let result = (a*100)/p;
    if (a > p){
      result= 100;
    }

    return result;
  }

  ionViewDidEnter() {
    this.dataService.getQuery(this.dataService.getLineasAccion(
      this.item.nivelid,
      this.item.entidadid,
      this.item.id, ''), true).then(records => {
        this.lineasAccion = this.structLineasAccion(records);
    });

    this.ratingService.getRating(this.item.id, 'Institucion').then(rating => {
      this.calificacion = rating;
      this.events.publish('rating:retrieve', rating, Date.now());
    });
  }

  pushItem(record: any) {

  }

  lineaAccionTapped(event, item) {
    this.navCtrl.push(ShowLineaAccionPage, {
      item: item
    });
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
        nombre: AppHelper.toTitleCase(la.la_nombre),
        cantidadFinanciera: la.cantidad_financiera,
        cantidadAvance: la.cantidad_avance,
        cantidadProgramada: la.cantidad_prog,
        unidadMedida: la.unidad_medida,
        ico: 'fa-users'
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
