import { BaseData } from './base';
import 'rxjs/add/operator/map';


export class InstitucionData extends BaseData {
  data: Array<{entidadid: string, nivelid: string}>

  getResumenPrograma(nivelId, entidadId, conditions) {
    let where = `WHERE nivel_id = '${nivelId}' AND entidad_id = '${entidadId}'`;
    where = conditions !== undefined ? `${where} AND ${conditions}` : where;
    return `?q=SELECT programa_nombre, programa_id, tipo_presupuesto_id, tipo_presupuesto_nombre, SUM(CAST(cantidad as NUMERIC(9, 2))) as cantidad_total FROM public.destinatarioproducto ${where} GROUP BY tipo_presupuesto_id, tipo_presupuesto_nombre, programa_id, programa_nombre ORDER BY tipo_presupuesto_id ASC, programa_id ASC;`;
  }

  getAllQuery(where: string) {
    return `?q=SELECT DISTINCT id, nivelid, entidadid, nombre, baselegal, descripcion, diagnostico, fechaactualizacion, mision, objetivo, politica, vision, ruc FROM public.instituciones ${where} ORDER BY nombre ASC LIMIT 20;`;
  }

  getAvances(nivelId, entidadId, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `?q=SELECT avance.* FROM avance LEFT JOIN public.accionhasproducto ON avance.accion_id = public.accionhasproducto.accionid ${where} public.accionhasproducto.nivel = '${nivelId}' AND public.accionhasproducto.entidad = '${entidadId}'`;
  }

  getLineasAccionDetalle(id, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `?q=SELECT avance.* FROM avance ${where} ins_id = '${id}' AND ac_borr = 'f'`;
  }

  getLineasAccion(id, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `?q=SELECT avance.la_nombre, avance.la_id, avance.periodo, avance.ila_id, avance.ila_meta, avance.la_um_descp FROM avance LEFT JOIN (DISTINCT avance.la_id, cartodb_id FROM ${where} ins_id = '${id}' AND ac_borr = 'f') as avance2 ON avance.cartodb_id = avance2.cartodb_id`;
  }

}
