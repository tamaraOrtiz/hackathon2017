import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseData } from './base';
import 'rxjs/add/operator/map';

@Injectable()
export class InstitucionData extends BaseData {
  data: Array<{entidadid: string, nivelid: string}>

  getResumenPrograma(nivelId, entidadId, conditions) {
    let where = `WHERE nivel_id = '${nivelId}' AND entidad_id = '${entidadId}'`;
    where = conditions !== undefined ? `${where} AND ${conditions}` : where;
    return `?q=SELECT programa_nombre, programa_id, tipo_presupuesto_id, tipo_presupuesto_nombre, SUM(CAST(cantidad as NUMERIC(9, 2))) as cantidad_total FROM public.destinatarioproducto ${where} GROUP BY tipo_presupuesto_id, tipo_presupuesto_nombre, programa_id, programa_nombre ORDER BY tipo_presupuesto_id ASC, programa_id ASC;`;
  }

  getAllQuery(where: string) {
    return `?q=SELECT DISTINCT nivelid, entidadid, nombre FROM public.instituciones ${where} ORDER BY nombre ASC LIMIT 20;`;
  }

}
