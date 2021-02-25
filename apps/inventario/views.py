import json

from django.db import transaction
from django.db.models import Q, Max
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView

from apps.backEnd import nombre_empresa
from apps.inventario.models import Inventario

from apps.mixins import ValidatePermissionRequiredMixin
from apps.producto.models import Producto

opc_icono = 'fas fa-warehouse'
opc_entidad = 'Inventario'
crud = '/inventario/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Inventario
    template_name = 'front-end/inventario/list.html'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Inventario.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                start_date = request.POST.get('start_date', '')
                end_date = request.POST.get('end_date', '')
                venta = ''
                estado = ''
                if start_date == '' and end_date == '':
                    compra = Inventario.objects.all()
                else:
                    compra = Inventario.objects.filter(Q(compra__fecha_compra__range=[start_date, end_date]) |
                                                       Q(venta__fecha_venta__range=[start_date, end_date]))
                for c in compra:
                    data.append([
                        c.id,
                        c.producto.nombre,
                        c.producto.categoria.nombre,
                        c.producto.presentacion.nombre,
                        estado
                    ])
            elif action == 'search':
                data = []
                query = Inventario.objects.values('producto_id', 'producto__producto_base__nombre').\
                    filter(estado=1).order_by().annotate(Max('producto__id'))
                for p in query:
                    result = {
                        'id': int(p['producto_id']),
                        'text': str(p['producto__producto_base__nombre'])
                    }
                    data.append(result)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['titulo'] = 'Reporte  de Inventario'
        data['empresa'] = empresa
        return data
