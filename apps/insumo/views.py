from django.db.models import Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView

from apps.alimento.models import Alimento
from apps.backEnd import nombre_empresa
from apps.compra.models import Detalle_compra
from apps.medicina.models import Medicina
from apps.mixins import ValidatePermissionRequiredMixin


class report(ValidatePermissionRequiredMixin, ListView):
    model = Detalle_compra
    template_name = 'front-end/insumo/report_stock.html'
    permission_required = 'compra.view_compra'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            start_date = request.POST.get('start_date', '')
            end_date = request.POST.get('end_date', '')
            action = request.POST['action']
            if action == 'report':
                data = []
                query = self.model.objects.values('insumo_id').annotate(
                        stock=Sum('stock_actual')).filter(
                       compra__estado=1, insumo__tipo_insumo=1).order_by('insumo_id')
                query2 = self.model.objects.values('insumo_id').filter(
                        compra__estado=1, insumo__tipo_insumo=0).annotate(
                        stock=Sum('stock_actual')).order_by('insumo_id')
                for p in query:
                    for m in Medicina.objects.filter(insumo_id=p['insumo_id']):
                        item = [m.insumo.nombre, m.insumo.get_tipo_insumo_display(),
                                m.insumo.categoria.nombre, m.tipo_medicina.nombre, p['stock']]
                        data.append(item)
                for a in query2:
                    for al in Alimento.objects.filter(insumo_id=a['insumo_id']):
                        item = [al.insumo.nombre, al.insumo.get_tipo_insumo_display(),
                                al.insumo.categoria.nombre, al.presentacion.nombre, a['stock']]
                        data.append(item)
            else:
                data['error'] = 'No ha seccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = 'fas fa-capsules'
        data['entidad'] = 'Reporte de stock de insumos'
        data['titulo'] = 'Reporte de stock de insumos'
        data['titulo_lista'] = 'Lista de Insumos'

        data['empresa'] = nombre_empresa()
        return data
