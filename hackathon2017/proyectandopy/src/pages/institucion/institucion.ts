
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
import { Searchbar } from 'ionic-angular';


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
  text: string = "";
  openbar: any;
  rootPage: any = InstitucionPage;
  inst : any = {};
  _niveles : any = {};
  _niveles_relevantes = ["11", "12", "13"];
  _nivelesCount = 0;
  niveles_ids: Array<any> = [];
  isLoading: boolean = false
  isValid: boolean = true
  @ViewChild(Slides) slides: Slides;
  @ViewChild('searchbar') searchbar:Searchbar;
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

  gochip(chip: Element, value) {
    let self = this;
    let htmlch = chip.innerHTML
    chip.innerHTML= "<ion-chip class='chip chip-md chip-transition' style='background: #4986d8; width:"+(chip as any).offsetWidth+"px !important;'><ion-label class='chip_text label label-md'><i class='fa fa-arrow-right' aria-hidden='true'></i></ion-label></ion-chip>";
    chip.querySelector(".chip-transition").addEventListener('click', function(e) {
      chip.innerHTML= htmlch;
      chip.querySelector(".ion-md-close-circle").addEventListener('click', function(e) {
        chip.remove();
        this.selectedNiveles.splice(this.selectedNiveles.indexOf(value), 1);
        this.filter(null, false);
      });
       self.selectedNiveles = [value];
    });

    setTimeout(function(){
      chip.innerHTML= htmlch;
      chip.querySelector(".ion-md-close-circle").addEventListener('click', function(e) {
        chip.remove();
        self.selectedNiveles.splice(self.selectedNiveles.indexOf(value), 1);
        self.filter(null, false);
      });
    }, 3000);

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
    let self =this
    this.showSearchBar = value;
    setTimeout(function(){
      if(self.searchbar){
        self.searchbar.setFocus();
      }

    }, 500);
    if (!value){

      this.text = ""
      self.filter(null, false);
    }


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
      }, function(errors){
        if(self.loading){
            self.loading.dismiss();
            self.loading = null;
            alert("error");
        }
      }).then(result => {
        this.isValid = true;
        this.dataService.getQuery(this.dataService.filterInstituciones(this._niveles_relevantes,this.text), true).then(record => {
          this._niveles = record;
          this._nivelesCount = Object.keys(record).length;
          if(self.loading){
              self.loading.dismiss();
              self.loading = null;
          }
        });
      });
    });

  }
  filtersearch(event, bar, loader=null) {
    let self = this;
    let val = bar && (event.target.value !== null || event.target.value !== undefined) ? event.target.value : '';
    let loading = loader ? loader : self.loadingCtrl.create({
       content: 'Por favor espere...'
    });
    if(!loader){
      loading.present();
    }

    if(self.selectedNiveles.length == 0){
      self.dataService.getQuery(self.dataService.filterInstituciones(["-1"],""), true).then(record => {
        self._niveles = record;
        if(loading){
          loading.dismiss();
          loading = null;
      	}
      });
    }else{
      this.text = val;
      this.isValid = false;
      self.dataService.getQuery(self.dataService.filterInstituciones(self.selectedNiveles,val), true).then(record => {
        self._niveles = record;
        if(loading){
          loading.dismiss();
          loading = null;
      	}
      });
    }


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

    if(this.selectedNiveles.length == 0){
      this.dataService.getQuery(this.dataService.filterInstituciones(this._niveles_relevantes,this.text), true).then(record => {
        this._niveles = record;
        if(loading){
          loading.dismiss();
          loading = null;
      	}
      });
    } else{
      this.isValid = false;
      this.dataService.getQuery(this.dataService.filterInstituciones(this.selectedNiveles,this.text), true).then(record => {
        this._niveles = record;
        if(loading){
          loading.dismiss();
          loading = null;
      	}
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

      if (!(this._niveles_relevantes as any).includes(row.nivel)){
        console.log(row.nivel);
        this.niveles_ids.push(row.nivel);
      }
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
  getMasInstituciones(){

    this.isLoading = true;
    this.isValid = false;
    let self = this;

    if (self.niveles_ids.length > 0){
      let items = [];
      let item = self.niveles_ids.pop();
      items = [item];
      self._niveles_relevantes.push(item);
      if (self.niveles_ids.length > 1){
        item = self.niveles_ids.pop();
        items.push(item);
        self._niveles_relevantes.push(item);
      }

      let result = {};
      Object.assign(result, self._niveles);
      self.dataService.getQuery(self.dataService.filterInstituciones(items,this.text), true).then(record => {
        self._niveles = record;
        Object.assign(self._niveles, result);

        if (self.niveles_ids.length > 0){
          self.isValid = true;
          self.isLoading = false;
        }
      });
    }

  }
}
