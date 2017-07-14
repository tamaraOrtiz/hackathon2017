import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BaseData {
  url: string
  data: Array<any>
  allQuery: string

  constructor(public http: Http) {
    this.url = "http://geo.stp.gov.py/user/stp/api/v2/sql";
  }

  getAll(conditions: string) {
    let where = conditions !== undefined ? "WHERE "+conditions : "";
    return new Promise<Array<any>>(resolve => {
      this.http.get(`${this.url}${this.getAllQuery(where)}`).map( res => res.json()).subscribe( data => {
        this.data = data.rows;
        resolve(this.data);
      });
    });
  }

  getQuery(sql: string){
    return new Promise<Array<any>>(resolve => {
      this.http.get(`${this.url}${sql}`).map( res => res.json()).subscribe( data => {
        this.data = data.rows;
        resolve(this.data);
      });
    });
  }

  getAllQuery(where: string) {

  }

}
