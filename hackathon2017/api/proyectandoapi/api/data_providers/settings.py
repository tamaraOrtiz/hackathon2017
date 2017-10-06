from os import path
from proyectandoapi.settings import *
URL_BASE = "http://geo.stp.gov.py/user/stp/api/v2/sql"
PND_FILE = path.join(BASE_DIR,'api','data_providers','json','pnd.json')

# Estas Unidades de medidas fueron filtradas manualmente, los Ignorados no son mostradas en el cliente
UNIDADES = {'ACTIVIDAD': 'ACTIVIDADES',
                   'ACTIVIDADES': 'ACTIVIDADES',
                   'ADJUDICACIONES': 'ADJUDICACIONES',
                   'AGREGADOS MILITARES': 'AGREGADOS MILITARES',
                   'ALUMNOS': 'ALUMNOS',
                   'ALUMNOS CURSANTES': 'ALUMNOS',
                   'ANIMALES': 'ANIMALES',
                   'ARANCEL': 'IGNORADOS',
                   'ASENTAMIENTOS': 'ASENTAMIENTOS',
                   'ASISTENCIA': 'ASISTENCIA',
                   'AULAS': 'AULAS',
                   'BENEFICIARIOS': 'IGNORADOS',
                   'CANASTA': 'CANASTAS',
                   'CAPACITACION': 'CAPACITACIONES',
                   'CASOS': 'CASOS',
                   'CASOS JUDICIALES': 'CASOS JUDICIALES',
                   'CAUSAS IMPUTADAS': 'CAUSAS IMPUTADAS',
                   'CEDULAS DE IDENTIDAD': 'CEDULAS DE IDENTIDAD',
                   'CENTROS': 'CENTROS',
                   'CERTIFICADOS': 'CERTIFICADOS',
                   'COMISIONES': 'COMISIONES',
                   'COMITÉS': 'COMITÉS',
                   'COMUNIDAD': 'COMUNIDADES',
                   'CONTROLES': 'CONTROLES',
                   'CONVENIOS': 'CONVENIOS',
                   'COOPERATIVAS': 'COOPERATIVAS',
                   'CREDITOS':'CREDITOS',
                   'CUOTAS': 'IGNORADOS',
                   'CURSOS': 'CURSOS',
                   'DESPACHOS':'IGNORADOS',
                   'DETERMINACIONES':'IGNORADOS',
                   'DIALISIS': 'DIALISIS',
                   'DISTRITOS':'DISTRITOS',
                   'DOCENTES': 'DOCENTES',
                   'DOCUMENTOS': 'IGNORADOS',
                   'DOSIS ENTREGADAS': 'IGNORADOS',
                   'EMPRESAS': 'EMPRESAS',
                   'ENTIDADES': 'ENTIDADES',
                   'ESCUELAS': 'ESCUELAS',
                   'ESTABLECIMIENTOS DE SALUD':'ESTABLECIMIENTOS DE SALUD',
                   'ESTUDIANTE': 'ALUMNOS',
                   'EVALUACIONES': 'IGNORADOS',
                   'EVENTOS': 'IGNORADOS',
                   'FAMILIAS': 'FAMILIAS',
                   'FERIAS':'IGNORADOS',
                   'FISCALIZACIONES': 'FISCALIZACIONES',
                   'GUARANIES': 'IGNORADOS',
                   'HABILITACIONES': 'HABILITACIONES',
                   'HECTAREAS': 'HECTAREAS',
                   'HECTÁREAS':'HECTAREAS',
                   'HOGARES': 'FAMILIAS',
                   'HOMBRES': 'HOMBRES',
                   'HORAS DE AIRE': 'IGNORADOS',
                   'HORAS DE VUELOS': 'IGNORADOS',
                   'INFORMES': 'IGNORADOS',
                   'INFORMES DE AUDITORÍA': 'IGNORADOS',
                   'INSCRIPCIONES':'IGNORADOS',
                   'INSTITUCIONES':'IGNORADOS',
                   'INSUMOS':'IGNORADOS',
                   'INTERNOS': 'IGNORADOS',
                   'INTERVENCIONES': 'IGNORADOS',
                   'INVESTIGACIONES': 'INVESTIGACIONES',
                   'JORNADAS': 'JORNADAS',
                   'JUBILADOS': 'JUBILADOS',
                   'KILOMETROS': 'KILOMETROS',
                   'KILÓMETROS': 'KILOMETROS',
                   'KWH':'IGNORADOS',
                   'LICENCIAS': 'LICENCIAS',
                   'LITROS':'IGNORADOS',
                   'LLAMADOS': 'LLAMADOS',
                   'LOCALES': 'LOCALES',
                   'LOCALIDADES': 'LOCALIDADES',
                   'MAPAS': 'MAPAS',
                   'METRO LINEAL': 'IGNORADOS',
                   'METROS': 'IGNORADOS',
                   'METROS CUADRADOS': 'IGNORADOS',
                   'METROS CUBICOS': 'IGNORADOS',
                   'MICROPROYECTOS': 'MICROPROYECTOS',
                   'MUJERES': 'MUJERES',
                   'NIÑOS/NIÑAS': 'NIÑOS/NIÑAS',
                   'OBRAS': 'OBRAS',
                   'OPERACIONES': 'IGNORADOS',
                   'OPERATIVOS': 'IGNORADOS',
                   'ORDENES DE TRABAJO': 'IGNORADOS',
                   'PACIENTES': 'PACIENTES',
                   'PAGOS': 'IGNORADOS',
                   'PASAPORTES':'IGNORADOS',
                   'PERMISOS': 'IGNORADOS',
                   'PERSONAS': 'PERSONAS',
                   'PERSONAS ATENDIDAS': 'PERSONAS',
                   'PLANES': 'IGNORADOS',
                   'PORCENTAJE': 'IGNORADOS',
                   'POZOS': 'IGNORADOS',
                   'PRESTACIONES': 'IGNORADOS',
                   'PRESTAMOS': 'IGNORADOS',
                   'PROCEDIMIENTOS': 'IGNORADOS',
                   'PRODUCTORES': 'PRODUCTORES',
                   'PROYECTOS': 'PROYECTOS',
                   'PROYECTOS DE INVESTIGACION': 'PROYECTOS DE INVESTIGACION',
                   'PUENTES':'PUENTES',
                   'RECOMENDACIONES':  'IGNORADOS',
                   'REGISTROS': 'IGNORADOS',
                   'REPORTES': 'IGNORADOS',
                   'RESOLUCIONES':'RESOLUCIONES',
                   'SENTENCIAS DEFINITIVAS': 'IGNORADOS',
                   'SERVICIOS':  'IGNORADOS',
                   'SERVICIOS OFRECIDOS': 'IGNORADOS',
                   'SISTEMAS': 'IGNORADOS',
                   'SUBSIDIOS': 'IGNORADOS',
                   'TEXTOS':  'IGNORADOS',
                   'TONELADAS':  'IGNORADOS',
                   'TRANSFERENCIAS': 'IGNORADOS',
                   'UNIDAD':  'IGNORADOS',
                   'UNIDAD MILITAR': 'UNIDAD MILITAR',
                   'UNIDADES':  'IGNORADOS',
                   'USUARIOS': 'USUARIOS',
                   'VEHICULOS': 'VEHICULOS',
                   'VERIFICACIONES': 'IGNORADOS',
                   'VIVIENDAS':'VIVIENDAS',
                   'VUELOS':  'IGNORADOS'

}

