import locale

from django.utils.decorators import method_decorator

from apps.cliente.forms import ClienteForm
from apps.cliente.models import Cliente
from apps.compra.models import Compra
from apps.distribucion.models import Distribucion

from apps.inventario.models import Inventario
from apps.lote.models import Lote
from apps.mixins import ValidatePermissionRequiredMixin
import json
from datetime import datetime
from datetime import timedelta

from django.db import transaction
from django.db.models import Sum, Count
from django.db.models.functions import Coalesce
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.backEnd import nombre_empresa

from apps.user.forms import UserForm
from apps.venta.forms import Detalle_VentaForm, VentaForm
from apps.venta.models import Venta, Detalle_venta
from apps.empresa.models import Empresa

import os
from django.conf import settings
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.contrib.staticfiles import finders

opc_icono = 'fa fa-shopping-basket '
opc_entidad = 'Ventas'
crud = '/venta/crear'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = Venta
    template_name = 'front-end/venta/list.html'
    permission_required = 'venta.view_venta'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                start = request.POST['start_date']
                end = request.POST['end_date']
                data = []
                if start == '' and end == '':
                    if request.user.tipo == 1:
                        query = Venta.objects.all()
                    else:
                        query = Venta.objects.filter(user_id=request.user.id)
                else:
                    if request.user.tipo == 1:
                        query = Venta.objects.filter(fecha__range=[start, end])
                    else:
                        query = Venta.objects.filter(user_id=request.user.id,
                                                     fecha__range=[start, end])
                for c in query:
                    data.append(c.toJSON())
            elif action == 'detalle':
                id = request.POST['id']
                if id:
                    data = []
                    result = Detalle_venta.objects.filter(venta_id=id)
                    for p in result:
                        for dist in p.lote.distribucion_set.all():
                            item = dist.toJSON()
                            item['valores'] = p.toJSON()
                            item['costo_libra'] = dist.get_costo_libra()
                            data.append(item)
            elif action == 'estado':
                id = request.POST['id']
                if id:
                    ahora = datetime.now()
                    with transaction.atomic():
                        es = Venta.objects.get(id=id)
                        fechaCadena = str(es.fecha) + " 00:00:00"
                        fecha = datetime.strptime(fechaCadena, '%Y-%m-%d %H:%M:%S')
                        if ahora > (fecha + timedelta(days=3)):
                            data['error'] = 'Solo puede abular las ventas maximo 3 dias despues de la transaccion'
                        else:
                            es.estado = 0
                            es.save()
                            for i in Detalle_venta.objects.filter(venta_id=id):
                                for dist in i.lote.distribucion_set.all():
                                    dist.stock_actual += i.cantidad
                                    dist.save()
                                lot = Lote.objects.get(id= i.lote_id)
                                lot.stock_actual += i.cantidad
                                lot.save()
                else:
                    data['error'] = 'Ha ocurrido un error'
            elif action == 'pagar':
                id = request.POST['id']
                if id:
                    with transaction.atomic():
                        es = Venta.objects.get(id=id)
                        es.estado = 1
                        es.save()
                else:
                    data['error'] = 'Ha ocurrido un error'
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar'
        data['titulo'] = 'Ventas'
        data['titulo_lista'] = 'Listado de Ventas'
        data['titulo_modal_person'] = 'Agregar Cliente'
        data['empresa'] = empresa
        data['form'] = VentaForm
        data['form2'] = Detalle_VentaForm()
        # data['detalle'] = []
        data['formp'] = ClienteForm()
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = Venta
    template_name = 'front-end/venta/form.html'
    permission_required = ('venta.add_venta', 'venta.change_venta')

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                datos = json.loads(request.POST['ventas'])
                if datos:
                    with transaction.atomic():
                        c = Venta()
                        c.fecha = datos['fecha']
                        c.cliente_id = datos['cliente']
                        c.subtotal = float(datos['subtotal'])
                        c.iva = float(datos['iva'])
                        c.total = float(datos['total'])
                        c.save()
                        if datos['lotes']:
                            for i in datos['lotes']:
                                dv = Detalle_venta()
                                dv.venta_id = c.id
                                dv.lote_id = int(i['lote']['id'])
                                dv.cantidad = int(i['cantidad'])
                                dv.pvp_actual = float(i['valor_ave'])
                                dv.subtotal = float(i['subtotal'])
                                dv.save()
                                dist = Distribucion.objects.get(id=int(i['id']))
                                dist.stock_actual -= int(i['cantidad'])
                                dist.save()
                                lot = Lote.objects.get(id=int(i['lote']['id']))
                                lot.stock_actual -= int(i['cantidad'])
                                lot.save()
                        data['id'] = c.id
                        data['resp'] = True
                else:
                    data['resp'] = False
                    data['error'] = "Datos Incompletos"
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar Venta'
        data['titulo'] = 'Nueva Venta'
        data['nuevo'] = '/venta/nuevo'
        data['empresa'] = empresa
        data['form'] = VentaForm()
        data['form2'] = Detalle_VentaForm()
        data['detalle'] = []
        data['formc'] = UserForm()
        data['formp'] = ClienteForm()
        data['titulo_modal_person'] = 'Registro de un nuevo Cliente'
        data['boton_fac'] = 'Facturar Venta'
        data['titulo_lista'] = 'Detalle de productos'
        data['titulo_detalle'] = 'Datos de la factura'
        return data


