import json

from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.mixins import ValidatePermissionRequiredMixin
from apps.presentacion.forms import PresentacionForm
from apps.presentacion.models import Presentacion

opc_icono = 'fas fa-box-open'
opc_entidad = 'Presentacion'
crud = '/presentacion/crear'
empresa = nombre_empresa()


class lista(ListView):
    model = Presentacion
    template_name = 'front-end/presentacion/list.html'
    permission_required = 'presentacion.view_presentacion'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Presentacion.objects.all():
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
        data['titulo'] = 'Listado de Presentaciones'
        data['nuevo'] = '/presentacion/nuevo'
        data['titulo_lista'] = 'Listado de Presentaciones'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = PresentacionForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = PresentacionForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = PresentacionForm(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = Presentacion.objects.get(pk=int(pk))
                f = PresentacionForm(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                pk = request.POST['id']
                cat = Presentacion.objects.get(pk=pk)
                cat.delete()
                data['resp'] = True
            elif action == 'search':
                data = []
                term = request.POST['term']
                query = Presentacion.objects.filter(nombre__icontains=term)[0:10]
                for a in query:
                    result = {'id': int(a.id), 'text': str(a.nombre)}
                    data.append(result)
            elif action == 'get':
                data = []
                id = request.POST['id']
                producto = Presentacion.objects.filter(pk=id)
                for i in producto:
                    item = i.toJSON()
                    data.append(item)
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def save_data(self, f):
        data = {}
        if f.is_valid():
            var = f.save()
            data['resp'] = True
            data = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
            print(f.errors)
        return data


