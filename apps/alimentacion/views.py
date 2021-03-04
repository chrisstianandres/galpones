import json

from django.db.models import Sum
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.alimentacion.forms import AlimentacionForm
from apps.alimentacion.models import Alimentacion
from apps.alimento.models import Alimento
from apps.backEnd import nombre_empresa
from apps.compra.models import Detalle_compra
from apps.insumo.models import Insumo
from apps.mixins import ValidatePermissionRequiredMixin

opc_icono = 'fas fa-book-dead'
opc_entidad = 'Alimetacion'
crud = '/alimentacion/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Alimentacion
    template_name = 'front-end/categoria/list.html'
    permission_required = 'alimentacion.view_alimentacion'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in self.model.objects.all():
                    data.append(c.toJSON())
            elif action == 'search':
                data = []
                term = request.POST['term']
                ids = request.POST['ids']
                query = Detalle_compra.objects.values('insumo__nombre', 'insumo_id')\
                    .annotate(stock=Sum('stock_actual')).order_by('stock')\
                    .filter(insumo__nombre__icontains=term, stock_actual__gt=0, insumo__tipo_insumo=0)
                for c in query.exclude(insumo_id=ids):
                    data.append({'id': c['insumo_id'], 'text': str(c['insumo__nombre']) + ' / '+'stock: ' + str(c['stock'])})
            elif action == 'get':
                data = []
                id = request.POST['id']
                query = Detalle_compra.objects.filter(insumo_id=id).aggregate(Sum('stock_actual'))
                data.append(query)
            elif action == 'list_list':
                data = []
                ids = request.POST['ids']
                query = Detalle_compra.objects.values('insumo_id').annotate(stock=Sum('stock_actual'))\
                    .order_by('stock').filter(stock_actual__gt=0, insumo__tipo_insumo=0)
                for c in query.exclude(insumo_id=ids):
                    ins = Alimento.objects.get(insumo_id=c['insumo_id'])
                    item = ins.toJSON()
                    item['stock'] = c['stock']
                    data.append(item)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = AlimentacionForm
    model_class = Alimentacion

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        datos = request.POST
        try:
            if action == 'add':
                med = self.model_class()
                med.distribucion_id = int(datos['distribucion_id'])
                ins = Insumo.objects.get(id=datos['insumo'])
                tkmed = Alimento.objects.get(insumo_id=ins.id)
                med.alimento_id = tkmed.id
                cantidad = int(datos['cantidad'])
                for a in Detalle_compra.objects.filter(insumo_id=tkmed.insumo_id, stock_actual__gt=0):
                    if cantidad <= a.stock_actual:
                        med.dosis = cantidad
                        a.stock_actual -= cantidad
                        a.save()
                        break
                    else:
                        cal = cantidad - a.stock_actual
                        med.dosis = cal
                        a.stock_actual -= cantidad
                        a.save()
                med.save()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def save_data(self, f):
        data = {}
        if f.is_valid():
            var = f.save()
            data = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
