# Generated by Django 3.1.7 on 2021-02-23 17:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('empleado', '0002_empleado_empresa'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='empleado',
            name='empresa',
        ),
    ]