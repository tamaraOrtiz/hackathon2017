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

  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

}
