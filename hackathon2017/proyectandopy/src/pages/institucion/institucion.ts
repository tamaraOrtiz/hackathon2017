import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
import { AppHelper } from '../../helpers/app-helper';
import { BasePage } from '../../app/base-page';
import { LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EstadisticasPage } from '../estadisticas/estadisticas';
import { Platform } from 'ionic-angular';



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
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController,
    menuCtrl: MenuController, public socialSharing: SocialSharing, public platform: Platform) {
    super(navCtrl, navParams, dataService, socialSharing, platform);
    this.where = "borrado = 'false'";
    this.openbar = platform.is('core');
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

  showSearch(value: boolean){
    this.showSearchBar = value;
  }

  ionViewDidEnter(){
    let self = this;
    this.loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });

    this.loading.present();
    this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
      this.niveles = this.structNiveles(records);
      this.selectedNiveles = Object.keys(this.niveles);
      this.filter(null, false, this.loading);
    }, function(errors){
      self.loading.dismiss();
    });
  }

  filter(event, bar, loader=null) {
    let val = bar && (event.target.value !== null || event.target.value !== undefined) ? event.target.value : '';
    let loading = loader ? loader : this.loadingCtrl.create({
       content: 'Por favor espere...'
    });
    if(!loader){
      loading.present();
    }
    let self = this;
    let niveles = this.selectedNiveles.length > 0 ? `nivelid IN ('${this.selectedNiveles.join('\',\'')}')` : null;
    if (!niveles) {
      loading.dismiss();
      return;
    }
    let query = (bar && val.trim() !== '') ? `nombre ILIKE '%25${val}%25' AND ${niveles}` : niveles;
    this.dataService.getAll(query).then(records => {
      self.pushItems(records);

      let groupedItems = {}
      self.items.map(function(item) {
        self.groupItems(groupedItems, item);
      });
      self.groupedItems = (<any> Object).values(groupedItems);
      self.groupedItems.map(function(item) {
        item.entidades = (<any> Object).values(item.entidades);
      });
      loading.dismiss();
    }, function(errors){
      loading.dismiss();
    });
  }

  structNiveles (meta):any {
    let niveles = [];
    for(let row of meta) {
      niveles[row.nivel_id] =
      {
        id: row.nivel_id,
        nombre: AppHelper.toTitleCase(row.nivel_nombre),
      };
    }

    return niveles;
  }

  groupItems(groupedItems, item) {
    if(groupedItems[item.nivelid] === undefined) {
      groupedItems[item.nivelid] = {name: this.niveles[item.nivelid].nombre, entidades: []};
    }
    if(groupedItems[item.nivelid]['entidades'][item.entidadid] === undefined) {
      groupedItems[item.nivelid]['entidades'][item.entidadid] = {name: AppHelper.toTitleCase(item.entidadid), items: []};
    }
    item.nombre = AppHelper.toTitleCase(item.nombre);
    groupedItems[item.nivelid]['entidades'][item.entidadid]['items'].push(item);
  }


  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

  itemTappedEst(event, item) {
    this.navCtrl.push(EstadisticasPage, {
      item: item
    });
  }

  selectAll(all) {
    let self = this;
    if(all) {
      self.selectedNiveles = [];
      self.niveles.map(function(item) {
        console.log(item.id);
        self.selectedNiveles.push(item.id);
      })
    } else {
      self.selectedNiveles = [];
    }
    console.log(event);
  }

}
