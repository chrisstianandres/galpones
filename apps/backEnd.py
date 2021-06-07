import json
import smtplib
import uuid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.contrib.auth import *
from django.contrib.auth.models import Group
from django.contrib.auth.views import LoginView
from django.db.models import Sum
from django.http import *
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# -----------------------------------------------PAGINA PRINCIPAL-----------------------------------------------------#
from django.views.generic import FormView, TemplateView

from apps.alimento.models import Alimento
from apps.compra.models import Detalle_compra
from apps.empresa.models import Empresa
from apps.medicina.models import Medicina
from apps.user.forms import ResetPasswordForm, ChangePasswordForm
from apps.user.models import User
from galpones.settings import MEDIA_URL


def nombre_empresa():
    if Empresa.objects.filter(id=1).exists():
        empresa = Empresa.objects.first()
    else:
        empresa = {'nombre': 'Sin nombre'}
    return empresa


# @csrf_exempt
# def menu(request):
#     data = {
#         'titulo': 'Menu Principal', 'empresa': nombre_empresa(),
#         'icono': 'fas fa-tachometer-alt', 'entidad': 'Menu Principal',
#         'imagen1': '{}{}'.format(MEDIA_URL, 'frente1.jpeg'),
#         'imagen2': '{}{}'.format(MEDIA_URL, 'frente2.jpeg'),
#     }
#     if request.method == 'POST':
#         try:
#             action = request.POST['action']
#             model = Detalle_compra
#             if action == 'report':
#                 data = []
#                 query = model.objects.values('insumo_id').annotate(
#                     stock=Sum('stock_actual')).filter(
#                     compra__estado=1, insumo__tipo_insumo=1).order_by('insumo_id')
#                 query2 = model.objects.values('insumo_id').filter(
#                     compra__estado=1, insumo__tipo_insumo=0).annotate(
#                     stock=Sum('stock_actual')).order_by('insumo_id')
#                 for p in query:
#                     for m in Medicina.objects.filter(insumo_id=p['insumo_id']):
#                         item = [m.insumo.nombre, m.insumo.get_tipo_insumo_display(),
#                                 m.insumo.categoria.nombre, m.tipo_medicina.nombre, p['stock']]
#                         data.append(item)
#                 for a in query2:
#                     for al in Alimento.objects.filter(insumo_id=a['insumo_id']):
#                         item = [al.insumo.nombre, al.insumo.get_tipo_insumo_display(),
#                                 al.insumo.categoria.nombre, al.presentacion.nombre, a['stock']]
#                         data.append(item)
#             else:
#                 data['error'] = 'No ha seccionado una opcion'
#         except Exception as e:
#              data['error'] = str(e)
#         return JsonResponse(data, safe=False)
#     return render(request, 'front-end/index.html', data)


# -----------------------------------------------LOGEO----------------------------------------------------------------#

# def logeo(request):
#     data = {}
#     if not request.user.is_authenticated:
#         data['title'] = 'Inicio de Sesion'
#         data['nomb'] = nombre_empresa()
#     else:
#         return HttpResponseRedirect("/menu")
#     return render(request, 'front-end/login2.html', data)

class DashboardView(TemplateView):
    template_name = 'front-end/index.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        request.user.get_group_session()
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            model = Detalle_compra
            if action == 'report':
                data = []
                query = model.objects.values('insumo_id').annotate(stock=Sum('stock_actual')) \
                    .filter(compra__estado=1, insumo__tipo_insumo=1).order_by('insumo_id')
                query2 = model.objects.values('insumo_id').filter(compra__estado=1, insumo__tipo_insumo=0).annotate(
                    stock=Sum('stock_actual')).order_by('insumo_id')
                for p in query:
                    for m in Medicina.objects.filter(insumo_id=p['insumo_id']):
                        item = [m.insumo.nombre, m.insumo.get_tipo_insumo_display(),
                                m.insumo.categoria.nombre, m.tipo_medicina.nombre, p['stock']]
                        data.append(item)
                    for a in query2:
                        for al in Alimento.objects.filter(insumo_id=a['insumo_id']):
                            item = [al.insumo.nombre, al.insumo.get_tipo_insumo_display(),
                                    al.insumo.categoria.nombre, al.presentacion.nombre, a['stock']]
                            data.append(item)
            else:
                data['error'] = 'No ha seccionado una opcion'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['titulo'] = 'Menu Principal'
        data['empresa'] = nombre_empresa()
        data['icono'] = 'fas fa-tachometer-alt'
        data['entidad'] = 'Menu Principal'
        data['imagen1'] = '{}{}'.format(MEDIA_URL, 'frente1.jpeg')
        data['imagen2'] = '{}{}'.format(MEDIA_URL, 'frente2.jpeg')
        data['imagen3'] = '{}{}'.format(MEDIA_URL, 'frente3.jpeg')
        # group = Group.objects.filter(id=self.request.session['group'].id)
        # if group.exists():
        #     data['perms'] = [{p.content_type.app_label: p.codename} for p in Group.objects.get(id=self.request.session['group'].id).permissions.all()]
        #     print(data['perms'])
        return data


class LoginFormView(LoginView):
    template_name = 'front-end/login2.html'

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(settings.LOGIN_REDIRECT_URL)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.estado == 1:
                login(request, user)
                data['resp'] = True
            else:
                data['error'] = '<strong>Usuario Inactivo </strong>'
        else:
            data['error'] = '<strong>Usuario no valido </strong><br>' \
                            'Verifica las credenciales de acceso y vuelve a intentarlo.'
        return JsonResponse(data)

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['title'] = 'Inicio de Sesion'
        data['nomb'] = nombre_empresa()
        return data


