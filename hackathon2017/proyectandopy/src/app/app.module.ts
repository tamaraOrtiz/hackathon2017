import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import { MomentModule } from 'angular2-moment';
import { ProgressBarComponent } from '../components/progressbar/progressbar';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InstitucionPage } from '../pages/institucion/institucion';
import { ShowInstitucionPage } from '../pages/show-institucion/show-institucion';
import { ShowNivelPage } from '../pages/show-nivel/show-nivel';
import { ProgramaPage } from '../pages/programa/programa';
import { MapaPage } from '../pages/mapa/mapa';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ShowLineaAccionPage } from '../pages/show-linea-accion/show-linea-accion';
import { PNDPage } from '../pages/pnd/pnd';
import { ModalPage } from '../pages/modal/modal';
import { EstadisticasPage } from '../pages/estadisticas/estadisticas';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PpyCanva } from '../components/ppy-canva/ppy-canva';
import { PpyResumen } from '../components/ppy-resumen/ppy-resumen';
import { PpyRating } from '../components/ppy-rating/ppy-rating';
import { PpyComment } from '../components/ppy-comment/ppy-comment';
import { AppHelper } from '../helpers/app-helper';
import { KeysPipe } from '../helpers/keys-pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InstitucionPage,
    ShowNivelPage,
    ShowInstitucionPage,
    ShowLineaAccionPage,
    ProgramaPage,
    MapaPage,
    TabsPage,
    TutorialPage,
    PpyCanva,
    PpyResumen,
    PpyRating,
    PpyComment,
    ProgressBarComponent,
    PNDPage,
    ModalPage,
    EstadisticasPage,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    MomentModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InstitucionPage,
    ShowNivelPage,
    ShowInstitucionPage,
    ShowLineaAccionPage,
    ProgramaPage,
    MapaPage,
    TabsPage,
    TutorialPage,
    PNDPage,
    EstadisticasPage,
    ModalPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
