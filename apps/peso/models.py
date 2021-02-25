from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.distribucion.models import Distribucion


class Peso(models.Model):
    distribucion = models.ForeignKey(Distribucion, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    peso_promedio = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}/{}/{}'.format(self.distribucion, self.fecha, self.peso_promedio)

    def toJSON(self):
        item = model_to_dict(self)
        item['distribucion'] = self.distribucion.toJSON()
        item['fecha'] = self.fecha.strftime('%Y/%m/%d')
        item['peso_promedio'] = format(self.peso_promedio, '.2f')
        return item

    class Meta:
        db_table = 'peso'
        verbose_name = 'peso'
        verbose_name_plural = 'pesos'
        ordering = ['-id', '-distribucion']