from django.db import models
from django.forms import model_to_dict

from apps.ubicacion.models import Parroquia


class Empresa(models.Model):
    nombre = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=25)
    ruc = models.CharField(max_length=13, unique=True)
    direccion = models.CharField(max_length=25)
    telefono = models.CharField(max_length=10, unique=True)
    correo = models.CharField(max_length=50, null=True, blank=True, unique=True)
    iva = models.IntegerField(default=12, blank=True, null=True)
    tasa = models.IntegerField(default=16, blank=True, null=True)
    indice = models.IntegerField(default=12, blank=True, null=True)
    ubicacion = models.ForeignKey(Parroquia, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return '%s %s' % (self.nombre, self.ruc)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'empresa'
        verbose_name = 'empresa'
        verbose_name_plural = 'empresas'
        ordering = ['-nombre', '-ruc', '-direccion']
