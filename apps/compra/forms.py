from django import forms
from datetime import *
from .models import Compra, Detalle_compra


class CompraForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['fecha_compra'].widget.attrs = {
                'readonly': True,
                'class': 'form-control'
            }
            self.fields['comprobante'].widget.attrs = {
                'class': 'form-control'
            }
            self.fields['proveedor'].widget.attrs = {
                'class': 'form-control select2',
                'style': "width: 100%",
                'data-width': "100%"
            }
            self.fields['subtotal'].widget.attrs = {
                'value': '0.00',
                'class': 'form-control',
                'readonly': True
            }
            self.fields['tasa_iva'].widget.attrs = {
                'value': '0.12',
                'class': 'form-control'
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
        model = Compra
        fields = [
            'fecha_compra',
            'comprobante',
            'proveedor',
            'subtotal',
            'iva',
            'tasa_iva',
            'total'
        ]
        labels = {
            'fecha_compra': 'Fecha de Compra',
            'proveedor': 'Proveedor',
            'comprobante': 'Comprobante',
            'subtotal': 'Subtotal',
            'tasa_iva': 'I.V.A',
            'iva': 'I.V.A. Calculado',
            'total': 'TOTAL'
        }
        widgets = {
            'fecha_compra': forms.DateInput(
                format='%Y-%m-%d',
                attrs={'value': datetime.now().strftime('%Y-%m-%d')},
            ),
            'tasa_iva': forms.TextInput(),
            'iva': forms.TextInput(),
            'comprobante': forms.TextInput(),
            'total': forms.TextInput(),
        }


class Detalle_CompraForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.Meta.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control'
            })
            self.fields['insumo'].widget.attrs = {
                'class': 'form-control select2',
                'data-live-search': "true",
                'style': 'width: 100%'
            }
        # habilitar, desabilitar, y mas

    class Meta:
        model = Detalle_compra
        fields = [
            'insumo'
        ]
