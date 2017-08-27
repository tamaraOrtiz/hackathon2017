import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
    this.selectedNiveles = [];
  }


  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      let niveles = this.selectedNiveles.length > 0 ? `AND nivelid IN ('${this.selectedNiveles.join('\',\'')}')` : '';
      this.dataService.getAll(`nombre ILIKE '%agencia%' ${niveles}`).then(records => {
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
  ionViewDidLoad(){
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
      this.pushItems(records);
      let self = this;
      let groupedItems = {}
      this.items.map(function(item) {
        if(groupedItems[item.nivelid] === undefined) {
          groupedItems[item.nivelid] = {name: item.nivel_nombre, items: []};
        }
        groupedItems[item.nivelid]['items'].push(item);
      });
      this.groupedItems = (<any> Object).values(groupedItems);
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
        if(groupedItems[item.nivelid] === undefined) {
          groupedItems[item.nivelid] = {name: item.nivel_nombre, items: []};
        }
        groupedItems[item.nivelid]['items'].push(item);
      });
      this.groupedItems = (<any> Object).values(groupedItems);
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


  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

}
