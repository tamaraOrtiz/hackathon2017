import urllib.request
import api.data_providers.settings as settings
import json
from urllib.error import HTTPError
import pprint
import os
import api.data_providers.la_provider as p_la
from api.models import *
from django.db.models import Count
from django.db.models import Sum
import copy
import unidecode

"""
Author: Tamara Ortiz
Esta clase provee toda la informacion necesaria de las intituciones
"""

# Inicializa las url para obtener los datos de carto db, de las tablas: institucion_spr, niveles_spr, entidades_spr
INST_URL = "?q=SELECT%20*%20FROM%20public.instituciones_spr"
NIV_URL = "?q=SELECT%20*%20FROM%20public.niveles_spr"
ENT_URL = "?q=SELECT%20*%20FROM%20public.entidades_spr"


# Guarda los datos obtenidos de las tablas instituciones_spr, niveles_spr y entidades_spr en diferentes archivos
def save_inst():
    # Guarda los datos obtenidos de la tabla instituciones_spr en un archivo
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, INST_URL)) as data:
        result = data.read()
        _json = result.decode('utf8')
        with open(settings.INST_FILE, 'w') as f:
            f.write(_json)
    # Guarda los datos obtenidos de la tabla niveles_spr en un archivo, el archivo contiene un hash que tiene como
    # clave el id del nivel y como valor el nombre del nivel
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, NIV_URL)) as data:
        result = data.read()
        _json = result.decode('utf8')
        _niveles = {}
        niveles =  json.loads(_json)["rows"]
        for n in niveles:
            _niveles[n["nivel"]] = n["nombrenivel"]
        with open(settings.NIV_FILE, 'w') as f:
            f.write(json.dumps(_niveles))
    # Guarda los datos obtenidos de la tabla entidades_spr en un archivo, el archivo contiene un hash que tiene como
    # clave el id del nivel seguido del id de la entidad, separado por:'_' y como valor el nombre de la entidad
    with urllib.request.urlopen("{}{}".format(settings.URL_BASE, ENT_URL)) as data:
        result = data.read()
        _json = result.decode('utf8')
        _entidades = {}
        entidades = json.loads(_json)["rows"]
        for e in entidades:
            _entidades[e["nivel"]+"_"+e["entidad"]] = e["nombreentidad"]
        with open(settings.ENT_FILE, 'w') as f:
            f.write(json.dumps(_entidades))


