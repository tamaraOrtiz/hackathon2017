import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BaseData } from '../providers/base';
import { ShowBasePage } from './show-base-page';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';

@Injectable()
export class BasePage {
  items: Array<any>
  where: string
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public dataService: BaseData, public socialSharing: SocialSharing, public platform: Platform) {
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

  share() {//message=null, image=null, url=null, via='facebook'
    if(!this.platform.is('mobile')){
    } else {
      this.socialSharing.shareViaFacebook("image")
    }

  }

}
