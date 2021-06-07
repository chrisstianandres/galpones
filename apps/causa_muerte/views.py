import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.categoria.forms import CategoriaForm
from apps.categoria.models import Categoria
from apps.causa_muerte.forms import Causa_muerteForm
from apps.causa_muerte.models import Causa_muerte
from apps.mixins import ValidatePermissionRequiredMixin

opc_icono = 'fas fa-book-dead'
opc_entidad = 'Causa de Muerte'
crud = '/causa_muerte/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Causa_muerte
    template_name = 'front-end/categoria/list.html'
    permission_required = 'view_causa_muerte'

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
                for c in self.model.objects.filter(nombre__icontains=term):
                    data.append({'id': c.id, 'text': c.nombre})
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
    form_class = Causa_muerteForm
    model_class = Causa_muerte
    permission_required = 'add_causa_muerte'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = self.form_class(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = self.model_class.objects.get(pk=int(pk))
                f = self.form_class(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                pk = request.POST['id']
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
