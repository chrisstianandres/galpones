from datetime import *

from django import forms
from django.db import transaction
from django.forms import TextInput, EmailInput, SelectMultiple

from .models import User
# from ..cliente.models import Cliente
from django.contrib.auth.models import Group


class UserForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        this_year = datetime.now().year
        years = range(this_year - 15, this_year - 3)
        for field in self.Meta.fields:
            # self.fields[field].widget.attrs.update({
            #     'class': 'form-control'
            # })

            self.fields['first_name'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos nombres', 'class': 'form-control form-rounded'})
            self.fields['last_name'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos Apellidos', 'class': 'form-control form-rounded'})
            self.fields['cedula'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero de cedula', 'class': 'form-control form-rounded'})
            self.fields['email'].widget = EmailInput(
                attrs={'placeholder': 'abc@correo.com', 'class': 'form-control form-rounded'})
            # self.fields['direccion'].widget = TextInput(
            #     attrs={'placeholder': 'Ingresa una direccion', 'class': 'form-control form-rounded'})
            self.fields['telefono'].widget = TextInput(
                attrs={'placeholder': 'Ingresa un numero de telefono', 'class': 'form-control form-rounded'})
            self.fields['celular'].widget = TextInput(
                attrs={'placeholder': 'Ingresa un numero de celular', 'class': 'form-control form-rounded'})
            self.fields['username'].widget = TextInput(
                attrs={'placeholder': 'Ingresa un nombre de usuario', 'class': 'form-control form-rounded'})
            self.fields['sexo'].widget.attrs = {
                'class': 'form-control select2'
            }
            self.fields['tipo'].widget.attrs = {
                'class': 'form-control select2',
                'style': "display: none"
            }
            # self.fields["fecha_nacimiento"].widget = SelectDateWidget(years=years,
            #                                                         attrs={'class': 'selectpicker'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = User
        fields = ['username',
                  'first_name',
                  'last_name',
                  'tipo',
                  'cedula',
                  'email',
                  'avatar',
                  'sexo',
                  'telefono',
                  'celular',
                  'direccion',
                  'groups',
                  'password',
                  ]
        labels = {
            'username': 'Nombre de Usuario',
            'first_name': 'Nombres',
            'last_name': 'Apellidos',
            'tipo': 'Tipo de Usuario',
            'cedula': 'N° de cedula',
            'email': 'Correo',
            'avatar': 'Imagen',
            'sexo': 'Genero',
            'telefono': 'Telefono',
            'celular': 'Celular',
            'direccion': 'Direccion',
            'password': 'Contraseña'
        }
        widgets = {
            'username': forms.TextInput(),
            'first_name': forms.TextInput(),
            'last_name': forms.TextInput(),
            'cedula': forms.TextInput(),
            'sexo': forms.Select(),
            'tipo': forms.Select(),
            'correo': forms.EmailInput(),
            'telefono': forms.TextInput(),
            'celular': forms.TextInput(),
            'direccion': forms.Textarea(attrs={'placeholder': 'Ingresa una direccion', 'class': 'form-control',
                                               'rows': '4', 'cols': '30'}),
            'groups': forms.SelectMultiple(attrs={'class': 'form-control', 'style': '100%', 'multiple': 'multiple'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Ingresa una contraseña'},
                                            render_value=True)
        }

    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                pwd = self.cleaned_data['password']
                u = form.save(commit=False)
                if u.pk is None:
                    u.set_password(pwd)
                else:
                    user = User.objects.get(pk=u.pk)
                    if user.password != pwd:
                        u.set_password(pwd)
                u.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data


class GroupForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['name'].widget.attrs = {
                'class': 'form-control form-control-sm input-sm'}

    class Meta:
        model = Group
        fields = ['name']
        labels = {'name': 'Nombre'}
        widgets = {'name': forms.TextInput()}


class ResetPasswordForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Ingrese un username',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    def clean(self):
        cleaned = super().clean()
        if not User.objects.filter(username=cleaned['username']).exists():
            self._errors['error'] = self._errors.get('error', self.error_class())
            self._errors['error'].append('El usuario no existe')
            # raise forms.ValidationError('El usuario no existe')
        return cleaned

    def get_user(self):
        username = self.cleaned_data.get('username')
        return User.objects.get(username=username)


class ChangePasswordForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Ingrese un password',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    confirmPassword = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Repita el password',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    def clean(self):
        cleaned = super().clean()
        password = cleaned['password']
        confirmPassword = cleaned['confirmPassword']
        if password != confirmPassword:
            self._errors['error'] = self._errors.get('error', self.error_class())
            self._errors['error'].append('El usuario no existe')
            raise forms.ValidationError('Las contraseñas deben ser iguales')
        return cleaned



