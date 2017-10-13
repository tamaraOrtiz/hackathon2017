import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { CommentData } from '../../providers/comment';
import { ToastController } from 'ionic-angular';
import { FacebookProvider } from '../../providers/facebook/facebook-provider';

@Component({
  selector: 'ppy-comment',
  templateUrl: 'ppy-comment.html',
  providers: [CommentData, FacebookProvider]
})

export class PpyComment {
  _comment: { page: string, entity_id: string, entity_type: string, text: string, meta: string};
  comments: Array<any>
  service: CommentData
  lastPage: number
  isLoading = false
  userData: any

  constructor(public events: Events, public dataService: CommentData,
    public toastCtrl: ToastController,
    private facebookProvider: FacebookProvider) {
    let self = this;
    self.service = dataService;
    self.lastPage = 0;

    events.subscribe('comment:saved:success', (comment) => {
      let toast = self.toastCtrl.create({
        message: 'Tu opinión fue enviada con exito!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-success"
      });
      toast.present().then(() => {
        self.getComments(self.lastPage);
      });
    });
    events.subscribe('comment:saved:error', (comment) => {
      let toast = self.toastCtrl.create({
        message: 'Tu opinión no fue guardada, vuelve a intentarlo mas tarde!',
        duration: 3000,
        position: 'top',
        cssClass: "toast-error"
      });
      toast.present();
    });
    events.subscribe('Facebook:LoggedIn', (userData) => {
      self.userData = userData;
    })
  }

  ngOnInit() {
    this.getComments(this.lastPage);
  }

  getComments(lastPage) {
    this.isLoading = true;
    this.service.getAllComments(this.comment.entity_type, this.comment.entity_id, lastPage).then( comments => {
      this.comments = comments;
      this.lastPage = this.lastPage + 1;
      this.isLoading = false;
    })
  }

  @Input()
  set comment(comment: { page: string, entity_id: string, entity_type: string, text: string, meta: any }) {
    this._comment = comment;
  }

  get comment(){
    return this._comment;
  }

  pushComment(){
    this.comment.meta = this.comment.meta ? this.comment.meta : {};
    this.comment.meta['name'] = this.userData.name;
    this.comment.meta['email'] = this.userData.email;
    this.comment.meta['picture'] = this.userData.picture;
    this.comment.meta['userId'] = this.userData.userId;
    this.dataService.push(this.comment);
  }

  logForm(form) {
    form.reset()
  }
}
