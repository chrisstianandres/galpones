from django import forms
from datetime import *
from django.forms import SelectDateWidget, TextInput, NumberInput, EmailInput

from .models import Galpon


class GalponForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['capacidad'].widget = TextInput(
                attrs={'class': 'form-control input-sm'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Galpon
        fields = ['capacidad']
        labels = {'capacidad': 'Capacidad'}
        widgets = {'capacidad': forms.TextInput()}

