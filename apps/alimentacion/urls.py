from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import *

app_name = 'Alimentacion'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),

]
