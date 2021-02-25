from django.contrib import admin
from .models import *


class CompraAdmin(admin.TabularInline):
    model = Detalle_compra


class Detalle_compraAdmin(admin.ModelAdmin):
    inlines = (CompraAdmin,)


admin.site.register(Compra, Detalle_compraAdmin)
