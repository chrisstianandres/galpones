import json
import os

from django.contrib.staticfiles import finders
from django.db.models import Sum
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.template.loader import get_template
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *
from xhtml2pdf import pisa

from apps.alimentacion.forms import AlimentacionForm
from apps.backEnd import nombre_empresa
from apps.causa_muerte.forms import Causa_muerteForm
from apps.distribucion.forms import DistribucionForm
from apps.distribucion.models import Distribucion
from apps.empleado.models import Empleado
from apps.empresa.models import Empresa
from apps.galpon.forms import GalponForm
from apps.galpon.models import Galpon
from apps.gasto.forms import GastoForm
from apps.medicacion.forms import MedicacionForm
from apps.medicacion.models import Medicacion
from apps.mixins import ValidatePermissionRequiredMixin
from apps.mortalidad.forms import MortalidadForm
from apps.peso.forms import PesoForm
from apps.produccion.models import Produccion
from apps.tipo_gasto.forms import TipogastoForm
from galpones import settings

opc_icono = 'fas fa-crow'
opc_entidad = 'Control de Produccion'
crud = '/distribucion/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Distribucion
    template_name = 'front-end/distribucion/list.html'
    permission_required = 'distribucion.view_distribucion'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Galpon.objects.all():
                    data.append(c.toJSON())
            elif action == 'search_galpon':
                data = []
                term = request.POST['term']
                query = Distribucion.objects.filter(galpon_id=int(term), lote__estado=0)
                for a in query:
                    data.append({'id': a.id, 'text': str('Galpon N°: ' + str(a.galpon_id))})
            elif action == 'get_data':
                data = []
                peso_data = []
                gastos_data = []
                mortalidad_data = []
                alimento_data = []
                medicina_data = []
                id = request.POST['id']
                query = Distribucion.objects.get(id=id, lote__estado=0)
                lote_data = [query.toJSON()]
                for p in query.peso_set.all():
                    peso_data.append(p.toJSON())
                for g in query.gasto_set.all():
                    gastos_data.append(g.toJSON())
                for m in query.mortalidad_set.all():
                    mortalidad_data.append(m.toJSON())
                for a in query.alimentacion_set.all().values('fecha', 'alimento__insumo__nombre',
                                                             'alimento__presentacion__nombre') \
                        .annotate(total=Sum('cantidad')).order_by('total'):
                    alimento_data.append(a)
                for med in query.medicacion_set.all().values('fecha', 'medicina__insumo__nombre',
                                                             'medicina__tipo_medicina__nombre') \
                        .annotate(total=Sum('dosis')).order_by('total'):
                    medicina_data.append(med)
                data.append({
                    'peso': peso_data,
                    'lote_data': lote_data,
                    'gastos': gastos_data,
                    'mortalidad': mortalidad_data,
                    'alimentacion': alimento_data,
                    'medicacion': medicina_data
                })
            elif action == 'list_list':
                data = []
                query = Distribucion.objects.filter(lote__estado=0)
                for a in query:
                    data.append(a.toJSON())
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
        data['titulo'] = 'Control de Produccion'
        data['titulo_lista'] = 'Control de Produccion'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = DistribucionForm
        data['form_peso'] = PesoForm
        data['form_mortalidad'] = MortalidadForm
        data['form_causa_muerte'] = Causa_muerteForm
        data['form_gasto'] = GastoForm
        data['form_tipo_gasto'] = TipogastoForm
        data['form_medicacion'] = MedicacionForm
        data['form_alimentacion'] = AlimentacionForm
        return data


class reporte(ValidatePermissionRequiredMixin, ListView):
    model = Distribucion
    template_name = 'front-end/distribucion/report_galpon.html'
    permission_required = 'distribucion.view_distribucion'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Galpon.objects.all():
                    data.append(c.toJSON())
            elif action == 'search_galpon':
                data = []
                term = request.POST['term']
                query = Distribucion.objects.filter(galpon_id=int(term), lote__estado=1)
                for a in query:
                    data.append({'id': a.id, 'text': str('Galpon N°: ' + str(a.galpon_id))})
            elif action == 'get_data':
                data = []
                peso_data = []
                gastos_data = []
                mortalidad_data = []
                alimento_data = []
                medicina_data = []
                gastos_medicina = 0
                gastos_alimentos = 0
                gastos_sueldos = 0
                gastos_varios = 0
                total_bajas = 0
                id = request.POST['id']
                query = Distribucion.objects.get(id=id, lote__estado=1)
                prod = Produccion.objects.filter(lote_id=query.lote_id)
                lote_data = [query.toJSON()]
                for p in query.peso_set.all():
                    peso_data.append(p.toJSON())
                for g in query.gasto_set.all():
                    gastos_varios += g.valor
                    gastos_data.append(g.toJSON())
                for m in query.mortalidad_set.all():
                    total_bajas += m.cantidad_muertes
                    mortalidad_data.append(m.toJSON())
                for a in query.alimentacion_set.all().values('fecha', 'alimento__insumo__nombre',
                                                             'alimento__presentacion__nombre') \
                        .annotate(total=Sum('cantidad')).order_by('total'):
                    alimento_data.append(a)
                for med in query.medicacion_set.all().values('fecha', 'medicina__insumo__nombre',
                                                             'medicina__tipo_medicina__nombre') \
                        .annotate(total=Sum('dosis')).order_by('total'):
                    medicina_data.append(med)
                for med_tot in query.medicacion_set.all():
                    x = med_tot.medicina.insumo.detalle_compra_set.all().values('insumo_id') \
                        .annotate(total=Sum('p_compra')).order_by('total')
                    for xt in x:
                        gastos_medicina += xt['total']
                for alt_total in query.alimentacion_set.all():
                    a = alt_total.alimento.insumo.detalle_compra_set.all().values('insumo_id') \
                        .annotate(total=Sum('p_compra')).order_by('total')
                    for alt_tot in a:
                        gastos_alimentos += alt_tot['total']
                data.append({
                    'peso': peso_data,
                    'lote_data': lote_data,
                    'gastos': gastos_data,
                    'mortalidad': mortalidad_data,
                    'alimentacion': alimento_data,
                    'medicacion': medicina_data,
                    'gastos_medicina': gastos_medicina,
                    'gastos_alimentos': gastos_alimentos,
                    'gastos_varios': gastos_varios,
                    'total_bajas': total_bajas,
                })
            elif action == 'list_list':
                data = []
                query = Distribucion.objects.filter(lote__estado=1)
                for a in query:
                    data.append(a.toJSON())
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Reporte de Produccion'
        data['boton'] = 'Guardar'
        data['titulo'] = 'Reporte de Produccion'
        data['titulo_lista'] = 'Reporte de Produccion'
        data['titulo_formulario'] = 'Formulario de Registro'
        data['empresa'] = empresa
        data['form'] = DistribucionForm
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = GalponForm

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = GalponForm(request.POST)
                data = self.save_data(f)
            elif action == 'edit':
                pk = request.POST['id']
                cat = Galpon.objects.get(pk=int(pk))
                f = GalponForm(request.POST, instance=cat)
                data = self.save_data(f)
            elif action == 'delete':
                pk = request.POST['id']
                cat = Galpon.objects.get(pk=pk)
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


