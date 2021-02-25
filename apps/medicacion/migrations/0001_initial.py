# Generated by Django 3.1.7 on 2021-02-23 16:54

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('medicina', '0001_initial'),
        ('distribucion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Medicacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(default=datetime.datetime.now)),
                ('dosis', models.IntegerField(default=1)),
                ('distribucion', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='distribucion.distribucion')),
                ('medicina', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='medicina.medicina')),
            ],
            options={
                'verbose_name': 'medicacion',
                'verbose_name_plural': 'medicaciones',
                'db_table': 'medicacion',
                'ordering': ['-id', '-distribucion', 'medicina'],
            },
        ),
    ]