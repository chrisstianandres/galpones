var tblventa;
var pago = {
    items: {
        abono: 0.00
    },
    list: function () {
        tblventa = $("#datatable").DataTable({
            destroy: true,
            iDisplayLength: 12,
            autoWidth: false,
            dataSrc: "",
            responsive: true,
            language: {
                "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {'action': 'letras'},
                dataSrc: ""
            },
            columns: [
                {data: 'fecha'},
                {data: 'fecha_pago'},
                {data: 'valor'},
                {data: 'valor_pagado'},
                {data: 'saldo'},
                {data: 'estado_text'},
            ],
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center'
                },
                {
                    targets: [-1],
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span>' + data + '</span>'

                    }
                },
                {
                    targets: [2, 3, 4],
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
            ],
            createdRow: function (row, data, dataIndex) {
                if (data.estado === 2) {
                    $('td', row).eq(5).find('span').addClass('badge bg-success').attr("style", "color: white");
                } else if (data.estado === 1) {
                    $('td', row).eq(5).find('span').addClass('badge bg-danger').attr("style", "color: white");
                    if (data.fecha_pago === null) {
                        $('td', row).eq(1).html('<span class="badge bg-danger" style="color: white">' + data.estado_text + '</span>');
                    }
                } else if (data.estado === 0) {
                    $('td', row).eq(5).find('span').addClass('badge bg-warning').attr("style", "color: white");
                    if (data.fecha_pago === null) {
                        $('td', row).eq(1).html('<span class="badge bg-warning" style="color: white">' + data.estado_text + '</span>');
                    }
                }
            }
        });
    }
};
$(function () {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {'action': 'cuenta'},
        dataSrc: "",
    }).done(function (data) {
        $('#id_abono').TouchSpin({
            min: 0.01,
            max: parseFloat(data),
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10,
            prefix: '$'
        });

    });

    // if (localStorage.getItem('carrito')) {
    //     carro_respaldo = JSON.parse(localStorage.getItem('carrito'));
    //     ventas.items.productos = carro_respaldo;
    //     ventas.list();
    // } else {
    //     ventas.list();
    // }
    // var action = '';
    // var pk = '';
    // //remover producto del detalle
    // $('#datatable tbody')
    //     .on('click', 'a[rel="remove"]', function () {
    //         var tr = tblventa.cell($(this).closest('td, li')).index();
    //         borrar_todo_alert('Alerta de Eliminación',
    //             'Esta seguro que desea eliminar este producto de tu detalle <br> ' +
    //             '<strong>CONTINUAR?</strong>', function () {
    //                 ventas.items.productos.splice(tr.row, 1);
    //                 ventas.list();
    //             })
    //     })
    //     .on('change keyup', 'input[name="cantidad"]', function () {
    //         var cantidad = parseInt($(this).val());
    //         var tr = tblventa.cell($(this).closest('td, li')).index();
    //         ventas.items.productos[tr.row].cantidad = cantidad;
    //         ventas.calculate();
    //         $('td:eq(7)', tblventa.row(tr.row).node()).html('$' + ventas.items.productos[tr.row].subtotal.toFixed(2));
    //     });
    // //remover todos los productos del detalle
    // $('.btnRemoveall').on('click', function () {
    //     if (ventas.items.productos.length === 0) return false;
    //     borrar_todo_alert('Alerta de Eliminación',
    //         'Esta seguro que desea eliminar todos los productos seleccionados? <br>' +
    //         '<strong>CONTINUAR?</strong>', function () {
    //             ventas.items.productos = [];
    //             ventas.list();
    //         });
    // });
    // //boton guardar
    // $('#save').on('click', function () {
    //     if (ventas.items.productos.length === 0) {
    //         menssaje_error('Error!', "Debe seleccionar al menos un producto", 'far fa-times-circle');
    //         return false
    //     } else {
    //         var total_venta = $('#id_total').val();
    //         $('#Modal_detalle').modal('show');
    //         $('#id_valor').val(total_venta);
    //         if (total_venta <= 1) {
    //             $('#id_tipo_pago').prop('disabled', true).val(0).trigger('change');
    //             $('#select2-id_tipo_pago-container').attr('title', 'El valor debe ser mayor a $ 1000 para ' +
    //                 'realizar un pago a credito');
    //             $('#credito').hide();
    //             amortizacion($('#id_nro_cuotas').val(0), ($('#tasa_val').val() / 100), $('#id_total').val());
    //         } else {
    //             $('#id_tipo_pago').prop('disabled', false);
    //         }
    //     }
    // });
    $('#save').on('click', function () {
            var abono = $('#id_abono').val();
            var parametros;
            pago.items.abono = parseFloat(abono);
            parametros = {'abono': JSON.stringify(pago.items)};
            parametros['action'] = 'abono';
            save_with_ajax('Alerta',
                window.location.pathname, 'Esta seguro que desea realizar un abono de $' + abono + '?', parametros,
                function () {
                   location.reload()
                });
        }
    );
    pago.list();

});

