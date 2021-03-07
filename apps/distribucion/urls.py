from django.conf.urls import url
from django.urls import path
from .views import *
from django.contrib.auth.decorators import login_required

app_name = 'Distribucion'

urlpatterns = [
    path('control', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),
    path('reporte', login_required(reporte.as_view()), name='reporte'),
    path('printpdf/<int:pk>', login_required(printpdf.as_view()), name='printpdf'),

]
