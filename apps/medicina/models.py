from django.db import models
from django.forms import model_to_dict

from apps.insumo.models import Insumo
from apps.tipo_medicina.models import Tipo_medicina


class Medicina(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.PROTECT, null=True)
    tipo_medicina = models.ForeignKey(Tipo_medicina, on_delete=models.PROTECT)

    def __str__(self):
        return '{}/{}' .format(self.insumo.nombre, self.tipo_medicina)

    def toJSON(self):
        item = model_to_dict(self)
        item['insumo'] = self.insumo.toJSON()
        item['tipo_medicina'] = self.tipo_medicina.toJSON()
        item['precio'] = 1.00
        item['cantidad'] = 1
        item['subtotal'] = 1.00
        return item

    class Meta:
        db_table = 'medicina'
        verbose_name = 'medicina'
        verbose_name_plural = 'medicinas'
        ordering = ['-id']