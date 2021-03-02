from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.distribucion.models import Distribucion
from apps.empresa.models import Empresa
from apps.tipo_gasto.models import Tipo_gasto


class Gasto(models.Model):
    distribucion = models.ForeignKey(Distribucion, on_delete=models.PROTECT, null=True)
    tipo_gasto = models.ForeignKey(Tipo_gasto, on_delete=models.PROTECT)
    fecha_pago = models.DateField(default=datetime.now)
    valor = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    detalle = models.CharField(max_length=50)

    def __str__(self):
        return '%s' % self.tipo_gasto.nombre

    def toJSON(self):
        item = model_to_dict(self)
        item['distribucion'] = self.distribucion.toJSON()
        item['fecha_pago'] = self.fecha_pago.strftime('%Y/%m/%d')
        item['tipo_gasto'] = self.tipo_gasto.toJSON()
        item['valor'] = format(self.valor, '.2f')
        return item

    class Meta:
        db_table = 'gasto'
        verbose_name = 'gasto'
        verbose_name_plural = 'gastos'
        ordering = ['-id', '-tipo_gasto', '-valor']