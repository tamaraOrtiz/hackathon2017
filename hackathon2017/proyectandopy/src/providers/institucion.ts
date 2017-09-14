import { BaseData } from './base';
import 'rxjs/add/operator/map';


export class InstitucionData extends BaseData {
  data: Array<{entidadid: string, nivelid: string}>

  getResumenPrograma(nivelId, entidadId) {
    return `destinatarios/?nivel=${nivelId}&entidad=${entidadId}`;
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
