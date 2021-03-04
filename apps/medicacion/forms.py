from django import forms
from datetime import *
from django.forms import SelectDateWidget, TextInput, NumberInput, EmailInput

from apps.medicacion.models import Medicacion
from apps.medicina.models import Medicina


class MedicacionForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['fecha'].widget = TextInput(attrs={'class': 'form-control', 'disabled': True,
                                                           'id': 'id_fecha_medicacion'})
            self.fields['fecha'].initial = datetime.now().strftime('%Y-%m-%d')
            self.fields['medicina'].widget.attrs = {'class': 'form-control select2', 'style': 'width:100%'}
            self.fields['medicina'].queryset = Medicina.objects.none()
            self.fields['dosis'].widget = TextInput(attrs={'class': 'form-control'})

        # habilitar, desabilitar, y mas

    class Meta:
        model = Medicacion
        fields = ['fecha', 'medicina', 'dosis']
        labels = {'fecha': 'Fecha', 'medicina': 'Medicina', 'dosis': 'Cantidad'}
        widgets = {'fecha': forms.TextInput(), 'dosis': forms.TextInput()}
