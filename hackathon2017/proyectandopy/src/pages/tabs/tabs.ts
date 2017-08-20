import { Component } from '@angular/core';

import { InstitucionPage } from '../../pages/institucion/institucion';
import { HomePage } from '../../pages/home/home';
import { NivelPage } from '../../pages/nivel/nivel';
import { ProgramaPage } from '../../pages/programa/programa';
import { TutorialPage } from '../../pages/tutorial/tutorial';
import { PNDPage } from '../../pages/pnd/pnd';

@Component({
  templateUrl: 'tabs.html'})

export class TabsPage {
  'Instituciones' = InstitucionPage;
  'Niveles' = NivelPage;
  'PND' = PNDPage;
  'Informacion' = TutorialPage;

  constructor() {

  }
}
