import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BaseData } from '../providers/base';
import { ShowBasePage } from './show-base-page';
import { AppHelper } from '../helpers/app-helper';

export class BasePage {
  items: Array<any>
  where: string
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public dataService: BaseData, public appHelper: AppHelper) {
    this.items = [];
    this.where = undefined;
  }

  ionViewDidEnter() {
    this.dataService.getAll(this.where).then(records => {
      this.pushItems(records);
    });
  }

  pushItems(records: Array<any>) {
    this.items = [];
    for (let record of records) {
      this.items.push(record);
    }
  }

  itemTapped(event, item) {}

}
