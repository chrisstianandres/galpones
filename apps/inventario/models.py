from django.db import models
from django.forms import model_to_dict

from apps.compra.models import Compra, Detalle_compra

ESTADO = (
    (1, 'En stock'),
    (0, 'Vendido')
)


class Inventario(models.Model):
    compra = models.ForeignKey(Detalle_compra, on_delete=models.PROTECT)
    estado = models.IntegerField(choices=ESTADO, default=1)

    def __str__(self):
        return '{}'.format(self.compra)

    def toJSON(self):
        item = model_to_dict(self)
        item['compra'] = self.compra.toJSON()
        return item

    class Meta:
        db_table = 'inventario'
        verbose_name = 'inventario'
        verbose_name_plural = 'inventario'
        ordering = ['id']