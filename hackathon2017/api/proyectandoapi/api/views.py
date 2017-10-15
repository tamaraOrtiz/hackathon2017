from django.shortcuts import render
from api.serializer import RatingSerializer, CommentSerializer, ClientAppSerializer, EventSerializer
from api.models import Rating, Comment, ClientApp, Event
from django.db.models import Sum
from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ratelimit.decorators import ratelimit
import api.data_providers.la_provider as la_provider
import api.data_providers.pnd_provider as pnd_provider
import api.data_providers.dest_provider as dest_provider
import api.data_providers.inst_provider as ins_provider


# Create your views here.
@api_view(['GET', 'POST'])
def rating(request):
    if request.method == 'POST':
        """
        Request POST: Aqui se guarda el rating de una entidad
        URL: https://proyectando-api.herokuapp.com/api/rating/
        """

        data = request.data

        serializer = RatingSerializer(data=data)

        if serializer.is_valid():
            serializer.save()  # Save data if is valid
            filtered_objects = Rating.objects.filter(entity_id__exact=serializer.data['entity_id'],
                                                     entity_type__exact=serializer.data['entity_type'])
            score = filtered_objects.aggregate(rating=Sum('score'), count=Count('score'))
            data['score'] = round(score['rating'] * 1.0 / score['count'], 2)
            return Response(data, status=status.HTTP_201_CREATED)  # Return 201 if create a client app

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        """
        Request GET: Aqui obtienen todos los ratings
        RL: https://proyectando-api.herokuapp.com/api/rating/
        """
        ratings = Rating.objects.all()
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)


# Create your views here.
@api_view(['GET', 'POST'])
def event(request):
    if request.method == 'POST':
        """
        Request POST para event (Si el event para la entidad id y entidad type ya existe, lo actutaliza)
        URL: https://proyectando-api.herokuapp.com/api/event/
        """
        data = request.data  # Save data request in json data
        event = Event.objects.filter(entity_type__exact=data["entity_type"], event_type__exact=data["event_type"], entity_id__exact=data["entity_id"])[:1]
        if data["entity_type"] == "lineasAccion" and data["event_type"] == "download":
            inst = data["entity_id"].split("_")[0]
            inst_event = Event.objects.filter(entity_type__exact="Institucion",
                                         entity_id__exact=inst, event_type__exact=data["event_type"])[:1]
            if inst_event:
                inst_event = inst_event[0]
                inst_event.counter = inst_event.counter + 1
                inst_event.save(update_fields=['counter'])
            else:
                i =inst_event.create(entity_type='Institucion', event_type="download", entity_id=inst, counter=1)
                i.save()
        if event:
            event = event[0]
            event.counter = event.counter + 1
            event.save(update_fields=['counter'])
            return Response(event.counter, status=status.HTTP_201_CREATED)  # Return 201 if create a client app
        else:

            serializer = EventSerializer(data=data)  # Call method that serialize the data

            if serializer.is_valid():
                serializer.save()  # Save data if is valid

                return Response(1, status=status.HTTP_201_CREATED)  # Return 201 if create a client app

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)



# Create your views here.
@api_view(['GET', 'POST'])
def comment(request):
    if request.method == 'POST':
        """
        Request POST para comment
        URL: https://proyectando-api.herokuapp.com/api/comment/
        """

        data = request.data  # Save data request in json data

        serializer = CommentSerializer(data=data)  # Call method that serialize the data

        if serializer.is_valid():
            serializer.save()  # Save data if is valid

            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return 201 if create a client app

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        """
        GET comment
        URL: https://proyectando-api.herokuapp.com/api/comment/?entity_id=48342&entity_type=Institucion&page=0
        """
        next_page = (int(request.query_params.get('page', int)) + 1) * 10
        comments = Comment.objects.filter(entity_id__exact=request.query_params.get('entity_id', None),
                                          entity_type__exact=request.query_params.get('entity_type', None),
                                          ).order_by('-commented_at')[:next_page]
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def get_rating(request):
    if request.method == 'GET':
        """
        GET rating
        URL:https://proyectando-api.herokuapp.com/api/get_rating?entity_id=48342&entity_type=Institucion
        """
        filtered_objects = Rating.objects.filter(entity_id__exact=request.query_params.get('entity_id', None),
                                                entity_type__exact=request.query_params.get('entity_type', None))
        count = filtered_objects.count()
        if count == 0:
            return Response(0, status=status.HTTP_200_OK)
        score = filtered_objects.aggregate(rating=Sum('score'))
        return Response(round(score['rating']/count, 2), status=status.HTTP_200_OK)


@api_view(['GET'])
def get_events(request):
    if request.method == 'GET':
        """
        GET events
        URL:https://proyectando-api.herokuapp.com/api/get_events?entity_id=48342&entity_type=Institucion
        """
        filtered_objects = Event.objects.filter(entity_id__exact=request.query_params.get('entity_id', None),
                                                entity_type__exact=request.query_params.get('entity_type', None))
        result={}
        for e in filtered_objects:
            if e.event_type not in result:
                result[e.event_type] = e.counter
            else:
                result[e.event_type] = result[e.event_type] + e.counter

        return Response(result, status=status.HTTP_200_OK)


