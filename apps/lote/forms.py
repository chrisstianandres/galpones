from django import forms
from datetime import *
from django.forms import SelectDateWidget, TextInput, NumberInput, EmailInput

from .models import Lote


class LoteForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['raza'].widget.attrs = {
                'class': 'form-control select2',
                'data-live-search': "true"
            }
            self.fields['cantidad'].widget = TextInput(
                attrs={'class': 'form-control input-sm'})
            self.fields['fecha'].widget = TextInput(
                attrs={'class': 'form-control input-sm',
                       'readonly': True
                       })
            self.fields['fecha'].initial = datetime.now().strftime('%d-%m-%Y')
            self.fields['valor_pollito'].widget = TextInput(
                attrs={'class': 'form-control input-sm'})

        # habilitar, desabilitar, y mas

    class Meta:
        model = Lote
        fields = ['fecha', 'cantidad', 'valor_pollito', 'raza']
        labels = {'raza': 'Tipo Ave', 'cantidad': 'Cantidad', 'fecha': 'Fecha', 'valor_pollito': 'Valor por Ave'}
        widgets = {'cantidad': forms.TextInput(), 'fecha': forms.TextInput(), 'valor_pollito': forms.TextInput()}
