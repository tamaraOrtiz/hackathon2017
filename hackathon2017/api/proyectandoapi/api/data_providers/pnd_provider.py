import urllib.request
import api.data_providers.settings as settings
import json
from urllib.error import HTTPError
import pprint
import os
"""
Author: Tamara Ortiz
Esta clase provee toda la informacion necesaria del pnd
"""
# Obtiene los datos del pnd del api carto db
PND_URL = "?q=SELECT%20*%20FROM%20public.pnd_meta_fisica"
# Obtiene los datos del accionhasproducto del api carto db
ACCPRO_URL = '?q=SELECT%20*%20FROM%20public.accionhasproducto'


# Guarda los datos obtenidos de pnd_meta_fisica en un archivo
def save_pnd():
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, PND_URL)) as data:
        result = data.read()
        _json = result.decode('utf8').replace("'", '"')
        with open(settings.PND_FILE, 'w') as f:
            f.write(_json)


# Guarda los datos de la tabla accionhasproductos en un archivo
def save_acc_pro():
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, ACCPRO_URL)) as data:
        result = data.read()
        _json = result.decode('utf8').replace("'", '"')
        with open(settings.ACCPRO_FILE, 'w') as f:
            f.write(_json)


# Obtiene los totales utilizando el producto concat
def get_total_productos():
    result = {}
    totales = {}
    if os.path.exists(settings.ACCPRO_FILE):
        with open(settings.ACCPRO_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            for d in data:
                key1= d["nivel"]+"-"+d["entidad"]+"-"+d["tipoprograma"]+"-"+d["programa"]+"-"+d["proyecto"]+"-"+d["subprograma"]+"-"+d["sprproductoid"]
                key2 = d["nivel"] + "-" + d["entidad"] + "-" + d["anho"]
                if key1 not in result:
                    result[key1] = float(d["cantidadfinanciera"])

                    if key2 in totales:
                        totales[key2] =  totales[key2] + float(d["cantidadfinanciera"])
                    else:
                        totales[key2] = float(d["cantidadfinanciera"])

    return totales, result


# Guarda los totales en un en un archivo, guardando los totales por entidad y por producto concat en diferentes archivos
def save_totales():
    t_ent, t_prod = get_total_productos()
    with open(settings.TOTALES_ENTIDADES, 'w') as f:
        f.write(json.dumps(t_ent))
    with open(settings.TOTALES_PRODUCTOS, 'w') as f:
        f.write(json.dumps(t_prod))


# Filtra los datos del pnd por nivel, entidad y anho
def filter_pnd(nivel, entidad, anho):
    result= []
    if os.path.exists(settings.PND_FILE):
        with open(settings.PND_FILE, 'r') as f:
            data = json.loads(f.read())
            data = data["rows"]
            result = list(filter(lambda x: filter_item_pnd(x, nivel, entidad, anho), data))
    return result

# Obtiene los totales guardados en el achivo TOTALES_PRODUCTOS
def get_totales():
    result= {}
    if os.path.exists(settings.TOTALES_PRODUCTOS):
        with open(settings.TOTALES_PRODUCTOS, 'r') as f:
            result = json.loads(f.read())
    return result

# Obtiene los datos del pnd por nivel, entidad y anho
def get_pnd(nivel=None, entidad=None, anho=None):
    nivel = nivel if nivel!='null' else None
    entidad = entidad if entidad!='null' else None
    anho = anho if anho!='null' else None
    data = filter_pnd(nivel, entidad, anho)
    totales = get_totales()
    result = {}
    objetivos = set()
    entidades = set()
    beneficiarios = {}
    personas = 0
    monto = 0
    full_beneficiarios = {}
    for d in data:
        # Separa los beneficiarios que son personas y los registra de manera separada
        if d['unidad_medida'] in settings.UNIDADES:
            unidad = settings.UNIDADES[d['unidad_medida']]
        else:
            unidad = d['unidad_medida']
        if d['unidad_medida'] in settings.PERSONAS:
            personas += float(d["cantidad"])
        if d['objetivo_estrategico_id'] not in objetivos:
            objetivos.add(d['objetivo_estrategico_id'])
        entidad_id = d['entidad_id']+"_"+d['nivel_id']
        if entidad_id not in entidades:
            entidades.add(entidad_id)
        if unidad not in beneficiarios:
            beneficiarios[unidad] = d["cantidad"]
        else:
            beneficiarios[unidad] = float(beneficiarios[unidad]) + float(d["cantidad"])
        # Agrega el total utilizando el producto concat
        if d["prod_concat"] in totales:
            monto += totales[d["prod_concat"]]
    # Agrega la cantidad de beneficiarios de cada unidad de medidad
    for k,v in beneficiarios.items():
        if k in settings.ICONOS:
            full_beneficiarios[k] = (v, settings.ICONOS[k])
    # Agrega todos los datos necesarios para mostrar el pnd
    result["entidades"] = len(entidades)
    result["objetivos"] = len(objetivos)
    result["beneficiarios"] = full_beneficiarios
    result["monto"] = monto
    result["personas"] = personas
    return result

# Obtiene los datos del pnd agrupados por eje
def get_pnd_eje(nivel=None, entidad=None, anho=None):
    nivel = nivel if nivel!='null' else None
    entidad = entidad if entidad!='null' else None
    anho = anho if anho!='null' else None
    data = filter_pnd(nivel, entidad, anho)
    totales = get_totales()
    ejes= {"Reducción de pobreza y desarrollo social":{
        'personas':0,
        'monto':0,
        'beneficiarios':{},
        'entidades': set(),
            'objetivos': set()},
        "Crecimiento económico inclusivo": {
            'personas': 0,
            'monto': 0,
            'beneficiarios': {},
            'entidades': set(),
            'objetivos': set()},
        "Inserción de Paraguay en el mundo": {
            'personas': 0,
            'monto': 0,
            'beneficiarios': {},
            'entidades': set(),
            'objetivos': set()}

    }

    for d in data:

        monto = totales[d["prod_concat"]] if d["prod_concat"] in totales else 0
        if d['unidad_medida'] in settings.UNIDADES:
            unidad = settings.UNIDADES[d['unidad_medida']]
        else:
            unidad = d['unidad_medida']
        if d['eje_estrategico_nombre'] in ejes:

            if d['unidad_medida'] in settings.PERSONAS:
                ejes[d['eje_estrategico_nombre']]["personas"] = ejes[d['eje_estrategico_nombre']]["personas"] + float(d["cantidad"])
            if d['objetivo_estrategico_id'] not in ejes[d['eje_estrategico_nombre']]["objetivos"]:
                ejes[d['eje_estrategico_nombre']]["objetivos"].add(d['objetivo_estrategico_id'])
            entidad_id = d['entidad_id']+"_"+d['nivel_id']
            if entidad_id not in ejes[d['eje_estrategico_nombre']]["entidades"]:
                ejes[d['eje_estrategico_nombre']]["entidades"].add(entidad_id)
            if unidad not in ejes[d['eje_estrategico_nombre']]["beneficiarios"]:
                ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad] = [float(d["cantidad"]),  settings.ICONOS[unidad]]
            else:
                ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad][0] = ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad][0]+ float(d["cantidad"])
            if d["prod_concat"] in totales:
                ejes[d['eje_estrategico_nombre']]["monto"] = ejes[d['eje_estrategico_nombre']]["monto"] +monto

    return ejes

