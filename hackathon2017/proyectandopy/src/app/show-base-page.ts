import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AppHelper } from '../helpers/app-helper';

export class ShowBasePage {

  item: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public appHelper: AppHelper) {
    this.item = navParams.get('item');
  }

  toggleGroup(event, _class, col, h_id) {
    if(document.getElementById(col)){
      if (event.classList.contains(_class)) {
        document.getElementById(col).style.display = 'none';
        document.getElementById(_class).style.display = 'block';
        document.getElementById(h_id).style.display = 'none';
        event.classList.remove(_class);
      } else{
        document.getElementById(col).style.display = 'block';
        document.getElementById(_class).style.display = 'none';
        document.getElementById(h_id).style.display = 'block';
        event.classList.add(_class);
      }
    }
  }

}
