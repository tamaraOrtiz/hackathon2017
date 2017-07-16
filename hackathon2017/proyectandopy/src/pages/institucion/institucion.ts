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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
  }

  pushItems(records: Array<any>) {
    for (let record of records) {
      this.items.push(record);
    }
  }

  itemTapped(event, item) {
    console.log(this.items);
    console.log(item)
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

}
