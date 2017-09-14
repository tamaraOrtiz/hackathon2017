import { Component } from '@angular/core';
import {  ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { PndData } from '../../providers/pnd';
import { BasePage } from '../../app/base-page';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalPage } from '../../pages/modal/modal'
import { SocialSharing } from '@ionic-native/social-sharing';;

@Component({
  selector: 'page-pnd',
  templateUrl: 'pnd.html',
  providers: [InstitucionData, RatingData, PndData]
})
export class PNDPage extends BasePage {
  items: Array<{title: string, note: string, icon: string}>;
  niveles: Array<any>;
  entidades: Array<any>;
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
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData,
    public loadingCtrl: LoadingController,
    public events: Events, public plt: Platform,
    public socialSharing: SocialSharing,
    public raService: RatingData, public pService: PndData, public modalCtrl: ModalController) {
    super(navCtrl, navParams, dataService, socialSharing, plt);
    this.ratingService = raService;
    this.pndService = pService;
    this.selectedNiveles = "null";
    this.selectedEntidades = "null";
    this.selectedAnhos = "null";
    this.anhos = [2017,2018,2019];
    this.tabactive = 'general';
    this.openbar = plt.is('core');

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
    console.log(event && event.hasOwnProperty('target'));
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
      console.log(record);
        this.general = record;
        loading.dismiss();
    });

    this.dataService.getQuery(this.pndService.getEjes(nivel, entidad, anho), true).then(record => {
      console.log(record);
        this.eje = record;
    });
    this.dataService.getQuery(this.pndService.getEstrategias(nivel, entidad, anho), true).then(record => {
      console.log(record);
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
      this.events.publish('rating:retrieve', rating, Date.now());
    });

    this.dataService.getQuery(this.pndService.getGeneral(null, null, null), true).then(record => {
      console.log(record);
        this.general = record;
    });
    this.dataService.getQuery(this.pndService.getEjes(null, null, null), true).then(record => {
      console.log(record);
        this.eje = record;
    });
    this.dataService.getQuery(this.pndService.getEstrategias(null, null, null), true).then(record => {
      console.log(record);
        this.estrategias = record;
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
