# Generated by Django 3.1.5 on 2021-02-06 19:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('tipo', models.IntegerField(choices=[(0, 'CEDULA'), (1, 'RUC')], default=0)),
                ('num_doc', models.CharField(max_length=13, unique=True)),
                ('correo', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('telefono', models.CharField(max_length=10, unique=True)),
                ('direccion', models.CharField(max_length=50)),
                ('fecha', models.DateField(default=datetime.datetime.now)),
            ],
            options={
                'verbose_name': 'proveedor',
                'verbose_name_plural': 'proveedores',
                'db_table': 'proveedor',
                'ordering': ['-nombre', '-num_doc', '-direccion'],
            },
        ),
    ]