import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/map';

/**
 * @name BaseData
 * @description Clase base de la cual heredan todos los providers y su objetivo
 * es obtener los registros de los datasets disponibles en datos.gov.py
 *
 */
@Injectable()
export class BaseData {
  stpUrl: string
  apiUrl: string
  data: Array<any>
  paraguayGeoJson: any
  departamentoParaguayGeoJson: any
  jsonExample: any
  allQuery: string

  constructor(public http: Http, public events: Events) {
    this.stpUrl = "http://geo.stp.gov.py/user/stp/api/v2/sql";
    this.apiUrl = "https://proyectando-api.herokuapp.com/api/";
  }

  postToFlickr(title, image){
    let self = this;
    return new Promise<any>((resolve, reject) => {
      self.http.post('https://up.flickr.com/services/upload/', {
        photo: image,
        title: title,
        is_public: 1,
        api_key: '603713384958c55d8a54fc78a03306cd',
        secret: 'bb1f2c6ec8c8a183'
      }).subscribe( response => {
        resolve(this.data);
      }, error => {
        reject(error);
      })
    });
  }

  /**
   * @name getAll
   * @argument conditions: equivalente a un where de  sql
   * @description methodo para listar todos los registros de una tabla sql
   *
   */
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

  
  getQuery(sql: string, api=false){
    let _url = api ? this.apiUrl : this.stpUrl;
    return new Promise<Array<any>>((resolve, reject) => {
      this.http.get(`${_url}${sql}`).map( res => res.json()).subscribe( data => {
        this.data = api ? data : data.rows;
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
      this.http.get('assets/jsons/paraguay_2002_limites_nacionales.geojson').map(res => res.json()).subscribe( data => {
        this.paraguayGeoJson = data;
        resolve(this.paraguayGeoJson);
      }, error => {
        reject(error);
      });
    });
  }

  getDepartamentoParaguayMap(){
    return new Promise<any>((resolve, reject) => {
      this.http.get('assets/jsons/paraguay_2002_departamentos.geojson').map(res => res.json()).subscribe( data => {
        this.departamentoParaguayGeoJson = data;
        resolve(this.departamentoParaguayGeoJson);
      }, error => {
        reject(error);
      });
    });
  }

  getJsonEx(){
    return new Promise<any>((resolve, reject) => {
      this.http.get('assets/jsons/flare.csv').map(res => res.json()).subscribe( data => {
        this.jsonExample = data;
        resolve(this.jsonExample);
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
        this.events.publish(`${entityType}:saved:success`, data);
        this.data = data.rows;
        resolve(this.data);
      }, error => {
        this.events.publish(`${entityType}:saved:error`,entity);
        reject(error);
      });
    });
  }

  pushEvent(entityType, entityID, eventType, page){
    return new Promise<any>((resolve, reject) => {
      let _data = {"entity_id":entityID, "entity_type":entityType, "event_type":eventType, "page":page}
      this.http.post(`${this.apiUrl}event/`, _data).subscribe( data => {

          this.events.publish(`${entityType}:${eventType}:saved:success`, (data as any)._body);
      }, error => {
        console.log(error);
      });
    });
  }

  getEvents(entityType, entityId){
    return new Promise<any>((resolve, reject) => {
      this.http.get(`${this.apiUrl}get_events?entity_id=${entityId}&entity_type=${entityType}`).map( res => res.json()).subscribe( data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}
