from django.contrib.auth.decorators import login_required
from django.urls import path

from apps.tipo_medicina.views import *
from . import views

app_name = 'Tipo_medicina'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),
    path('report', login_required(report.as_view()), name='report'),
    path('ciudad', login_required(views.ciudad), name='ciudad'),
]
