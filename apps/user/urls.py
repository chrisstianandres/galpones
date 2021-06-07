from django.urls import path
from . import views
from apps.user.views import *
from django.contrib.auth.decorators import login_required

app_name = 'Usuarios'

urlpatterns = [
    path('lista', lista.as_view(), name='lista'),
    path('nuevo', login_required(CrudView.as_view()), name='nuevo'),
    path('groups', login_required(Listgroupsview.as_view()), name='groups'),
    path('newgroup', login_required(CrudViewGroup.as_view()), name='newgroup'),
    path('estado', login_required(views.estado), name='estado'),
    path('editar/<int:pk>', login_required(Updateview.as_view()), name='editar'),
    path('grupo_editar/<int:pk>', login_required(UpdateGroup.as_view()), name='grupo_editar'),
    path('profile', login_required(views.profile), name='profile'),
    path('change/group/<int:pk>/', UserChangeGroup.as_view(), name='user_change_group'),

]
