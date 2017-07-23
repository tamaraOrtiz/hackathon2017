import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { ShowInstitucionPage } from '../show-institucion/show-institucion';
import { BasePage } from '../../app/base-page';
import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-institucion',
  templateUrl: 'institucion.html',
  providers: [InstitucionData]
})

export class InstitucionPage extends BasePage {
  items: Array<any>;
  searchQuery: string = '';
  niveles: Array<any>;
  selectedNiveles: any;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, dataService);
    this.where = "borrado = 'false'";
    this.selectedNiveles = [];

  }

  getItems(ev: any) {
    console.log(this.selectedNiveles);
    let val = ev.target.value;
    if (val && val.trim() != '') {
      console.log(val);
      let niveles = this.selectedNiveles.length > 0 ? `AND nivelid IN ('${this.selectedNiveles.join('\',\'')}')` : '';
      this.dataService.getAll(`nombre ILIKE '%agencia%' ${niveles}`).then(records => {
        this.pushItems(records);
      });
    }
  }

  ionViewDidLoad(){
    this.loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });

    this.loading.present();
    this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
      this.niveles = this.structNiveles(records);
    });
    this.dataService.getAll(this.where).then(records => {
      this.pushItems(records);
      this.loading.dismiss();
    });

  }

  filter() {
    this.dataService.getAll(`nivelid IN ('${this.selectedNiveles.join('\',\'')}')`).then(records => {
      this.pushItems(records);
    });
  }

  structNiveles (meta):any {
    let niveles = [];
    for(let row of meta) {
      niveles.push({
        id: row.nivel_id,
        nombre: row.nivel_nombre,
      });
    }

    return niveles;
  }


  itemTapped(event, item) {
    this.navCtrl.push(ShowInstitucionPage, {
      item: item
    });
  }

}
