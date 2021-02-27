"""galpones URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include

from apps import backEnd
from galpones import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('menu', login_required(backEnd.menu), name='menu'),
    path('verificar/', backEnd.check_ced, name='verificar'),
    path('logout', login_required(backEnd.disconnect), name='logout'),
    path('user/', include('apps.user.urls', namespace='user')),
    path('empresa/', include('apps.empresa.urls', namespace='empresa')),
    path('medicina/', include('apps.medicina.urls', namespace='medicina')),
    path('galpon/', include('apps.galpon.urls', namespace='galpon')),
    path('empleado/', include('apps.empleado.urls', namespace='empleado')),
    path('lote/', include('apps.lote.urls', namespace='lote')),
    path('tipo_ave/', include('apps.raza.urls', namespace='raza')),
    path('categoria/', include('apps.categoria.urls', namespace='categoria')),
    path('tipo_medicine/', include('apps.tipo_medicina.urls', namespace='tipo_medicine')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)\
                  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

