import json
import os
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.staticfiles import finders
from django.db import transaction
from django.db.models import Sum
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.template.loader import get_template
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *
from xhtml2pdf import pisa

from apps.alimento.models import Alimento
from apps.backEnd import nombre_empresa
from apps.compra.forms import CompraForm, Detalle_CompraForm
from apps.compra.models import Compra, Detalle_compra
from apps.devoluciones.models import Devolucion_compra
from apps.empresa.models import Empresa
from apps.medicina.models import Medicina
from apps.mixins import ValidatePermissionRequiredMixin
from apps.proveedor.forms import ProveedorForm

opc_icono = 'fa fa-shopping-bag'
opc_entidad = 'Compras'
crud = '/compra/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Compra
    template_name = 'front-end/compra/list.html'
    permission_required = 'compra.view_compra'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Compra.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                start = request.POST['start_date']
                end = request.POST['end_date']
                if start and end:
                    compra = Compra.objects.filter(fecha_compra__range=[start, end])
                else:
                    compra = Compra.objects.all()
                for c in compra:
                    data.append(c.toJSON())
            elif action == 'detalle_medicina':
                id = request.POST['id']
                if id:
                    data = []
                    for p in Detalle_compra.objects.filter(compra_id=id, insumo__tipo_insumo=1):
                        med = Medicina.objects.get(insumo_id=int(p.insumo_id))
                        item = p.toJSON()
                        item['p_compra'] = p.p_compra
                        item['insumo'] = med.toJSON()
                        item['subtotal'] = float(p.subtotal)
                        data.append(item)
                else:
                    data['error'] = 'Ha ocurrido un error'
            elif action == 'detalle_alimentos':
                id = request.POST['id']
                if id:
                    data = []
                    for p in Detalle_compra.objects.filter(compra_id=id, insumo__tipo_insumo=0):
                        al = Alimento.objects.get(insumo_id=int(p.insumo_id))
                        item = p.toJSON()
                        item['p_compra'] = p.p_compra
                        item['insumo'] = al.toJSON()
                        item['subtotal'] = float(p.subtotal)
                        data.append(item)
                else:

                    data['error'] = 'Ha ocurrido un error'
            elif action == 'devolucion':
                id = request.POST['id']
                key = 0
                ahora = datetime.now()
                dev = self.model.objects.get(id=id)
                fechaCadena = str(dev.fecha_compra) + " 00:00:00"
                fecha = datetime.strptime(fechaCadena, '%Y-%m-%d %H:%M:%S')
                if ahora > (fecha + timedelta(days=1)):
                    data['error'] = 'Solo puede abular las compras maximo 1 dia despues de la transaccion'
                else:
                    for det in dev.detalle_compra_set.all():
                        if det.stock_actual < det.stock_inicial:
                            key = 1
                        break
                    if key == 0:
                        dev.estado = 0
                        dev.save()
                        add = Devolucion_compra()
                        add.compra_id = id
                        add.save()
            elif action == 'list_dev':
                data = []
                start = request.POST['start_date']
                end = request.POST['end_date']
                if start and end:
                    compra = Devolucion_compra.objects.filter(fecha__range=[start, end])
                else:
                    compra = Devolucion_compra.objects.all()
                for c in compra:
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
        data['titulo'] = 'Compras'
        data['titulo_lista'] = 'Listado de Compras'
        data['titulo_modal_person'] = 'Agregar Proveedor'
        data['empresa'] = empresa
        data['form'] = CompraForm
        data['form2'] = Detalle_CompraForm()
        # data['detalle'] = []
        data['formp'] = ProveedorForm()
        return data