@api_view(['POST'])
def client_app(request):
    if request.method == 'POST':
        """
        Request POST for client app
        Este metodo no es utilizado pero podria usarce en un futuro
        """

        data = request.data  # Save data request in json data
        serializer = ClientAppSerializer(data=data)  # Call method that serialize the data

        if serializer.is_valid():
            serializer.save()  # Save data if is valid

            client_app_created = ClientApp.objects.filter(
                app_name=serializer.data.get("app_name")).first()  # Get the client app created

            return Response(client_app_created.app_code,
                            status=status.HTTP_201_CREATED)  # Return 201 if create a client app

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_lineas_de_accion(request):
    if request.method == 'GET':
        """
        GET lineas de accion
        URL: https://proyectando-api.herokuapp.com/api/lineas_de_accion/?nivel=12&entidad=6&institucion=22691
        """
        filtered_objects = la_provider.filter_avance(request.query_params.get('nivel', None),
                                                request.query_params.get('entity', None),
                                                request.query_params.get('institucion', None),
                                               )

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_departamentos(request):

    if request.method == 'GET':
        """
        GET departamentos
        URL: https://proyectando-api.herokuapp.com/api/departamentos/?la=502&nivel=12&entidad=6&institucion=22691
        """
        filtered_objects = la_provider.filter_map(request.query_params.get('la', None),
                                                  request.query_params.get('nivel', None),
                                                  request.query_params.get('entidad', None),
                                                  request.query_params.get('institucion', None)
                                                  )

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_pnd(request):
    if request.method == 'GET':
        """
        GET resumen pnd
        URL: https://proyectando-api.herokuapp.com/api/pnd/?nivel=null&entidad=null&anho=null
        """
        filtered_objects = pnd_provider.get_pnd(request.query_params.get('nivel', None),
            request.query_params.get('entidad', None),
            request.query_params.get('anho', None))

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_pnd_eje(request):
    if request.method == 'GET':
        """
        GET resumen pnd ejes
        URL: https://proyectando-api.herokuapp.com/api/pndeje/?nivel=null&entidad=null&anho=null
        """
        filtered_objects = pnd_provider.get_pnd_eje(request.query_params.get('nivel', None),
            request.query_params.get('entidad', None),
            request.query_params.get('anho', None))

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_pnd_estrategia(request):
    if request.method == 'GET':
        """
        GET resumen pnd estrategias
        URL: https://proyectando-api.herokuapp.com/api/pndestrategia/?nivel=null&entidad=null&anho=null
        """
        filtered_objects = pnd_provider.get_pnd_estrategia(request.query_params.get('nivel', None),
            request.query_params.get('entidad', None),
            request.query_params.get('anho', None))

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_dest(request):
    if request.method == 'GET':
        """
        GET destinatarios
        URL: https://proyectando-api.herokuapp.com/api/destinatarios/?nivel=11&entidad=2
        """
        filtered_objects = dest_provider.get_dest(request.query_params.get('nivel', None),
            request.query_params.get('entidad', None))

        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_inst(request):
    if request.method == 'GET':
        """
        GET Instituciones
        URL: https://proyectando-api.herokuapp.com/api/instituciones/?niveles=
        """
        filtered_objects = ins_provider.get_inst(request.query_params.get('niveles', None))
        return Response(filtered_objects, status=status.HTTP_200_OK)


@api_view(['GET'])
def filter_inst(request):
    if request.method == 'GET':
        """
        GET Instituciones
        URL: https://proyectando-api.herokuapp.com/api/filtro_instituciones/?niveles=1,10,11,12,13,14,15,21,22,23,24,25,27,28,30,40&text=min
        """

        filtered_objects = ins_provider.filter_inst(request.query_params.get('niveles', None),
                                                    request.query_params.get('text', ""))
        return Response(filtered_objects, status=status.HTTP_200_OK)

@api_view(['GET'])
def update_institucion(request):
    if request.method == 'GET':
        """
        Este metodo actualiza los datos de los proveedores de las intituciones
        URL: https://proyectando-api.herokuapp.com/api/actualizar_instituciones
        """
        la_provider.save_totales()
        la_provider.save_avance()
        la_provider.save_programacion()
        la_provider.save_la_prog()
        la_provider.save_la()
        la_provider.save_la_mapa()
        ins_provider.save_inst()
        ins_provider.save_full_inst()
        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def update_pnd(request):

    if request.method == 'GET':
        """
        Este metodo actualiza los datos del proveedor del pnd
        URL: https://proyectando-api.herokuapp.com/api/actualizar_pnd
        """
        pnd_provider.save_acc_pro()
        pnd_provider.save_totales()
        pnd_provider.save_pnd()
        return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def update_destinatarios(request):
    if request.method == 'GET':
        """
        Este metodo actualiza los datos del proveedor de destinatarios
        URL: https://proyectando-api.herokuapp.com/api/actualizar_destinatarios
        """
        dest_provider.save_dest()
        return Response(status=status.HTTP_200_OK)


