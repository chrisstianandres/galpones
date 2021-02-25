from django.db import models
from django.forms import model_to_dict

from apps.tipo_medicina.models import Tipo_medicina


class Medicina(models.Model):
    tipo_medicina = models.ForeignKey(Tipo_medicina, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=100)
    precio = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}/{}' .format(self.nombre, self.tipo_medicina)

    def toJSON(self):
        item = model_to_dict(self)
        item['tipo_medicina'] = self.tipo_medicina.toJSON()
        item['precio'] = format(self.precio, '.2f')
        return item

    class Meta:
        db_table = 'medicina'
        verbose_name = 'medicina'
        verbose_name_plural = 'medicinas'
        ordering = ['-id', '-nombre']