class devolucion(ValidatePermissionRequiredMixin, ListView):
    model = Compra
    template_name = 'front-end/compra/devolucion.html'
    permission_required = 'compra.view_compra'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Compra.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'detalle_medicina':
                id = request.POST['id']
                if id:
                    data = []
                    for p in Detalle_compra.objects.filter(compra_id=id, insumo__tipo_insumo=1):
                        med = Medicina.objects.get(insumo_id=int(p.insumo_id))
                        item = p.toJSON()
                        item['p_compra'] = p.p_compra
                        item['insumo'] = med.toJSON()
                        item['subtotal'] = float(p.subtotal)
                        data.append(item)
                else:
                    data['error'] = 'Ha ocurrido un error'
            elif action == 'detalle_alimentos':
                id = request.POST['id']
                if id:
                    data = []
                    for p in Detalle_compra.objects.filter(compra_id=id, insumo__tipo_insumo=0):
                        al = Alimento.objects.get(insumo_id=int(p.insumo_id))
                        item = p.toJSON()
                        item['p_compra'] = p.p_compra
                        item['insumo'] = al.toJSON()
                        item['subtotal'] = float(p.subtotal)
                        data.append(item)
                else:

                    data['error'] = 'Ha ocurrido un error'
            elif action == 'devolucion':
                id = request.POST['id']
                key = 0
                ahora = datetime.now()
                dev = self.model.objects.get(id=id)
                fechaCadena = str(dev.fecha_compra) + " 00:00:00"
                fecha = datetime.strptime(fechaCadena, '%Y-%m-%d %H:%M:%S')
                if ahora > (fecha + timedelta(days=1)):
                    data['error'] = 'Solo puede abular las compras maximo 1 dia despues de la transaccion'
                else:
                    for det in dev.detalle_compra_set.all():
                        if det.stock_actual < det.stock_inicial:
                            key = 1
                        break
                    if key == 0:
                        dev.estado = 0
                        dev.save()
                        add = Devolucion_compra()
                        add.compra_id = id
                        add.save()
            elif action == 'list':
                data = []
                start = request.POST['start_date']
                end = request.POST['end_date']
                if start and end:
                    compra = Devolucion_compra.objects.filter(fecha__range=[start, end])
                else:
                    compra = Devolucion_compra.objects.all()
                for c in compra:
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
        data['titulo'] = 'Compras'
        data['titulo_lista'] = 'Listado de Compras Devueltas'
        data['empresa'] = empresa
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = Compra
    template_name = 'front-end/compra/form.html'
    permission_required = 'compra.add_compra'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                datos = json.loads(request.POST['compras'])
                if datos:
                    with transaction.atomic():
                        c = Compra()
                        c.comprobante = datos['comprobante']
                        c.fecha_compra = datos['fecha_compra']
                        c.proveedor_id = datos['proveedor']
                        c.user_id = request.user.id
                        c.subtotal = float(datos['subtotal'])
                        c.tasa_iva = float(datos['tasa_iva']) / float(100)
                        c.iva = float(datos['iva'])
                        c.total = float(datos['total'])
                        c.save()
                        if datos['medicinas']:
                            for m in datos['medicinas']:
                                dv = Detalle_compra()
                                dv.compra_id = c.id
                                dv.insumo_id = int(m['insumo']['id'])
                                dv.cantidad = int(m['cantidad'])
                                dv.stock_inicial = int(m['cantidad'])
                                dv.stock_actual = int(m['cantidad'])
                                dv.subtotal = float(m['subtotal'])
                                dv.p_compra = float(m['precio'])
                                dv.save()
                        if datos['alimentos']:
                            for a in datos['alimentos']:
                                dv = Detalle_compra()
                                dv.compra_id = c.id
                                dv.insumo_id = int(a['insumo']['id'])
                                dv.cantidad = int(a['cantidad'])
                                dv.stock_inicial = int(a['cantidad'])
                                dv.stock_actual = int(a['cantidad'])
                                dv.subtotal = float(a['subtotal'])
                                dv.p_compra = float(a['precio'])
                                dv.save()
                        data['resp'] = True
                else:
                    data['resp'] = False
                    data['error'] = "Datos Incompletos"
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar Compra'
        data['titulo'] = 'Nueva Compra'
        data['nuevo'] = '/compra/nuevo'
        data['empresa'] = empresa
        data['form'] = CompraForm()
        data['form2'] = Detalle_CompraForm()
        data['detalle'] = []
        data['formp'] = ProveedorForm()
        data['titulo_modal_person'] = 'Registro de un nuevo Proveedor'
        data['boton_fac'] = 'Guardar Compra'
        data['titulo_lista'] = 'Detalle de productos'
        data['titulo_detalle'] = 'Datos de la factura'
        return data


