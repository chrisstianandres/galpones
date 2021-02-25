from django.db import models
from django.forms import model_to_dict

from apps.compra.models import Compra


ESTADO = (
    (1, 'En stock'),
    (0, 'Vendido')
)


class Inventario(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.PROTECT)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    estado = models.IntegerField(choices=ESTADO, default=1)

    def __str__(self):
        return '%s' % self.producto.producto_base.nombre

    def toJSON(self):
        item = model_to_dict(self)
        item['compra'] = self.compra.toJSON()
        item['producto'] = self.producto.toJSON()
        return item

    class Meta:
        db_table = 'inventario'
        verbose_name = 'inventario'
        verbose_name_plural = 'inventario'
        ordering = ['id']