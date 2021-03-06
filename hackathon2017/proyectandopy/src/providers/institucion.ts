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
  getInstituciones(niveles) {
    return `instituciones/?niveles=${niveles}`;
  }

  filterInstituciones(niveles, text) {
    return `filtro_instituciones/?niveles=${niveles}&text=${text}`;
  }

  getInstitucion(id) {
    return `?q=SELECT nivelid, entidadid, nombre, baselegal, descripcion, diagnostico, fechaactualizacion, mision, objetivo, politica, vision, ruc FROM public.instituciones WHERE id='${id}' LIMIT 1`;
  }

  getNiveles(where: string) {
    return "?q=SELECT nivel, nombrenivel FROM public.niveles_spr "+where+" ORDER BY nombrenivel ASC ;"
  }

  getEntidades(where: string) {
    return "?q=SELECT entidad, nombreentidad FROM public.entidades_spr "+where+" ORDER BY nombreentidad ASC ;"
  }



}
