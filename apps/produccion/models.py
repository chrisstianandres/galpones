from django.db import models
from django.forms import model_to_dict

from apps.empleado.models import Empleado
from apps.lote.models import Lote


class Produccion(models.Model):
    lote = models.ForeignKey(Lote, on_delete=models.PROTECT)
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT)
    sueldo = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}'.format(self.lote.fecha)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'produccion'
        verbose_name = 'produccion'
        verbose_name_plural = 'producciones'
        ordering = ['-id', '-lote']