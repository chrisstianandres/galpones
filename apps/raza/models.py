from django.db import models
from django.forms import model_to_dict


class Raza(models.Model):
    nombre = models.CharField(max_length=25)

    def __str__(self):
        return '%s' % self.nombre

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'raza'
        verbose_name = 'raza'
        verbose_name_plural = 'razas'
        ordering = ['-id', '-nombre']