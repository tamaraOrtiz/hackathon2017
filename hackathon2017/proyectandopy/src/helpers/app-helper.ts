import { Injectable } from '@angular/core';
import * as html2canvas from "html2canvas";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { ToastController } from 'ionic-angular';
import * as d3 from "d3";
@Injectable()
export class AppHelper {

  numberFormat: any;
  provider: any;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public socialSharing: SocialSharing, public platform: Platform,
    private transfer: FileTransfer, private file: File, public toastCtrl: ToastController,
    private fileOpener: FileOpener) {
    let localeFormatter = d3.formatLocale({ "decimal": ",", "thousands": ".", "grouping": [3]});
    this.numberFormat = localeFormatter.format(",.2f")
  }

  numberFormatter(number) {
    return this.numberFormat(number.toString()).replace(/,0+/,'');
  }

  isDeskTop(){
    return this.platform.is('core');
  }

  isBrowser(){
    return this.platform.is('core') || this.platform.is('mobileweb');
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

  download(div, excludedElements=[], showElements=[], entidad, id, page, filename) {
    this.provider.pushEvent(entidad, id, "download", page)
    let self = this;
    self.getGenerateCanva(div, excludedElements, showElements).then(function (url) {
      if(self.isBrowser()){
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      } else {
        console.log(`${self.file.cacheDirectory}${filename}`);
        self.fileTransfer.download("http://www.set.gov.py/portal/rest/jcr/repository/collaboration/sites/PARAGUAY-SET/medias/images/2017/bannerHome2017.jpg", `${self.file.cacheDirectory}${filename}`).then((entry) => {

          let toast = self.toastCtrl.create({
            message: "Se ha descargado correctamente",
            duration: 3000,
            position: 'top',
            cssClass: "toast-success"
          });
          toast.present();
          console.log(entry.toURL());
          self.fileOpener.open(entry.toURL(), 'image/jpg')
              .then(() => toast.present())
              .catch(e => console.log('Error openening file', e));
          console.log(entry.toURL());

        }, (error) => {
          console.log(error);
          let toast = self.toastCtrl.create({
            message: "No se pudo descargar la imagen",
            duration: 3000,
            position: 'top',
            cssClass: "toast-error"
          });
          toast.present();
        });
      }
    });
  }

  downloadjson(entidad, id, page, filename, _object, _elem: Element) {
    this.provider.pushEvent(entidad, id, "download", page)
    let self = this;
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_object));
    var elem = (_elem as any)._elementRef.nativeElement;
    if(self.isBrowser()){
      elem.setAttribute("href",     dataStr     );
      elem.setAttribute("download", filename);
    } else {

    }
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
    let s = Math.round((max-min) /n * 100) / 100;
    if(s >= 10) {
      s = Math.round(s);
    }
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
