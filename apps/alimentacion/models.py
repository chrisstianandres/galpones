from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.alimento.models import Alimento
from apps.distribucion.models import Distribucion


class Alimentacion(models.Model):
    distribucion = models.ForeignKey(Distribucion, on_delete=models.PROTECT, null=True, blank=True)
    alimento = models.ForeignKey(Alimento, on_delete=models.PROTECT, null=True, blank=True)
    fecha = models.DateField(default=datetime.now)
    cantidad = models.IntegerField(default=1, blank=True, null=True)

    def __str__(self):
        return '{}/{}/{}'.format(self.distribucion, self.alimento, self.cantidad)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'alimentacion'
        verbose_name = 'alimentacion'
        verbose_name_plural = 'alimentaciones'
        ordering = ['-id', '-distribucion', '-alimento', 'cantidad']
