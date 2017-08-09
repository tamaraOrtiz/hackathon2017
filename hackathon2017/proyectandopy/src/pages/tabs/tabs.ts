import { Component } from '@angular/core';

import { InstitucionPage } from '../../pages/institucion/institucion';
import { HomePage } from '../../pages/home/home';
import { NivelPage } from '../../pages/nivel/nivel';
import { ProgramaPage } from '../../pages/programa/programa';
import { TutorialPage } from '../../pages/tutorial/tutorial';

@Component({
  templateUrl: 'tabs.html'})

export class TabsPage {
  'Instituciones' = InstitucionPage;
  'Niveles' = NivelPage;
  'Programas' = ProgramaPage;
  'Informacion' = TutorialPage;

  constructor() {

  }
}