# Guarda en un archivo toda la informacion necesaria de cada intitucion
def save_full_inst():
    # Guarda en la variable niveles el hash guardado en el archivo NIV_FILE
    if os.path.exists(settings.NIV_FILE):
        with open(settings.NIV_FILE, 'r') as n:
            niveles = json.loads(n.read())
            # Guarda en la variable entidades el hash guardado en el archivo ENT_FILE
            if os.path.exists(settings.ENT_FILE):
                with open(settings.ENT_FILE, 'r') as e:
                    entidades = json.loads(e.read())
                    # Guarda en la variable data los datos guardados de la tabla instituciones_spr
                    if os.path.exists(settings.INST_FILE):
                        with open(settings.INST_FILE, 'r') as f:
                            data = json.loads(f.read())
                            data = data["rows"]
                            result = {}
                            for d in data:
                                # Inicializa las cantidades
                                cant_p = 0
                                cant_a = 0
                                monto = 0
                                # p_la es el proveedor de los datos de la lineas de accion
                                # aqui se obtienen las lineas de accion de la institucion actual, teniendo en cuenta el nivel y la entidad de la misma
                                las = p_la.filter_avance(d['nivelid'], d['entidadid'], d["id"])
                                # aumenta las cantidades, usando los datos de cada linea de accion de la institucion actual
                                for la in las:
                                    cant_p += la['cantidad_prog']
                                    cant_a += la['cantidad_avance']
                                    monto += la['cantidad_financiera']
                                # guarda en la variable entidades el id del nivel seguido del id de la entidad separado por "_", esto es porque id de la entidad
                                # puede repetirse en diferentes niveles, siendo entidades distintas
                                entidad = entidades[d["nivelid"] + "_" + d["entidadid"]]
                                # Verifica si el nivel actual ya fue procesado anteriormente
                                if d['nivelid'] in result:
                                    # Verifica si la entidad actual ya fue procesada anteriormente dentro del nivel actual
                                    if d['entidadid'] in result[d['nivelid']]["entidades"]:
                                        #  Verifica si la institucion actual ya fue procesada anteriormente dentro de la entidad actual
                                        if d['id'] not in result[d['nivelid']]["entidades"][d['entidadid']]:
                                            # Si no fue procesada la inicializa, utiliza el total de las cantidades de las lineas de accion
                                            # de la institucion, obtenidas mas arriba, si ya fue procesada la ignora.

                                            result[d['nivelid']]["entidades"][d['entidadid']][d['id']]={'id':d["id"],
                                                                                               'nombre':d["nombre"],
                                                                                          'la':len(las),
                                                                                          'cant_a':cant_a,
                                                                                          'cant_p':cant_p,
                                                                                          'monto':monto,
                                                                                            "nivelnombre": niveles[d["nivelid"]],
                                                                                            "nivelid":d["nivelid"],
                                                                                            "entidadnombre":entidad,
                                                                                            "entidadid":d["entidadid"]}
                                    else:
                                        # Si la entidad actual no fue procesada la inicializa
                                        result[d['nivelid']]["entidades"][d["entidadid"]]= {
                                            "nombre": entidad,
                                            "id" : d["entidadid"],
                                            "instituciones": {
                                                d['id']: {'id': d["id"],
                                                          'la': len(las),
                                                          'nombre': d["nombre"],
                                                          'cant_a': cant_a,
                                                          'cant_p': cant_p,
                                                          'monto': monto,
                                                          "nivelnombre": niveles[d["nivelid"]],
                                                          "nivelid":d["nivelid"],
                                                          "entidadnombre":entidad,
                                                          "entidadid":d["entidadid"]
                                                          }}}
                                else:
                                    # Si el nivel actual no fue procesado lo inicializa
                                    result[d['nivelid']] ={
                                        "nombre": niveles[d["nivelid"]],
                                        "id": d["nivelid"],
                                        "entidades":{
                                            d["entidadid"]:{
                                                "nombre": entidad,
                                                "id" : d["entidadid"],
                                                "instituciones": {
                                                    d['id']: {'id': d["id"],
                                                              'la': len(las),
                                                              'nombre': d["nombre"],
                                                              'cant_a': cant_a,
                                                              'cant_p': cant_p,
                                                              'monto': monto,
                                                              "nivelnombre": niveles[d["nivelid"]],
                                                              "nivelid":d["nivelid"],
                                                              "entidadnombre":entidad,
                                                              "entidadid":d["entidadid"]
                                                              }}}}}
                            # Guarda el json generado en un archivo
                            with open(settings.FULLINST_FILE, 'w') as f:
                                f.write(json.dumps(result))


# Crea un hash que tiene como clave el id de una entidad y como valor el total de esa entidad
def get_objects(objects):
    result = {}
    for obj in objects:
        result[obj["entity_id"]] = obj["total"]

    return result

# Obtiene las instituciones segun los niveles recibidos
def get_inst(_niveles):
    niveles = _niveles.split(",")
    if os.path.exists(settings.FULLINST_FILE):
        with open(settings.FULLINST_FILE, 'r') as f:
            # Obtiene cantidad cada de evento de la entidad "Intitucion", agrupados por id, estos eventos son agregado a su institucion correspondiente mas abajo
            rating = Rating.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Count('entity_id')).order_by('entity_id')
            sum_rating = Rating.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Sum('score')).order_by('entity_id')
            comments = Comment.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Count('entity_id')).order_by('entity_id')
            events = Event.objects.filter(entity_type__exact="Institucion", event_type__exact="view").values(
                "entity_id").annotate(total=Sum('counter')).order_by('entity_id')
            downloads = Event.objects.filter(entity_type__exact="Institucion", event_type__exact="download").values(
                "entity_id").annotate(total=Sum('counter')).order_by('entity_id')

            _rating = get_objects(rating)
            _comment = get_objects(comments)
            _event = get_objects(events)
            _downloads = get_objects(downloads)
            _sum_rating = get_objects(sum_rating)
           
            data = json.loads(f.read())
            # Si la variable niveles tiene una arreglo con una cadena vacia, significa que no se recibio ningun nivel como parametro y
            # devuelve todas las insituciones
            if niveles == ['']:

                for k1,n in data.items():
                    for k2,ent in n["entidades"].items():
                        for k,inst in ent["instituciones"].items():
                            inst["rating"] = round(_sum_rating[inst["id"]] / _rating[inst["id"]], 2) if inst[
                                                                                                            "id"] in _rating else 0
                            inst["comment"] = _comment[inst["id"]] if inst["id"] in _comment else 0
                            inst["views"] = _event[inst["id"]] if inst["id"] in _event else 0
                            inst["downloads"] = _downloads[inst["id"]] if inst["id"] in _downloads else 0
                       

                return data
            else:
                result = {}
                # Filtra las insitituciones por los niveles recibidos
                for n in niveles:
                    if n in data:
                        for k,ent in data[n]["entidades"].items():
                            for k1,inst in ent["instituciones"].items():
                                inst["rating"] = round(_sum_rating[inst["id"]]/_rating[inst["id"]], 2) if inst["id"] in _rating else 0
                                inst["comment"] = _comment[inst["id"]] if inst["id"] in _comment else 0
                                inst["views"] = _event[inst["id"]] if inst["id"] in _event else 0
                                inst["downloads"] = _downloads[inst["id"]] if inst["id"] in _downloads else 0
                           
                        result[n] = data[n]
                return result


