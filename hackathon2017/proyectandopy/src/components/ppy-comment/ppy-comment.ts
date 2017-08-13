import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { CommentData } from '../../providers/comment';

@Component({
  selector: 'ppy-comment',
  templateUrl: 'ppy-comment.html',
  providers: [CommentData]
})

export class PpyComment {
  _comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string, commented_at: string };
  comments: Array<any>

  constructor(public events: Events, public dataService: CommentData) {
    events.subscribe('comments:retrieve', (comments, time) => {
      this.comments = comments;
    });
  }

  @Input()
  set comment(comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string, commented_at: string }) {
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
