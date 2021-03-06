from django import forms
from datetime import *

from apps.gasto.models import Gasto


class GastoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['fecha_pago'].widget.attrs = {
                'disabled': True,
                'class': 'form-control'
            }
            self.fields['tipo_gasto'].widget.attrs = {
                'class': 'form-control select2',
                'data-live-search': "true",
                'style': 'width:100%'
            }
            self.fields['valor'].widget.attrs = {
                'value': '0.00',
                'class': 'form-control'
            }
            self.fields['detalle'].widget.attrs = {
                'class': 'form-control'
            }

        # habilitar, desabilitar, y mas

    class Meta:
        model = Gasto
        fields = [
            'fecha_pago',
            'tipo_gasto',
            'valor',
            'detalle'
        ]
        labels = {
            'fecha_pago': 'Fecha de Pago',
            'tipo_gasto': 'Tipo de Gasto',
            'valor': 'Valor',
            'detalle': 'Detalle'
        }
        widgets = {
            'fecha': forms.DateInput(
                format='%Y-%m-%d',
                attrs={'value': datetime.now().strftime('%Y-%m-%d')},
            ),
            'valor': forms.TextInput(),
            'detalle': forms.Textarea()
        }
