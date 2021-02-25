from django.db import models
from django.forms import model_to_dict

ESTADO = (
    (1, 'LABORANDO'),
    (0, 'DISPONIBLE'),
)


class Galpon(models.Model):
    capacidad = models.IntegerField(default=1)
    estado = models.IntegerField(choices=ESTADO, default=0)

    def __str__(self):
        return '{}/{}'.format(self.capacidad, self.get_estado_display())

    def toJSON(self):
        item = model_to_dict(self)
        item['estado_text'] = self.get_estado_display()
        item['capacidad'] = int(self.capacidad)
        return item

    class Meta:
        db_table = 'galpon'
        verbose_name = 'galpon'
        verbose_name_plural = 'galpones'
        ordering = ['-id', '-capacidad']