from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    url(r'^rating/$', views.rating),
    url(r'^comment/$', views.comment),
    url(r'^event/$', views.event),
    url(r'^post_key/$', views.client_app),
    url(r'^lineas_de_accion/$', views.get_lineas_de_accion),
    url(r'^departamentos/$', views.get_departamentos),
    url(r'^get_rating', views.get_rating),
    url(r'^get_events', views.get_events),
    url(r'^pnd/$', views.get_pnd),
    url(r'^pndeje/$', views.get_pnd_eje),
    url(r'^pndestrategia/$', views.get_pnd_estrategia),
    url(r'^destinatarios/$', views.get_dest),
    url(r'^instituciones', views.get_inst),
    url(r'^filtro_instituciones', views.filter_inst),
    url(r'^actualizar_instituciones', views.update_institucion),
    url(r'^actualizar_pnd', views.update_pnd),
    url(r'^actualizar_destinatarios', views.update_destinatarios)
]


urlpatterns = format_suffix_patterns(urlpatterns)