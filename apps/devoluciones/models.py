from datetime import datetime
from django.db import models
from django.forms import model_to_dict

from apps.compra.models import Compra
from apps.venta.models import Venta


class Devolucion_compra(models.Model):
    fecha = models.DateField(default=datetime.now)
    compra = models.ForeignKey(Compra, on_delete=models.PROTECT)

    def __str__(self):
        return '%s %s' % (self.fecha, self.compra)

    def toJSON(self):
        item = model_to_dict(self)
        item['compra'] = self.compra.toJSON()
        return item

    class Meta:
        db_table = 'devolucion_compra'
        verbose_name = 'devolucion_compra'
        verbose_name_plural = 'devolucion_compras'
        ordering = ['-id', 'compra']


class Devolucion_venta(models.Model):
    fecha = models.DateField(default=datetime.now)
    venta = models.ForeignKey(Venta, on_delete=models.PROTECT)

    def __str__(self):
        return '%s %s' % (self.fecha, self.venta)

    def toJSON(self):
        item = model_to_dict(self)
        item['venta'] = self.venta.toJSON()
        return item

    class Meta:
        db_table = 'devolucion_venta'
        verbose_name = 'devolucion_venta'
        verbose_name_plural = 'devolucion_ventas'
        ordering = ['id', 'venta']