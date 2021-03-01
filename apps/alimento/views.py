import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.alimento.models import Alimento
from apps.backEnd import nombre_empresa
from apps.categoria.forms import CategoriaForm
from apps.categoria.models import Categoria
from apps.mixins import ValidatePermissionRequiredMixin

opc_icono = 'fas fa-boxes'
opc_entidad = 'Categoria'
crud = '/categoria/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Alimento
    template_name = 'front-end/categoria/list.html'
    permission_required = 'categoria.view_categoria'

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
        data['titulo'] = 'Listado de Categorias'
        data['nuevo'] = '/categoria/nuevo'
        data['titulo_lista'] = 'Listado de Categorias'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = CategoriaForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = CategoriaForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        pk = request.POST['id']
        try:
            if action == 'add':
                f = CategoriaForm(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                cat = Categoria.objects.get(pk=int(pk))
                f = CategoriaForm(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                cat = Categoria.objects.get(pk=pk)
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
            data['categoria'] = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
