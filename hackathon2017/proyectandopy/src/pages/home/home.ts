import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InstitucionPage } from '../../pages/institucion/institucion';
import { ProgramaPage } from '../../pages/programa/programa';
import { TutorialPage } from '../../pages/tutorial/tutorial';
import { PNDPage } from '../../pages/pnd/pnd';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  'Intituciones' = InstitucionPage;
  'PND' = PNDPage;
  'Informacion' = TutorialPage;
  constructor(public navCtrl: NavController) {

  }

}
