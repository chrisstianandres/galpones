from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView

from apps.mixins import ValidatePermissionRequiredMixin
from apps.ubicacion.models import Provincia, Canton, Parroquia


class lista(ListView):
    model = Provincia
    template_name = "front-end/cliente/list.html"

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}

        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                for c in Provincia.objects.all():
                    data.append({'id': c.id, 'nombre': c.nombre})
            elif action == 'provincia':
                data = []
                term = request.POST['term']
                query = Provincia.objects.filter(nombre__icontains=term)[0:10]
                for a in query:
                    result = {'id': int(a.id), 'text': str(a.nombre)}
                    data.append(result)
            elif action == 'canton_insert':
                data = []
                id = request.POST['id']
                query = Canton.objects.filter(provincia_id=id).order_by('nombre')
                result = {'id': 0, 'text': '--------------------------'}
                data.append(result)
                for c in query:
                    result = {'id': int(c.id), 'text': str(c.nombre)}
                    data.append(result)
            elif action == 'parroquia':
                data = []
                id = request.POST['id']
                result = {'id': 0, 'text': '--------------------------'}
                data.append(result)
                query = Parroquia.objects.filter(canton_id=id)
                for p in query:
                    result = {'id': int(p.id), 'text': str(p.nombre)}
                    data.append(result)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
            print(e)
        return JsonResponse(data, safe=False)