import json
from datetime import datetime

from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa

from apps.mixins import ValidatePermissionRequiredMixin
from apps.peso.forms import PesoForm
from apps.peso.models import Peso

opc_icono = 'fas fa-balance-scale-left'
opc_entidad = 'Pesos'
crud = '/peso/crear'
empresa = nombre_empresa()


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = PesoForm
    model_class = Peso

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        datos = request.POST
        try:
            if action == 'add':
                if self.model_class.objects.filter(distribucion_id=int(datos['distribucion_id']), fecha=datetime.now()):
                    data['resp'] = False
                    data['error'] = 'No puede agregar varios pesos el mismo dia'
                else:
                    peso = self.model_class()
                    peso.distribucion_id = int(datos['distribucion_id'])
                    peso.peso_promedio = float(datos['peso_promedio'])
                    peso.save()
                    data['resp'] = True
            elif action == 'edit':
                pk = request.POST['id']
                peso = self.model_class.objects.get(pk=int(pk))
                peso.peso_promedio = float(datos['peso_promedio'])
                peso.fecha = datos['fecha']
                peso.save()
                data['resp'] = True
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
            data['galpon'] = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
