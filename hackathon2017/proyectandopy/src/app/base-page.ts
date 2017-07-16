import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BaseData } from '../providers/base';
import { ShowBasePage } from './show-base-page';

@Injectable()
export class BasePage {
  items: Array<any>
  where: string
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: BaseData) {
    this.items = [];
    this.where = undefined;
  }

  ionViewDidLoad() {
    this.dataService.getAll(this.where).then(records => {
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
