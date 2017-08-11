import { BaseData } from './base';
import 'rxjs/add/operator/map';

export class CommentData extends BaseData {

  push(entity) {
    console.log(entity);
    this.pushEntity('comment', entity);
  }

}
