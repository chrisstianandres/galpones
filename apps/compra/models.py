from datetime import datetime
from django.db import models
from django.forms import model_to_dict

from apps.insumo.models import Insumo
from apps.user.models import User
from apps.presentacion.models import Presentacion
from apps.proveedor.models import Proveedor
from galpones.settings import MEDIA_URL

estado = (
    (0, 'DEVUELTA'),
    (1, 'FINALIZADA')
)


class Compra(models.Model):
    fecha_compra = models.DateField(default=datetime.now)
    comprobante = models.TextField(null=True, blank=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    subtotal = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    tasa_iva = models.DecimalField(default=0.12, max_digits=9, decimal_places=2)
    iva = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    estado = models.IntegerField(choices=estado, default=1)
    jpg = models.ImageField(upload_to='comprobante/%Y/%m/%d', blank=True, null=True)

    def __str__(self):
        return '%s %s' % (self.fecha_compra, self.proveedor.nombre)

    def get_jpg(self):
        if self.jpg:
            return '{}{}'.format(MEDIA_URL, self.jpg)
        else:
            return '{}{}'.format(MEDIA_URL, 'comprobante/no_imagen.png')

    def toJSON(self):
        item = model_to_dict(self)
        item['proveedor'] = self.proveedor.toJSON()
        item['user'] = self.user.username
        item['estado_text'] = self.get_estado_display()
        item['subtotal'] = format(self.subtotal, '.2f')
        item['iva'] = format(self.iva, '.2f')
        item['total'] = format(self.total, '.2f')
        item['jpg'] = self.get_jpg()
        return item

    class Meta:
        db_table = 'compra'
        verbose_name = 'compra'
        verbose_name_plural = 'compras'
        ordering = ['-id', 'proveedor']


class Detalle_compra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.PROTECT)
    insumo = models.ForeignKey(Insumo, on_delete=models.PROTECT)
    p_compra = models.DecimalField(default=0.00, max_digits=9, decimal_places=2, blank=True, null=True)
    cantidad = models.IntegerField(default=1)
    stock_inicial = models.IntegerField(default=1)
    stock_actual = models.IntegerField(default=1)
    subtotal = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '%s %s' % (self.compra, self.insumo.nombre)

    def toJSON(self):
        item = model_to_dict(self)
        item['compra'] = self.compra.toJSON()
        item['insumo'] = self.insumo.toJSON()
        return item

    class Meta:
        db_table = 'detalle_compra'
        verbose_name = 'detalle_compra'
        verbose_name_plural = 'detalles_compras'
        ordering = ['id', 'compra']