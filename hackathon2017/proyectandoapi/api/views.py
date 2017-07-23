from django.shortcuts import render
from api.serializer import RatingSerializer
from api.models import Rating
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ratelimit.decorators import ratelimit

# Create your views here.
@api_view(['POST'])
def rating(request):
    if request.method == 'POST':
        """
        Request POST for raiting
        """

        data = request.data  # Save data request in json data
        data["client"] = 1  # Add a Client default

        serializer = RatingSerializer(data=data)  # Call method that serialize the data

        if serializer.is_valid():
            serializer.save()  # Save data if is valid

            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return 201 if create a client app

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
