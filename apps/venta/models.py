from datetime import datetime

from django.db import models
from django.forms import model_to_dict

from apps.cliente.models import Cliente
from apps.inventario.models import Inventario
from apps.empresa.models import Empresa

estado = (
    (0, 'DEVUELTA'),
    (1, 'FINALIZADA'),
    (2, 'RESERVADA')
)
tipo_pago = (
    (0, 'CONTADO'),
    (1, 'CREDITO')
)

tipo_venta = (
    (0, 'FISICA'),
    (1, 'ONLINE')
)


class Venta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    fecha = models.DateField(default=datetime.now)
    subtotal = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    iva = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    estado = models.IntegerField(choices=estado, default=1)
    tipo_pago = models.IntegerField(choices=tipo_pago, default=0)
    tipo_venta = models.IntegerField(choices=tipo_venta, default=0)

    def __str__(self):
        return '%s %s %s' % (self.cliente.nombres, self.fecha, self.total)

    def toJSON(self):
        item = model_to_dict(self)
        item['estado'] = self.get_estado_display()
        item['tipo_pago'] = self.get_tipo_pago_display()
        item['cliente'] = self.cliente.toJSON()
        return item

    class Meta:
        db_table = 'venta'
        verbose_name = 'venta'
        verbose_name_plural = 'ventas'
#


class Detalle_venta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.PROTECT)
    inventario = models.ForeignKey(Inventario, on_delete=models.PROTECT)
    pvp_actual = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)
    cantidad = models.IntegerField(default=0)
    subtotal = models.DecimalField(default=0.00, max_digits=9, decimal_places=2)

    def __str__(self):
        return '%s' % self.venta

    def toJSON(self):
        empresa = Empresa.objects.first()
        item = model_to_dict(self)
        item['venta'] = self.venta.toJSON()
        item['producto'] = self.inventario.toJSON()
        return item

    class Meta:
        db_table = 'detalle_venta'
        verbose_name = 'detalle_venta'
        verbose_name_plural = 'detalles_ventas'