# Filtra las instituciones por niveles y nombre
def filter_inst(_niveles, text):
    niveles = _niveles.split(",")

    if os.path.exists(settings.FULLINST_FILE):
        with open(settings.FULLINST_FILE, 'r') as f:
            # Obtiene cantidad cada de evento de la entidad "Intitucion", agrupados por id, estos eventos son agregado a su institucion correspondiente mas abajo
            rating = Rating.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Count('entity_id')).order_by('entity_id')
            sum_rating = Rating.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Sum('score')).order_by('entity_id')
            comments = Comment.objects.filter(entity_type__exact='Institucion').values("entity_id").annotate(
                total=Count('entity_id')).order_by('entity_id')
            events = Event.objects.filter(entity_type__exact="Institucion", event_type__exact="view").values(
                "entity_id").annotate(total=Sum('counter')).order_by('entity_id')
            downloads = Event.objects.filter(entity_type__exact="Institucion", event_type__exact="download").values(
                "entity_id").annotate(total=Sum('counter')).order_by('entity_id')

            _rating = get_objects(rating)
            _comment = get_objects(comments)
            _event = get_objects(events)
            _downloads = get_objects(downloads)
            _sum_rating = get_objects(sum_rating)

            data = json.loads(f.read())
            filter = copy.deepcopy(data)
            ival = False
            eval = False

            text = unidecode.unidecode(text).lower() # Elimina los acentos y convierte el texto a minuscula
            # Si la variable niveles tiene una arreglo con una cadena vacia, significa que no se recibio ningun nivel como parametro y
            # devuelve todas las insituciones que tenga un nombre que contenga el texto guardado en la variable "text"
            if niveles == ['']:

                for k1, n in data.items():
                    for k2, ent in n["entidades"].items():
                        for k, _inst in ent["instituciones"].items():
                            ninst = unidecode.unidecode(_inst["nombre"]).lower()
                            if text not in ninst:
                                del(filter[k1]["entidades"][k2]["instituciones"][k])
                            else:
                                inst =filter[k1]["entidades"][k2]["instituciones"][k]
                                inst["rating"] = round(_sum_rating[inst["id"]] / _rating[inst["id"]], 2) if inst[
                                                                                                                "id"] in _rating else 0
                                inst["comment"] = _comment[inst["id"]] if inst["id"] in _comment else 0
                                inst["views"] = _event[inst["id"]] if inst["id"] in _event else 0
                                inst["downloads"] = _downloads[inst["id"]] if inst["id"] in _downloads else 0
                                ival = True
                        if not ival:
                            del(filter[k1]["entidades"][k2])
                        else:
                            eval = True
                        ival = False
                    if not eval:
                        del (filter[k1])
                    eval = False
                return filter
            else:
                result = {}
                # Filtra las insitituciones por los niveles recibidos y el texto en la variable text
                for n in niveles:
                    if n in data:
                        for k, ent in data[n]["entidades"].items():
                            for k1, _inst in ent["instituciones"].items():
                                ninst = unidecode.unidecode(_inst["nombre"]).lower()
                                if text not in ninst:
                                    del (filter[n]["entidades"][k]["instituciones"][k1])
                                else:
                                    inst= filter[n]["entidades"][k]["instituciones"][k1]
                                    inst["rating"] = round(_sum_rating[inst["id"]] / _rating[inst["id"]], 2) if inst[
                                                                                                                    "id"] in _rating else 0
                                    inst["comment"] = _comment[inst["id"]] if inst["id"] in _comment else 0
                                    inst["views"] = _event[inst["id"]] if inst["id"] in _event else 0
                                    inst["downloads"] = _downloads[inst["id"]] if inst["id"] in _downloads else 0
                                    ival = True
                            if not ival:
                                del (filter[n]["entidades"][k])
                            else:
                                eval = True
                            ival = False
                        if not eval:
                            del (filter[n])
                        else:
                            result[n] = filter[n]
                        eval = False

                return result