import json

from django.db.models import Sum
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.compra.models import Detalle_compra
from apps.distribucion.models import Distribucion
from apps.insumo.models import Insumo
from apps.medicacion.forms import MedicacionForm
from apps.medicacion.models import Medicacion
from apps.medicina.models import Medicina
from apps.mixins import ValidatePermissionRequiredMixin
from apps.mortalidad.forms import MortalidadForm
from apps.mortalidad.models import Mortalidad

opc_icono = 'fas fa-book-dead'
opc_entidad = 'Medicacion'
crud = '/medicacion/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Mortalidad
    template_name = 'front-end/categoria/list.html'
    permission_required = 'mortalidad.view_mortalidad'

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
                query = Detalle_compra.objects.values('insumo__nombre', 'insumo_id')\
                    .annotate(stock=Sum('stock_actual')).order_by('stock')\
                    .filter(insumo__nombre__icontains=term, stock_actual__gt=0, insumo__tipo_insumo=1)
                for c in query:
                    data.append({'id': c['insumo_id'], 'text': str(c['insumo__nombre']) + ' / '+'stock: ' + str(c['stock'])})
            elif action == 'get':
                data = []
                id = request.POST['id']
                query = Detalle_compra.objects.filter(insumo_id=id).aggregate(Sum('stock_actual'))
                data.append(query)
            # elif action == 'list_list':
            #     data = []
            #     ids = json.loads(request.POST['ids'])
            #     query = Detalle_compra.objects.filter(stock_actual__gt=0)
            #     for c in query.exclude(id__in=ids):
            #         data.append(c.toJSON())
            # else:
            #     data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar'
        data['titulo'] = 'Listado de Categorias'
        data['nuevo'] = '/categoria/nuevo'
        data['titulo_lista'] = 'Listado de Categorias'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        # data['form'] = CategoriaForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = MedicacionForm
    model_class = Medicacion

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
                med.medicina_id = int(datos['medicina'])
                medc = Medicina.objects.get(id=int(datos['medicina']))
                dosis = int(datos['dosis'])
                for a in Detalle_compra.objects.filter(insumo_id=medc.insumo_id, stock_actual__gt=0):
                    if dosis <= a.stock_actual:
                        med.dosis = dosis
                        a.stock_actual -= dosis
                        a.save()
                        break
                    else:
                        cal = dosis - a.stock_actual
                        med.dosis = cal
                        a.stock_actual -= dosis
                        a.save()
                med.save()
                data['resp'] = True
            elif action == 'edit':
                pk = request.POST['id']
                mort = self.model_class.objects.get(pk=int(pk))
                dist = Distribucion.objects.get(id=int(datos['distribucion_id']))
                dist.cantidad_pollos += mort.cantidad_muertes
                mort.cantidad_muertes = int(datos['cantidad_muertes'])
                mort.descrpcion = datos['descrpcion']
                mort.causa_id = datos['causa']
                mort.fecha = datos['fecha']
                mort.save()
                dist.cantidad_pollos -= int(datos['cantidad_muertes'])
                dist.save()
                data['resp'] = True
            elif action == 'delete':
                pk = request.POST['id']
                dist = Distribucion.objects.get(id=int(datos['distribucion_id']))
                mort = self.model_class.objects.get(pk=int(pk))
                dist.cantidad_pollos += mort.cantidad_muertes
                dist.save()
                cat = self.model_class.objects.get(pk=pk)
                cat.delete()
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
