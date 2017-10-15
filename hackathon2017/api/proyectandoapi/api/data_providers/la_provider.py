import urllib.request
import api.data_providers.settings as settings
import json
from urllib.error import HTTPError
import pprint
import os

"""
Author: Tamara Ortiz
Esta clase provee toda la informacion necesaria de las lineas de accion
"""

# Obtiene los avances del api carto db y hace un join con instituciones para tener los datos de la intitucion
AVANCE_URL = "?q=SELECT%20public.avance.ac_nombre,public.avance.ins_id,%20public.avance.la_nombre,%20public.avance.crono_tipo_nombre,%20public.avance.m1,%20public.avance.m2," \
             "%20public.avance.m3,%20public.avance.depto_id,%20public.avance.depto_nombre," \
             "%20public.avance.avance_cant,%20public.avance.m4,%20public.avance.la_id," \
             "%20public.avance.accion_id,%20public.avance.acumula,%20public.avance.la_um_descp,%20public.instituciones.nivelid," \
             "%20public.instituciones.entidadid%20FROM%20public.avance%20left%20join%20public.instituciones%20on%20public.avance.ins_id=public.instituciones.id"

# Obtiene la programacion del api carto db y hace un join con instituciones para tener los datos de la intitucion
PROG_URL = "?q=SELECT%20public.programacion.m1,%20public.programacion.ins_id,%20public.programacion.m2,%20public.programacion.crono_tipo_nombre,%20public.programacion.m3," \
           "%20public.programacion.cant_prog,%20public.programacion.depto_id,%20public.programacion.depto_nombre,%20public.programacion.m4,%20public.programacion.la_id,%20public.programacion.accion_id," \
           "%20public.programacion.acumula,%20public.instituciones.nivelid,%20public.instituciones.entidadid%20FROM%20public.programacion" \
           "%20left%20join%20public.instituciones%20on%20public.programacion.ins_id=public.instituciones.id"

# Obtiene los dato de la tabla accionhasproducto del api carto db
ACCPRO_URL = '?q=SELECT%20*%20FROM%20public.accionhasproducto'

# Obtiene el total de cantidad financiera de cada accion agrupada por nivel y institucion
def get_total_productos():
    totales = {}
    if os.path.exists(settings.ACCPRO_FILE):
        with open(settings.ACCPRO_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            for d in data:
                key1 = d['accionid']+"_"+d["entidad"]+"_"+d["nivel"]
                if key1 not in totales:
                    totales[key1] = float(d["cantidadfinanciera"])
                else:
                    totales[key1] = totales[key1]+float(d["cantidadfinanciera"])

    return totales


# Guarda en un archivo el total de cada linea de accion
def save_totales():
    t_prod = get_total_productos()
    with open(settings.TOTALES_PRODACC, 'w') as f:
        f.write(json.dumps(t_prod))


# Guarda en un archivo los datos obtenidos de la tabla de avances
def save_avance():
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, AVANCE_URL)) as data:
        result = data.read()
        _json = result.decode('utf8').replace("'", '"')
        with open(settings.AVANCE_FILE, 'w') as f:
            f.write(_json)


# Guarda en un archivo los datos obtenidos de la tabla de programacion
def save_programacion():
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, PROG_URL)) as data:
        result = data.read()
        _json = result.decode('utf8').replace("'", '"')
        with open(settings.PROG_FILE, 'w') as f:
            f.write(_json)


