import { Injectable } from '@angular/core';
import * as html2canvas from "html2canvas";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as d3 from "d3";
@Injectable()
export class AppHelper {

  numberFormat: any;
  provider: any;
  fileTransfer: FileTransferObject;

  constructor(public socialSharing: SocialSharing, public platform: Platform,
    private transfer: FileTransfer, private file: File, public toastCtrl: ToastController,
    private fileOpener: FileOpener, public loadingCtrl: LoadingController) {
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
        allowTaint: true,
        useCORS: true,
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
        console.log(canvas);
        let url = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        resolve(url);
      });
    });
  }

  getElement(identifier, dom=document) {
    return dom.querySelector(identifier);
  }

  download(div, excludedElements=[], showElements=[], entidad, id, page, filename, background=false) {
    this.provider.pushEvent(entidad, id, "download", page)
    let self = this;
    return new Promise<any>((resolve) => {
      self.getGenerateCanva(div, excludedElements, showElements).then(function (url) {
        if(self.isBrowser()){
          var a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        } else {
          self.platform.ready().then(() => {
            const fileTransfer: FileTransferObject = self.transfer.create();
            fileTransfer.download(url, `${self.file.dataDirectory}${filename}`).then((entry) => {
              if(background){
                resolve(entry.toURL());
              } else {
                let toast = self.toastCtrl.create({
                  message: "Se ha descargado correctamente",
                  duration: 3000,
                  position: 'top',
                  cssClass: "toast-success"
                });
                toast.present();
                self.fileOpener.open(entry.toURL(), 'image/jpg')
                .catch(e => {
                  console.log('Error openening file', e)
                });
              }
            }, (error) => {
              if(background) {
                resolve(null);
              } else {
                let toast = self.toastCtrl.create({
                  message: "No se pudo descargar la imagen",
                  duration: 3000,
                  position: 'top',
                  cssClass: "toast-error"
                });
                toast.present();
              }
            })
          });
        }
      });
    });
  }

  downloadjson(entidad, id, page, filename, _object, _elem: Element) {
    this.provider.pushEvent(entidad, id, "download", page)
    let self = this;
    var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_object));
    if(self.isBrowser()){
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } else {
       self.platform.ready().then(() => {
         const fileTransfer: FileTransferObject = self.transfer.create();
         fileTransfer.download(url, `${self.file.dataDirectory}${filename}`).then((entry) => {
           let toast = self.toastCtrl.create({
             message: "Se ha descargado correctamente",
             duration: 3000,
             position: 'top',
             cssClass: "toast-success"
           });
           toast.present();
           console.log(entry.toURL());
           self.fileOpener.open(entry.toURL(), 'text/plain')
           .catch(e => {
             console.log('Error openening file', e)
           });
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
         })
      });
    }
  }

  share(via='facebook', message=null, url=null, image=null) {
    url = url ? url : 'https://proyectandopy.com';
    let appnames = {
      'facebook': `http://www.facebook.com/sharer.php?summary=${message}&u=${url}&image=${image}`,
      'twitter': `https://twitter.com/share?text=${message}&url=${url}`
    };
    if(this.platform.is('core') || !this.socialSharing.canShareVia(via)){
      window.open(appnames[via], '_blank');
    } else {
      this.socialSharing.shareWithOptions({
        message: message, // not supported on some apps (Facebook, Instagram)
        subject: null, // fi. for email
        files: [image],
        chooserTitle: 'Seleccione una aplicación' // Android only, you can override the default share sheet title
      });
    }
  }


  shareDiv(div, message, excludedElements=[], showElements=[], entidad, id, page, filename, background=false, via='facebook'){
    let loading = this.loadingCtrl.create({
       content: 'Por favor espere...'
    });
      loading.present();
    this.download(div, excludedElements=[], showElements=[], entidad, id, page, filename, true).then((image) => {
      loading.dismiss();
      this.share(via, message, null, image);
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
