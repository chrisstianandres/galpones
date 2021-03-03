from django import forms
from django.forms import TextInput

from apps.causa_muerte.models import Causa_muerte


class Causa_muerteForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['nombre'].widget = TextInput(
                attrs={'placeholder': 'Ingrese el nombre de la causa de muerte', 'class': 'form-control',
                       'id': 'id_nombre_causa_muerte'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Causa_muerte
        fields = ['nombre']
        labels = {'nombre': 'Nombre'}
        widgets = {'nombre': forms.TextInput()}
