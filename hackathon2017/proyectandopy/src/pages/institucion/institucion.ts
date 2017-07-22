import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
import { BasePage } from '../../app/base-page';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
    this.selectedNiveles = [];
  }

  getItems(ev: any) {
    console.log(this.selectedNiveles);
    let val = ev.target.value;
    if (val && val.trim() != '') {
      let niveles = this.selectedNiveles.length > 0 ? `AND nivelid IN ('${this.selectedNiveles.join('\',\'')}')` : '';
      this.dataService.getAll(`entidadnombre like '%${val}%' ${niveles}`).then(records => {
        this.pushItems(records);
      });
    }
  }

  ionViewDidLoad(){
    this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
      this.niveles = this.structNiveles(records);
    });
    this.dataService.getAll(this.where).then(records => {
      this.pushItems(records);
    });
  }

  filter() {
    this.dataService.getAll(`nivelid IN ('${this.selectedNiveles.join('\',\'')}')`).then(records => {
      this.pushItems(records);
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
