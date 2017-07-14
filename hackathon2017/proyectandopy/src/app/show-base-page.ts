import { NavController, NavParams } from 'ionic-angular';


export class ShowBasePage {
  
  item: any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log(this.item);
  }

  pushItem(records: any) {

  }

}
