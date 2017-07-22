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
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
  }

  getItems(ev: any) {
    // Reset items back to all of the items


    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.indexOf(val) > -1);
      })
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
