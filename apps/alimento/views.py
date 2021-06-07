import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.alimento.forms import AlimentoForm
from apps.alimento.models import Alimento
from apps.backEnd import nombre_empresa
from apps.categoria.forms import CategoriaForm
from apps.categoria.models import Categoria
from apps.insumo.forms import InsumoForm
from apps.insumo.models import Insumo
from apps.mixins import ValidatePermissionRequiredMixin
from apps.presentacion.forms import PresentacionForm

opc_icono = 'fas fa-utensils'
opc_entidad = 'Alimentos'
crud = '/categoria/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Alimento
    template_name = 'front-end/alimento/list.html'
    permission_required = 'view_alimento'

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
            elif action == 'list_list':
                data = []
                ids = json.loads(request.POST['ids'])
                query = self.model.objects.all()
                for c in query.exclude(id__in=ids):
                    data.append(c.toJSON())
            elif action == 'search':
                data = []
                ids = json.loads(request.POST['ids'])
                term = request.POST['term']
                query = self.model.objects.filter(insumo__nombre__icontains=term)
                for c in query.exclude(id__in=ids)[0:10]:
                    data.append({'id': c.id, 'text': str(c.insumo.nombre + ' / ' + c.insumo.descripcion)})
            elif action == 'get':
                data = []
                id = request.POST['id']
                for c in self.model.objects.filter(id=id):
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
        data['titulo'] = 'Alimentos'
        data['nuevo'] = '/alimento/nuevo'
        data['titulo_lista'] = 'Listado de Alimentos'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        if 'form' not in data:
            data['form'] = AlimentoForm
        if 'formi' not in data:
            data['formi'] = InsumoForm
        if 'formp' not in data:
            data['formp'] = PresentacionForm
        if 'formc' not in data:
            data['formc'] = CategoriaForm
        data['titulo_modal_tipo'] = 'Agregar una Presentacion'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = AlimentoForm
    model = Alimento
    second_model = Insumo
    second_form_class = InsumoForm
    permission_required = 'add_alimento'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'add':
                f = self.form_class(request.POST)
                f2 = self.second_form_class(request.POST)
                data = self.save_data(f, f2)
            elif action == 'edit':
                pk = request.POST['id']
                alt = self.model.objects.get(pk=int(pk))
                ins = self.second_model.objects.get(pk=int(alt.insumo_id))
                f = self.form_class(request.POST, instance=alt)
                f2 = self.second_form_class(request.POST, instance=ins)
                data = self.save_data(f, f2)
            elif action == 'delete':
                pk = request.POST['id']
                cat = self.model.objects.get(pk=pk)
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
            alimento = f.save(commit=False)
            alimento.insumo = f2.save()
            alimento.save()
            data['alimento'] = alimento.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
