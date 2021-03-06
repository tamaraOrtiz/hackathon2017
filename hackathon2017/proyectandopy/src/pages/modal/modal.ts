import { Component } from '@angular/core';
import {  ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { InstitucionData } from '../../providers/institucion';
import { RatingData } from '../../providers/rating';
import { PndData } from '../../providers/pnd';
import { BasePage } from '../../app/base-page';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AppHelper } from '../../helpers/app-helper';

@Component({
  selector: 'page-pnd',
  templateUrl: 'modal.html',
  providers: [InstitucionData, RatingData, PndData]
})
export class ModalPage extends BasePage {
  info: Array<any>;
  viewC : ViewController
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: InstitucionData,
    public loadingCtrl: LoadingController,
    public events: Events, public plt: Platform,
    public raService: RatingData, public pService: PndData, public modalCtrl: ModalController, viewCtrl: ViewController,
    public appHelper: AppHelper) {
    super(navCtrl, navParams, dataService, appHelper);
    this.info = this.navParams.data;
    this.viewC = viewCtrl;
  }
  
  dismiss() {
      this.viewC.dismiss();
    }
}
