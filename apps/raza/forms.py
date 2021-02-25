from django import forms
from django.forms import TextInput

from apps.raza.models import Raza


class RazaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['nombre'].widget = TextInput(
                attrs={'placeholder': 'Nombre del tipo de Ave', 'class': 'form-control input-sm'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Raza
        fields = ['nombre']
        labels = {'nombre': 'Nombre'}
        widgets = {'nombre': forms.TextInput()}