class CrudViewOnline(ValidatePermissionRequiredMixin, TemplateView):
    form_class = Venta
    template_name = 'front-end/venta/form.html'
    permission_required = 'venta.add_venta'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                datos = json.loads(request.POST['ventas'])
                if datos:
                    with transaction.atomic():
                        c = Venta()
                        c.fecha = datos['fecha_venta']
                        c.cliente_id = datos['cliente']
                        c.subtotal = float(datos['subtotal'])
                        c.iva = float(datos['iva'])
                        c.total = float(datos['total'])
                        c.save()
                        if datos['productos']:
                            for i in datos['productos']:
                                for in_pr in Inventario.objects.filter(producto_id=i['id'], estado=1)[
                                             :i['cantidad']]:
                                    dv = Detalle_venta()
                                    dv.venta_id = c.id
                                    dv.inventario_id = in_pr.id
                                    dv.cantidad = int(i['cantidad'])
                                    dv.pvp_actual = float(in_pr.producto.pvp)
                                    dv.subtotal = float(i['subtotal'])
                                    in_pr.estado = 0
                                    in_pr.save()
                                    dv.save()
                                stock = Producto.objects.get(id=i['id'])
                                stock.stock = int(
                                    Inventario.objects.filter(producto_id=i['id'], estado=1).count())
                                stock.save()
                    data['id'] = c.id
                    data['resp'] = True
                else:
                    data['resp'] = False
                    data['error'] = "Datos Incompletos"
            elif action == 'reserva':
                datos = json.loads(request.POST['ventas'])
                if datos:
                    with transaction.atomic():
                        c = Venta()
                        c.fecha = datos['fecha_venta']
                        c.cliente_id = datos['cliente']
                        c.subtotal = float(datos['subtotal'])
                        c.iva = float(datos['iva'])
                        c.total = float(datos['total'])
                        c.estado = 2
                        c.save()
                        if datos['productos']:
                            for i in datos['productos']:
                                for in_pr in Inventario.objects.filter(producto_id=i['id'], estado=1)[
                                             :i['cantidad']]:
                                    dv = Detalle_venta()
                                    dv.venta_id = c.id
                                    dv.inventario_id = in_pr.id
                                    dv.cantidad = int(i['cantidad'])
                                    dv.pvp_actual = float(in_pr.producto.pvp)
                                    dv.subtotal = float(i['subtotal'])
                                    in_pr.estado = 0
                                    in_pr.save()
                                    dv.save()
                                stock = Producto.objects.get(id=i['id'])
                                stock.stock = int(
                                    Inventario.objects.filter(producto_id=i['id'], estado=1).count())
                                stock.save()
                        data['id'] = c.id
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
        data['boton'] = 'Guardar Venta'
        data['titulo'] = 'Nueva Venta'
        data['nuevo'] = '/venta/nuevo'
        data['empresa'] = empresa
        data['form'] = VentaForm()
        data['form2'] = Detalle_VentaForm()
        data['detalle'] = []
        data['formc'] = UserForm()
        return data


