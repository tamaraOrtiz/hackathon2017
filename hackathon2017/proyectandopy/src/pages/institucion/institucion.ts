import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
import { AppHelper } from '../../helpers/app-helper';
import { BasePage } from '../../app/base-page';
import { LoadingController } from 'ionic-angular';
import { EstadisticasPage } from '../estadisticas/estadisticas';
import { Slides } from 'ionic-angular';



@Component({
  selector: 'page-institucion',
  templateUrl: 'institucion.html',
  providers: [InstitucionData]
})

export class InstitucionPage extends BasePage {
  items: Array<any>;
  searchQuery: string = '';
  showSearchBar: boolean = false;
  niveles: Array<any>;
  selectedNiveles: Array<any> = [];
  groupedItems: Array<any> = [];
  loading;
  openbar: any;
  rootPage: any = InstitucionPage;
  inst : any = {};
  _niveles : any = {};
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController,
    menuCtrl: MenuController, public appHelper: AppHelper) {
    super(navCtrl, navParams, dataService, appHelper);
    this.where = "borrado = 'false'";
    this.openbar = appHelper.isDeskTop();
  }

  delete(chip: Element, value) {
    chip.remove();
    this.selectedNiveles.splice(this.selectedNiveles.indexOf(value), 1);
    this.filter(null, false);
  }

  opensidebar(){
    this.openbar = true;
  }

  closesidebar(){
    this.openbar = false;

  }

  goToSlide() {
    this.slides.slideNext(100);
  }

  gobackSlide() {
    this.slides.slidePrev(100);
  }

  showSearch(value: boolean){
    this.showSearchBar = value;
  }


  ionViewDidEnter(){
    let self = this;
    this.loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });

    this.loading.present().then(() => {
      this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
        this.niveles = this.structNiveles(records);
        this.selectedNiveles = Object.keys(this.niveles);
        this.filter(null, false, this.loading);
      }, function(errors){
        self.loading.dismiss();
      }).then(result => {
        this.dataService.getQuery(this.dataService.getInstituciones([]), true).then(record => {
          this._niveles = record;
          self.loading.dismiss();
        });
      });
    });
  }

  add_all_niveles(){
     this.selectedNiveles = Object.keys(this.niveles);

   }
   remove_all_niveles(){
      this.selectedNiveles = [];
      this._niveles = {};

    }

  filter(event, bar, loader=null) {
    let loading = loader ? loader : this.loadingCtrl.create({
       content: 'Por favor espere...'
    });
    if(!loader){
      loading.present();
    }
    console.log(this.selectedNiveles);
    if(this.selectedNiveles.length == 0){
      this.dataService.getQuery(this.dataService.getInstituciones(["-1"]), true).then(record => {
        this._niveles = record;
        loading.dismiss();
      });
    }else{
      this.dataService.getQuery(this.dataService.getInstituciones(this.selectedNiveles), true).then(record => {
        this._niveles = record;
        loading.dismiss();
      });
    }


  }

  structNiveles (meta):any {
    let niveles = [];
    for(let row of meta) {
      niveles[row.nivel] =
      {
        id: row.nivel,
        nombre: this.appHelper.toTitleCase(row.nombrenivel),
      };
    }

    return niveles;
  }



  itemTapped(event, item) {
    this.dataService.pushEvent("Institucion", item.id, "view", "institucion_list");
    this.navCtrl.push(ShowInstitucionPage, {
      item: item,
      ins_id: item.id
    });
  }

  itemTappedEst(event, item) {
    this.dataService.pushEvent("Entidad", item.nivelid+"_"+item.entidadid, "view", "institucion_list");
    this.navCtrl.push(EstadisticasPage, {
      item: item
    });
  }

  selectAll(all) {
    let self = this;
    if(all) {
      self.selectedNiveles = [];
      self.niveles.map(function(item) {
        self.selectedNiveles.push(item.id);
      })
    } else {
      self.selectedNiveles = [];
    }
  }

}
