import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa

from apps.mixins import ValidatePermissionRequiredMixin
from apps.raza.forms import RazaForm
from apps.raza.models import Raza

opc_icono = 'fas fa-dove'
opc_entidad = 'Tipos de Aves'
crud = '/tipo_ave/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Raza
    template_name = 'front-end/raza/list.html'
    permission_required = 'raza.view_raza'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                ids = request.POST['ids']
                if ids == 'NaN':
                    ids = None
                data = []
                for c in Raza.objects.all().exclude(id=ids):
                    data.append(c.toJSON())
            elif action == 'list_table':
                data = []
                for c in Raza.objects.all():
                    data.append(c.toJSON())
            elif action == 'search':
                data = []
                term = request.POST['term']
                for c in Raza.objects.filter(nombre__icontains=term):
                    data.append({'id': c.id, 'text': c.nombre})
            elif action == 'take':
                data = []
                id = request.POST['id']
                c = Raza.objects.get(id=id)
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
        data['titulo'] = 'Aves'
        data['nuevo'] = '/tipo_ave/nuevo'
        data['titulo_lista'] = 'Listado de Aves'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = RazaForm
        # data['formp'] = TipomedicinaForm
        data['titulo_modal_tipo'] = 'Agregar un tipo de Ave'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = RazaForm
    model_class = Raza

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
