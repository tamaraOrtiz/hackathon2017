import { NavController, NavParams } from 'ionic-angular';


export class ShowBasePage {

  item: any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('item'));
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
  }

  pushItem(records: any) {

  }

}
