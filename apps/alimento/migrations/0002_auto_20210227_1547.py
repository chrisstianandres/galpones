# Generated by Django 3.1.7 on 2021-02-27 20:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alimento', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='alimento',
            options={'ordering': ['-id'], 'verbose_name': 'alimento', 'verbose_name_plural': 'alimentos'},
        ),
        migrations.RemoveField(
            model_name='alimento',
            name='nombre',
        ),
    ]