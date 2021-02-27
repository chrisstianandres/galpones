from django.db import models
from django.forms import model_to_dict

from apps.categoria.models import Categoria

tipo_insumo = (
    (0, 'Alimento'),
    (1, 'Medicina'),
)


class Insumo(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)
    tipo_insumo = models.IntegerField(choices=tipo_insumo, default=0)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=50)

    def __str__(self):
        return '%s' % self.nombre

    def toJSON(self):
        item = model_to_dict(self)
        item['categoria'] = self.categoria.toJSON()
        item['tipo_insumo'] = self.get_tipo_insumo_display()
        return item

    class Meta:
        db_table = 'insumo'
        verbose_name = 'insumo'
        verbose_name_plural = 'insumos'
        ordering = ['-id', '-nombre', '-categoria']