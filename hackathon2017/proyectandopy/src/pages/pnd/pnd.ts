import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InstitucionData } from '../../providers/institucion';
import { BasePage } from '../../app/base-page';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-pnd',
  templateUrl: 'pnd.html',
  providers: [InstitucionData]
})
export class PNDPage extends BasePage {
  items: Array<{title: string, note: string, icon: string}>;
  niveles: Array<any>;
  entidades: Array<any>;
  selectedNiveles: any;
  selectedEntidades: any;
  anhos: Array<any>;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, dataService);
    this.selectedNiveles = [];
    this.selectedEntidades = [];
    this.anhos = [2017,2018];

  }

  showFilter() {
    document.getElementById("filter-row").setAttribute('style', 'display:block !important');
    document.getElementById("filter-up").setAttribute('style', 'display:block !important');
    document.getElementById("filter-down").setAttribute('style', 'display:none !important');
  }

  hideFilter() {
    document.getElementById("filter-row").setAttribute('style', 'display:none !important');
    document.getElementById("filter-up").setAttribute('style', 'display:none !important');
    document.getElementById("filter-down").setAttribute('style', 'display:block !important');
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PNDPage, {
      item: item
    });
  }

  ionViewDidLoad(){
    let self = this;
    this.loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });

    this.loading.present();
    this.dataService.getQuery(this.dataService.getNiveles("")).then(records => {
      this.niveles = this.structNiveles(records);
    }, function(errors){
      self.loading.dismiss();
    });

    this.dataService.getAll(this.where).then(records => {
      this.entidades = this.structEntidades(records);
      this.loading.dismiss();
    }, function(errors){
      self.loading.dismiss();
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

  structEntidades (meta):any {
    let entidades = [];
    for(let row of meta) {
      entidades.push({
        id: row.nivelid+"_"+row.entidadid,
        nombre: row.nombre,
      });
    }

    return entidades;
  }

}
