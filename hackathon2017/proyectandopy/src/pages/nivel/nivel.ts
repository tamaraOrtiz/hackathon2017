import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { NivelData } from '../../providers/nivel';
import { ShowNivelPage } from '../show-nivel/show-nivel';
import { BasePage } from '../../app/base-page';

@Component({
  selector: 'page-nivel',
  templateUrl: 'nivel.html',
  providers: [NivelData]
})

export class NivelPage extends BasePage {
  selectedItem: any;
  icons: string[];
  items: Array<{id: string, nombre: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: NivelData) {
    super(navCtrl, navParams, dataService);
  }

  pushItems(records: Array<any>) {
    for (let record of records) {
      this.items.push({
        id: record.nivel_id,
        nombre: record.nivel_nombre
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ShowNivelPage, {
      item: item
    });
  }

}
