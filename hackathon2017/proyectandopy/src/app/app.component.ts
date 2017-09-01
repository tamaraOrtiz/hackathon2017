import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { InstitucionPage } from '../pages/institucion/institucion';
import { NivelPage } from '../pages/nivel/nivel';
import { ProgramaPage } from '../pages/programa/programa';
import { MapaPage } from '../pages/mapa/mapa';
import { TabsPage } from '../pages/tabs/tabs';
import { PNDPage } from '../pages/pnd/pnd';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = TabsPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Institucion', component: InstitucionPage, icon: "home" },
      { title: 'Nivel', component: NivelPage, icon: "stats" },
      { title: 'Programa', component: ProgramaPage, icon: "albums" },
      { title: 'Mapa', component: MapaPage, icon: "map" },
      { title: 'PND', component: PNDPage, icon: "map" }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      moment.locale('es-la');
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
