import { BaseData } from './base';
import 'rxjs/add/operator/map';

export class RatingData extends BaseData {
  data: Array<{nivel_id: string, nivel_nombre: string}>

  push(entity) {
    this.pushEntity('rating', entity);
  }

  getRating(){
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.get(`${this.apiUrl}get_rating/`).map( res => res.json()).subscribe( data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}
