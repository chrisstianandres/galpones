from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.alimento.models import Alimento


class ProvisionAlimento(models.Model):
    alimento = models.ForeignKey(Alimento, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    valor_unitario = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    cantidad = models.IntegerField(default=1)

    def __str__(self):
        return '%s' % self.fecha

    def toJSON(self):
        item = model_to_dict(self)
        item['fecha'] = self.fecha.strftime('%d/%m/%Y')
        item['alimento'] = self.alimento.toJSON()
        item['valor_unitario'] = format(self.valor_unitario, '.2f')
        return item

    class Meta:
        db_table = 'provision_alimento'
        verbose_name = 'provision_alimento'
        verbose_name_plural = 'provision_alimentos'
        ordering = ['-id', '-nombre', '-fecha']