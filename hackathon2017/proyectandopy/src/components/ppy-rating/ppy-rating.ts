import { Component, Input } from '@angular/core';

@Component({
  selector: 'ppy-rating',
  templateUrl: 'ppy-rating.html'
})

export class PpyRating {

  _rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string };

  @Input()
  set rating(rating: { page: string, entity_id: string, entity_type: string, score: number, meta: string }) {
    this._rating = rating;
  }

  get rating(){
    return this._rating;
  }

  setRating(text, number){
      this.rating.score = number;
      document.getElementById("rating-text").innerHTML = text;
      document.getElementById("send-rating").style.display = 'block';
      for (let i = 1; i < 6; i++) {
        var el = document.getElementById("star-"+i.toString());
        if(i<=number){
          el.classList.add("check");
        }else{
          el.classList.remove("check");
        }
      }
  }
}
