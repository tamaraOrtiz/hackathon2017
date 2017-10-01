import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ShowLineaAccionPage } from '../show-linea-accion/show-linea-accion';
import { Events } from 'ionic-angular';
import * as d3 from "d3";
import { Http } from '@angular/http';
import { AppHelper } from '../../helpers/app-helper';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-estadisticas',
  templateUrl: 'estadisticas.html',
  providers: [InstitucionData, RatingData]
})

export class EstadisticasPage extends ShowBasePage {

  ratingService: RatingData

  meta: Array<any>

  charts: Array<any>

  tabs: string = "info";

  presupuestos: Array<string>

  lineasAccion: any

  csvItems: any

  calificacion: any
  openbar: any
  tabactive:any
  _events: any = {};
  count_view = 0
  count_download = 0
  id: any
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData, public raService: RatingData,
    private iab: InAppBrowser, public events: Events,
    public appHelper: AppHelper, public http: Http) {
    super(navCtrl, navParams, appHelper);
    this.ratingService = raService;
    this.dataService = dataService;
    this.openbar = appHelper.isDeskTop();
    appHelper.provider = dataService;
    this.tabactive = 'info'
    this.id = `${this.item.nivelid}_${this.item.entidadid}`
    this.events.subscribe('Entidad:download:saved:success', (data) => {
      this.count_download = data;
    });
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

  ionViewDidEnter() {
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelid, this.item.entidadid), true).then(records => {
      this.presupuestos = Object.keys(records).length > 0 ? records : null;
    });


    this.ratingService.getRating(this.id, 'Estadistica').then(rating => {
      this.calificacion = rating;
      this.events.publish('rating:retrieve', rating, Date.now());
    });

    this.dataService.getEvents("Entidad", this.item.nivelid+"_"+this.item.entidadid).then(data => {
      this._events = data;
      if("view" in this._events){
        this.count_view = this._events["view"]
      }
      if("download" in this._events){
        this.count_download = this._events["download"]
      }
    });
  }
  goToSlide() {
    this.slides.slideNext(100);
  }

  gobackSlide() {
    this.slides.slidePrev(100);
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
    let self = this;
    let lineasAccion = [];
    records.forEach(function (la) {
      lineasAccion.push({
        id: la.la_id,
        nombre: self.appHelper.toTitleCase(la.la_nombre),
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
