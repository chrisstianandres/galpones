from django.db import models
from django.forms import model_to_dict

from apps.insumo.models import Insumo
from apps.presentacion.models import Presentacion


class Alimento(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.PROTECT, null=True)
    presentacion = models.ForeignKey(Presentacion, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return '{}/{}'.format(self.insumo.nombre, self.presentacion)

    def toJSON(self):
        item = model_to_dict(self)
        item['insumo'] = self.insumo.toJSON()
        item['presentacion'] = self.presentacion.toJSON()
        item['precio'] = 1.00
        item['cantidad'] = 1
        item['subtotal'] = 1.00
        return item

    class Meta:
        db_table = 'alimento'
        verbose_name = 'alimento'
        verbose_name_plural = 'alimentos'
        ordering = ['-id']