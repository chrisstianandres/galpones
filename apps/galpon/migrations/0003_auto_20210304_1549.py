# Generated by Django 3.1.7 on 2021-03-04 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('galpon', '0002_auto_20210224_1759'),
    ]

    operations = [
        migrations.AlterField(
            model_name='galpon',
            name='estado',
            field=models.IntegerField(choices=[(1, 'EN PRODUCCION'), (0, 'DISPONIBLE')], default=0),
        ),
    ]
