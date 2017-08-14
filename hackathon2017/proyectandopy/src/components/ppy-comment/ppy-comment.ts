import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { CommentData } from '../../providers/comment';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'ppy-comment',
  templateUrl: 'ppy-comment.html',
  providers: [CommentData]
})

export class PpyComment {
  _comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string, commented_at: string };
  comments: Array<any>
  service: CommentData

  constructor(public events: Events, public dataService: CommentData, public toastCtrl: ToastController) {
    this.service = dataService;
    events.subscribe('comment:saved:success', (comment) => {
      let toast = this.toastCtrl.create({
        message: 'Tu opinión fue enviada con exito!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-success"
      });
      toast.present();
      dataService.getAllComments(this.comment.entity_type, this.comment.entity_id).then( comments => {
        this.comments = comments;
      })
    });
    events.subscribe('comment:saved:error', (comment) => {
      let toast = this.toastCtrl.create({
        message: 'Tu opinión no fue guardada, vuelve a intentarlo mas tarde!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-error"
      });
      toast.present();
    });
  }

  ngOnInit() {
    this.service.getAllComments(this.comment.entity_type, this.comment.entity_id).then( comments => {
      this.comments = comments;
    })
  }

  @Input()
  set comment(comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string, commented_at: string }) {
    this._comment = comment;
  }

  get comment(){
    return this._comment;
  }

  pushComment(){
    this.dataService.push(this.comment);
  }

  logForm(form) {
    form.reset()
  }
}
