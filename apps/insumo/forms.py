from django import forms
from datetime import *
from django.forms import SelectDateWidget, TextInput, NumberInput, EmailInput

from .models import Insumo
from ..tipo_medicina.models import Tipo_medicina
from ..ubicacion.models import Parroquia


class InsumoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['nombre'].widget = TextInput(
                attrs={'placeholder': 'Ingrese el nombre del insumo', 'class': 'form-control',
                       'id': 'id_nombre_insumo'})
            self.fields['descripcion'].widget = TextInput(
                attrs={'placeholder': 'Ingrese una Descripcion', 'class': 'form-control',
                       'id': 'id_descripcion_insumo'})
            self.fields['categoria'].widget.attrs = {
                'class': 'form-control select2 input-sm',
                'style': "width: 100%"
            }
        # habilitar, desabilitar, y mas

    class Meta:
        model = Insumo
        fields = ['nombre',
                  'descripcion',
                  'categoria'
                  ]
        labels = {
            'nombre': 'Nombre',
            'descripcion': 'Descripcion',
            'categoria': 'Categoria'
        }
        widgets = {
            'nombre': forms.TextInput(),
            'descripcion': forms.TextInput()
        }


