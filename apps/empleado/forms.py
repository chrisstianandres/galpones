from datetime import *

from django import forms
from django.forms import TextInput, EmailInput

from .models import Empleado


class EmpleadoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        this_year = datetime.now().year
        years = range(this_year - 15, this_year - 3)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['nombres'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos nombres', 'class': 'form-control'})
            self.fields['apellidos'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos Apellidos', 'class': 'form-control'})
            self.fields['cedula'].widget = TextInput(
                attrs={'placeholder': 'Ingrese un numero de cedula', 'class': 'form-control'})
            self.fields['correo'].widget = EmailInput(
                attrs={'placeholder': 'abc@correo.com', 'class': 'form-control'})
            self.fields['direccion'].widget = TextInput(
                attrs={'placeholder': '(Maximo 50 caracteres)', 'class': 'form-control'})
            self.fields['telefono'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero de telefono', 'class': 'form-control'})
            self.fields['celular'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero de celular', 'class': 'form-control'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Empleado
        fields = ['nombres',
                  'apellidos',
                  'cedula',
                  'correo',
                  'sexo',
                  'telefono',
                  'celular',
                  'direccion'
                  ]
        labels = {
            'nombres': 'Nombres',
            'apellidos': 'Apellidos',
            'cedula': 'N° de cedula',
            'correo': 'Correo',
            'sexo': 'Genero',
            'telefono': 'Telefono',
            'celular': 'Celular',
            'Direccion': 'direccion'

        }
        widgets = {
            'nombres': forms.TextInput(),
            'apellidos': forms.TextInput(),
            'cedula': forms.TextInput(),
            'sexo': forms.Select(attrs={'class': 'selectpicker', 'data-width': 'fit'}),
            'correo': forms.EmailInput(),
            'telefono': forms.TextInput(),
            'celular': forms.TextInput(),
            'direccion': forms.TextInput()
        }
