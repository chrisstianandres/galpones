# Generated by Django 3.1.7 on 2021-03-06 01:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categoria', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Insumo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_insumo', models.IntegerField(choices=[(0, 'Alimento'), (1, 'Medicina')], default=0)),
                ('nombre', models.CharField(max_length=50)),
                ('descripcion', models.CharField(max_length=50)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='categoria.categoria')),
            ],
            options={
                'verbose_name': 'insumo',
                'verbose_name_plural': 'insumos',
                'db_table': 'insumo',
                'ordering': ['-id', '-nombre', '-categoria'],
            },
        ),
    ]
