from django.db import models


# Este modelo es utilizado para guardar el rating de cada entidad
class Rating(models.Model):
    page = models.CharField(max_length=100, null=True)
    entity_id = models.CharField(max_length=50, null=True)
    entity_type = models.CharField(max_length=50, null=True)
    score = models.IntegerField(null=False)
    meta = models.CharField(max_length=50, null=True)

# Este modelo almacena los comentarios de cada entidad
class Comment(models.Model):
    page = models.CharField(max_length=100, null=True)
    entity_id = models.CharField(max_length=50, null=True)
    entity_type = models.CharField(max_length=50, null=True)
    commented_at = models.DateTimeField(auto_now=True, null=False)
    text = models.CharField(max_length=50, null=True)
    meta = models.CharField(max_length=50, null=True)


class UUIDField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = kwargs.get('max_length', 64)
        kwargs['blank'] = True
        models.CharField.__init__(self, *args, **kwargs)

    def pre_save(self, model_instance, add):
        if add:
            value = str(uuid.uuid4())
            setattr(model_instance, self.attname, value)
            return value
        else:
            return super(models.CharField, self).pre_save(model_instance, add)

# Este modelos no es utilizado pero podria utilizarce en el futuro
class ClientApp(models.Model):
    app_name = models.CharField(max_length=100, unique=True, null=False)
    app_code = UUIDField(primary_key=True, editable=False)

# Este modelo almacena los eventos de cada entidad (view, download)
class Event(models.Model):
    page = models.CharField(max_length=100, null=True)
    entity_id = models.CharField(max_length=50, null=True)
    entity_type = models.CharField(max_length=50, null=True)
    event_type = models.CharField(max_length=50, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    counter = models.IntegerField(null=False, default=1)