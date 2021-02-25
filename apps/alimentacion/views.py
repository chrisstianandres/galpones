from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from apps.empresa.forms import EmpresaForm
from apps.empresa.models import Empresa
import json

opc_icono = 'fa fa-cogs'
opc_entidad = 'Configuracion'
crud = '/empresa/configuracion/'


@csrf_exempt
def editar(request):
    config = Empresa.objects.first()
    data = {
        'icono': opc_icono, 'crud': crud, 'entidad': opc_entidad, 'empresa': config,
        'boton': 'Editar', 'titulo': 'Configuracion', 'form': EmpresaForm(instance=config),
        'id_prov': config.ubicacion.canton.provincia.id, 'id_text': config.ubicacion.canton.provincia.nombre,
        'id_cant': config.ubicacion.canton.id, 'id_text_cant': config.ubicacion.canton.nombre,
        'id_parr': config.ubicacion.id, 'id_text_parr': config.ubicacion.nombre,

    }
    if request.method == 'GET':
        f = EmpresaForm(instance=config)
        data['form'] = f
        return render(request, 'front-end/empresa/empresa_form.html', data)
    else:
        try:
            data = {}
            dato = request.POST
            if dato:
                config.nombre = dato['nombre']
                config.ubicacion_id = dato['ubicacion']
                config.direccion = dato['direccion']
                config.ruc = dato['ruc']
                config.correo = dato['correo']
                config.telefono = dato['telefono']
                config.facebook = dato['facebook']
                config.twitter = dato['twitter']
                config.instagram = dato['instagram']
                config.iva = dato['iva']
                config.indice = dato['indice']
                config.tasa = dato['tasa']
                config.save()
                data['resp'] = True
                return JsonResponse(data, safe=False)
        except Exception as e:
            data['error'] = str(e)