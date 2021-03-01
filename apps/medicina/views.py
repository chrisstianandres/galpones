import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.categoria.forms import CategoriaForm
from apps.insumo.forms import InsumoForm
from apps.insumo.models import Insumo
from apps.medicina.forms import MedicinaForm, TipomedicinaForm
from apps.medicina.models import Medicina
from apps.mixins import ValidatePermissionRequiredMixin

opc_icono = 'fas fa-capsules'
opc_entidad = 'Medicinas'
crud = '/medicina/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Medicina
    template_name = 'front-end/medicina/list.html'
    permission_required = 'medicina.view_medicina'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Medicina.objects.all():
                    data.append(c.toJSON())
            elif action == 'list_list':
                data = []
                ids = json.loads(request.POST['ids'])
                query = Medicina.objects.all()
                for c in query.exclude(id__in=ids):
                    data.append(c.toJSON())
            elif action == 'search':
                data = []
                ids = json.loads(request.POST['ids'])
                term = request.POST['term']
                query = Medicina.objects.filter(insumo__nombre__icontains=term, insumo__tipo_insumo=1)
                for c in query.exclude(id__in=ids)[0:10]:
                    data.append({'id': c.id, 'text': str(c.insumo.nombre + ' / ' + c.insumo.descripcion)})
            elif action == 'get':
                data = []
                id = request.POST['id']
                for c in Medicina.objects.filter(id=id):
                    data.append(c.toJSON())
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
        data['titulo'] = 'Medicinas'
        data['nuevo'] = '/medicina/nuevo'
        data['titulo_lista'] = 'Listado de medicinas'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        if 'form' not in data:
            data['form'] = MedicinaForm()
        if 'formi' not in data:
            data['formi'] = InsumoForm()
        if 'formp' not in data:
            data['formp'] = TipomedicinaForm()
        if 'formc' not in data:
            data['formc'] = CategoriaForm()
        data['titulo_modal_tipo'] = 'Agregar un tipo de medicina'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = MedicinaForm
    second_form_class = InsumoForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = self.form_class(request.POST)
                f2 = self.second_form_class(request.POST)
                data = self.save_data(f, f2)
            elif action == 'edit':
                pk = request.POST['id']
                med = Medicina.objects.get(pk=int(pk))
                ins = Insumo.objects.get(pk=int(med.insumo_id))
                f = MedicinaForm(request.POST, instance=med)
                f2 = InsumoForm(request.POST, instance=ins)
                data = self.save_data(f, f2)
            elif action == 'delete':
                pk = request.POST['id']
                cat = Medicina.objects.get(pk=pk)
                cat.delete()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def save_data(self, f, f2):
        data = {}
        if f.is_valid() and f2.is_valid():
            insumo = f2.save(commit=False)
            insumo.tipo_insumo = 1
            medicina = f.save(commit=False)
            medicina.insumo = f2.save()
            medicina.save()
            data['medicina'] = medicina.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
