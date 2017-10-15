import { Component, Input, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { RatingData } from '../../providers/rating';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'ppy-rating',
  templateUrl: 'ppy-rating.html',
  providers: [RatingData]
})

export class PpyRating {

  @ViewChild('ratingElement') ratingElement;

  _options: Array<string>
  sendRating: Boolean = false;
  _rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string };

  ratingText = ['Sin calificación',
              'La información no me ayudo en nada.',
              'La información es insufiente.',
              'La infomación no es clara.',
              'La infomación es suficiente.',
              'La infomación es completa y clara.'];

  constructor(public events: Events, public dataService: RatingData, public toastCtrl: ToastController) {
    let self = this;
    self.events.subscribe('rating:retrieve', (rating, time) => {
      if(rating.entity_id == self.rating.entity_id &&
         rating.entity_type == self.rating.entity_type &&
         rating.page == self.rating.page){
           self.loadRating();
      }
    });
    self.events.subscribe('rating:saved:success', (rating) => {
      if(rating.entity_id == self.rating.entity_id &&
         rating.entity_type == self.rating.entity_type &&
         rating.page == self.rating.page){
           self.afterSaveRating(rating, 'success');
      }
    });
    self.events.subscribe('rating:saved:error', (rating) => {
      if(rating.entity_id == self.rating.entity_id &&
         rating.entity_type == self.rating.entity_type &&
         rating.page == self.rating.page){
           self.afterSaveRating(rating, 'error');
      }
    });
  }


  loadRating(){
    let self = this;
    let element = this.ratingElement.nativeElement;
    if (element.querySelector("#rating-text") === null) {
      return;
    }
    self.setRating(self.rating, true);
  }

  afterSaveRating(rating, result='success'){
    let self = this;
    let element = this.ratingElement.nativeElement;
    let message = result === 'success' ? 'Tu calificación fue enviada con exito!' :
      'Tu calificación no fue guardada, vuelve a intentarlo mas tarde!';
    if (element.querySelector("#rating-text") === null) {
      return;
    }
    let toast = self.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: `toast-${result}`
    });
    toast.present();

    if(result == 'success'){

      self.sendRating = false;
      self.setRating(rating.score, false, true);
    }
  }

  @Input()
  set rating(rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string }) {
    this._rating = rating;
  }

  @Input()
  set options(options: Array<string>) {
    this._options = options;
  }

  get options(){
    return this._options;
  }

  get rating(){
    return this._rating;
  }


  setRating(number, init, call=false){
    this.rating.score = number;
    this.rating.meta = this._options[0];
    let element = this.ratingElement.nativeElement;
    element.querySelector("#rating-text").innerHTML = this.ratingText[Math.floor(number)];
    if(!init && !call){
      
      this.sendRating = true;
    }
    for (let i = 1; i < 6; i++) {
      var el = element.querySelector("#star-"+i.toString());
      if(i<=number){
        el.classList.add("check");
      }else{
        el.classList.remove("check");
      }
    }
  }

  pushRating(){
    this.dataService.push(this.rating);
  }

}
