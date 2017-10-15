from rest_framework import serializers
from api.models import Rating, Comment, ClientApp, Event

"""
Author: Tamara Ortiz
May 2016
Esta clase serializa los modelos de datos
"""


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('page', 'entity_id', 'entity_type', 'score', 'meta')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('page', 'entity_id', 'entity_type', 'commented_at', 'text', 'meta')


class ClientAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientApp
        fields = ('app_name')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('page', 'entity_id', 'entity_type', 'event_type')
