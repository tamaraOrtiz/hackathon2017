from rest_framework import serializers
from api.models import Rating

"""
Author: Tamara Ortiz
May 2016
This class serialize the data to model
"""


#  This class serialize the data for Client App
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('page', 'entity_id', 'entity_type', 'score', 'meta')