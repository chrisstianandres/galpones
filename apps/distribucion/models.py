from django.db import models
from django.forms import model_to_dict

from apps.galpon.models import Galpon
from apps.lote.models import Lote


class Distribucion(models.Model):
    lote = models.ForeignKey(Lote, on_delete=models.PROTECT, null=True, blank=True)
    galpon = models.ForeignKey(Galpon, on_delete=models.PROTECT, null=True, blank=True)
    cantidad_pollos = models.IntegerField(default=1, blank=True, null=True)

    def __str__(self):
        return '{}{}' .format(self.lote, self.galpon)

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
