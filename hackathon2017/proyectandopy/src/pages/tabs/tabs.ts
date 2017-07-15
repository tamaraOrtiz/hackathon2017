import { Component } from '@angular/core';

import { InstitucionPage } from '../../pages/institucion/institucion';
import { NivelPage } from '../../pages/nivel/nivel';
import { ProgramaPage } from '../../pages/programa/programa';

@Component({
  templateUrl: 'tabs.html'})

export class TabsPage {
  'Instituciones' = InstitucionPage;
  'Niveles' = NivelPage;
  'Programas' = ProgramaPage;


  constructor() {

  }
}
