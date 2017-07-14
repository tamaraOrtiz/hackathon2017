import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-show-nivel',
  templateUrl: 'show-nivel.html',
})
export class ShowNivelPage {

  item: {id: string, nombre: string}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log(this.item);
  }

}
