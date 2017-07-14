import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BaseData } from '../providers/base';
import { ShowBasePage } from './show-base-page';

@Injectable()
export class BasePage {
  items: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: BaseData) {
    this.items = [];
  }

  ionViewDidLoad() {
    this.dataService.getAll(undefined).then(records => {
      this.pushItems(records);
    });
  }

  pushItems(records: Array<any>) {

  }

  itemTapped(event, item) {
    this.navCtrl.push(ShowBasePage, {
      item: item
    });
  }
}
