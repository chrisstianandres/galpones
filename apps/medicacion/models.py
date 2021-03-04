from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.distribucion.models import Distribucion
from apps.medicina.models import Medicina


class Medicacion(models.Model):
    distribucion = models.ForeignKey(Distribucion, on_delete=models.PROTECT)
    medicina = models.ForeignKey(Medicina, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    dosis = models.IntegerField(default=1)

    def __str__(self):
        return '{} / {}' .format(self.distribucion, self.medicina)

    def toJSON(self):
        item = model_to_dict(self)
        item['distribucion'] = self.distribucion.toJSON()
        item['medicina'] = self.medicina.toJSON()
        item['fecha'] = self.fecha.strftime('%Y/%m/%d')
        return item

    class Meta:
        db_table = 'medicacion'
        verbose_name = 'medicacion'
        verbose_name_plural = 'medicaciones'
        ordering = ['-id', '-distribucion', 'medicina']