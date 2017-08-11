import { Component, Input } from '@angular/core';
import { CommentData } from '../../providers/comment';

@Component({
  selector: 'ppy-comment',
  templateUrl: 'ppy-comment.html',
  providers: [CommentData]
})

export class PpyComment {

  _comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string };

  constructor(public dataService: CommentData) {

  }

  @Input()
  set comment(comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string }) {
    this._comment = comment;
  }

  get comment(){
    return this._comment;
  }

  pushComment(){
    console.log(this.comment)
    this.dataService.push(this.comment);
  }
}
