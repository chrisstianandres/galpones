from datetime import *

from django import forms
from django.forms import TextInput

from apps.alimentacion.models import Alimentacion
from apps.alimento.models import Alimento


class AlimentacionForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['fecha'].widget = TextInput(attrs={'class': 'form-control', 'disabled': True,
                                                           'id': 'id_fecha_alimentacion'})
            self.fields['fecha'].initial = datetime.now().strftime('%Y-%m-%d')
            self.fields['alimento'].widget.attrs = {'class': 'form-control select2', 'style': 'width:100%'}
            self.fields['alimento'].queryset = Alimento.objects.none()
            self.fields['cantidad'].widget = TextInput(attrs={'class': 'form-control'})

        # habilitar, desabilitar, y mas

    class Meta:
        model = Alimentacion
        fields = ['fecha', 'alimento', 'cantidad']
        labels = {'fecha': 'Fecha', 'alimento': 'Alimento', 'cantidad': 'Cantidad'}
        widgets = {'fecha': forms.TextInput(), 'cantidad': forms.TextInput()}