class printpdf(View):
    def link_callback(self, uri, rel):
        """
        Convert HTML URIs to absolute system paths so xhtml2pdf can access those
        resources
        """
        result = finders.find(uri)
        if result:
            if not isinstance(result, (list, tuple)):
                result = [result]
            result = list(os.path.realpath(path) for path in result)
            path = result[0]
        else:
            sUrl = settings.STATIC_URL  # Typically /static/
            sRoot = settings.STATIC_ROOT  # Typically /home/userX/project_static/
            mUrl = settings.MEDIA_URL  # Typically /media/
            mRoot = settings.MEDIA_ROOT  # Typically /home/userX/project_static/media/

            if uri.startswith(mUrl):
                path = os.path.join(mRoot, uri.replace(mUrl, ""))
            elif uri.startswith(sUrl):
                path = os.path.join(sRoot, uri.replace(sUrl, ""))
            else:
                return uri

        # make sure that file exists
        if not os.path.isfile(path):
            raise Exception(
                'media URI must start with %s or %s' % (sUrl, mUrl)
            )
        return path

    def pvp_cal(self, *args, **kwargs):
        data = []
        try:
            gastos_data = []
            peso_data = []
            mortalidad_data = []
            alimento_data = []
            medicina_data = []
            gastos_medicina = 0
            gastos_alimentos = 0
            gastos_varios = 0
            total_bajas = 0
            id = self.kwargs['pk']
            query = Distribucion.objects.get(id=id, lote__estado=1)
            lote_data = [query.toJSON()]
            for p in query.peso_set.all():
                peso_data.append(p.toJSON())
            for g in query.gasto_set.all():
                gastos_varios += g.valor
                gastos_data.append(g.toJSON())
            for m in query.mortalidad_set.all():
                total_bajas += m.cantidad_muertes
                mortalidad_data.append(m.toJSON())
            for a in query.alimentacion_set.all().values('fecha', 'alimento__insumo__nombre',
                                                         'alimento__presentacion__nombre') \
                    .annotate(total=Sum('cantidad')).order_by('total'):
                alimento_data.append(a)
            for med in query.medicacion_set.all().values('fecha', 'medicina__insumo__nombre',
                                                         'medicina__tipo_medicina__nombre') \
                    .annotate(total=Sum('dosis')).order_by('total'):
                medicina_data.append(med)
            for med_tot in query.medicacion_set.all():
                x = med_tot.medicina.insumo.detalle_compra_set.all().values('insumo_id') \
                    .annotate(total=Sum('p_compra')).order_by('total')
                for xt in x:
                    gastos_medicina += xt['total']
            for alt_total in query.alimentacion_set.all():
                a = alt_total.alimento.insumo.detalle_compra_set.all().values('insumo_id') \
                    .annotate(total=Sum('p_compra')).order_by('total')
                for alt_tot in a:
                    gastos_alimentos += alt_tot['total']
            data.append({
                'peso': peso_data,
                'lote_data': lote_data,
                'gastos': gastos_data,
                'mortalidad': mortalidad_data,
                'alimentacion': alimento_data,
                'medicacion': medicina_data,
                'gastos_medicina': gastos_medicina,
                'gastos_alimentos': gastos_alimentos,
                'gastos_varios': gastos_varios,
                'total_bajas': total_bajas,
            })
        except:
            pass
        return data

    def get(self, request, *args, **kwargs):
        try:
            template = get_template('front-end/report/report_galpon.html')
            context = {'title': 'Reporte de Produccion por Galpon',
                       'empresa': Empresa.objects.first(),
                       'data': self.pvp_cal(),
                       }
            html = template.render(context)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Reporte de Produccion por galpon.pdf"'
            pisa_status = pisa.CreatePDF(html, dest=response, link_callback=self.link_callback)
            return response
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('venta:lista'))