# Define las unidades de medida que son personas
PERSONAS = ['ALUMNOS', 'DOCENTES', 'USUARIOS', 'PERSONAS', 'PACIENTES', 'MUJERES',
'NIÑOS/NIÑAS', 'HOMBRES']


# Relaciona una unidad de medida con un icono
ICONOS = {'ACTIVIDADES': "fa fa-calendar-check-o",
                   'ADJUDICACIONES': "fa fa-handshake-o",
                   'AGREGADOS MILITARES': "fa fa-taxi" ,
                   'ALUMNOS': "fa fa-graduation-cap",
                   'ANIMALES':"fa fa-paw",
                   'ASENTAMIENTOS': "fa fa-home",
                   'ASISTENCIA': "fa fa-handshake-o",
                   'AULAS': "fa fa-graduation-cap",
                   'CANASTAS':"fa fa-shopping-basket",
                   'CAPACITACIONES':"fa fa-graduation-cap",
                   'CASOS': "fa fa-book",
                   'CASOS JUDICIALES': "fa fa-book",
                   'CAUSAS IMPUTADAS': "fa fa-book",
                   'CEDULAS DE IDENTIDAD': "fa fa-address-card",
                   'CENTROS': "fa fa-university",
                   'CERTIFICADOS': "fa fa-newspaper-o",
                   'COMISIONES': "fa fa-handshake-o",
                   'COMITÉS':"fa fa-handshake-o",
                   'COMUNIDADES': "fa fa-users",
                   'CONTROLES':  "fa fa-book",
                   'CONVENIOS':  "fa fa-newspaper-o",
                   'COOPERATIVAS':"fa fa-university",
                   'CREDITOS': "fa fa-handshake-o",
                   'CURSOS': "fa fa-graduation-cap",
                   'DIALISIS': "fa fa-medkit",
                   'DISTRITOS':"fa fa-map-marker",
                   'DOCENTES': "fa fa-graduation-cap",
                   'EMPRESAS': "fa fa-university",
                   'ENTIDADES': "fa fa-university",
                   'ESCUELAS': "fa fa-graduation-cap",
                   'ESTABLECIMIENTOS DE SALUD': "fa fa-hospital-o",
                   'FAMILIAS': "fa fa-users",
                   'FISCALIZACIONES':"fa fa-book",
                   'HABILITACIONES':"fa fa-address-card",
                   'HECTAREAS':"fa fa-exchange" ,
                   'HOMBRES': "fa fa-male",
                   'IGNORADOS': "",
                   'INVESTIGACIONES':"fa fa-graduation-cap",
                   'JORNADAS': "fa fa-graduation-cap",
                   'JUBILADOS': "fa fa-blind",
                   'KILOMETROS': "fa fa-exchange" ,
                   'LICENCIAS': "fa fa-address-card",
                   'LLAMADOS': "fa fa-volume-control-phone",
                   'LOCALES':"fa fa-university",
                   'LOCALIDADES':"fa fa-map-marker",
                   'MAPAS': "fa fa-map" ,
                   'MICROPROYECTOS': "fa fa-handshake-o",
                   'MUJERES':"fa fa-female",
                   'NIÑOS/NIÑAS': "fa fa-child",
                   'OBRAS': "fa fa-building-o",
                   'PACIENTES': "fa fa-wheelchair",
                   'PERSONAS': "fa fa-users",
                   'PRODUCTORES':"fa fa-truck",
                   'PROYECTOS': "fa fa-handshake-o",
                   'PROYECTOS DE INVESTIGACION': "fa fa-handshake-o",
                   'PUENTES':"fa fa-building-o",
                   'RESOLUCIONES': "fa fa-book",
                   'UNIDAD MILITAR': "fa fa-taxi",
                   'USUARIOS': "fa fa-users",
                   'VEHICULOS': "fa fa-car" ,
                   'VIVIENDAS': "fa fa-home"}

