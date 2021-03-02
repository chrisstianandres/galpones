from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.causa_muerte.models import Causa_muerte
from apps.distribucion.models import Distribucion


class Mortalidad(models.Model):
    distribucion = models.ForeignKey(Distribucion, on_delete=models.PROTECT)
    causa = models.ForeignKey(Causa_muerte, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    cantidad_muertes = models.IntegerField(default=1)
    descrpcion = models.CharField(max_length=100)

    def __str__(self):
        return '{}/{}' .format(self.distribucion, self.causa)

    def toJSON(self):
        item = model_to_dict(self)
        item['causa'] = self.causa.toJSON()
        return item

    class Meta:
        db_table = 'mortalidad'
        verbose_name = 'mortalidad'
        verbose_name_plural = 'mortalidades'
        ordering = ['-id', '-distribucion', 'causa']