# Obtiene los datos del pnd agrupado por estrategia
def get_pnd_estrategia(nivel=None, entidad=None, anho=None):
    nivel = nivel if nivel!='null' else None
    entidad = entidad if entidad!='null' else None
    anho = anho if anho!='null' else None
    data = filter_pnd(nivel, entidad, anho)
    totales = get_totales()
    # Inicializa cada estrategia y dentro de cada estrategia divide la informacion por eje
    est= {"Igualdad de oportunidades": {"Reducción de pobreza y desarrollo social":{
                                        'personas':0,
                                        'monto':0,
                                        'beneficiarios':{},
                                        'entidades': set(),
                                            'objetivos': set()},
                                        "Crecimiento económico inclusivo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()},
                                        "Inserción de Paraguay en el mundo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()}},
        "Desarrollo y ordenamiento territorial": {"Reducción de pobreza y desarrollo social":{
                                        'personas':0,
                                        'monto':0,
                                        'beneficiarios':{},
                                        'entidades': set(),
                                            'objetivos': set()},
                                        "Crecimiento económico inclusivo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()},
                                        "Inserción de Paraguay en el mundo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()}},
        "Gestión pública eficiente y transparente": {"Reducción de pobreza y desarrollo social":{
                                        'personas':0,
                                        'monto':0,
                                        'beneficiarios':{},
                                        'entidades': set(),
                                            'objetivos': set()},
                                        "Crecimiento económico inclusivo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()},
                                        "Inserción de Paraguay en el mundo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()}},
        "Sostenibilidad ambiental": {"Reducción de pobreza y desarrollo social":{
                                        'personas':0,
                                        'monto':0,
                                        'beneficiarios':{},
                                        'entidades': set(),
                                            'objetivos': set()},
                                        "Crecimiento económico inclusivo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()},
                                        "Inserción de Paraguay en el mundo": {
                                            'personas': 0,
                                            'monto': 0,
                                            'beneficiarios': {},
                                            'entidades': set(),
                                            'objetivos': set()}}

    }

    for d in data:

        monto = totales[d["prod_concat"]] if d["prod_concat"] in totales else 0
        if d['unidad_medida'] in settings.UNIDADES:
            unidad = settings.UNIDADES[d['unidad_medida']]
        else:
            unidad = d['unidad_medida']
        ejes = est[d["linea_transversal_nombre"]]
        if d['eje_estrategico_nombre'] in ejes:

            if d['unidad_medida'] in settings.PERSONAS:
                ejes[d['eje_estrategico_nombre']]["personas"] = ejes[d['eje_estrategico_nombre']]["personas"] + float(d["cantidad"])
            if d['objetivo_estrategico_id'] not in ejes[d['eje_estrategico_nombre']]["objetivos"]:
                ejes[d['eje_estrategico_nombre']]["objetivos"].add(d['objetivo_estrategico_id'])
            entidad_id = d['entidad_id']+"_"+d['nivel_id']
            if entidad_id not in ejes[d['eje_estrategico_nombre']]["entidades"]:
                ejes[d['eje_estrategico_nombre']]["entidades"].add(entidad_id)
            if unidad not in ejes[d['eje_estrategico_nombre']]["beneficiarios"]:
                ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad] = [float(d["cantidad"]),  settings.ICONOS[unidad]]
            else:
                ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad][0] = ejes[d['eje_estrategico_nombre']]["beneficiarios"][unidad][0]+ float(d["cantidad"])
            if d["prod_concat"] in totales:
                ejes[d['eje_estrategico_nombre']]["monto"] = ejes[d['eje_estrategico_nombre']]["monto"] +monto


    return est


# Retorna True si el item pertenece al nivel, entidad y anho
def filter_item_pnd(item, nivel, entidad, anho):
    if nivel:
        if not(item["nivel_id"] == nivel):
            return False
    if entidad:
        if not(item["entidad_id"] == entidad):
            return False
    if anho:
        if not(item["anho"] == anho):
            return False
    return True
