import { BaseData } from './base';
import 'rxjs/add/operator/map';


export class PndData extends BaseData {
  data: Array<{entidadid: string, nivelid: string, anho: string}>

  getGeneral(nivelId, entidadId, anho) {

    return `pnd/?nivel=${nivelId}&entidad=${entidadId}&anho=${anho}`;
  }

  getEjes(nivelId, entidadId, anho) {

    return `pndeje/?nivel=${nivelId}&entidad=${entidadId}&anho=${anho}`;
  }
}
