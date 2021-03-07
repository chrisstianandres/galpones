var datos = {
    fechas: {
        'start_date': '',
        'end_date': '',
        'action': 'list'
    },
    add: function (data) {
        if (data.key === 1) {
            this.fechas['start_date'] = data.startDate.format('YYYY-MM-DD');
            this.fechas['end_date'] = data.endDate.format('YYYY-MM-DD');
        } else {
            this.fechas['start_date'] = '';
            this.fechas['end_date'] = '';
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: this.fechas,
            success: function (data) {
                datatable.clear();
                datatable.rows.add(data).draw();
            }
        });

    },
};

function datatable_fun() {
    datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: datos.fechas,
            dataSrc: ""
        },
        columns: [
            {"data": "fecha"},
            {"data": "raza.nombre"},
            {"data": "cantidad"},
            {"data": "stock_produccion"},
            {"data": "stock_actual"},
            {"data": "bajas"},
            {"data": "total_gastos"}
        ],
        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: {
            dom: {
                button: {
                    className: '',

                },
                container: {
                    className: 'buttons-container float-md-right'
                }
            },
            buttons: [
                {
                    text: '<i class="fa fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger my_class',
                    extend: 'pdfHtml5',
                    filename: 'Reporte de Produccion por Lote',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    footer: true,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize: customize_report
                },
            ],
        },
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center'
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '$' + parseFloat(data).toFixed(2);
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
            cantidad = api.column(2, {page: 'current'}).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // total full table
            cantidad_full = api.column(2).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

            // Total over this page
            stock_prod = api.column(3, {page: 'current'}).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // total full table
            stock_prod_full = api.column(3).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // Total over this page
            saldo = api.column(4, {page: 'current'}).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // total full table
            saldo_full = api.column(4).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
// Total over this page
            bajas = api.column(5, {page: 'current'}).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // total full table
            bajas_full = api.column(5).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // Total over this page
            gastos = api.column(6, {page: 'current'}).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
            // total full table
            gastos_full = api.column(6).data().reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);


            // Update footer
            $(api.column(2).footer()).html(
                parseInt(cantidad) + ' ( ' + parseInt(cantidad_full) + ')'
            );
            $(api.column(3).footer()).html(
                parseInt(stock_prod) + ' ( ' + parseInt(stock_prod_full) + ')'
            );
            $(api.column(4).footer()).html(
                parseInt(saldo) + ' ( ' + parseInt(saldo_full) + ')'
            );
            $(api.column(5).footer()).html(
                parseInt(bajas) + ' (  ' + parseInt(bajas_full) + ')'
            );
            $(api.column(6).footer()).html(
                '$ '+parseFloat(gastos).toFixed(2) + ' ( $ ' + parseFloat(gastos_full).toFixed(2) + ')'
            );
        },
    });
}

$(function () {
    // cantidad.TouchSpin({
    //     prefix: 'Cantidad'
    // }).prop('disabled', true);
    // valor_ave.TouchSpin({
    //     min: 0.05,
    //     max: 20.00,
    //     decimals: 2,
    //     step: 0.01,
    //     prefix: '$'
    // });
    // raza.select2({
    //     theme: "classic",
    //     language: {
    //         inputTooShort: function () {
    //             return "Ingresa al menos un caracter...";
    //         },
    //         "noResults": function () {
    //             return "Sin resultados";
    //         },
    //         "searching": function () {
    //             return "Buscando...";
    //         }
    //     },
    //     allowClear: true,
    //     placeholder: 'Busca un tipo de ave',
    //     minimumInputLength: 1,
    //     ajax: {
    //         delay: 250,
    //         type: 'POST',
    //         url: '/tipo_ave/lista',
    //         data: function (params) {
    //             var queryParameters = {
    //                 term: params.term,
    //                 'action': 'search'
    //             };
    //             return queryParameters;
    //         },
    //         processResults: function (data) {
    //             return {
    //                 results: data
    //             };
    //
    //         },
    //
    //     },
    // });
    // $('#id_search_raza').on('click', function () {
    //     $('.tooltip').remove();
    //     $('#modal_tipo').modal('show');
    //     dt_tipo = $('#datatable_tipo_ave').DataTable({
    //         responsive: true,
    //         autoWidth: false,
    //         destroy: true,
    //         language: {
    //             url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
    //         },
    //         ajax: {
    //             url: '/tipo_ave/lista',
    //             type: 'POST',
    //             data: {'action': 'list', 'ids': ids},
    //             dataSrc: ""
    //         },
    //         dom: 'lftirp',
    //         columns: [
    //             {"data": "nombre"},
    //             {"data": "id"}
    //         ],
    //         columnDefs: [
    //             {
    //                 targets: [-1],
    //                 class: 'text-center',
    //                 orderable: false,
    //                 render: function (data, type, row) {
    //                     return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="select" ' +
    //                         'data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
    //                         '<i class="fa fa-check"></i></a>' + ' ';
    //
    //                 }
    //             }
    //         ]
    //
    //     });
    // });
    // $('#id_new_raza').on('click', function () {
    //     $('.tooltip').remove();
    //     $('#modal_form').modal('show');
    //     action = 'add'
    // });
    //
    // $('#datatable_tipo_ave tbody')
    //     .on('click', 'a[rel="select"]', function () {
    //         $('.tooltip').remove();
    //         var tr = dt_tipo.cell($(this).closest('td, li')).index();
    //         var data = dt_tipo.row(tr.row).data();
    //         var parametros = {'id': data.id, 'action': 'take'};
    //         $.ajax({
    //             dataType: 'JSON',
    //             type: 'POST',
    //             url: '/tipo_ave/lista',
    //             data: parametros,
    //         }).done(function (data) {
    //             if (!data.hasOwnProperty('error')) {
    //                 $.isLoading({
    //                     text: "<strong>" + 'Seleccionando..' + "</strong>",
    //                     tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
    //                 });
    //                 setTimeout(function () {
    //                     $.isLoading('hide');
    //                     var newOption = new Option(data[0].nombre, data[0].id, false, true);
    //                     $('#id_raza').append(newOption).trigger('change');
    //                     $('#modal_tipo').modal('hide');
    //                     ids = data[0].id;
    //                 }, 1000);
    //                 return false;
    //             }
    //             menssaje_error(data.error, data.content, 'fa fa-times-circle');
    //         })
    //             .fail(function (jqXHR, textStatus, errorThrown) {
    //                 alert(textStatus + ': ' + errorThrown);
    //             });
    //
    //     });
    datatable_fun();
    daterange();
    $('#datatable tbody')
        .on('click', 'a[rel="close"]', function () {
            var parametros;
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            parametros = {'action': 'close', 'id': data.id};
            save_with_ajax('Alerta!', window.location.pathname, 'Esta seguro que desea cerrar la produccion de este lote?',
                parametros, function () {
                    menssaje_ok('Exito!', 'Exito al cerrar la produccion de este lote!', '', function () {
                        datatable.ajax.reload(null, false);
                    })
                })
        });
});

function daterange() {
    $('input[name="fecha"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: '<i class="fas fa-search"></i> Buscar',
            cancelLabel: '<i class="fas fa-times"></i> Cancelar',
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        picker['key'] = 1;
        datos.add(picker);

    }).on('cancel.daterangepicker', function (ev, picker) {
        picker['key'] = 0;
        datos.add(picker);
    });
}
