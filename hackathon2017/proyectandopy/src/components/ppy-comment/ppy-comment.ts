import { Component, Input } from '@angular/core';

@Component({
  selector: 'ppy-comment',
  templateUrl: 'ppy-comment.html'
})

export class PpyComment {

  _comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string };

  @Input()
  set comment(comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string }) {
    this._comment = comment;
  }

  get comment(){
    return this._comment;
  }
}
