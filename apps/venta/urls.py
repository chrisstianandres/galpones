from django.contrib.auth.decorators import login_required
from django.urls import path

from apps.venta.views import *
from . import views

app_name = 'Venta'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),
    path('devoluciones', login_required(devolucion.as_view()), name='devoluciones'),
    # path('nuevo_online', login_required(CrudViewOnline.as_view()), name='nuevo_online'),
    # path('online', views.CrudView_online, name='online'),
    path('chart', login_required(views.grap), name='chart'),
    path('printpdf/<int:pk>', login_required(printpdf.as_view()), name='printpdf'),
    path('report_by_product', login_required(report.as_view()), name='report_by_product'),
    path('report_total', login_required(report_total.as_view()), name='report_total'),
    # path('report_total_pedidos', login_required(report_total_reserva.as_view()), name='report_total_pedidos'),
    # path('data_tarjets', login_required(views.data_tarjets), name='data_tarjets'),
]
