from datetime import datetime

from django import forms

from .models import Detalle_venta, Venta
from apps.inventario.models import Inventario


class VentaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['fecha'].widget.attrs = {
                'readonly': True,
                'class': 'form-control'
            }
            self.fields['cliente'].widget.attrs = {
                'class': 'form-control select2',
                'style': "width: 93%"
            }
            self.fields['tipo_pago'].widget.attrs = {
                'class': 'form-control select2',
                'style': "width: 100%",
                'data-toggle': "tooltip",
            }
            self.fields['subtotal'].widget.attrs = {
                'value': '0.00',
                'class': 'form-control',
                'readonly': True
            }
            self.fields['iva'].widget.attrs = {
                'value': '0.00',
                'class': 'form-control',
                'readonly': True
            }
            self.fields['total'].widget.attrs = {
                'value': '0.00',
                'class': 'form-control',
                'readonly': True
            }

        # habilitar, desabilitar, y mas

    class Meta:
        model = Venta
        fields = [
            'fecha',
            'cliente',
            'tipo_pago',
            'subtotal',
            'iva',
            'total'
        ]
        labels = {
            'fecha': 'Fecha de Venta',
            'cliente': 'Cliente',
            'tipo_pago': 'Forma de pago',
            'subtotal': 'Subtotal',
            'iva': 'I.V.A.',
            'total': 'TOTAL'
        }
        widgets = {
            'fecha': forms.DateInput(
                format='%Y-%m-%d',
                attrs={'value': datetime.now().strftime('%Y-%m-%d')},
            ),
            'iva': forms.TextInput(),
            'total': forms.TextInput(),
        }


class Detalle_VentaForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['inventario'].widget.attrs = {
                'class': 'form-control select2'
            }
            self.fields["inventario"].queryset = Inventario.objects.none()
        # habilitar, desabilitar, y mas

    class Meta:
        model = Detalle_venta
        fields = [
            'inventario',
        ]
