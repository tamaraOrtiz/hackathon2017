import { Injectable } from '@angular/core';
import * as html2canvas from "html2canvas";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';
import * as d3 from "d3";
@Injectable()
export class AppHelper {

  numberFormat: any;
  provider: any;

  constructor(public socialSharing: SocialSharing, public platform: Platform) {
    let localeFormatter = d3.formatLocale({ "decimal": ",", "thousands": ".", "grouping": [3]});
    this.numberFormat = localeFormatter.format(",.2f")
  }

  numberFormatter(number) {
    return this.numberFormat(number.toString()).replace(/,0+/,'');
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

  getGenerateCanva(div, excludedElements, showElements=[]){
    let self = this;
    return new Promise<any>((resolve) => {
      let target = self.getElement(div);
      html2canvas(target, {
        onclone: function(doc) {
          excludedElements.forEach(function (div) {
            let element = self.getElement(div, doc);
            if(element !== null) {
              element.style.display = 'none';
            }
          });
          showElements.forEach(function (div) {
            let element = self.getElement(div, doc);
            console.log(div);
            console.log(element);
            if(element !== null) {
              element.style.display = 'block';
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

  download(div, excludedElements=[], showElements=[], entidad, id, page) {
    console.log(showElements);
    this.provider.pushEvent(entidad, id, "download", page)
    let self = this;
    self.getGenerateCanva(div, excludedElements, showElements).then(function (url) {
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

  share(via='facebook', message=null, url=null, image=null) {
    url = url ? url : 'https://proyectandopy.com';
    image = 'http://fiuni.edu.py/img/logo-fiuni.png';
    let appnames = {
      'facebook': `http://www.facebook.com/sharer.php?summary=${message}&u=${url}&image=${image}`,
      'twitter': `https://twitter.com/share?text=${message}&url=${url}`
    };
    if(this.platform.is('core') || !this.socialSharing.canShareVia(via)){
      window.open(appnames[via], '_blank');
    } else {
      this.socialSharing.shareWithOptions({
        message: 'share this', // not supported on some apps (Facebook, Instagram)
        subject: 'the subject', // fi. for email
        files: [image], // an array of filenames either locally or remotely
        url: 'https://www.website.com/foo/#bar?a=b',
        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
      });//(via, message, '', url, image);
    }
  }

  shareDiv(div, excludedElements=[], via='facebook'){
    this.getGenerateCanva(div, excludedElements).then((image) => {

      this.share(via, null, null, image);
    });
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

  getRange(min, max, n) {
    let r = [];
    let s = Math.round((max-min) /n);
    if(s === 0) {
      return r;
    }
    for(let i = max; i > min; i-=s) {
      r.push(i);
    }
    r.push(min);
    return r;
  }
}
