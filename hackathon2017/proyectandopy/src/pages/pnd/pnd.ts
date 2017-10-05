import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { PndData } from '../../providers/pnd';
import { BasePage } from '../../app/base-page';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalPage } from '../../pages/modal/modal';
import { AppHelper } from '../../helpers/app-helper';
import { Slides } from 'ionic-angular';


@Component({
  selector: 'page-pnd',
  templateUrl: 'pnd.html',
  providers: [InstitucionData, RatingData, PndData]
})
export class PNDPage extends BasePage {
  items: Array<{title: string, note: string, icon: string}>;
  niveles: Array<any> = [];
  entidades: Array<any> = [];
  general: any = {};
  eje: any = {};
  estrategias: any = {};
  selectedNiveles: any;
  selectedEntidades: any;
  selectedAnhos: any;
  anhos: Array<any>;
  tabs: string = "resumen";
  ratingService: RatingData
  pndService: PndData
  calificacion: any
  tabactive:any
  openbar: any
  shownab: any
  count_view = 0
  count_download = 0
  events: any
  info_est= {"Igualdad de oportunidades": "Nivela las oportunidades de todas las personas desde el comienzo de sus vidas, para que las circunstancias de nacimiento como el género, la etnicidad, el lugar de nacimiento y el entorno familiar, que están fuera del control personal, no ejerzan influencia sobre las oportunidades de vida del individuo.",
              "Gestión pública eficiente y transparente": "Implica satisfacer las necesidades de la población, coordinando las áreas funcionales para eliminar la fragmentación de tareas, optimizando los recursos, ofreciendo información veraz de todos los actos de gestión pública de interés para la sociedad",
              "Desarrollo y ordenamiento territorial": 'Define un modelo de ocupación y organización del territorio paraguayo, señalando las acciones territoriales prioritarias (reducción de pobreza, servicios, infraestructura, gestión de riesgos, entre otros), y arreglos institucionales necesarios para su adecuado funcionamiento (acuerdos programáticos para intervención en territorio, desconcentración administrativa y medidas graduales de descentralización).',
            "Sostenibilidad ambiental":" Disminuye los desequilibrios ambientales propios de la actividad económica y los asentamientos humanos."}
  loading;
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData,
    public loadingCtrl: LoadingController,
    public eventHandler: Events, public raService: RatingData,
    public pService: PndData, public appHelper: AppHelper, public modalCtrl: ModalController) {
    super(navCtrl, navParams, dataService, appHelper);
    this.ratingService = raService;
    this.pndService = pService;
    this.selectedNiveles = "null";
    this.selectedEntidades = "null";
    this.selectedAnhos = "null";
    this.anhos = [2017,2018,2019];
    this.tabactive = 'eje';
    this.openbar = appHelper.isDeskTop();
    this.shownab = !appHelper.isDeskTop();
    this.eventHandler.subscribe('Pnd:view:saved:success', (data) => {
      this.count_view = data;
    });
    this.eventHandler.subscribe('Pnd:download:saved:success', (data) => {
      this.count_download = data;
    });
    appHelper.provider = dataService;

  }

  goToSlide() {
    this.slides.slideNext(100);
  }

  gobackSlide() {
    this.slides.slidePrev(100);
  }

  changetab(_text){
    this.tabactive = _text;
  }
  opensidebar(){
    this.openbar = true;


  }
  openModal(info) {

    let modal = this.modalCtrl.create(ModalPage, info);
    modal.present();
  }
  showFilter() {
    document.getElementById("filter-row").setAttribute('style', 'display:block !important');
    document.getElementById("filter-up").setAttribute('style', 'display:block !important');
    document.getElementById("filter-down").setAttribute('style', 'display:none !important');
  }

  hideFilter() {
    document.getElementById("filter-row").setAttribute('style', 'display:none !important');
    document.getElementById("filter-up").setAttribute('style', 'display:none !important');
    document.getElementById("filter-down").setAttribute('style', 'display:block !important');
  }

  closesidebar(){
    this.openbar = false;

  }
  filter(event, bar, loader=null) {
    let val = bar ? event.target.value : '';
    let loading = loader ? loader : this.loadingCtrl.create({
       content: 'Por favor espere...'
    });
    if(!loader){
      loading.present();
    }
    let self = this;
    let nivel = this.selectedNiveles;
    let entidad = this.selectedEntidades;
    let anho = this.selectedAnhos;
    if (!nivel || !entidad || !anho) {
      loading.dismiss();
      return;
    }
    this.dataService.getQuery(this.pndService.getGeneral(nivel, entidad, anho), true).then(record => {
        this.general = record;
        loading.dismiss();
    });

    this.dataService.getQuery(this.pndService.getEjes(nivel, entidad, anho), true).then(record => {
        this.eje = record;
    });
    this.dataService.getQuery(this.pndService.getEstrategias(nivel, entidad, anho), true).then(record => {
        this.estrategias = record;
    });

  }
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PNDPage, {
      item: item
    });
  }

  ionViewDidEnter(){
    let self = this;
    this.loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });
    this.dataService.pushEvent("Pnd", 1, "view", "pnd_view");

    this.loading.present();
    this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
      this.niveles = this.structNiveles(records);
    }, function(errors){
      self.loading.dismiss();
    });

    this.dataService.getAll(this.where).then(records => {
      this.entidades = this.structEntidades(records);
      this.loading.dismiss();
    }, function(errors){
      self.loading.dismiss();
    });

    this.ratingService.getRating(1, 'PND').then(rating => {
      this.calificacion = rating;
      this.eventHandler.publish('rating:retrieve', rating, Date.now());
    });

    this.dataService.getQuery(this.pndService.getGeneral(null, null, null), true).then(record => {

        this.general = record;
    });
    this.dataService.getQuery(this.pndService.getEjes(null, null, null), true).then(record => {

        this.eje = record;
    });
    this.dataService.getQuery(this.pndService.getEstrategias(null, null, null), true).then(record => {

        this.estrategias = record;
    });
    this.dataService.getEvents("Pnd", 1).then(data => {
      this.events = data;
      if("view" in this.events){
        this.count_view = this.events["view"]
      }
      if("download" in this.events){
        this.count_download = this.events["download"]
      }
    });
  }

  structNiveles (meta):any {
    let niveles = [];
    for(let row of meta) {
      niveles.push({
        id: row.nivel_id,
        nombre: row.nivel_nombre,
      });
    }

    return niveles;
  }



  structEntidades (meta):any {

    let entidades = [];
    for(let row of meta) {
      entidades.push({
        id: row.nivelid+"_"+row.entidadid,
        nombre: row.nombre,
      });
    }

    return entidades;
  }

}
