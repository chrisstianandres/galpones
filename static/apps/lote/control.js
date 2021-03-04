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
            {"data": "valor_pollito"},
            {"data": "stock_produccion"},
            {"data": "stock_actual"},
            {"data": "estado_text"},
            {"data": "id"}
        ],
        dom: "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columnDefs: [
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>';
                }
            },
            {
                targets: [-3, -4],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + parseInt(data) + '</span>';
                }
            },
            {
                targets: [-5],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '$' + parseFloat(data).toFixed(2);
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="close" ' +
                        'data-toggle="tooltip" title="Cerrar produccion de Lote"><i class="fas fa-power-off"></i></a>' + ' '

                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.estado === 1) {
                $('td', row).eq(6).find('span').addClass('badge badge-success').attr("style", "color: white");
                $('td', row).eq(7).hide();
            } else if (data.estado === 0) {
                $('td', row).eq(6).find('span').addClass('badge badge-secondary').attr("style", "color: white");
                $('td', row).eq(4).find('span').addClass('badge badge-secondary').attr("style", "color: white").text('Aun en produccion');
                $('td', row).eq(5).find('span').addClass('badge badge-secondary').attr("style", "color: white").text('Aun en produccion');
            }
        }
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
