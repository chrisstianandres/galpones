from django import forms
from datetime import *
from django.forms import SelectDateWidget, TextInput, NumberInput, EmailInput

from .models import Empresa, Portadas
from ..ubicacion.models import Parroquia


class EmpresaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['nombre'].widget = TextInput(
                attrs={'placeholder': 'Ingrese el nombre de la Empresa', 'class': 'form-control form-rounded'})
            self.fields['direccion'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero la direccion de la empresa',
                       'class': 'form-control form-rounded'})
            self.fields['correo'].widget = TextInput(attrs={'placeholder': 'Ingrese numero la direccion de la empresa',
                                                            'class': 'form-control form-rounded'})
            # self.fields['ciudad'].widget = TextInput(attrs={'placeholder': 'Ingrese numero la direccion de la empresa',
            #                                                 'class': 'form-control form-rounded'})
            self.fields['telefono'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero la direccion de la empresa',
                       'class': 'form-control form-rounded'})
            self.fields['iva'].widget = TextInput(attrs={'class': 'form-control form-rounded', 'value': 0.12})
            self.fields['ruc'].widget = TextInput(attrs={'placeholder': 'Ingrese numero la direccion de la empresa',
                                                         'class': 'form-control form-rounded'})
            self.fields['indice'].widget = TextInput(attrs={'class': 'form-control form-rounded'})
            self.fields['tasa'].widget = TextInput(attrs={'class': 'form-control form-rounded'})
            self.fields['ubicacion'].queryset = Parroquia.objects.none()

        # habilitar, desabilitar, y mas

    class Meta:
        model = Empresa
        fields = ['nombre',
                  'ubicacion',
                  'ruc',
                  'foto',
                  'correo',
                  'direccion',
                  'iva',
                  'indice',
                  'tasa',
                  'telefono'
                  ]
        labels = {
            'nombre': 'Nombre',
            'ubicacion': 'Parroquia',
            'ruc': 'Ruc',
            'correo': 'Correo',
            'direccion': 'Direccion',
            'foto': 'Imagen',
            'iva': 'Iva',
            'tasa': 'Tasa de interes',
            'indice': 'Indice de Ganancia',
            'telefono': 'Telefono',
        }
        widgets = {
            'nombre': forms.TextInput(),
            # 'ciudad': forms.TextInput(),
            'ruc': forms.TextInput(),
            'correo': forms.TextInput(),
            'direccion': forms.TextInput(),
            'iva': forms.TextInput(),
            'tasa': forms.TextInput(),
            'indice': forms.TextInput(),
            'telefono': forms.TextInput()
        }


class PortadaForm(forms.ModelForm):

    class Meta:
        model = Portadas
        fields = ['avatar']
        labels = {'avatar': 'Foto'}