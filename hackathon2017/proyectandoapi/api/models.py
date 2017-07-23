from django.db import models
# Create your models here.
class Rating(models.Model):
    page = models.CharField(max_length=100, null=True)
    entity_id = models.CharField(max_length=50, null=True)
    entity_type = models.CharField(max_length=50, null=True)
    score = models.IntegerField(null=False)
    meta = models.CharField(max_length=50, null=True)
