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

  share(via='facebook', message=null, url=null, image=null) {//
    let appnames = {
      'facebook': `http://www.facebook.com/sharer.php?message=${message}&url=${url}`,
      'twitter': `https://twitter.com/share?text=${message}&url=${url}`
    };
    if(this.platform.is('core') || !this.socialSharing.canShareVia(via)){
      window.open(appnames[via], '_blank');
    } else {
      this.socialSharing.shareVia(via, message);
    }
  }

}
