import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.distribucion.forms import DistribucionForm
from apps.distribucion.models import Distribucion
from apps.galpon.forms import GalponForm
from apps.galpon.models import Galpon
from apps.medicina.models import Medicina
from apps.mixins import ValidatePermissionRequiredMixin
from apps.mortalidad.forms import MortalidadForm
from apps.peso.forms import PesoForm
from apps.peso.models import Peso

opc_icono = 'fas fa-crow'
opc_entidad = 'Control de Produccion'
crud = '/distribucion/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Distribucion
    template_name = 'front-end/distribucion/list.html'
    permission_required = 'distribucion.view_distribucion'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Galpon.objects.all():
                    data.append(c.toJSON())
            elif action == 'search_galpon':
                data = []
                term = request.POST['term']
                query = Distribucion.objects.filter(galpon_id=int(term), lote__estado=0)
                for a in query:
                    data.append({'id': a.id, 'text': str('Galpon N°: ' + str(a.galpon_id))})
            elif action == 'get_data':
                data = []
                peso_data = []
                gastos_data = []
                mortalidad_data = []
                alimento_data = []
                medicina_data = []
                id = request.POST['id']
                query = Distribucion.objects.get(id=id, lote__estado=0)
                lote_data = [query.toJSON()]
                for p in query.peso_set.all():
                    peso_data.append(p.toJSON())
                for g in query.gasto_set.all():
                    gastos_data.append(g.toJSON())
                for m in query.mortalidad_set.all():
                    mortalidad_data.append(m.toJSON())
                for a in query.alimentacion_set.all():
                    alimento_data.append(a.toJSON())
                for med in query.medicacion_set.all():
                    medicina_data.append(med.toJSON())
                data.append({
                    'peso': peso_data,
                    'lote_data': lote_data,
                    'gastos': gastos_data,
                    'mortalidad': mortalidad_data,
                    'alimentacion': alimento_data,
                    'medicacion': medicina_data
                })


            elif action == 'list_list':
                data = []
                query = Distribucion.objects.filter(lote__estado=0)
                for a in query:
                    data.append(a.toJSON())
            # elif action == 'search':
            #     data = []
            #     term = request.POST['term']
            #     for c in Galpon.objects.filter(capacidad__range=term):
            #         data.append({'id': c.id, 'text': c.nombre})
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar'
        data['titulo'] = 'Control de Produccion'
        data['titulo_lista'] = 'Control de Produccion'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = DistribucionForm
        data['form_peso'] = PesoForm
        data['form_mortalidad'] = MortalidadForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = GalponForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = GalponForm(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = Galpon.objects.get(pk=int(pk))
                f = GalponForm(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                pk = request.POST['id']
                cat = Galpon.objects.get(pk=pk)
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
            data['galpon'] = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
