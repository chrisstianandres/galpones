var logotipo;
var datatable;
var datatable_pagos;
var row_data;


function datatable_fun() {
    datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {'action': 'list'},
            dataSrc: ""
        },
        columns: [
            {"data": "venta.cliente.full_name_list"},
            {"data": "nro_cuotas"},
            {"data": "valor"},
            {"data": "interes"},
            {"data": "tolal_deuda"},
            {"data": "saldo"},
            {"data": "estado_text"},
            {"data": "id"}
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: {
            dom: {
                button: {
                    className: 'btn',

                },
                container: {
                    className: 'buttons-container'
                }
            },
            buttons: [
                {
                    text: '<i class="fa fa-file-excel"></i> Excel',
                    className: "btn btn-success btn-space float-right",
                    extend: 'excel'
                },
                {
                    text: '<i class="fa fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger btn-space float-right',
                    extend: 'pdfHtml5',
                    //filename: 'dt_custom_pdf',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    exportOptions:
                        {
                            columns: [0, 1, 2, 3, 4, 5, 6],
                            search: 'applied',
                            order: 'applied'
                        },
                    customize: customize,
                },

            ]
        },
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center',
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var edit = '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="detalle" ' +
                        'data-toggle="tooltip" title="Detalle"><i class="fa fa-search"></i></a>' + ' ';
                    return edit

                }
            },
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>'

                }
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.estado === 2) {
                $('td', row).eq(6).find('span').addClass('badge bg-success').attr("style", "color: white");
            } else if (data.estado === 1) {
                $('td', row).eq(6).find('span').addClass('badge bg-danger').attr("style", "color: white");
            } else if (data.estado === 0) {
                $('td', row).eq(6).find('span').addClass('badge bg-warning').attr("style", "color: white");
            }
        },
    });
}

$(function () {
    var action = '';
    var pk = '';
    datatable_fun();
    $('#datatable tbody')
        .on('click', 'a[rel="detalle"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            row_data = data.id;
            $('#Modal').modal('show');
            datatable_pagos = $("#tbldetalle_ctas_cobrar").DataTable({
                responsive: true,
                autoWidth: false,
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                destroy: true,
                ajax: {
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'id': data.id,
                        'action': 'detalle'
                    },
                    dataSrc: ""
                },
                columns: [
                    {data: 'fecha'},
                    {data: 'fecha_pago'},
                    {data: 'valor'},
                    {data: 'estado_text'},
                    {data: 'id'},
                ],
                columnDefs: [
                    {
                        targets: '_all',
                        class: 'text-center'
                    },
                    {
                        targets: [-2],
                        orderable: false,
                        render: function (data, type, row) {
                            return '<span>' + data + '</span>'

                        }
                    },
                    {
                        targets: [-3],
                        orderable: false,
                        render: function (data, type, row) {
                            return '$' + parseFloat(data).toFixed(2);
                        }
                    },
                    {
                        targets: [-1],
                        width: "15%",
                        render: function (data, type, row) {
                            return '<a type="button" rel="pagar" class="btn btn-success btn-xs btn-round" ' +
                                'style="color: white" data-toggle="tooltip" title="Realizar pago" >' +
                                '<i class="fas fa-hand-holding-usd"></i></a>' + ' ';
                        }
                    },
                ],
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                    // Total over this page
                    pageTotal = api
                        .column(2, {page: 'current'})
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(2).footer()).html(
                        '$' + parseFloat(pageTotal).toFixed(2)
                        // parseFloat(data).toFixed(2)
                    );
                },
                createdRow: function (row, data, dataIndex) {
                    if (data.estado === 2) {
                        $('td', row).eq(3).find('span').addClass('badge bg-success').attr("style", "color: white");
                        $('td', row).eq(4).find('a[rel="pagar"]').hide();
                    } else if (data.estado === 1) {
                        $('td', row).eq(3).find('span').addClass('badge bg-danger').attr("style", "color: white");
                        if (data.fecha_pago === null) {
                            $('td', row).eq(1).html('<span class="badge bg-danger" style="color: white">' + data.estado_text + '</span>');
                        }
                    } else if (data.estado === 0) {
                        $('td', row).eq(3).find('span').addClass('badge bg-warning').attr("style", "color: white");
                        if (data.fecha_pago === null) {
                            $('td', row).eq(1).html('<span class="badge bg-warning" style="color: white">' + data.estado_text + '</span>');
                        }
                    }
                },
            });
            if (data.estado === 1) {
                $('#abono').hide();
            } else {
                $('#abono').show();
            }
        });
    //boton agregar cliente
    $('#abono').on('click', function () {
        window.location.href = '/ctas_cobrar/pagar/' + row_data
    });
    $('#tbldetalle_ctas_cobrar tbody')
        .on('click', 'a[rel="pagar"]', function () {
            var tr = datatable_pagos.cell($(this).closest('td, li')).index();
            var data = datatable_pagos.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'pagar'};
            save_estado('Alerta',
                window.location.pathname, 'Esta seguro que desea realizar el pago de esta letra', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al realizar el pago de esta letra', 'far fa-smile-wink', function () {
                        datatable_pagos.ajax.reload(null, false);
                        datatable.ajax.reload(null, false);
                    })
                });

        })
});
