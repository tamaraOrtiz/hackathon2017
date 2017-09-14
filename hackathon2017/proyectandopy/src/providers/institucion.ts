import { BaseData } from './base';
import 'rxjs/add/operator/map';


export class InstitucionData extends BaseData {
  data: Array<{entidadid: string, nivelid: string}>

  getResumenPrograma(nivelId, entidadId, conditions) {
    let where = `WHERE nivel_id = '${nivelId}' AND entidad_id = '${entidadId}'`;
    where = conditions !== undefined ? `${where} AND ${conditions}` : where;
    return `?q=SELECT programa_nombre, programa_id, tipo_presupuesto_id, tipo_presupuesto_nombre, SUM(CAST(cantidad as NUMERIC(9, 2))) as cantidad_total FROM public.spr_destinatarios ${where} GROUP BY tipo_presupuesto_id, tipo_presupuesto_nombre, programa_id, programa_nombre ORDER BY tipo_presupuesto_id ASC, programa_id ASC;`;
  }

  getAllQuery(where: string) {
    return `?q=SELECT id, nivelid, entidadid, nombre, baselegal, descripcion, diagnostico, fechaactualizacion, mision, objetivo, politica, vision, ruc FROM public.instituciones ${where} ORDER BY nivelid, entidadid, nombre ASC;`;
  }

  getAvances(nivelId, entidadId, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `?q=SELECT avance.* FROM avance LEFT JOIN public.accionhasproducto ON avance.accion_id = public.accionhasproducto.accionid ${where} public.accionhasproducto.nivel = '${nivelId}' AND public.accionhasproducto.entidad = '${entidadId}'`;
  }

  getLineasAccionDetalle(id, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `?q=SELECT avance.* FROM avance ${where} ins_id = '${id}' AND ac_borr = 'f'`;
  }

  getLineasAccion(nivelId, entidadId, institucionId, conditions) {
    let where = conditions !== undefined ? `WHERE ${conditions} AND ` : 'WHERE ';
    return `lineas_de_accion/?nivel=${nivelId}&entidad=${entidadId}&institucion=${institucionId}`;
  }

  getNiveles(where: string) {
    return "?q=SELECT nivel_id, nivel_nombre, COUNT(DISTINCT entidad_id) FROM public.destinatarioproducto "+where+" GROUP BY nivel_id, nivel_nombre ORDER BY nivel_id ASC ;"
  }



}
