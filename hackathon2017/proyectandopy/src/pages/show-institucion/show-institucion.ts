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

  chartsData: any

  presupuestos: Array<string>

  lineasAccion: any

  csvItems: any

  calificacion: any

  @ViewChild('resumegraph') graph;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData, public raService: RatingData,
    private iab: InAppBrowser, public events: Events,
    private socialSharing: SocialSharing, public plt: Platform, public http: Http) {
    super(navCtrl, navParams);
    this.ratingService = raService;
    this.dataService = dataService;
    this.charts = [];
  }
  openLink(link){
  		this.iab.create(link,'_system',{location:'yes'});
  }

  regularShare(){

      // share(message, subject, file, url)
      if (this.plt.is('code') || this.plt.is('mobileweb')) {
      // This will only print when on iOS
        console.log('I am an iOS device!');

      }else{
        this.socialSharing.share("Testing, sharing this from inside an app I'm building right now", null, "www/assets/img/ejes.jpg", null);
      }

    }

  twitterShare(){
    this.socialSharing.shareViaTwitter("Testing, sharing this from inside an app I'm building right now", "www/assets/img/ejes.jpg", null);
  }

  instagramShare(){
    this.socialSharing.shareViaInstagram(`Testing, sharing this from inside an app I'm building right now`, "www/assets/img/ejes.jpg");
  }

  whatsappShare(){
    this.socialSharing.shareViaWhatsApp("Testing, sharing this from inside an app I'm building right now", "www/assets/img/ejes.jpg", null);
  }


  ionViewDidLoad() {
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelid, this.item.entidadid, undefined)).then(records => {
      this.chartsData = this.structResumenPrograma(records);
      this.presupuestos = Object.keys(this.chartsData);
    });
    this.dataService.getQuery(this.dataService.getLineasAccion(this.item.id, "periodo = '2016'")).then(records => {
      this.lineasAccion = this.structLineasAccion(records);
    });

    this.ratingService.getRating(this.item.id, 'Institucion').then(rating => {
      this.calificacion = rating;
      this.events.publish('rating:retrieve', rating, Date.now());
    });
  }

  ngOnInit() {
    this.generateResumen();
  }



  generateResumen(){
    console.log(this.graph);
    let w  = 1000
    let h = 1000;
    let x = d3.scaleLinear().range([0, w]);
    let y = d3.scaleLinear().range([0, h]);

    let vis = d3.select("#resumegraph")
              .append("div")
              .attr("class", "chart")
              .attr("width", w)
              .attr("height", h)
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h);

    let partition = d3.partition()
                 .size([h, w])
                 .padding(0)
                 //.round(f);
    d3.json("/assets/jsons/flare.json", function(error, root) {
      if (error) throw error;
      root = d3.hierarchy(root);
      root.sum(function(d) { return d.size; });
      let g = vis.selectAll("g")
          .data(partition(root).descendants())
          .enter().append("svg:g")
          .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });
     let kx = w / root.dx;
     let ky = h / 1;

     g.append("svg:rect")
         .attr("width", root.dy * kx)
         .attr("height", function(d) { return d.dx * ky; })
         .attr("class", function(d) { return d.children ? "parent" : "child"; });

     g.append("svg:text")
         .attr("transform", function() { alert("jola"); })
         .attr("dy", ".35em")
         .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
         .text(function(d) { return d.name; })


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
        nombre: la.la_nombre,
        periodo: la.periodo,
        instanciaId: la.ila_id,
        meta: la.ila_meta,
        unidadMedida: la.la_um_descp,
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
