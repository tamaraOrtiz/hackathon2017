import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { PndData } from '../../providers/pnd';
import { BasePage } from '../../app/base-page';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-pnd',
  templateUrl: 'pnd.html',
  providers: [InstitucionData, RatingData, PndData]
})
export class PNDPage extends BasePage {
  items: Array<{title: string, note: string, icon: string}>;
  niveles: Array<any>;
  entidades: Array<any>;
  selectedNiveles: any;
  selectedEntidades: any;
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
    public raService: RatingData, public pService: PndData) {
    super(navCtrl, navParams, dataService);
    this.ratingService = raService;
    this.pndService = pService;
    this.selectedNiveles = [];
    this.selectedEntidades = [];
    this.anhos = [2017,2018];
    this.tabactive = 'general';
    this.openbar = plt.is('core');

  }
  changetab(_text){
    this.tabactive = _text;
  }
  opensidebar(){
    this.openbar = true;


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
