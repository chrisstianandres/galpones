# Generated by Django 3.1.7 on 2021-03-02 00:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lote', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lote',
            name='estado',
            field=models.IntegerField(choices=[(1, 'CERRADO'), (0, 'EN PRODUCCION')], default=0),
        ),
    ]
