import { BaseData } from './base';
import 'rxjs/add/operator/map';


export class PndData extends BaseData {
  data: Array<{entidadid: string, nivelid: string, anho: string}>
  getGeneral(nivelId, entidadId, anho) {
  
    return `pnd/?nivel=${nivelId}&entidad=${entidadId}&institucion=${anho}`;
  }
}
