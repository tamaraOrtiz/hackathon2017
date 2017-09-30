import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { AppHelper } from '../../helpers/app-helper';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'ppy-footer',
  templateUrl: 'ppy-footer.html'
})

export class PpyFooter {
  public constructor(private iab: InAppBrowser, public appHelper: AppHelper) {
  }
  openLink(link){
      this.iab.create(link,'_system',{location:'yes'});
  }

}
