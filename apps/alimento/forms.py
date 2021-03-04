from django import forms
from django.forms import TextInput

from .models import Alimento
from ..presentacion.models import Presentacion


class AlimentoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['presentacion'].widget.attrs = {
                'class': 'form-control select2 input-sm',
                'style': "width: 100%"
            }
        # habilitar, desabilitar, y mas

    class Meta:
        model = Alimento
        fields = ['presentacion']
        labels = {'presentacion': 'Presentacion'}