class ResetPasswordView(FormView):
    form_class = ResetPasswordForm
    template_name = 'front-end/reset_password.html'
    success_url = reverse_lazy(settings.LOGIN_REDIRECT_URL)

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def send_email_reset_pwd(self, user):
        data = {}
        try:
            URL = settings.DOMAIN if not settings.DEBUG else self.request.META['HTTP_HOST']
            user.token = uuid.uuid4()
            user.save()
            mailServer = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
            mailServer.starttls()
            mailServer.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            email_to = user.email
            mensaje = MIMEMultipart()
            mensaje['From'] = settings.EMAIL_HOST_USER
            mensaje['To'] = email_to
            mensaje['Subject'] = 'Reseteo de contraseña'
            empresa = nombre_empresa()
            content = render_to_string('front-end/send_email.html', {
                'user': user,
                'link_resetpwd': 'http://{}/change_pass/{}/'.format(URL, str(user.token)),
                'empresa': empresa
            })
            mensaje.attach(MIMEText(content, 'html'))
            mailServer.sendmail(settings.EMAIL_HOST_USER, email_to, mensaje.as_string())
        except Exception as e:
            data['error'] = str(e)
        return data

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            form = ResetPasswordForm(request.POST)  # self.get_form()
            if form.is_valid():
                user = form.get_user()
                data = self.send_email_reset_pwd(user)
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Reseteo de Contraseña'
        context['nomb'] = nombre_empresa()
        return context


class ChangePasswordView(FormView):
    form_class = ChangePasswordForm
    template_name = 'front-end/change_password.html'
    success_url = reverse_lazy(settings.LOGIN_REDIRECT_URL)

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        token = self.kwargs['token']
        if User.objects.filter(token=token).exists():
            return super().get(request, *args, **kwargs)
        return HttpResponseRedirect('/')

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            form = ChangePasswordForm(request.POST)
            if form.is_valid():
                user = User.objects.get(token=self.kwargs['token'])
                user.set_password(request.POST['password'])
                user.token = uuid.uuid4()
                user.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Cambio de Contraseña'
        context['login_url'] = settings.LOGIN_URL
        context['nomb'] = nombre_empresa()
        return context


# class signin(TemplateView):
#     form_class = UserForm_online
#     template_name = 'front-end/signin.html'
#
#     @method_decorator(csrf_exempt)
#     def dispatch(self, request, *args, **kwargs):
#         return super().dispatch(request, *args, **kwargs)
#
#     def post(self, request, *args, **kwargs):
#         data = {}
#         action = request.POST['action']
#         try:
#             if action == 'add':
#                 f = UserForm_online(request.POST, request.FILES)
#                 if f.is_valid():
#                     f.save(commit=False)
#                     if verificar(f.data['cedula']):
#                         user = f.save()
#                         # print(user.id)
#
#                         return HttpResponseRedirect('/login')
#                     else:
#                         f.add_error("cedula", "Numero de Cedula no valido para Ecuador")
#                         data['form'] = f
#                 else:
#                     data['title'] = 'Registro de usuario'
#                     data['nomb'] = nombre_empresa()
#                     data['crud'] = '/signin/'
#                     data['action'] = 'add'
#                     data['error'] = f.errors
#                     data['form'] = f
#                     return render(request, 'front-end/signin.html', data)
#             else:
#                 data['error'] = 'No ha seleccionado ninguna opción'
#         except Exception as e:
#             data['error'] = str(e)
#         return HttpResponse(json.dumps(data), content_type='application/json')
#
#     def get(self, request, *args, **kwargs):
#         data = {}
#         if not self.request.user.is_authenticated:
#             data['title'] = 'Registro de usuario'
#             data['nomb'] = nombre_empresa()
#             data['form'] = UserForm_online()
#             data['crud'] = '/signin/'
#             data['action'] = 'add'
#         else:
#             return HttpResponseRedirect("/")
#         return render(request, self.template_name, data)
#
#     def get_context_data(self, **kwargs):
#         data = super().get_context_data(**kwargs)
#         data['title'] = 'Registro de usuario'
#         data['nomb'] = nombre_empresa()
#         data['form'] = UserForm_online()
#         data['crud'] = '/signin/'
#         data['action'] = 'add'
#         return data


@csrf_exempt
def connect(request):
    data = {}
    if request.method == 'POST' or None:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.estado == 1:
                login(request, user)
                data['resp'] = True
            else:
                data['error'] = '<strong>Usuario Inactivo </strong>'
        else:
            data['error'] = '<strong>Usuario no valido </strong><br>' \
                            'Verifica las credenciales de acceso y vuelve a intentarlo.'
    else:
        data['error'] = 'Metodo Request no es Valido.'
    return HttpResponse(json.dumps(data), content_type="application/json")


@csrf_exempt
def disconnect(request):
    data = []
    logout(request)
    return HttpResponse(json.dumps(data))


@csrf_exempt
def check_ced(request):
    data = {}
    nro = request.POST['data']
    if verificar(nro):
        data['resp'] = True
    else:
        data['error'] = "Numero de Cedula no valido para Ecuador"
    return JsonResponse(data)


def verificar(nro):
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
