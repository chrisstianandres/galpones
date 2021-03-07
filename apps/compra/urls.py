from django.contrib.auth.decorators import login_required
from django.urls import path

from apps.compra.views import *
from . import views

app_name = 'Compra'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),
    # path('index', login_required(views.index), name='index'),
    # path('printpdf/<int:pk>', login_required(printpdf.as_view()), name='printpdf'),
    path('report_by_product', login_required(report.as_view()), name='report_by_product'),
    path('report_total', login_required(report_total.as_view()), name='report_total'),
]
