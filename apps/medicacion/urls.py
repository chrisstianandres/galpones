from django.conf.urls import url
from django.urls import path
from .views import *
from django.contrib.auth.decorators import login_required
app_name = 'Medicacion'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),

]
