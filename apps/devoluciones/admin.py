from django.contrib import admin

from apps.devoluciones.models import Devolucion_compra, Devolucion_venta

admin.site.register(Devolucion_compra)
admin.site.register(Devolucion_venta)
