import json

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
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
            elif action == 'search':
                data = []
                term = request.POST['term']
                for c in Medicina.objects.filter(nombre__icontains=term):
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
        data['titulo'] = 'Medicinas'
        data['nuevo'] = '/medicina/nuevo'
        data['titulo_lista'] = 'Listado de medicinas'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = MedicinaForm
        data['formp'] = TipomedicinaForm
        data['titulo_modal_tipo'] = 'Agregar un tipo de medicina'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = MedicinaForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = MedicinaForm(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = Medicina.objects.get(pk=int(pk))
                f = MedicinaForm(request.POST, instance=cat)
                data = self.save_data(f)
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

    def save_data(self, f):
        data = {}
        if f.is_valid():
            var = f.save()
            data['medicina'] = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
