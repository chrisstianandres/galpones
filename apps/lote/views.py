import json
from datetime import datetime

from django.db import transaction
from django.db.models import Sum
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa
from apps.compra.models import Detalle_compra
from apps.distribucion.models import Distribucion
from apps.empleado.models import Empleado
from apps.galpon.models import Galpon
from apps.gasto.models import Gasto
from apps.lote.forms import LoteForm
from apps.lote.models import Lote
from apps.medicacion.models import Medicacion
from apps.mixins import ValidatePermissionRequiredMixin
from apps.peso.models import Peso
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
                total_muertes = 0
                gastos_lote = 0
                sueldo_lote = 0
                lot = self.model.objects.get(id=id)
                lot.estado = 1
                for e in prod:
                    emp = Empleado.objects.get(id=e.empleado.id)
                    emp.estado = 0
                    sueldo_lote += e.sueldo
                    emp.save()
                for g in dist:
                    galpon = Galpon.objects.get(id=g.galpon.id)
                    galpon.estado = 0
                    galpon.save()
                    p = Peso.objects.filter(distribucion_id=g.id).last()
                    g.peso_promedio = p.peso_promedio
                    total += g.cantidad_pollos
                    for gst in Gasto.objects.filter(distribucion_id=g.id):
                        g.total_gastos += gst.valor
                    for med in g.medicacion_set.all():
                        x = med.medicina.insumo.detalle_compra_set.all().values('insumo_id') \
                            .annotate(total=Sum('p_compra')).order_by('total')
                        for xt in x:
                            g.total_gastos += xt['total']
                    for alt in g.alimentacion_set.all():
                        a = alt.alimento.insumo.detalle_compra_set.all().values('insumo_id') \
                            .annotate(total=Sum('p_compra')).order_by('total')
                        for alt_tot in a:
                            g.total_gastos += alt_tot['total']
                    for mort in g.mortalidad_set.all():
                        total_muertes += mort.cantidad_muertes
                    g.total_gastos += lot.valor_pollito * (total+total_muertes)
                    g.total_gastos += sueldo_lote / dist.count()
                    g.stock_actual += g.cantidad_pollos
                    gastos_lote += g.total_gastos
                    g.save()
                lot.stock_produccion = int(total)
                lot.stock_actual = int(total)
                lot.total_gastos = float(gastos_lote)
                lot.save()
            elif action == 'search_ave':
                data = []
                term = request.POST['term']
                ids = json.loads(request.POST['ids'])
                query = Lote.objects.filter(raza__nombre__icontains=term, estado=1)
                for a in query.exclude(id__in=ids):
                    for ad in a.distribucion_set.all():
                        data.append({'id': a.id, 'text': str('Ave: ' + a.raza.nombre + ' /' +
                                                             '  Cantidad: ' + str(ad.cantidad_pollos) + ' /' +
                                                             '  Lote N°: ' + str(a.id) + ' /' +
                                                             '  Galpon N°: ' + str(ad.galpon.id))})
            elif action == 'search_ave_list':
                data = []
                ids = json.loads(request.POST['ids'])
                query = Lote.objects.filter(estado=1)
                for a in query.exclude(id__in=ids):
                    for ad in a.distribucion_set.all():
                        item = ad.toJSON()
                        item['valor_libra'] = float(ad.get_costo_libra()) * float(1 + (empresa.indice / 100))
                        item['valor_ave'] = float(ad.peso_promedio) * float(ad.get_costo_libra()) * float(1 + (empresa.indice / 100))
                        item['cantidad'] = 1
                        item['subtotal'] = 0.00
                        item['iva'] = 0.00
                        item['total'] = 0.00
                        data.append(item)
            elif action == 'get':
                data = []
                id = request.POST['id']
                query = Lote.objects.filter(id=id)
                for a in query:
                    for ad in a.distribucion_set.all():
                        item = ad.toJSON()
                        item['valor_libra'] = float(ad.get_costo_libra()) * float(1 + (empresa.indice/100))
                        item['valor_ave'] = float(ad.peso_promedio) * float(ad.get_costo_libra()) * float(1 + (empresa.indice / 100))
                        item['cantidad'] = 1
                        item['subtotal'] = 0.00
                        item['iva'] = 0.00
                        item['total'] = 0.00
                        data.append(item)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            print(e)
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


class report(ValidatePermissionRequiredMixin, ListView):
    model = Lote
    template_name = 'front-end/lote/report.html'
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
                    for d in c.distribucion_set.all():
                        for g in d.mortalidad_set.all().values('cantidad_muertes').annotate(total=Sum('cantidad_muertes')):
                            item = c.toJSON()
                            item['bajas'] = g['total']
                            data.append(item)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            print(e)
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Reporte Produccion por Lote'
        data['boton'] = 'Guardar'
        data['titulo'] = 'Reporte Produccion por Lote'
        data['titulo_lista'] = 'Lista de Lotes'
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
