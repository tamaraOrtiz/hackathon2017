import { Injectable } from '@angular/core';
import * as html2canvas from "html2canvas";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';

@Injectable()
export class AppHelper {

  constructor(public socialSharing: SocialSharing, public platform: Platform) {

  }

  isDeskTop(){
    return this.platform.is('core');
  }

  toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  fontSizeforWidth(width, text){
    return width / text.length * 0.85;
  }

  getGenerateCanva(div, excludedElements){
    let self = this;
    return new Promise<any>((resolve) => {
      let target = self.getElement(div);
      html2canvas(target, {
        onclone: function(doc) {
          excludedElements.forEach(function (div) {
            let element = self.getElement(div, doc);
            console.log(element);
            if(element !== null) {
              element.style.display = 'none';
            }
          });
        }
      }).then( canvas => {
        let url = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        resolve(url);
      });
    });
  }

  getElement(identifier, dom=document) {
    return dom.querySelector(identifier);
  }

  download(div, excludedElements) {
    let self = this;
    self.getGenerateCanva(div, excludedElements).then(function (url) {
      if(self.platform.is('core')){
        var a = document.createElement('a');
        a.href = url;
        a.download = 'estadistica.jpg';
        a.click();
      } else {
        //self.fileTransfer.download(url, self.file.dataDirectory + 'file.pdf').then((entry) => {
        //  console.log('download complete: ' + entry.toURL());
        //}, (error) => {
        //});
      }
    });
  }

  share(via='facebook', message=null, url=null, image=null) {//
    let appnames = {
      'facebook': `http://www.facebook.com/sharer.php?summary=${message}&u=${url}`,
      'twitter': `https://twitter.com/share?text=${message}&url=${url}`
    };
    if(this.platform.is('core') || !this.socialSharing.canShareVia(via)){
      window.open(appnames[via], '_blank');
    } else {
      this.socialSharing.shareVia(via, message);
    }
  }

  shareDiv(div, via='facebook'){
    this.share(via, null, null, this.getGenerateCanva(div, []));
  }

  keys(hash) {
    return Object.keys(hash);
  }

  combineHashes(source, destination) {
    this.keys(source).forEach(function(k) {
      let amount = destination[k] === undefined ? 0 :destination[k];
      destination[k] = amount + source[k];
    });
  }
}
