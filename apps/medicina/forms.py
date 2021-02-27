from django import forms
from django.forms import TextInput

from .models import Medicina
from ..tipo_medicina.models import Tipo_medicina


class MedicinaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['tipo_medicina'].widget.attrs = {
                'class': 'form-control select2 input-sm',
                'style': "width: 100%"
            }
        # habilitar, desabilitar, y mas

    class Meta:
        model = Medicina
        fields = ['tipo_medicina']
        labels = {'tipo_medicina': 'Tipo'}


class TipomedicinaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['nombre'].widget = TextInput(
                attrs={'placeholder': 'Nombre de la Medicina', 'class': 'form-control input-sm',
                       'id': 'id_nombre_tipo'})
            # habilitar, desabilitar, y mas

    class Meta:
        model = Tipo_medicina
        fields = ['nombre']
        labels = {'nombre': 'Nombre'}
        widgets = {'nombre': forms.TextInput()}
