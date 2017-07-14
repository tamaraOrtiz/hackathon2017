import { Component, Injectable } from '@angular/core';
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

@Injectable()
export class InstitucionPage extends BasePage {
  items: Array<{id: string, nivelId: string, nombre: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams, dataService);
  }

  pushItems(records: Array<any>) {
    for (let record of records) {
      this.items.push({
        id: record.entidadid,
        nivelId: record.nivelid,
        nombre: record.nombre
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

}
