from django.db import models
from django.forms import model_to_dict

from apps.ubicacion.models import Parroquia
from galpones.settings import MEDIA_URL


class Empresa(models.Model):
    nombre = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=25)
    ruc = models.CharField(max_length=13, unique=True)
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=10, unique=True)
    correo = models.CharField(max_length=50, null=True, blank=True, unique=True)
    iva = models.IntegerField(default=12, blank=True, null=True)
    tasa = models.IntegerField(default=16, blank=True, null=True)
    indice = models.IntegerField(default=12, blank=True, null=True)
    ubicacion = models.ForeignKey(Parroquia, on_delete=models.PROTECT, null=True, blank=True)
    foto = models.ImageField(upload_to='empresa/logo', blank=True, null=True)

    def __str__(self):
        return '%s %s' % (self.nombre, self.ruc)

    def get_canton(self):
        return '{}-{}-{}'.format(self.ubicacion.canton.provincia.nombre, self.ubicacion.canton.nombre, 'ECUADOR')

    def get_image(self):
        if self.foto:
            return '{}{}'.format(MEDIA_URL, self.foto)
        else:
            return '{}{}'.format(MEDIA_URL, 'empresa/nofoto.png')

    def toJSON(self):
        item = model_to_dict(self)
        # item['foto'] = self.get_image()
        return item

    class Meta:
        db_table = 'empresa'
        verbose_name = 'empresa'
        verbose_name_plural = 'empresas'
        ordering = ['-nombre', '-ruc', '-direccion']


class Portadas(models.Model):
    avatar = models.ImageField(upload_to='portadas', blank=True, null=True)

    def toJSON(self):
        item = model_to_dict(self)
        item['avatar'] = self.get_image()
        return item

    def get_image(self):
        if self.avatar:
            return '{}{}'.format(MEDIA_URL, self.avatar)
        else:
            return '{}{}'.format(MEDIA_URL, 'user/user_women.png')
    class Meta:
        db_table = 'portadas'
        verbose_name = 'portadas'
        verbose_name_plural = 'portadas'
