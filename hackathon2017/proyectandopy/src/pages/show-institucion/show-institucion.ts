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
  events: any;

  loadProgress: any
  calificacion: any
  openbar: any
  tabactive:any
  myParseInt: any
  count_view = 0
  count_download = 0
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData, public raService: RatingData,
    private iab: InAppBrowser, public eventHandler: Events,
    public appHelper: AppHelper, public http: Http) {
    super(navCtrl, navParams, appHelper);
    this.ratingService = raService;
    this.dataService = dataService;
    this.openbar = appHelper.isDeskTop();
    this.tabactive = 'info'
    this.myParseInt = parseInt;
    if(!this.item){
      this.item = { id: navParams.data.ins_id }
    }
    this.eventHandler.subscribe('Institucion:view:saved:success', (data) => {
      this.count_view = data;
    });
    this.eventHandler.subscribe('Institucion:download:saved:success', (data) => {
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

  progress(p, a, n, d){
    let pr = 0;
    if (d!=0){
      pr = n/d;
    }

    a = a + pr;

    let result = (a*100)/p;
    if (a > p){
      result= 100;
    }

    return result;
  }

  ionViewDidEnter() {
    this.dataService.getQuery(this.dataService.getInstitucion(this.item.id)).then(record => {
      let institucion = record[0] as any;
      let additionalData = {
                             nombre: institucion.nombre,
                             descripcion: institucion.descripcion,
                             mision: institucion.mision,
                             diagnostico: institucion.diagnostico,
                             baselegal: institucion.baselegal,
                             objetivo: institucion.objetivo,
                             politica: institucion.politica,
                             ruc: institucion.ruc,
                             nivelid: institucion.nivelid,
                             entidadid: institucion.entidadid
                           };
      this.item = Object.assign(this.item, additionalData);
      this.dataService.getQuery(this.dataService.getLineasAccion(
        this.item.nivelid,
        this.item.entidadid,
        this.item.id, ''), true).then(records => {
          this.lineasAccion = this.structLineasAccion(records);
      });
    });

    this.ratingService.getRating(this.item.id, 'Institucion').then(rating => {
      this.calificacion = rating;
      this.eventHandler.publish('rating:retrieve', rating, Date.now());
    });

    this.dataService.getEvents("Institucion", this.item.id).then(data => {
      this.events = data;
      if("view" in this.events){
        this.count_view = this.events["view"]
      }
      if("download" in this.events){
        this.count_download = this.events["download"]
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
    this.dataService.pushEvent("lineasAccion", item.institucion+"_"+item.id, "view", "institucion_list");
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
      let pr = 0;
      if (la.cantidad_denominador!=0){
        pr = la.cantidad_promedio/la.cantidad_denominador;
      }
      let avance = la.cantidad_avance + pr;
      pr = 0;
      if (la.cantidad_prog_denominador!=0){
        pr = la.cantidad_prog_promedio/la.cantidad_prog_denominador;
      }
      let progr = la.cantidad_prog + pr
      lineasAccion.push({
        id: la.la_id,
        nivel: la.nivel,
        entidad: la.entidad,
        institucion: la.institucion,
        nombre: self.appHelper.toTitleCase(la.la_nombre),
        cantidadFinanciera: la.cantidad_financiera,
        cantidadAvance: avance,
        cantidadProgramada: progr,
        unidadMedida: la.unidad_medida,
        cantidadPromedio: la.cantidad_promedio,
        cantidadDenominador: la.cantidad_denominador,
        avance_metas: la.avance_metas,
        programa_metas: la.programa_metas,
        promedio_metas: la.promedio_metas,
        programa_denominador_metas: la.programa_denominador_metas,
        programa_promedio_metas: la.programa_promedio_metas,
        denominador_metas: la.denominador_metas,
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
