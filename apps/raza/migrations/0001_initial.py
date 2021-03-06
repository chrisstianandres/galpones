# Generated by Django 3.1.7 on 2021-03-06 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Raza',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=25)),
            ],
            options={
                'verbose_name': 'raza',
                'verbose_name_plural': 'razas',
                'db_table': 'raza',
                'ordering': ['-id', '-nombre'],
            },
        ),
    ]
