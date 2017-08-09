import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BaseData {
  stpUrl: string
  apiUrl: string
  data: Array<any>
  paraguayGeoJson: any
  allQuery: string

  constructor(public http: Http) {
    this.stpUrl = "http://geo.stp.gov.py/user/stp/api/v2/sql";
    this.apiUrl = "https://proyectando-api.herokuapp.com/api/";
  }

  getAll(conditions: string) {
    let where = conditions !== undefined ? "WHERE "+conditions : "";
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.get(`${this.stpUrl}${this.getAllQuery(where)}`).map( res => res.json()).subscribe( data => {
        this.data = data.rows;
        resolve(this.data);
      }, error => {
        reject(error);
      });
    });
  }

  getQuery(sql: string){
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.get(`${this.stpUrl}${sql}`).map( res => res.json()).subscribe( data => {
        this.data = data.rows;
        resolve(this.data);
      }, error => {
        reject(error);
      });
    });
  }

  getAllQuery(where: string) {

  }

  getParaguayMap(){
    return new Promise<any>((resolve, reject) => {
      this.http.get('assets/jsons/paraguay.json').map(res => res.json()).subscribe( data => {
        this.paraguayGeoJson = data;
        resolve(this.paraguayGeoJson);
      }, error => {
        reject(error);
      });
    });
  }

  getEntity(entityType, id){

  }

  pushEntity(entityType, entity){
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${this.apiUrl}${entityType}/`, entity).map( res => res.json()).subscribe( data => {
        this.data = data.rows;
        resolve(this.data);
      }, error => {
        reject(error);
      });
    });
  }

}