# Guarda en un archivo los datos de las lineas de accion
def save_la():
    result = []
    if os.path.exists(settings.PROG_FILE):
        with open(settings.LA_PROG_FILE, 'r') as f:
            prog = json.loads(f.read())
    if os.path.exists(settings.AVANCE_FILE):
        with open(settings.AVANCE_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            process_data = {}
            # Obtiene los totales de cada accion
            totales = get_total_productos()
            for d in data:
                # Verifica que el dato actual tenga entidad y nivel
                if d["entidadid"] is not None and d["nivelid"] is not None:
                    # Inicializa un id para la linea de accion, utilizando el id de la linea de accion
                    # de la entidad, el nivel y la institucion
                    key1 = d["la_id"] + "_" + d["entidadid"] + "_" + d["nivelid"]+ "_" + d["ins_id"]
                    # Define el id de la accion actual
                    key_accion = d['accion_id'] + "_" + d["entidadid"] + "_" + d["nivelid"]
                    # Obtiene el total de la accion actual
                    total = totales[key_accion] if key_accion in totales else 0
                    if key1 not in process_data:
                        # Inicializa los datos de la linea de accion si esta no fue procesada anteriormente
                        acciones = [key_accion]
                        metas_avance = {
                            'm1':0, 'm2':0, 'm3':0, 'm4':0
                        }
                        metas_promedio = {
                            'm1': 0, 'm2': 0, 'm3': 0, 'm4': 0
                        }
                        metas_denominador = {
                            'm1': 0, 'm2': 0, 'm3': 0, 'm4': 0
                        }

                        if d['acumula'] == 't' and d["crono_tipo_nombre"]=="Entregable":
                            metas_avance['m1'] = float(d['m1'])
                            metas_avance['m2'] = float(d['m2'])
                            metas_avance['m3'] = float(d['m3'])
                            metas_avance['m4'] = float(d['m4'])
                        if d['acumula'] == 'f' and d["crono_tipo_nombre"]=="Entregable":
                            metas_promedio['m1'] = float(d['m1'])
                            metas_promedio['m2'] = float(d['m2'])
                            metas_promedio['m3'] = float(d['m3'])
                            metas_promedio['m4'] = float(d['m4'])
                            metas_denominador['m1'] = 1
                            metas_denominador['m2'] = 1
                            metas_denominador['m3'] = 1
                            metas_denominador['m4'] = 1
                        process_data[key1] = {
                            'la_id': d["la_id"],
                            'la_nombre': d["la_nombre"],
                            'entidad': d["entidadid"],
                            'nivel': d["nivelid"],
                            'institucion': d["ins_id"],
                            'avance_metas': metas_avance,
                            'promedio_metas': metas_promedio,
                            'denominador_metas': metas_denominador,
                            'unidad_medida': d["la_um_descp"],
                            'acciones': acciones,
                            'cantidad_financiera': total,
                            'cantidad_avance': float(d["avance_cant"]) if (d['acumula'] == 't' and d["crono_tipo_nombre"]=="Entregable") else 0,
                            'cantidad_promedio': float(d["avance_cant"]) if (d['acumula'] == 'f' and d["crono_tipo_nombre"]=="Entregable") else 0,
                            'cantidad_denominador': 1 if (d['acumula'] == 'f' and d["crono_tipo_nombre"]=="Entregable") else 0}
                        # Agrega los detos guardados el json de programacion, usando key1
                        if key1 in prog:
                            p = prog[key1]
                            for k,v in p.items():
                                if k not in process_data[key1]:
                                    process_data[key1][k]= v
                    else:
                        # Si la linea de accion ya fue procesada anteriormente actualiza las cantidades
                        acciones = process_data[key1]['acciones']
                        if key_accion not in acciones:
                            acciones.append(key_accion)
                            process_data[key1]['cantidad_financiera']= process_data[key1]['cantidad_financiera']+total
                            if d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable":
                                process_data[key1]['cantidad_avance'] = process_data[key1][
                                                                            'cantidad_avance'] + float(d["avance_cant"])
                            if d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable":
                                process_data[key1]['cantidad_promedio'] = process_data[key1][
                                                                            'cantidad_promedio'] + float(d["avance_cant"])
                                process_data[key1]['cantidad_denominador'] = process_data[key1][
                                                                              'cantidad_denominador'] + 1
                            metas_avance = process_data[key1]['avance_metas']
                            metas_promedio = process_data[key1]['promedio_metas']
                            metas_denominador = process_data[key1]['denominador_metas']
                            if d['acumula'] == 't' and d["crono_tipo_nombre"]=="Entregable":
                                metas_avance['m1'] = metas_avance['m1']+float(d['m1'])
                                metas_avance['m2'] = metas_avance['m2']+float(d['m2'])
                                metas_avance['m3'] = metas_avance['m3']+float(d['m3'])
                                metas_avance['m4'] = metas_avance['m4']+float(d['m4'])
                            if d['acumula'] == 'f' and d["crono_tipo_nombre"]=="Entregable":
                                metas_promedio['m1'] = metas_promedio['m1']+float(d['m1'])
                                metas_promedio['m2'] = metas_promedio['m2']+float(d['m2'])
                                metas_promedio['m3'] = metas_promedio['m3']+float(d['m3'])
                                metas_promedio['m4'] = metas_promedio['m4']+float(d['m4'])
                                metas_denominador['m1'] = metas_denominador['m1']+1
                                metas_denominador['m2'] = metas_denominador['m2']+1
                                metas_denominador['m3'] = metas_denominador['m3']+1
                                metas_denominador['m4'] = metas_denominador['m4']+1
            with open(settings.LA_FILE, 'w') as f:
                f.write(json.dumps(process_data))


# Genera el json con los datos de la programacion
def save_la_prog():
    result = []
    if os.path.exists(settings.PROG_FILE):
        with open(settings.PROG_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            process_data = {}
            # Obtiene los totales de cada accion
            totales = get_total_productos()
            for d in data:
                # Verifica que el dato actual tenga entidad y nivel
                if d["entidadid"] is not None and d["nivelid"] is not None:
                    key1 = d["la_id"] + "_" + d["entidadid"] + "_" + d["nivelid"]+ "_" + d["ins_id"]
                    key_accion = d['accion_id'] + "_" + d["entidadid"] + "_" + d["nivelid"]
                    total = totales[key_accion] if key_accion in totales else 0
                    if key1 not in process_data:
                        # Inicializa los datos de la linea de accion si esta no fue procesada anteriormente
                        acciones = [key_accion]
                        metas_avance = {
                            'm1': 0, 'm2': 0, 'm3': 0, 'm4': 0
                        }
                        metas_promedio = {
                            'm1': 0, 'm2': 0, 'm3': 0, 'm4': 0
                        }
                        metas_denominador = {
                            'm1': 0, 'm2': 0, 'm3': 0, 'm4': 0
                        }

                        if d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable":
                            metas_avance['m1'] = float(d['m1'])
                            metas_avance['m2'] = float(d['m2'])
                            metas_avance['m3'] = float(d['m3'])
                            metas_avance['m4'] = float(d['m4'])
                        if d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable":
                            metas_promedio['m1'] = float(d['m1'])
                            metas_promedio['m2'] = float(d['m2'])
                            metas_promedio['m3'] = float(d['m3'])
                            metas_promedio['m4'] = float(d['m4'])
                            metas_denominador['m1'] = 1
                            metas_denominador['m2'] = 1
                            metas_denominador['m3'] = 1
                            metas_denominador['m4'] = 1
                        process_data[key1] = {
                            'la_id': d["la_id"],
                            'programa_metas': metas_avance,
                            'programa_promedio_metas': metas_promedio,
                            'programa_denominador_metas': metas_denominador,
                            'acciones': acciones,
                            'cantidad_prog': float(d["cant_prog"]) if (
                            d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable") else 0,
                            'cantidad_prog_promedio': float(d["cant_prog"]) if (
                            d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0,
                            'cantidad_prog_denominador': 1 if (
                            d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0}
                    else:
                        # Si la linea de accion ya fue procesada anteriormente actualiza las cantidades
                        acciones = process_data[key1]['acciones']
                        if key_accion not in acciones:
                            acciones.append(key_accion)
                            if d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable":
                                process_data[key1]['cantidad_prog'] = process_data[key1][
                                                                            'cantidad_prog'] + float(d["cant_prog"])
                            if d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable":
                                process_data[key1]['cantidad_prog_promedio'] = process_data[key1][
                                                                            'cantidad_prog_promedio'] + float(d["cant_prog"])
                                process_data[key1]['cantidad_prog_denominador'] = process_data[key1][
                                                                              'cantidad_prog_denominador'] + 1
                            metas_avance = process_data[key1]['programa_metas']
                            metas_promedio = process_data[key1]['programa_promedio_metas']
                            metas_denominador = process_data[key1]['programa_denominador_metas']
                            if d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable":
                                metas_avance['m1'] = metas_avance['m1'] + float(d['m1'])
                                metas_avance['m2'] = metas_avance['m2'] + float(d['m2'])
                                metas_avance['m3'] = metas_avance['m3'] + float(d['m3'])
                                metas_avance['m4'] = metas_avance['m4'] + float(d['m4'])
                            if d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable":
                                metas_promedio['m1'] = metas_promedio['m1'] + float(d['m1'])
                                metas_promedio['m2'] = metas_promedio['m2'] + float(d['m2'])
                                metas_promedio['m3'] = metas_promedio['m3'] + float(d['m3'])
                                metas_promedio['m4'] = metas_promedio['m4'] + float(d['m4'])
                                metas_denominador['m1'] = metas_denominador['m1'] + 1
                                metas_denominador['m2'] = metas_denominador['m2'] + 1
                                metas_denominador['m3'] = metas_denominador['m3'] + 1
                                metas_denominador['m4'] = metas_denominador['m4'] + 1
            with open(settings.LA_PROG_FILE, 'w') as f:
                f.write(json.dumps(process_data))


# Filtra las lineas de accion por entidad, nivel y institucion
def filter_avance(nivel=None, entidad=None, institucion=None):
    result= []
    if os.path.exists(settings.LA_FILE):
        with open(settings.LA_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data.values()
            result = list(filter(lambda x: filter_item(x, nivel, entidad, institucion), data))
    return result


# Retorna True si la linea de accion pertenece a un nivel, entidad y intitucion
def filter_item(item, nivel, entidad, institucion):
    if nivel:
        if not(item["nivel"] == nivel):
            return False
    if entidad:
        if not(item["entidad"] == entidad):
            return False
    if institucion:
        if not(item["institucion"] == institucion):
            return False
    return True


# Genera los datos de una linea de accion agrupando los datos por departamento utilizando la tabla de programacion
def get_prog_mapa():
    if os.path.exists(settings.PROG_FILE):
        with open(settings.PROG_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            dep_data = {}

            for d in data:
                if d["entidadid"] is not None and d["nivelid"] is not None:
                    key = d['la_id']+'_' + d["entidadid"] + "_" + d["nivelid"]+ "_" + d["ins_id"]+"_"+d['depto_id']
                    if key not in dep_data:
                        dep_data[key]= {'total': float(d["cant_prog"]),
                                        'acciones':[d["accion_id"]]}
                    else:
                        acciones = dep_data[key]["acciones"]
                        if d["accion_id"] not in acciones:
                            dep_data[key]['total'] = dep_data[key]['total'] + float(d["cant_prog"])
                            acciones.append(d["accion_id"])
            return dep_data


# Genera los datos de una linea de accion agrupando los datos por departamento utilizando la tabla de programacion y avances
def save_la_mapa():
    if os.path.exists(settings.AVANCE_FILE):
        with open(settings.AVANCE_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            dep_data = {}
            totales = get_total_productos()
            prog = get_prog_mapa()
            for d in data:
                if d["entidadid"] is not None and d["nivelid"] is not None:
                    key_accion = d['accion_id'] + "_" + d["entidadid"] + "_" + d["nivelid"]
                    total = totales[key_accion] if key_accion in totales else 0
                    key = d['la_id'] + "_" + d["entidadid"] + "_" + d["nivelid"] + "_" + d["ins_id"]
                    key_dep = d['la_id']+ "_" + d["entidadid"] + "_" + d["nivelid"]+ "_" + d["ins_id"]+"_"+d['depto_id']
                    cant_prog = prog[key_dep]['total'] if key_dep in prog else 0
                    if key not in dep_data:
                        # Inicializa los datos de los departamentos de una linea de accion, todos los calculos tienen en cuenta la columna acumula y tipo de cronograma
                        dep_data[key]={
                            'unidad': d["la_um_descp"],
                            'la_id': d['la_id'],
                            'info_departamento':{
                                d['depto_nombre']: {
                                    'id': d['depto_id'],
                                    'nombre': d['depto_nombre'],
                                    'acciones': {key_accion: {'nombre': d["ac_nombre"], 'total': total}},

                                    'cant_avance':  float(d["avance_cant"]) if (
                                    d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable") else 0,
                                    'cant_promedio': float(d["avance_cant"]) if (
                                    d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0,
                                    'cant_denominador': 1 if (
                                    d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0,
                                    'cant_prog': cant_prog

                                }
                            }
                        }
                    else:
                        # Actualiza el departamento si este ya fue procesado
                        deps = dep_data[key]['info_departamento']
                        if d['depto_nombre'] in deps:
                            if key_accion not in deps[d['depto_nombre']]['acciones']:
                                deps[d['depto_nombre']]['acciones'][key_accion]= {'nombre': d["ac_nombre"], 'total': total}
                                if d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable":
                                    deps[d['depto_nombre']]['cant_avance'] = deps[d['depto_nombre']]['cant_avance']+ float(
                                        d["avance_cant"])
                                if d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable":
                                    deps[d['depto_nombre']]['cant_promedio'] = deps[d['depto_nombre']]['cant_promedio'] + float(
                                        d["avance_cant"])
                                    deps[d['depto_nombre']]['cant_denominador'] = deps[d['depto_nombre']]['cant_denominador'] + 1
                        else:
                            # Agrega un departamento a la linea de accion si el mismo no fue procesado anteriormente dentro de la linea de accion actual
                            deps[d['depto_nombre']]= {
                                    'id': d['depto_id'],
                                    'nombre': d['depto_nombre'],
                                    'acciones': {key_accion: {'nombre': d["ac_nombre"], 'total': total}},
                                    'cant_prog': cant_prog,
                                    'cant_avance':  float(d["avance_cant"]) if (
                                    d['acumula'] == 't' and d["crono_tipo_nombre"] == "Entregable") else 0,
                                    'cant_promedio': float(d["avance_cant"]) if (
                                    d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0,
                                    'cant_denominador': 1 if (
                                    d['acumula'] == 'f' and d["crono_tipo_nombre"] == "Entregable") else 0

                                }
            with open(settings.LA_MAPA, 'w') as f:
                f.write(json.dumps(dep_data))


# Filtra el mapa por id de linea de accion, nivel, entidad y institucion
def filter_map(la_id, nivel, entidad, ins):
    if os.path.exists(settings.LA_MAPA):
        with open(settings.LA_MAPA, 'r') as f:
            data = json.loads(f.read())
            key = la_id + "_" + entidad + "_" + nivel + "_" + ins
            if key in data:
                return data[key]
            else:
                return []



