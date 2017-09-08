import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { RatingData } from '../../providers/rating';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'ppy-rating',
  templateUrl: 'ppy-rating.html',
  providers: [RatingData]
})

export class PpyRating {

  _options: Array<string>

  _rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string };

  ratingText = ['Sin calificación',
              'La información no me ayudo en nada.',
              'La información es insufiente.',
              'La infomación no es clara.',
              'La infomación es suficiente.',
              'La infomación es completa y clara.'];

  constructor(public events: Events, public dataService: RatingData, public toastCtrl: ToastController) {
    events.subscribe('rating:retrieve', (rating, time) => {
      if (document.getElementById("rating-text") === undefined) {
        return;
      }
      this.setRating(rating, true);
    });
    events.subscribe('rating:saved:success', (rating) => {
      if (document.getElementById("rating-text") === undefined) {
        return;
      }
      let toast = this.toastCtrl.create({
        message: 'Tu calificación fue enviada con exito!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-success"
      });
      toast.present();
      document.getElementById("send-rating").style.display = 'none';
      document.getElementById("col-rating").style.display = 'none';
      dataService.getRating(this.rating.entity_id, this.rating.entity_type).then( rating => {
        this.setRating(rating, false);
      });
    });
    events.subscribe('rating:saved:error', (rating) => {
      if (document.getElementById("rating-text") === undefined) {
        return;
      }
      let toast = this.toastCtrl.create({
        message: 'Tu calificación no fue guardada, vuelve a intentarlo mas tarde!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-error"
      });
      toast.present();
    });
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

  setRating(number, init){
    this.rating.score = number;
    this.rating.meta = this._options[0];
    document.getElementById("rating-text").innerHTML = this.ratingText[Math.floor(number)];
    if(!init){
      document.getElementById("send-rating").style.display = 'block';
      document.getElementById("col-rating").style.display = 'block';
    }
    for (let i = 1; i < 6; i++) {
      var el = document.getElementById("star-"+i.toString());
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
