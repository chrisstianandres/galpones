import json
from datetime import datetime

from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.distribucion.models import Distribucion
from apps.empleado.models import Empleado
from apps.galpon.models import Galpon
from apps.lote.forms import LoteForm
from apps.lote.models import Lote
from apps.mixins import ValidatePermissionRequiredMixin
from apps.produccion.models import Produccion
from apps.raza.forms import RazaForm

opc_icono = 'fas fa-crop-alt'
opc_entidad = 'Lotes'
crud = '/lote/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Lote
    template_name = 'front-end/lote/list.html'
    permission_required = 'lote.view_lote'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                start = request.POST['start_date']
                end = request.POST['end_date']
                if start and end:
                    query = Lote.objects.filter(fecha__range=[start, end])
                else:
                    query = Lote.objects.all()
                for c in query:
                    data.append(c.toJSON())

            elif action == 'close':
                data = []
                id = request.POST['id']
                dist = Distribucion.objects.filter(lote_id=id)
                prod = Produccion.objects.filter(lote_id=id)
                total = 0
                for g in dist:
                    galpon = Galpon.objects.get(id=g.galpon.id)
                    galpon.estado = 0
                    galpon.save()
                    total += g.cantidad_pollos
                    g.save()
                for e in prod:
                    emp = Empleado.objects.get(id=e.empleado.id)
                    emp.estado = 0
                    emp.save()
                lot = self.model.objects.get(id=id)
                lot.estado = 1
                lot.stock_produccion = int(total)
                lot.stock_actual = int(total)
                lot.save()
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Control de Lotes'
        data['boton'] = 'Guardar'
        data['titulo'] = 'Control de Lotes'
        data['titulo_lista'] = 'Listado de Lotes'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = LoteForm
        data['formp'] = RazaForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = LoteForm
    template_name = 'front-end/lote/form.html'
    permission_required = 'lote.add_lote'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                with transaction.atomic():
                    datos = json.loads(request.POST['lote'])
                    lote = Lote()
                    lote.fecha = datetime.now()
                    lote.cantidad = int(datos['cantidad'])
                    lote.valor_pollito = float(datos['valor_ave'])
                    lote.raza_id = int(datos['raza'])
                    lote.save()
                    for e in datos['empleados_array']:
                        produccion = Produccion()
                        produccion.lote_id = lote.id
                        produccion.empleado_id = int(e['id'])
                        produccion.sueldo = float(e['sueldo'])
                        produccion.save()
                        empl = Empleado.objects.get(id=int(e['id']))
                        empl.estado = 1
                        empl.save()
                    for g in datos['galpones_array']:
                        distribucion = Distribucion()
                        distribucion.lote_id = lote.id
                        distribucion.galpon_id = int(g['id'])
                        distribucion.cantidad_pollos = int(g['cantidad'])
                        distribucion.save()
                        galp = Galpon.objects.get(id=g['id'])
                        galp.estado = 1
                        galp.save()
                    data['resp'] = True

                # f = LoteForm(request.POST)
                # data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = Lote.objects.get(pk=int(pk))
                f = LoteForm(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                pk = request.POST['id']
                cat = Lote.objects.get(pk=pk)
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
            data['lote'] = var.toJSON()
            data['resp'] = True
        else:
            data['error'] = f.errors
        return data
    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar'
        data['titulo'] = 'Lotes'
        data['titulo_lista'] = 'Listado de Lotes'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = LoteForm
        data['formp'] = RazaForm
        return data
