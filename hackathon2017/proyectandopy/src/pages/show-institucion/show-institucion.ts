import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';

/**
 * Generated class for the ShowNivelPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-show-institucion',
  templateUrl: 'show-institucion.html',
})
export class ShowInstitucionPage extends ShowBasePage {

  item: {id: string, nivelId: string, nombre: string, meta: any}

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams);
  }

  ionViewDidLoad() {
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelId, this.item.id, undefined)).then(record => {
      this.pushItem(record);
    });
  }

  pushItem(records: {id: string, nivelId: string, nombre: string, meta: any}) {

  }

}
