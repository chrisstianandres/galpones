# Generated by Django 3.1.7 on 2021-02-24 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicina', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicina',
            name='precio',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=9),
        ),
    ]
