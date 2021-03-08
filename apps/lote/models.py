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
    stock_produccion = models.IntegerField(default=0)
    stock_actual = models.IntegerField(default=0)
    estado = models.IntegerField(choices=ESTADO, default=0)
    fecha = models.DateField(default=datetime.now)
    valor_pollito = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    total_gastos = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}'.format(self.fecha.strftime('%d/%m/%Y'))

    def get_costo_ave(self):
        if self.estado == 0:
            cal = 0
        else:
            cal = (float(self.total_gastos) / int(self.stock_produccion))
        return cal

    def costo_libra(self):
        if self.estado == 0:
            data = 1
        else:
            data = (self.get_costo_ave() / self.stock_produccion)
        return data


    def toJSON(self):
        item = model_to_dict(self)
        item['raza'] = self.raza.toJSON()
        item['fecha'] = self.fecha.strftime('%d/%m/%Y')
        item['valor_pollito'] = format(self.valor_pollito, '.2f')
        item['estado_text'] = self.get_estado_display()
        item['costo_ave'] = format(self.get_costo_ave(), '.2f')
        item['costo_libra'] = format(self.costo_libra(), '.2f')
        return item

    class Meta:
        db_table = 'lote'
        verbose_name = 'lote'
        verbose_name_plural = 'lotes'
        ordering = ['-id', '-fecha']