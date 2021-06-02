from django.conf.urls import url
from django.urls import path
from . import views
from apps.empresa.views import *
from django.contrib.auth.decorators import login_required
app_name = 'Empresa'

urlpatterns = [
    path('configuracion/', login_required(views.editar), name='editar'),
    path('portada/lista', login_required(lista.as_view()), name='lista'),
    path('portada/nuevo', login_required(CrudView.as_view()), name='nuevo'),

]
