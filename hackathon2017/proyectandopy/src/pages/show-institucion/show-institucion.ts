import { Component, Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShowBasePage } from '../../app/show-base-page';
import { InstitucionData } from '../../providers/institucion';


@Component({
  selector: 'page-show-institucion',
  templateUrl: 'show-institucion.html',
  providers: [InstitucionData]
})

export class ShowInstitucionPage extends ShowBasePage {

  item: {id: string, nivelId: string, nombre: string, meta: any}

  meta: Array<any>

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData) {
    super(navCtrl, navParams);
    this.dataService = dataService;
  }

  ionViewDidLoad() {
    this.dataService.getQuery(this.dataService.getResumenPrograma(this.item.nivelId, this.item.id, undefined)).then(records => {
      this.meta = records;
    });
  }

  pushItem(records: {id: string, nivelId: string, nombre: string, meta: any}) {

  }

}
