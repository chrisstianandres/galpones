from django.db import models
from django.forms import model_to_dict

from apps.galpon.models import Galpon
from apps.lote.models import Lote


class Distribucion(models.Model):
    lote = models.ForeignKey(Lote, on_delete=models.PROTECT, null=True, blank=True)
    galpon = models.ForeignKey(Galpon, on_delete=models.PROTECT, null=True, blank=True)
    cantidad_pollos = models.IntegerField(default=1, blank=True, null=True)
    stock_actual = models.IntegerField(default=1)
    total_gastos = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    peso_promedio = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '{}{}' .format(self.lote, self.galpon)

    def get_costo_libra(self):
        cal = (float(self.total_gastos) / int(self.cantidad_pollos)) / float(self.peso_promedio)
        return cal

    def toJSON(self):
        item = model_to_dict(self)
        item['lote'] = self.lote.toJSON()
        item['galpon'] = self.galpon.toJSON()
        return item

    class Meta:
        db_table = 'distribucion'
        verbose_name = 'distribucion'
        verbose_name_plural = 'distribuciones'
        ordering = ['-lote', '-galpon', 'cantidad_pollos']
