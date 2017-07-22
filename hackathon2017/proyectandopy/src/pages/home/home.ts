import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InstitucionPage } from '../../pages/institucion/institucion';
import { NivelPage } from '../../pages/nivel/nivel';
import { ProgramaPage } from '../../pages/programa/programa';
import { TutorialPage } from '../../pages/tutorial/tutorial';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  'Intituciones' = InstitucionPage;
  'Niveles' = NivelPage;
  'Programas' = ProgramaPage;
  'Informacion' = TutorialPage;
  constructor(public navCtrl: NavController) {

  }

}