def CrudView_online(request):
    data = {}
    if request.user.is_authenticated:
        if request.method == 'GET':
            data['icono'] = opc_icono
            data['entidad'] = 'Compras'
            data['boton'] = 'Pagar'
            data['titulo'] = 'Pagar Compra'
            data['nuevo'] = '/'
            data['empresa'] = empresa
            data['form'] = VentaForm()
            data['form2'] = Detalle_VentaForm()
            data['detalle'] = []
            user = Cliente.objects.get(cedula=request.user.cedula)
            data['user'] = user
            return render(request, 'front-end/venta/online.html', data)
    else:
        data['key'] = 1
        data['titulo'] = 'Inicio de Sesion'
        data['nomb'] = nombre_empresa()
        return render(request, 'front-end/login.html', data)


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
            result = Detalle_venta.objects.filter(venta_id=self.kwargs['pk'])
            for p in result:
                for dist in p.lote.distribucion_set.all():
                    item = dist.toJSON()
                    item['valores'] = p.toJSON()
                    item['costo_libra'] = format(dist.get_costo_libra(), '.2f')
                    data.append(item)
        except:
            pass
        return data

    def get(self, request, *args, **kwargs):
        try:
            template = get_template('front-end/report/pdf.html')
            context = {'title': 'Comprobante de Venta',
                       'sale': Venta.objects.get(pk=self.kwargs['pk']),
                       'empresa': Empresa.objects.first(),
                       'det_sale': self.pvp_cal(),
                       }
            html = template.render(context)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Comprobante de Venta.pdf"'
            pisa_status = pisa.CreatePDF(html, dest=response, link_callback=self.link_callback)
            return response
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('venta:lista'))


@csrf_exempt
def grap(request):
    data = {}
    fecha = datetime.now()
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
    try:
        action = request.POST['action']
        if action == 'chart':
            data = {
                'dat': {
                    'data': grap_data(),
                    'titulo': str('Total de ventas del año' + " " + str(fecha.year)),
                },
                'year': datetime.now().year,
                'chart2': {
                    'data': dataChart2(),
                    'titulo': str('Total de ventas del mes de' + " " + str(fecha.strftime("%B"))),
                },
                # 'chart3': {
                #     'compras': datachartcontr(),
                #     'ventas': grap_data()
                # },
                'tarjets': {
                    'data': data_tarjets()
                }
            }
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)


def grap_data():
    year = datetime.now().year
    data = []
    for y in range(1, 13):
        total = Venta.objects.filter(fecha__year=year, fecha__month=y, estado=1).aggregate(r=Coalesce
        (Sum('total'), 0)).get('r')
        data.append(float(total))
    return data


def data_tarjets():
    year = datetime.now()
    ventas = Venta.objects.filter(fecha__month=year.month, estado=1).aggregate(
        r=Coalesce(Sum('total'), 0)).get('r')
    ventas_anual = Venta.objects.filter(fecha__year=year.year, estado=1).aggregate(
        r=Coalesce(Sum('total'), 0)).get('r')
    compras = Compra.objects.filter(fecha_compra__month=year.month, estado=1).aggregate(
        r=Coalesce(Sum('total'), 0)).get('r')
    compras_anual = Compra.objects.filter(fecha_compra__year=year.year, estado=1).aggregate(
        r=Coalesce(Sum('total'), 0)).get('r')
    # inventario = Inventario.objects.filter(produccion__fecha_ingreso__year=year, estado=1).aggregate(
    #     r=Coalesce(Count('id'), 0)).get('r')
    # agotados = Producto.objects.filter(producto_base__stock__lte=0).count()
    data = {
        'ventas': float(ventas),
        'ventas_anuales': float(ventas_anual),
        'compras': float(compras),
        'compras_anual': float(compras_anual),
        # 'inventario': int(inventario),
        # 'agotados': int(agotados),
    }
    return data


def dataChart2():
    year = datetime.now().year
    month = datetime.now().month
    data = []
    producto = Producto.objects.all()
    for p in producto:
        total = Detalle_venta.objects.filter(venta__fecha__year=year,
                                             venta__fecha__month=month,
                                             inventario__producto_id=p).aggregate(
            r=Coalesce(Sum('venta__total'), 0)).get('r')
        data.append({
            'name': p.producto_base.nombre,
            'y': float(total)
        })
    return data


def datachartcontr():
    year = datetime.now().year
    data = []
    for y in range(1, 13):
        totalc = Compra.objects.filter(fecha_compra__year=year, fecha_compra__month=y, estado=1).aggregate(
            r=Coalesce(Sum('total'), 0)).get('r')
        data.append(float(totalc))
    return data