@csrf_exempt
def index(request):
    data = {}
    try:
        data = []
        h = datetime.today() - timedelta(days=datetime.today().isoweekday() % 7)
        for p in Detalle_compra.objects.filter(compra__fecha_compra__range=[h, h + timedelta(days=6)],
                                               compra__estado=1):
            data.append(p.toJSON())
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)


class printpdf(ValidatePermissionRequiredMixin, View):
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
            iva_emp = Empresa.objects.get(pk=1)
            for i in Detalle_compra.objects.filter(compra_id=self.kwargs['pk']):
                item = i.compra.toJSON()
                item['producto'] = i.producto.toJSON()
                item['pvp'] = format(i.p_compra_actual, '.2f')
                item['cantidad'] = i.cantidad
                item['subtotal'] = format(i.subtotal, '.2f')
                data.append(item)
        except:
            pass
        return data

    def get(self, request, *args, **kwargs):
        try:
            template = get_template('front-end/report/pdf_compra.html')
            context = {'title': 'Comprobante de Compra',
                       'sale': Compra.objects.get(pk=self.kwargs['pk']),
                       'det_sale': self.pvp_cal(),
                       'empresa': Empresa.objects.get(id=1),
                       'icon': 'media/logo_don_chuta.png'
                       }
            html = template.render(context)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="report.pdf"'
            pisa_status = pisa.CreatePDF(html, dest=response, link_callback=self.link_callback)
            return response
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('compra:lista'))


class report(ValidatePermissionRequiredMixin, ListView):
    model = Compra
    template_name = 'front-end/compra/report_product.html'
    permission_required = 'compra.view_compra'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Compra.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'report':
                data = []
                start_date = request.POST.get('start_date', '')
                end_date = request.POST.get('end_date', '')
                if start_date == '' and end_date == '':
                    query = Detalle_compra.objects.values('compra__fecha_compra', 'insumo__nombre', 'insumo__tipo_insumo',
                                                          'p_compra'). \
                        order_by().annotate(Sum('cantidad')).annotate(Sum('compra__total')).annotate(Sum('subtotal'))
                else:
                    query = (Detalle_compra.objects.values('compra__fecha_compra', 'insumo__nombre', 'insumo__tipo_insumo',
                                                           'p_compra').
                        filter(compra__fecha_compra__range=[start_date, end_date]).order_by().annotate(
                        Sum('cantidad'))).annotate(Sum('compra__total'))
                for p in query:
                    if p['insumo__tipo_insumo'] == 0:
                        insumo = 'Alimento'
                    else:
                        insumo = 'Medicina'
                    data.append([
                        p['compra__fecha_compra'].strftime("%d/%m/%Y"),
                        p['insumo__nombre'],
                        insumo,
                        int(p['cantidad__sum']),
                        format(p['p_compra'], '.2f'),
                        format(p['compra__total__sum'], '.2f')])
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nueva Compra'
        data['titulo'] = 'Reporte de Compras'
        data['titulo_lista'] = 'Lista de Compras'
        data['empresa'] = empresa
        return data


class report_total(ValidatePermissionRequiredMixin, ListView):
    model = Compra
    template_name = 'front-end/compra/report_total.html'
    permission_required = 'compra.view_compra'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Compra.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            start_date = request.POST.get('start_date', '')
            end_date = request.POST.get('end_date', '')
            action = request.POST['action']
            if action == 'report':
                data = []
                if start_date == '' and end_date == '':
                    query = Compra.objects.values('fecha_compra', 'proveedor__nombre', 'user__username', ).order_by(). \
                        annotate(Sum('total'))
                else:
                    query = Compra.objects.values('fecha_compra', 'proveedor__nombre', 'user__username').filter(
                        fecha_compra__range=[start_date, end_date]).order_by(). \
                        annotate(Sum('total'))
                for p in query:
                    data.append([
                        p['fecha_compra'].strftime("%d/%m/%Y"),
                        p['proveedor__nombre'],
                        p['user__username'],
                        format(p['total__sum'], '.2f')
                    ])
            else:
                data['error'] = 'No ha seccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Reporte de Compras Totales'
        data['titulo'] = 'Reporte de Compras Totales'
        data['titulo_lista'] = 'Lista de Compras'

        data['empresa'] = empresa
        return data
