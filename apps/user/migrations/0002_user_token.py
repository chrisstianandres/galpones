# Generated by Django 3.1.7 on 2021-06-03 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='token',
            field=models.UUIDField(blank=True, editable=False, null=True),
        ),
    ]