import json

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, UpdateView, TemplateView, View


from apps.backEnd import nombre_empresa

from apps.mixins import ValidatePermissionRequiredMixin
from apps.user.forms import GroupForm

from apps.user.forms import UserForm
from apps.user.models import User


opc_icono = 'fas fa-user-shield'
opc_entidad = 'Usuarios'
empresa = nombre_empresa()


class lista(ValidatePermissionRequiredMixin, ListView):
    model = User
    template_name = 'front-end/user/list.html'
    permission_required = 'user.view_user'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                if request.user.username == 'soporte':
                    user = User.objects.all()
                else:
                    user = User.objects.all().exclude(username='soporte')
                for c in user:
                    data.append(c.toJSON())
            elif action == 'estado':
                id = request.POST['id']
                ps = User.objects.get(pk=id)
                if ps.estado == 1:
                    ps.estado = 0
                    ps.save()
                    data['resp'] = True
                elif ps.estado == 0:
                    ps.estado = 1
                    ps.save()
                    data['resp'] = True
                else:
                    data['error'] = 'Ha ocurrido un error'
            elif action == 'delete':
                try:
                    id = request.POST['id']
                    if id:
                        ps = User.objects.get(pk=id)
                        ps.delete()
                        data['resp'] = True
                    else:
                        data['error'] = 'Ha ocurrido un error'
                except Exception as e:
                    data['error'] = str(e)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nuevo Usuario'
        data['titulo'] = 'Listado de Usuarios'
        data['nuevo'] = '/usuario/nuevo'
        data['form'] = UserForm
        data['empresa'] = empresa
        data['titulo_lista'] = 'Listado de Usuarios'
        return data


class CrudView(ValidatePermissionRequiredMixin, TemplateView):
    form_class = UserForm
    template_name = 'front-end/user/form.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                f = UserForm(request.POST, request.FILES)
                if f.is_valid():
                    f.save(commit=False)
                    if verificar(f.data['cedula']):
                        f.save()
                        return HttpResponseRedirect('/user/lista')
                    else:
                        data = self.get_context_data()
                        f.add_error("cedula", "Numero de Cedula no valido para Ecuador")
                        data['form'] = f
                else:
                    data = self.get_context_data()
                    data['error'] = f.errors
                    data['form'] = f
                return render(request, 'front-end/user/form.html', data)
            elif action == 'delete':
                pk = request.POST['id']
                cli = User.objects.get(pk=pk)
                cli.delete()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        data = super(CrudView, self).get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar Usuario'
        data['titulo'] = 'Registro de Usuarios'
        data['nuevo'] = '/usuario/nuevo'
        data['action'] = 'add'
        data['form'] = UserForm
        data['empresa'] = empresa
        return data


class Updateview(ValidatePermissionRequiredMixin, UpdateView):
    model = User
    form_class = UserForm
    success_url = 'user:lista'
    template_name = 'front-end/user/form.html'
    permission_required = 'user.change_user'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            pk = self.kwargs.get('pk', 0)
            user = self.model.objects.get(id=pk)
            data = {
                'icono': opc_icono, 'crud': '/user/editar/' + str(self.kwargs['pk']), 'entidad': opc_entidad,
                'empresa': empresa,
                'boton': 'Guardar Edicion', 'titulo': 'Edicion del Registro de un Usuario',
                'action': 'edit'
            }
            if action == 'edit':
                f = self.form_class(request.POST, request.FILES, instance=user)
                if f.is_valid():
                    f.save(commit=False)
                    if verificar(f.data['cedula']):
                        f.save()
                        data['resp'] = True
                    else:
                        f.add_error("cedula", "Numero de Cedula no valido para Ecuador")
                        data['error'] = f.errors
                        data['form'] = f
                        return render(request, 'front-end/user/form.html', data)
                else:
                    data['form'] = f
                    data['error'] = f.errors
                    return render(request, 'front-end/user/form.html', data)
                return HttpResponseRedirect('/user/lista')
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        pk = self.kwargs.get('pk', 0)
        user = self.model.objects.get(id=pk)
        data['form'] = self.form_class(instance=user)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Guardar Edicion'
        data['titulo'] = 'Edicion del Registro de un Usuario'
        data['action'] = 'edit'
        data['crud'] = '/user/editar/' + str(self.kwargs['pk'])
        data['empresa'] = empresa
        return data


