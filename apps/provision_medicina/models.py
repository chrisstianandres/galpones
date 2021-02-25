from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.medicina.models import Medicina


class Provision_medicina(models.Model):
    medicina = models.ForeignKey(Medicina, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    dosisProvision = models.IntegerField(default=1)
    costoProvision = models.IntegerField(default=1)

    def __str__(self):
        return '{}/{}'.format(self.medicina, self.fecha)

    def toJSON(self):
        item = model_to_dict(self)
        item['medicina'] = self.medicina.toJSON()
        item['fecha'] = self.fecha.strftime('%Y/%m/%d')
        return item

    class Meta:
        db_table = 'provision_medicina'
        verbose_name = 'provision_medicina'
        verbose_name_plural = 'provision_medicinas'
        ordering = ['-id', '-medicina']