# Define los nombres de los archivos
ACCPRO_FILE = path.join(BASE_DIR,'api','data_providers','json',"acc_prod.json")

TOTALES_PRODUCTOS = path.join(BASE_DIR,'api','data_providers','json',"t_prod.json")

TOTALES_ENTIDADES = path.join(BASE_DIR,'api','data_providers','json',"t_ent.json")

TOTALES_PRODACC = path.join(BASE_DIR,'api','data_providers','json',"t_proacc.json")

AVANCE_FILE = path.join(BASE_DIR,'api','data_providers','json',"avance.json")

LA_FILE = path.join(BASE_DIR,'api','data_providers','json',"la.json")

PROG_FILE =  path.join(BASE_DIR,'api','data_providers','json',"pro.json")

LA_PROG_FILE =  path.join(BASE_DIR,'api','data_providers','json',"la_pro.json")

LA_MAPA =  path.join(BASE_DIR,'api','data_providers','json',"la_mapa.json")

DEST_FILE =  path.join(BASE_DIR,'api','data_providers','json',"dest.json")

INST_FILE =  path.join(BASE_DIR,'api','data_providers','json',"inst.json")

NIV_FILE =  path.join(BASE_DIR,'api','data_providers','json',"niv.json")

ENT_FILE =  path.join(BASE_DIR,'api','data_providers','json',"ent.json")

FULLINST_FILE =  path.join(BASE_DIR,'api','data_providers','json',"fullinst.json")