class report(ValidatePermissionRequiredMixin, ListView):
    model = Venta
    template_name = 'front-end/venta/report_product.html'
    permission_required = 'venta.view_venta'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Venta.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            start_date = request.POST.get('start_date', '')
            end_date = request.POST.get('end_date', '')
            empresa = Empresa.objects.first()
            iva = float(empresa.iva / 100)
            action = request.POST['action']
            if action == 'report':
                data = []
                if start_date == '' and end_date == '':
                    query = Detalle_venta.objects.values('venta__fecha', 'inventario__producto__producto_base_id',
                                                         'pvp_actual').order_by().annotate(
                        Sum('cantidad')).filter(venta__estado=1)
                else:
                    query = Detalle_venta.objects.values('venta__fecha', 'inventario__producto__producto_base_id',
                                                         'pvp_actual') \
                        .filter(venta__fecha__range=[start_date, end_date], venta__estado=1).order_by().annotate(
                        Sum('cantidad'))
                for p in query:
                    total = p['pvp_actual'] * p['cantidad__sum']
                    pr = Producto_base.objects.get(id=int(p['inventario__producto__producto_base_id']))
                    data.append([
                        p['venta__fecha'].strftime("%d/%m/%Y"),
                        pr.nombre,
                        int(p['cantidad__sum']),
                        format(p['pvp_actual'], '.2f'),
                        format(total, '.2f'),
                        format((float(total) * iva), '.2f'),
                        format(((float(total) * iva) + float(total)), '.2f')
                    ])
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['titulo'] = 'Reporte de Ventas por productos'
        data['empresa'] = empresa
        data['titulo_lista'] = 'Ventas por productos'
        return data


class report_total(ValidatePermissionRequiredMixin, ListView):
    model = Venta
    template_name = 'front-end/venta/report_total.html'
    permission_required = 'venta.view_venta'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Venta.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            start_date = request.POST.get('start_date', '')
            end_date = request.POST.get('end_date', '')
            action = request.POST['action']
            if action == 'report':
                data = []
                if start_date == '' and end_date == '':
                    query = Venta.objects.values('fecha', 'cliente__nombres', 'tipo_venta',
                                                 'cliente__apellidos').annotate(Sum('subtotal')). \
                        annotate(Sum('iva')).annotate(Sum('total')).filter(estado=1)
                else:
                    query = Venta.objects.values('fecha', 'cliente__nombres', 'tipo_venta',
                                                 'cliente__apellidos').filter(fecha__range=[start_date, end_date],
                                                                              estado=1) \
                        .annotate(Sum('subtotal')).annotate(Sum('iva')).annotate(Sum('total'))
                for p in query:
                    if p['tipo_venta'] == 0:
                        tipo = 'Fisica'
                    else:
                        tipo = 'OnLine'
                    data.append([
                        p['fecha'].strftime("%d/%m/%Y"),
                        p['cliente__nombres'] + " " + p['cliente__apellidos'],
                        tipo,
                        format(p['subtotal__sum'], '.2f'),
                        format((p['iva__sum']), '.2f'),
                        format(p['total__sum'], '.2f')
                    ])
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Ventas Finalizadas (Fisicas)'
        data['titulo'] = 'Reporte de Ventas (Fisicas)'
        data['empresa'] = empresa
        data['filter_prod'] = '/venta/lista'
        data['titulo_lista'] = 'Lista de Ventas finalizadas (Fisicas)'
        return data


class report_total_reserva(ValidatePermissionRequiredMixin, ListView):
    model = Venta
    template_name = 'front-end/venta/report_total_reserva.html'
    permission_required = 'venta.view_venta'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Venta.objects.none()

    def post(self, request, *args, **kwargs):
        data = {}
        try:

            start_date = request.POST.get('start_date', '')
            end_date = request.POST.get('end_date', '')
            action = request.POST['action']
            if action == 'report':
                data = []
                if start_date == '' and end_date == '':
                    query = Venta.objects.values('fecha', 'cliente__nombres',
                                                 'cliente__apellidos') \
                        .annotate(Sum('subtotal')). \
                        annotate(Sum('iva')).annotate(Sum('total')).filter(estado=2)
                else:
                    query = Venta.objects.values('fecha', 'cliente__nombres', 'cliente__apellidos').filter(
                        fecha__range=[start_date, end_date], estado=2).annotate(Sum('subtotal')). \
                        annotate(Sum('iva')).annotate(Sum('total'))
                for p in query:
                    data.append([
                        p['fecha'].strftime("%d/%m/%Y"),
                        p['cliente__nombres'] + " " + p['cliente__apellidos'],
                        format(p['subtotal__sum'], '.2f'),
                        format((p['iva__sum']), '.2f'),
                        format(p['total__sum'], '.2f')
                    ])
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Ventas Reservadas'
        data['titulo'] = 'Reporte de Pedidos'
        data['titulo_lista'] = 'Lista de Ventas reservadas'
        data['empresa'] = empresa
        return data
