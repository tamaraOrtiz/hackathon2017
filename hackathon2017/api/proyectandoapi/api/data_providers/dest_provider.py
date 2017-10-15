import urllib.request
import api.data_providers.settings as settings
import json
from urllib.error import HTTPError
import pprint
import os

"""
Author: Tamara Ortiz
Esta clase provee toda la informacion necesaria de los programas y entidades
"""


# Url que conecta con el apt the carto db, tabl: spr_destinatarios
DEST_URL = "?q=SELECT%20tipo_presupuesto_nombre,%20programa_nombre,%20cantidad,%20entidad_id,%20nivel_id,%20catalogo_destinatario_nombre%20FROM%20public.spr_destinatarios"


# Este metodo guarda los datos obtenidos de la tabla spr destinatarios en un archivo
def save_dest():
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, DEST_URL)) as data:
        result = data.read()
        _json = result.decode('utf8').replace("'", '"')
        with open(settings.DEST_FILE, 'w') as f:
            f.write(_json)


# Este metodo filtra los destinatarios por nivel y entidad
def filter_dest(nivel, entidad):
    result = []
    if os.path.exists(settings.DEST_FILE):
        with open(settings.DEST_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            # filter_dest_item retorna True si el item pertenece a una entidad y nivel
            result = list(filter(lambda x: filter_dest_item(x, nivel, entidad), data))
    return result


# Este metodo retorna los destinarios de un nivel y entidad
def get_dest(nivel=None, entidad=None):
    # Si el nivel o entidad es 'null' inicializa los mismos a None
    nivel = nivel if nivel != 'null' else None
    entidad = entidad if entidad != 'null' else None
    # Obtiene los datos filtrados por nivel y entidad
    data = filter_dest(nivel, entidad)
    result = {}
    for d in data:
        # Procesa los datos para obtener un json con los datos necesarios para el cliente, agrupa los destinarios por tipo de presupuesto
        if d['tipo_presupuesto_nombre'] in result:
            # Verifica si el programa actual ya esta dentro del tipo de presupuesto actual
            if d["programa_nombre"] in result[d['tipo_presupuesto_nombre']]:
                # Si el programa ya fue guardado anteriormente suma al total del programa la cantidad de beneficiarios del registro actual
                result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['total'] = result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['total'] + int(float(d["cantidad"]))
                # Agrupa la cantidad de destinarios por catalogo
                if d["catalogo_destinatario_nombre"] in result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['detalle']:
                    result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['detalle'][d["catalogo_destinatario_nombre"]] = result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['detalle'][d["catalogo_destinatario_nombre"]] + int(float(d["cantidad"]))
                else:
                    result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]['detalle'][
                        d["catalogo_destinatario_nombre"]] = int(float(d["cantidad"]))
            else:
                # Si el programa aun no fue guardado en el tipo de presupuesto actual, el mismo es inicializado
                result[d['tipo_presupuesto_nombre']][d["programa_nombre"]]= {'total':int(float(d["cantidad"])),
                'detalle': {
                        d["catalogo_destinatario_nombre"]:  int(float(d["cantidad"]))
                    }}
        else:
            # Si el tipo de programa no fue registrado aun, el mismo es inicializado
            result[d['tipo_presupuesto_nombre']] = {
                d["programa_nombre"]:{
                    'total': int(float(d["cantidad"])),
                    'detalle': {
                        d["catalogo_destinatario_nombre"]:  int(float(d["cantidad"]))
                    }
                }
            }

    #retorna el json generado
    return result


# Retorna True si el item pertenece a un nivel y entidad
def filter_dest_item(item, nivel, entidad):
    if nivel:
        if not(item["nivel_id"] == nivel):
            return False
    if entidad:
        if not(item["entidad_id"] == entidad):
            return False
    return True