class Listgroupsview(ValidatePermissionRequiredMixin, ListView):
    model = Group
    template_name = 'front-end/group/group_list.html'
    permission_required = 'auth.view_group'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'list':
                data = []
                user = Group.objects.all()
                for c in user:
                    data.append({'id': int(c.id), 'nombre': str(c.name),
                                 'permisos': [{'nombre': p['content_type__model']}
                                              for p in c.permissions.values('content_type__model')
                                .annotate(Count('content_type__model')).order_by('content_type__model')
                                .exclude(content_type__model__in=['logentry', 'permission', 'contenttype', 'session',
                                                                                              'detalle_venta',
                                                                                              'detalle_compra',
                                                                  'portadas', 'canton',  'provincia', 'parroquia'])]})
            elif action == 'delete':
                try:
                    id = request.POST['id']
                    if id:
                        ps = Group.objects.get(pk=id)
                        if not request.user.groups.filter(id=ps.id):
                            ps.delete()
                            data['resp'] = True
                        else:
                            data['error'] = 'Este grupo de permisos esta asignado a 1 o mas usuarios'
                    else:
                        data['error'] = 'Ha ocurrido un error'
                except Exception as e:
                    data['error'] = str(e)
            else:
                data['error'] = 'No ha seleccionado una opcion'
        except Exception as e:
            data['error'] = 'No ha seleccionado una opcion'
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = 'fa fa-user-lock'
        data['entidad'] = 'Grupos'
        data['boton'] = 'Nuevo Grupo'
        data['titulo'] = 'Listado de Grupos'
        data['nuevo'] = '/usuario/grupo'
        data['form'] = UserForm
        data['empresa'] = empresa
        return data


class CrudViewGroup(ValidatePermissionRequiredMixin, TemplateView):
    form_class = Group
    template_name = 'front-end/group/group_form.html'
    permission_required = 'auth.add_group'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'modelos':
                data = []
                contentype = ContentType.objects.order_by('model')
                x = 1
                for c in contentype.exclude(model__in=['logentry', 'permission', 'session', 'contenttype', 'cargo',
                                                       'detalle_venta', 'detalle_compra', 'portadas', 'canton',
                                                       'provincia', 'parroquia']):
                    nombre = c.model
                    if c.name == 'grupo':
                        nombre = 'rol'
                    data.append({'id': c.id, 'nombre': nombre, 'num': x, 'check': 0})
                    x += 1
            elif action == 'add':
                datos = json.loads(request.POST['permisos'])
                grupo = Group()
                grupo.name = datos['nombre']
                grupo.save()
                for p in datos['modelos']:
                    if p['check'] == 1:
                        add = '{}_{}'.format('add', p['nombre'])
                        permiso_add = Permission.objects.get(codename=add)
                        grupo.permissions.add(permiso_add.id)
                        view = '{}_{}'.format('view', p['nombre'])
                        permiso_view = Permission.objects.get(codename=view)
                        grupo.permissions.add(permiso_view.id)
                        change = '{}_{}'.format('change', p['nombre'])
                        permiso_change = Permission.objects.get(codename=change)
                        grupo.permissions.add(permiso_change.id)
                        delete = '{}_{}'.format('delete', p['nombre'])
                        permiso_delete = Permission.objects.get(codename=delete)
                        grupo.permissions.add(permiso_delete.id)
                    grupo.save()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Grupos'
        data['boton'] = 'Guardar Grupo'
        data['titulo'] = 'Nuevo Grupos'
        data['nuevo'] = '/usuario/newgroup'
        data['form'] = GroupForm
        data['action'] = 'add'
        data['empresa'] = empresa
        data['option'] = 'modelos'
        return data


