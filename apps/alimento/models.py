from django.db import models
from django.forms import model_to_dict


class Alimento(models.Model):
    nombre = models.CharField(max_length=25)

    def __str__(self):
        return '%s' % self.nombre

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'alimento'
        verbose_name = 'alimento'
        verbose_name_plural = 'alimentos'
        ordering = ['-id', '-nombre']