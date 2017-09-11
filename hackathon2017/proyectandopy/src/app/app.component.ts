import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { InstitucionPage } from '../pages/institucion/institucion';
import { TabsPage } from '../pages/tabs/tabs';
import { PNDPage } from '../pages/pnd/pnd';
import { TutorialPage } from '../pages/tutorial/tutorial';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = InstitucionPage;

  pages: Array<{title: string, component: any, icon: string}>;

  'Instituciones' = InstitucionPage;
  'PND' = PNDPage;
  'Informacion' = TutorialPage;
  menu:any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController, menuCtrl: MenuController) {
    this.initializeApp();

    this.menu = menuCtrl;
    this.pages = [
      { title: 'Institucion', component: InstitucionPage, icon: "home" },
      { title: 'PND', component: PNDPage, icon: "albums" },
    ];

  }

  openMenu() {
     this.menu.open();

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