class UpdateGroup(ValidatePermissionRequiredMixin, UpdateView):
    model = Group
    form_class = GroupForm
    template_name = 'front-end/group/group_form.html'
    success_url = 'user:groups'
    permission_required = 'auth.add_change'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'editar':
                data = []
                pk = self.kwargs['pk']
                contentype = ContentType.objects.all().order_by('model')
                x = 1
                for c in contentype.exclude(model__in=['logentry', 'permission', 'session', 'contenttype', 'cargo',
                                                       'detalle_venta', 'detalle_compra', 'portadas', 'canton',
                                                       'provincia', 'parroquia']):
                    nombre = c.model
                    set_add = 0
                    if Group.objects.filter(permissions__content_type__model=nombre, id=pk):
                        set_add = 1
                    data.append({'id': c.id, 'nombre': nombre, 'num': x, 'check': set_add})

                    x += 1
            elif action == 'add':
                datos = json.loads(request.POST['permisos'])
                grupo = Group.objects.get(id=self.kwargs['pk'])
                grupo.permissions.clear()
                grupo.name = datos['nombre']
                grupo.save()
                for p in datos['modelos']:
                    if p['check'] == 1:
                        add = '{}_{}'.format('add', p['nombre'])
                        permiso_add = Permission.objects.get(codename=add)
                        grupo.permissions.add(permiso_add.id)
                        view = '{}_{}'.format('view', p['nombre'])
                        permiso_view = Permission.objects.get(codename=view)
                        grupo.permissions.add(permiso_view.id)
                        change = '{}_{}'.format('change', p['nombre'])
                        permiso_change = Permission.objects.get(codename=change)
                        grupo.permissions.add(permiso_change.id)
                        delete = '{}_{}'.format('delete', p['nombre'])
                        permiso_delete = Permission.objects.get(codename=delete)
                        grupo.permissions.add(permiso_delete.id)
                    grupo.save()
                data['resp'] = True
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        grupo = self.model.objects.get(id=self.kwargs['pk'])
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = 'Grupos'
        data['boton'] = 'Guardar Grupo'
        data['titulo'] = 'Editar Grupos'
        data['nuevo'] = '/usuario/newgroup'
        data['form'] = GroupForm(instance=grupo)
        data['action'] = 'add'
        data['empresa'] = empresa
        data['option'] = 'editar'
        return data


@csrf_exempt
def estado(request):
    data = {}
    try:
        id = int(request.POST['id'])
        ps = User.objects.get(pk=id)
        if ps.estado == 1:
            ps.estado = 0
            ps.save()
            data['resp'] = True
        elif ps.estado == 0:
            ps.estado = 1
            ps.save()
            data['resp'] = True
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data)


def profile(request):
    empleado = User.objects.get(id=request.user.id)
    crud = '/user/profile'
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': crud,
        'boton': 'Guardar Uusuario', 'action': 'add', 'titulo': 'Perfil de Usuario', 'empresa': nombre_empresa()
    }
    if request.method == 'GET':
        form = UserForm(instance=empleado)
        data['form'] = form
    else:
        form = UserForm(request.POST, request.FILES, instance=empleado)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/user/profile')
        else:
            data['form'] = form
    return render(request, 'front-end/profile.html', data)
    # return render(request, 'front-end/profile.html', data)


def verificar(nro):
    error = ''
    l = len(nro)
    if l == 10 or l == 13:  # verificar la longitud correcta
        cp = int(nro[0:2])
        if cp >= 1 and cp <= 22:  # verificar codigo de provincia
            tercer_dig = int(nro[2])
            if tercer_dig >= 0 and tercer_dig < 6:  # numeros enter 0 y 6
                if l == 10:
                    return __validar_ced_ruc(nro, 0)
                elif l == 13:
                    return __validar_ced_ruc(nro, 0) and nro[
                                                         10:13] != '000'  # se verifica q los ultimos numeros no sean 000
            elif tercer_dig == 6:
                return __validar_ced_ruc(nro, 1)  # sociedades publicas
            elif tercer_dig == 9:  # si es ruc
                return __validar_ced_ruc(nro, 2)  # sociedades privadas
            else:
                error = 'Tercer digito invalido'
                return False and error
        else:
            error = 'Codigo de provincia incorrecto'
            return False and error
    else:
        error = 'Longitud incorrecta del numero ingresado'
        return False and error


def __validar_ced_ruc(nro, tipo):
    total = 0
    if tipo == 0:  # cedula y r.u.c persona natural
        base = 10
        d_ver = int(nro[9])  # digito verificador
        multip = (2, 1, 2, 1, 2, 1, 2, 1, 2)
    elif tipo == 1:  # r.u.c. publicos
        base = 11
        d_ver = int(nro[8])
        multip = (3, 2, 7, 6, 5, 4, 3, 2)
    elif tipo == 2:  # r.u.c. juridicos y extranjeros sin cedula
        base = 11
        d_ver = int(nro[9])
        multip = (4, 3, 2, 7, 6, 5, 4, 3, 2)
    for i in range(0, len(multip)):
        p = int(nro[i]) * multip[i]
        if tipo == 0:
            total += p if p < 10 else int(str(p)[0]) + int(str(p)[1])
        else:
            total += p
    mod = total % base
    val = base - mod if mod != 0 else 0
    return val == d_ver


class UserChangeGroup(View):

    def get(self, request, *args, **kwargs):
        try:
            request.session['group'] = Group.objects.get(pk=self.kwargs['pk'])
            print(request.session)
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('menu'))


