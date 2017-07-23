# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('page', models.CharField(null=True, max_length=100)),
                ('entity_id', models.CharField(null=True, max_length=50)),
                ('entity_type', models.CharField(null=True, max_length=50)),
                ('score', models.IntegerField()),
                ('meta', models.CharField(null=True, max_length=50)),
            ],
        ),
    ]
