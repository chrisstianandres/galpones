from datetime import datetime

from django import forms
from django.forms import TextInput

from .models import Mortalidad
from ..causa_muerte.models import Causa_muerte


class MortalidadForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })

            self.fields['fecha'].widget = TextInput(attrs={'class': 'form-control input-sm',
                                                           'id': 'id_fecha_mortalidad', 'disabled': True})
            self.fields['fecha'].initial = datetime.now().strftime('%Y/%m/%d')
            self.fields['cantidad_muertes'].widget = TextInput(attrs={'class': 'form-control input-sm'})
            self.fields['descrpcion'].widget = TextInput(attrs={'class': 'form-control input-sm', 'id': 'id_descrpcion_mortalidad'})
            self.fields['causa'].widget.attrs = {'class': 'form-control select2 input-sm', 'style': "width: 100%"}
            self.fields['causa'].queryset = Causa_muerte.objects.none()

        # habilitar, desabilitar, y mas

    class Meta:
        model = Mortalidad
        fields = ['fecha',
                  'causa',
                  'cantidad_muertes',
                  'descrpcion'
                  ]
        labels = {
            'fecha': 'Fecha',
            'causa': 'Causa de muerte',
            'cantidad_muertes': 'Cantidad de Bajas',
            'descrpcion': 'Descripcion'
        }
        widgets = {
            'fecha': forms.TextInput(),
            'cantidad_muertes': forms.TextInput(),
            'descrpcion': forms.TextInput()
        }
