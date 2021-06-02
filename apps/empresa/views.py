from django.views.generic import *
from apps.mixins import ValidatePermissionRequiredMixin
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from apps.empresa.forms import EmpresaForm, PortadaForm
from apps.empresa.models import Empresa, Portadas
import json



opc_icono = 'fa fa-cogs'
opc_entidad = 'Configuracion'
crud = '/empresa/configuracion/'


@csrf_exempt
def editar(request):
    config = Empresa.objects.first()
    data = {
        'icono': opc_icono, 'crud': crud, 'entidad': opc_entidad, 'empresa': config,
        'boton': 'Editar', 'titulo': 'Configuracion', 'form': EmpresaForm(instance=config),
        'id_prov': config.ubicacion.canton.provincia.id, 'id_text': config.ubicacion.canton.provincia.nombre,
        'id_cant': config.ubicacion.canton.id, 'id_text_cant': config.ubicacion.canton.nombre,
        'id_parr': config.ubicacion.id, 'id_text_parr': config.ubicacion.nombre,

    }
    if request.method == 'GET':
        f = EmpresaForm(instance=config)
        data['form'] = f
        return render(request, 'front-end/empresa/empresa_form.html', data)
    else:
        try:
            data = {}
            dato = request.POST
            if dato:
                config.nombre = dato['nombre']
                config.ubicacion_id = dato['ubicacion']
                config.direccion = dato['direccion']
                config.ruc = dato['ruc']
                config.correo = dato['correo']
                config.telefono = dato['telefono']
                config.iva = dato['iva']
                config.indice = dato['indice']
                config.tasa = dato['tasa']
                config.save()
                data['resp'] = True
                print(data)
                return JsonResponse(data, safe=False)
        except Exception as e:
            print(e)
            data['error'] = str(e)
    return HttpResponseRedirect('/empresa/configuracion')


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Portadas
    template_name = "front-end/portada/list.html"

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
            elif action == 'delete':
                pk = request.POST['id']
                cli = Portadas.objects.get(pk=pk)
                cli.delete()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
            print(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Portadas'
        data['boton'] = 'Guardar'
        data['titulo'] = 'Listado de Portadas'
        data['titulo_lista'] = 'Listado de Portadas'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['form'] = PortadaForm
        data['crud'] = '/empresa/portada/nuevo'
        data['action'] = 'add'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = PortadaForm
    template_name = 'front-end/portada/list.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        print(request.POST)
        try:
            if action == 'add':
                f = self.form_class(request.POST, request.FILES)
                data = self.save_data(f)
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def save_data(self, f):
        data = {}
        if f.is_valid():
            f.save()
        else:
            data['error'] = f.errors
        return data
