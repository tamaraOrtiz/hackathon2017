import { BaseData } from './base';
import 'rxjs/add/operator/map';

export class NivelData extends BaseData {
  data: Array<{nivel_id: string, nivel_nombre: string}>

  getAllQuery(where: string) {
    return "?q=SELECT nivel_id, nivel_nombre, COUNT(DISTINCT entidad_id) FROM public.destinatarioproducto "+where+" GROUP BY nivel_id, nivel_nombre ORDER BY nivel_id ASC ;"
  }

}
