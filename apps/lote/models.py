from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.raza.models import Raza

ESTADO = (
    (1, 'CERRADO'),
    (0, 'EN PRODUCCION'),
)


class Lote(models.Model):
    raza = models.ForeignKey(Raza, on_delete=models.PROTECT)
    cantidad = models.IntegerField(default=0)
    estado = models.IntegerField(choices=ESTADO, default=0)
    fecha = models.DateField(default=datetime.now)
    valor_pollito = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}'.format(self.fecha.strftime('%d/%m/%Y'))

    def toJSON(self):
        item = model_to_dict(self)
        item['raza'] = self.raza.toJSON()
        item['fecha'] = self.fecha.strftime('%d/%m/%Y')
        item['valor_pollito'] = format(self.valor_pollito, '.2f')
        return item

    class Meta:
        db_table = 'lote'
        verbose_name = 'lote'
        verbose_name_plural = 'lotes'
        ordering = ['-id', '-fecha']