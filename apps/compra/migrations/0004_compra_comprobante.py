# Generated by Django 3.1.7 on 2021-03-01 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('compra', '0003_compra_tasa_iva'),
    ]

    operations = [
        migrations.AddField(
            model_name='compra',
            name='comprobante',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]