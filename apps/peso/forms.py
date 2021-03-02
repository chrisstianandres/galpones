from datetime import datetime

from django import forms
from django.forms import TextInput

from .models import Peso


class PesoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control'})
            self.fields['fecha'].widget = TextInput(attrs={'class': 'form-control input-sm', 'id': 'id_fecha_peso',
                                                           'disabled': True})
            self.fields['fecha'].initial = datetime.now().strftime('%Y/%m/%d')
            self.fields['peso_promedio'].widget = TextInput(attrs={'class': 'form-control input-sm'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Peso
        fields = ['fecha', 'peso_promedio' ]
        labels = {'fecha': 'Fecha Registro', 'peso_promedio': 'Peso Promedio'}
        widgets = {'fecha': forms.TextInput(), 'peso_promedio': forms.TextInput()}
