import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BasePage } from '../../app/base-page';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { InstitucionData } from '../../providers/institucion';
import { AppHelper } from '../../helpers/app-helper';
import { LoadingController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  templateUrl: 'tutorial.html',
  providers: [InstitucionData]
})

export class TutorialPage extends BasePage {
  _slides = [
    {
      title: "Plan Nacional de Desarrollo 2030",
      description: "El <b>Plan Nacional de Desarrollo 2030 o PND</b> busca coordinar las acciones de los Poderes del Estado, niveles de Gobierno, sociedad civil y sector privado a fin de mejorar la gestión del País",
      image: "../assets/img/57.svg",
      cont:"1",
    },
    {
      title: "Ejes Estratégicos",
      description: "El PND se basa en una estructura de objectivos, a partir de tres <b>Ejes Estratégicos:</b></br> 1. Reducción de pobreza y desarrollo social. </br> 2. Crecimiento económico inclusivo. </br> 3. Inserción de Paraguay en el mundo en forma adecuada. ",
      image: "../assets/img/ejes.jpg",
      cont:"2",
    },
    {
      title: "Niveles",
      description: "Actualmente existen <b>un conjunto de Niveles</b> que agrupan las distintas entidades del Gobierno, entre ellas están los tres poderes del Estado, entidades y empresas públicas, universidades, entre otros.",
      image: "../assets/img/24.svg",
      cont:"3",
    },
    {
      title: "Entidades",
      description: "Las distintas <b>Entidades</b> del Gobierno planean y ejecutan programas vinculados a los ejes estratégicos, con el fin de alcanzar la meta fijada en el Plan de Desarrollo 2030.",
      image: "../assets/img/08.svg",
      cont:"4",
    },
    {
      title: "Programas",
      description: "Los <b>Programas</b> son un conjunto de acciones planeadas por cada entidad, que trabajan sobre un eje estratégico específico y que cuenta con un presupuesto determinado.",
      image: "../assets/img/36.svg",
      cont:"5",
    },
    {
      title: "ProyectandoPy",
      description: "<b>ProyectandoPy</b> toma los datos de los distintos programas, como número de beneficiarios y costos, y genera reportes y estadísticas útiles para ponerlos a disposición de los ciudadanos",
      image: "../assets/img/44.svg",
      cont:"6",
    }
  ];
  @ViewChild(Slides) slides: Slides;
  constructor(private iab: InAppBrowser, public navCtrl: NavController, public navParams: NavParams, public dataService: InstitucionData, public loadingCtrl: LoadingController,
    menuCtrl: MenuController, public appHelper: AppHelper) {
    super(navCtrl, navParams, dataService, appHelper);
  }

  openLink(link){
  		this.iab.create(link,'_system',{location:'yes'});
  }

  goToSlide() {
    this.slides.slideNext(100);
  }

  gobackSlide() {
    this.slides.slidePrev(100);
  }
}
