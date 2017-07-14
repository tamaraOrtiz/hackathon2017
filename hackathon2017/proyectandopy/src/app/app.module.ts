import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InstitucionPage } from '../pages/institucion/institucion';
import { ShowInstitucionPage } from '../pages/show-institucion/show-institucion';
import { NivelPage } from '../pages/nivel/nivel';
import { ShowNivelPage } from '../pages/show-nivel/show-nivel';
import { ProgramaPage } from '../pages/programa/programa';
import { MapaPage } from '../pages/mapa/mapa';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EchartCanva } from '../components/echart-canva';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InstitucionPage,
    NivelPage,
    ShowNivelPage,
    ShowInstitucionPage,
    ProgramaPage,
    MapaPage,
    EchartCanva
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
    ProgramaPage,
    MapaPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
