
from django.db import models
from django.forms import model_to_dict


class Provincia(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return '{}'.format(self.nombre)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'provincia'
        verbose_name = 'provincia'
        verbose_name_plural = 'provincias'
        ordering = ['-nombre']


class Canton(models.Model):
    provincia = models.ForeignKey(Provincia, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return '{}'.format(self.nombre)

    def toJSON(self):
        item = model_to_dict(self)
        item['provincia'] = self.provincia.toJSON()
        return item

    class Meta:
        db_table = 'canton'
        verbose_name = 'canton'
        verbose_name_plural = 'cantones'
        ordering = ['-nombre']


class Parroquia(models.Model):
    canton = models.ForeignKey(Canton, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=150)

    def __str__(self):
        return '{} / {} / {}'.format(self.canton.provincia.nombre, self.canton.nombre, self.nombre)

    def toJSON(self):
        item = model_to_dict(self)
        item['canton'] = self.canton.toJSON()
        return item

    class Meta:
        db_table = 'parroquia'
        verbose_name = 'parroquia'
        verbose_name_plural = 'parroquias'
        ordering = ['-nombre']

