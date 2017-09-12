import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
import { AppHelper } from '../../helpers/app-helper';
import { BasePage } from '../../app/base-page';
import { LoadingController } from 'ionic-angular';



@Component({
  selector: 'page-institucion',
  templateUrl: 'institucion.html',
  providers: [InstitucionData]
})

export class InstitucionPage extends BasePage {
  items: Array<any>;
  searchQuery: string = '';
  niveles: Array<any>;
  selectedNiveles: any;
  groupedItems: Array<any> = [];
  loading;
  rootPage: any = InstitucionPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController, menuCtrl: MenuController) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
  }

  delete(chip: Element, value) {
    chip.remove();
    this.selectedNiveles.splice(this.selectedNiveles.indexOf(value), 1);
    this.filter(null);
  }

  oppensidebar(){

    document.getElementById("filter-sidebar").style.display = 'block';
    document.getElementById("opensidebar").style.display = 'none';

  }

  closesidebar(){
    document.getElementById("filter-sidebar-div").style.display = 'none';
    document.getElementById("opensidebar").style.display = 'block';
  }

  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      let niveles = this.selectedNiveles.length > 0 ? `AND nivelid IN ('${this.selectedNiveles.join('\',\'')}')` : '';
      this.dataService.getAll(`nombre ILIKE '${val}' ${niveles}`).then(records => {
        this.pushItems(records);
      });
    }
  }

  showSearch(){
    document.getElementById("subnavbar").style.display = 'none';
    document.getElementById("search-div").style.cssText += ';display:block !important;'
  }

  cancelSearch(){
    document.getElementById("subnavbar").style.display = 'block';
    document.getElementById("search-div").style.cssText += ';display:none !important;'
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
    }, function(errors){
      self.loading.dismiss();
    });

    this.dataService.getAll(this.where).then(records => {
      this.pushItems(records);
      let self = this;
      let groupedItems = {}
      this.items.map(function(item) {
        item.nombre = AppHelper.toTitleCase(item.nombre);
        self.groupItems(groupedItems, item)
      });
      this.groupedItems = (<any> Object).values(groupedItems);
      this.groupedItems.map(function(item) {
        item.entidades = (<any> Object).values(item.entidades);
      });
      this.loading.dismiss();
    }, function(errors){
      self.loading.dismiss();
    });

  }

  filter(event) {
    let self = this;
    this.dataService.getAll(`nivelid IN ('${this.selectedNiveles.join('\',\'')}')`).then(records => {
      this.pushItems(records);
      let self = this;
      let groupedItems = {}
      this.items.map(function(item) {
        self.groupItems(groupedItems, item);
      });
      this.groupedItems = (<any> Object).values(groupedItems);
      this.groupedItems.map(function(item) {
        item.entidades = (<any> Object).values(item.entidades);
      });
    });
  }

  structNiveles (meta):any {
    let niveles = [];
    for(let row of meta) {
      niveles[row.nivel_id] =
      {
        id: row.nivel_id,
        nombre: row.nivel_nombre,
      };
    }

    return niveles;
  }

  groupItems(groupedItems, item) {
    if(groupedItems[item.nivelid] === undefined) {
      groupedItems[item.nivelid] = {name: item.nivelid, entidades: []};
    }
    if(groupedItems[item.nivelid]['entidades'][item.entidadid] === undefined) {
      groupedItems[item.nivelid]['entidades'][item.entidadid] = {name: item.entidadid, items: []};
    }
    groupedItems[item.nivelid]['entidades'][item.entidadid]['items'].push(item);
  }


  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
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
