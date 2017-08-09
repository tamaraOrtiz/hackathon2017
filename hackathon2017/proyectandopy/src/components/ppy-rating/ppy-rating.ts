import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { RatingData } from '../../providers/rating';

@Component({
  selector: 'ppy-rating',
  templateUrl: 'ppy-rating.html',
  providers: [RatingData]
})

export class PpyRating {

  _rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string };

  ratingText = ['La información no me ayudo en nada.',
              'La información es insufiente.',
              'La infomación no es clara.',
              'La infomación es suficiente.',
              'La infomación es completa y clara.'];

  constructor(public events: Events, public dataService: RatingData) {
    events.subscribe('rating:retrieve', (rating, time) => {
      this.setRating(rating, true);
    });
  }

  @Input()
  set rating(rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string }) {
    this._rating = rating;
  }

  get rating(){
    return this._rating;
  }

  setRating(number, init){
    this.rating.score = number;
    document.getElementById("rating-text").innerHTML = this.ratingText[number-1];
    if(!init){
      document.getElementById("send-rating").style.display = 'block';
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
