import { BaseData } from './base';
import 'rxjs/add/operator/map';

export class CommentData extends BaseData {

  push(entity) {
    this.pushEntity('comment', entity);
  }

  getAllComments(entityType, entityId, lastPage){
    return new Promise<any>((resolve, reject) => {
      this.http.get(`${this.apiUrl}comment?entity_id=${entityId}&entity_type=${entityType}&page=${lastPage}`).map( res => res.json()).subscribe( data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}
