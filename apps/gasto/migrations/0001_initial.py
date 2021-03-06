# Generated by Django 3.1.7 on 2021-03-06 01:02

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('distribucion', '0001_initial'),
        ('tipo_gasto', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gasto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_pago', models.DateField(default=datetime.datetime.now)),
                ('valor', models.DecimalField(decimal_places=2, default=0.0, max_digits=9)),
                ('detalle', models.CharField(max_length=50)),
                ('distribucion', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='distribucion.distribucion')),
                ('tipo_gasto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='tipo_gasto.tipo_gasto')),
            ],
            options={
                'verbose_name': 'gasto',
                'verbose_name_plural': 'gastos',
                'db_table': 'gasto',
                'ordering': ['-id', '-tipo_gasto', '-valor'],
            },
        ),
    ]
