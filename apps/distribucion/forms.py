from datetime import *

from django import forms
from django.forms import TextInput

from .models import Distribucion


class DistribucionForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['galpon'].widget.attrs = {
                'class': 'form-control select2',
                'data-live-search': "true"
            }
            self.fields['galpon'].queryset = Distribucion.objects.none()
        # habilitar, desabilitar, y mas

    class Meta:
        model = Distribucion
        fields = ['galpon']
        labels = {'galpon': 'Seleccionar galpon'}
