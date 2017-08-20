import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InstitucionPage } from '../pages/institucion/institucion';
import { ShowInstitucionPage } from '../pages/show-institucion/show-institucion';
import { NivelPage } from '../pages/nivel/nivel';
import { ShowNivelPage } from '../pages/show-nivel/show-nivel';
import { ProgramaPage } from '../pages/programa/programa';
import { MapaPage } from '../pages/mapa/mapa';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ShowLineaAccionPage } from '../pages/show-linea-accion/show-linea-accion';
import { PNDPage } from '../pages/pnd/pnd';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PpyCanva } from '../components/ppy-canva/ppy-canva';
import { PpyRating } from '../components/ppy-rating/ppy-rating';
import { PpyComment } from '../components/ppy-comment/ppy-comment';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InstitucionPage,
    NivelPage,
    ShowNivelPage,
    ShowInstitucionPage,
    ShowLineaAccionPage,
    ProgramaPage,
    MapaPage,
    TabsPage,
    TutorialPage,
    PpyCanva,
    PpyRating,
    PpyComment,
    PNDPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InstitucionPage,
    NivelPage,
    ShowNivelPage,
    ShowInstitucionPage,
    ShowLineaAccionPage,
    ProgramaPage,
    MapaPage,
    TabsPage,
    TutorialPage,
    PNDPage
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
