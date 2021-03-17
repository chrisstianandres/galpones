# Generated by Django 3.1.7 on 2021-03-13 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venta', '0002_auto_20210308_1035'),
    ]

    operations = [
        migrations.AddField(
            model_name='detalle_venta',
            name='peso',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=9),
        ),
        migrations.AddField(
            model_name='detalle_venta',
            name='valor_libra',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=9),
        ),
    ]
