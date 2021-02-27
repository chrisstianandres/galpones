var logotipo;
var datatable_empleado_list;
var datatable_empleado_select;
var datatable_galpon_list;
var datatable_galpon_select;
var action = 'add';
var pk;
var dt_tipo;

var fecha = $('#id_fecha');
var cantidad = $('#id_cantidad');
var valor_ave = $('#id_valor_pollito');
var raza = $('#id_raza');
var ids = NaN;
var ids_empleado = NaN;


var lotes = {
    items: {
        fecha,
        valor_ave,
        cantidad,
        raza,
        empleados_array: [],
        galpones_array: [],
    },
    calculate: function () {
        var cantidad =  0;
        $.each(this.items.galpones_array, function (pos, dict) {
            console.log(dict.cantidad);
            cantidad += dict.cantidad;
        });
        $('#id_cantidad').val(cantidad);
    },
    get_ids: function () {
        var ids = [];
        $.each(this.items.empleados_array, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    add: function (data) {
        this.items.empleados_array.push(data);
        this.list();
    },
    list: function () {
        datatable_empleado_list = $('#datatable_empleado_list').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            ajax: {
                url: '/empleado/lista',
                type: 'POST',
                data: {'action': 'list_lote', 'ids': JSON.stringify(lotes.get_ids())},
                dataSrc: ""
            },
            dom: 'ftrp',
            columns: [
                {"data": "text"},
                {"data": "cedula"},
                {"data": "id"}
            ],
            columnDefs: [
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a type="button" class="btn btn-primary btn-xs"  style="color: white" rel="select" ' +
                            'data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
                            '<i class="fa fa-check"></i></a>' + ' ';

                    }
                }
            ]
        });
        datatable_empleado_select = $('#datatable_empleado_select').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            data: this.items.empleados_array,
            dom: 'ftrp',
            columns: [
                {"data": "id"},
                {"data": "text"},
                {"data": "cedula"},
                {"data": "id"}
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="remove" ' +
                            'data-toggle="tooltip" data-placement="top" title="Quitar">' +
                            '<i class="fa fa-trash"></i></a>' + ' ';

                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-sm" name="cantidad" value="1.00">';

                    }
                }
            ],
            rowCallback: function (row, data) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 0.05,
                    max: 1000000,
                    step: 0.01,
                    decimals: 2,
                    forcestepdivisibility: 'none',
                    boostat: 5,
                    maxboostedstep: 10,
                    prefix: '$',
                    // verticalupclass: 'glyphicon glyphicon-plus',
                    // verticaldownclass: 'glyphicon glyphicon-minus'
                });
            }
        });
    },
    get_ids_galpon: function () {
        var ids = [];
        $.each(this.items.galpones_array, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    add_galpon: function (data) {
        this.items.galpones_array.push(data);
        this.list_galpon();
    },
    list_galpon: function () {
        this.calculate();
        datatable_galpon_list = $('#datatable_galpon_list').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            ajax: {
                url: '/galpon/lista',
                type: 'POST',
                data: {'action': 'list_lote', 'ids': JSON.stringify(lotes.get_ids_galpon())},
                dataSrc: ""
            },
            dom: 'ftrp',
            columns: [
                {"data": "id"},
                {"data": "capacidad"},
                {"data": "id"}
            ],
            columnDefs: [
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a type="button" class="btn btn-primary btn-xs"  style="color: white" rel="select" ' +
                            'data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
                            '<i class="fa fa-check"></i></a>' + ' ';

                    }
                }
            ]
        });
        datatable_galpon_select = $('#datatable_galpon_select').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            data: this.items.galpones_array,
            dom: 'ftrp',
            columns: [
                {"data": "id"},
                {"data": "id"},
                {"data": "capacidad"},
                {"data": "cantidad"}
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="remove" ' +
                            'data-toggle="tooltip" data-placement="top" title="Quitar">' +
                            '<i class="fa fa-trash"></i></a>' + ' ';

                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-sm" name="cantidad" value="' + data + '">';

                    }
                }
            ],
            rowCallback: function (row, data) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 1,
                    max: data.capacidad,
                    step: 1,
                    forcestepdivisibility: 'none',
                    boostat: 5,
                    maxboostedstep: 10
                });
            }
        });
    }
};

function datatable_fun() {
    // datatable = $("#datatable").DataTable({
    //     responsive: true,
    //     autoWidth: false,
    //     language: {
    //         url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
    //     },
    //     ajax: {
    //         url: window.location.pathname,
    //         type: 'POST',
    //         data: {'action': 'list'},
    //         dataSrc: ""
    //     },
    //     columns: [
    //         {"data": "id"},
    //         {"data": "capacidad"},
    //         {"data": "estado_text"},
    //         {"data": "id"}
    //     ],
    //     buttons: {
    //         dom: {
    //             button: {
    //                 className: '',
    //
    //             },
    //             container: {
    //                 className: 'buttons-container float-md-right'
    //             }
    //         },
    //         buttons: [
    //             {
    //                 text: '<i class="fa fa-file-pdf"></i> PDF',
    //                 className: 'btn btn-danger btn-space',
    //                 extend: 'pdfHtml5',
    //                 //filename: 'dt_custom_pdf',
    //                 orientation: 'landscape', //portrait
    //                 pageSize: 'A4', //A3 , A5 , A6 , legal , letter
    //                 download: 'open',
    //                 exportOptions: {
    //                     columns: [0, 1],
    //                     search: 'applied',
    //                     order: 'applied'
    //                 },
    //                 customize,
    //             },
    //         ],
    //     },
    //
    //     dom: "<'row'<'col-sm-12 col-md-12'B>>" +
    //         "<'row'<'col-sm-12 col-md-3'l>>" +
    //         "<'row'<'col-sm-12 col-md-12'f>>" +
    //         "<'row'<'col-sm-12'tr>>" +
    //         "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //     columnDefs: [
    //         {
    //             targets: [-2],
    //             class: 'text-center',
    //             orderable: false,
    //             render: function (data, type, row) {
    //                 return '<span>' + data + '</span>';
    //             }
    //         },
    //         {
    //             targets: [-3],
    //             class: 'text-center',
    //             orderable: false,
    //             render: function (data, type, row) {
    //                 return '<span>' + parseInt(data) + '</span>';
    //             }
    //         },
    //         {
    //             targets: '__all',
    //             class: 'text-center'
    //         },
    //         // {
    //         //     targets: [-2],
    //         //     class: 'text-center',
    //         //     orderable: false,
    //         //     render: function (data, type, row) {
    //         //         return '<img src="' + data + '" width="30" height="30" class="img-circle elevation-2">';
    //         //     }
    //         // },
    //         {
    //             targets: [-1],
    //             class: 'text-center',
    //             width: '10%',
    //             orderable: false,
    //             render: function (data, type, row) {
    //                 var edit = '<a style="color: white" type="button" class="btn btn-primary btn-xs" rel="edit" ' +
    //                     'data-toggle="tooltip" title="Editar Datos"><i class="fa fa-edit"></i></a>' + ' ';
    //                 var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
    //                     'data-toggle="tooltip" title="Eliminar"><i class="fa fa-trash"></i></a>' + ' ';
    //                 return edit + del
    //
    //             }
    //         },
    //     ],
    //     createdRow: function (row, data, dataIndex) {
    //         if (data.estado === 0 ) {
    //             $('td', row).eq(2).find('span').addClass('badge badge-success').attr("style", "color: white");
    //         } else if (data.estado === 1) {
    //              console.log(data.estado);
    //             $('td', row).eq(2).find('span').addClass('badge badge-warning').attr("style", "color: white");
    //         }
    //     }
    // });
}

$(function () {
    cantidad.TouchSpin({
        prefix: 'Cantidad'
    }).prop('disabled', true);
    valor_ave.TouchSpin({
        min: 0.05,
        max: 20.00,
        decimals: 2,
        step: 0.01,
        prefix: '$'
    });
    raza.select2({
        theme: "classic",
        language: {
            inputTooShort: function () {
                return "Ingresa al menos un caracter...";
            },
            "noResults": function () {
                return "Sin resultados";
            },
            "searching": function () {
                return "Buscando...";
            }
        },
        allowClear: true,
        placeholder: 'Busca un tipo de ave',
        minimumInputLength: 1,
        ajax: {
            delay: 250,
            type: 'POST',
            url: '/tipo_ave/lista',
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    'action': 'search'
                };
                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data
                };

            },

        },
    });
    $('#id_search_raza').on('click', function () {
        $('.tooltip').remove();
        $('#modal_tipo').modal('show');
        dt_tipo = $('#datatable_tipo_ave').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            ajax: {
                url: '/tipo_ave/lista',
                type: 'POST',
                data: {'action': 'list', 'ids': ids},
                dataSrc: ""
            },
            dom: 'lftirp',
            columns: [
                {"data": "nombre"},
                {"data": "id"}
            ],
            columnDefs: [
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="select" ' +
                            'data-toggle="tooltip" data-placement="top" title="Seleccionar">' +
                            '<i class="fa fa-check"></i></a>' + ' ';

                    }
                }
            ]

        });
    });
    $('#id_new_raza').on('click', function () {
        $('.tooltip').remove();
        $('#modal_form').modal('show');
        action = 'add'
    });

    $('#datatable_tipo_ave tbody')
        .on('click', 'a[rel="select"]', function () {
            $('.tooltip').remove();
            var tr = dt_tipo.cell($(this).closest('td, li')).index();
            var data = dt_tipo.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'take'};
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: '/tipo_ave/lista',
                data: parametros,
            }).done(function (data) {
                if (!data.hasOwnProperty('error')) {
                    $.isLoading({
                        text: "<strong>" + 'Seleccionando..' + "</strong>",
                        tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
                    });
                    setTimeout(function () {
                        $.isLoading('hide');
                        var newOption = new Option(data[0].nombre, data[0].id, false, true);
                        $('#id_raza').append(newOption).trigger('change');
                        $('#modal_tipo').modal('hide');
                        ids = data[0].id;
                    }, 1000);
                    return false;
                }
                menssaje_error(data.error, data.content, 'fa fa-times-circle');
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + ': ' + errorThrown);
                });

        });
    // datatable_fun();
    // action = 'add';
    // //Botones dentro de datatable
    // $('#datatable tbody')
    //     .on('click', 'a[rel="del"]', function () {
    //         var tr = datatable.cell($(this).closest('td, li')).index();
    //         var data = datatable.row(tr.row).data();
    //         var parametros = {'id': data.id, 'action': 'delete'};
    //         save_estado('Alerta',
    //             '/galpon/nuevo', 'Esta seguro que desea eliminar este galpon?', parametros,
    //             function () {
    //                 menssaje_ok('Exito!', 'Exito al eliminar  este galpon!', 'far fa-smile-wink', function () {
    //                     location.reload();
    //                 })
    //             });
    //     })
    //     .on('click', 'a[rel="edit"]', function () {
    //         var tr = datatable.cell($(this).closest('td, li')).index();
    //         var data = datatable.row(tr.row).data();
    //         action = 'edit';
    //         pk = data.id;
    //         $('#id_capacidad').val(data.capacidad);
    //         $('#id_numero').val(data.id);
    //         $('#input_numero').show("slow");
    //     });
    //
    // $('#id_capacidad').TouchSpin({
    //     min: 1,
    //     max: 1000000
    // });
    //
    //enviar formulario de nuevo producto
    $('#guardar').on('click', function (e) {
        e.preventDefault();
        if (raza.val()=== ''){
             menssaje_error('Error!', "Debe seleccionar un tipo de ave", 'far fa-times-circle');
                return false
        } else if (lotes.items.empleados_array.length === 0) {
             menssaje_error('Error!', "Debe Asignar al menos a un empleado a este lote", 'far fa-times-circle');
                return false
        } else if (lotes.items.galpones_array.length === 0) {
            menssaje_error('Error!', "Debe Asignar al menos a un Galpon a este lote", 'far fa-times-circle');
            return false
        }
        lotes.items.fecha = fecha.val();
        lotes.items.valor_ave = valor_ave.val();
        lotes.items.cantidad = cantidad.val();
        lotes.items.raza = raza.val();
        var parametros = {'lote': JSON.stringify(lotes.items)};
        parametros['action'] = action;
        parametros['id'] = pk;
        save_with_ajax('Alerta',
                '/lote/nuevo', 'Esta seguro que desea guardar este lote?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este lote!', 'far fa-smile-wink', function () {
                        location.href = '/menu';
                    });
                });
    });
    $('#form_tipo').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/tipo_ave/nuevo', 'Esta seguro que desea guardar este tipo de ave?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este tipo de ave!', 'far fa-smile-wink', function () {
                        $('#modal_form').modal('hide');
                        var newOption = new Option(response['nombre'], response['id'], false, true);
                        $('#id_raza').append(newOption).trigger('change');
                        ids = response['id'];
                    });
                });
        }
    });
    $('#id_raza').on('change', function () {
        if ($(this).val() === '') {
            ids = NaN;
        }

    });


    //Seccion Empleados
    lotes.list();
    $('#datatable_empleado_list tbody')
        .on('click', 'a[rel="select"]', function () {
            var tr = datatable_empleado_list.cell($(this).closest('td, li')).index();
            var data = datatable_empleado_list.row(tr.row).data();
            lotes.add(data);
        });
    $('#datatable_empleado_select tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = datatable_empleado_select.cell($(this).closest('td, li')).index();
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea quitar a este empleado de la asignacion <br> ' +
                '<strong>CONTINUAR?</strong>', function () {
                    lotes.items.empleados_array.splice(tr.row, 1);
                    lotes.list();
                })
        })
        .on('change keyup', 'input[name="cantidad"]', function () {
            var sueldo = parseFloat($(this).val());
            var tr = datatable_empleado_select.cell($(this).closest('td, li')).index();
            lotes.items.empleados_array[tr.row].sueldo = sueldo;
        });
    $('#quitar_todo_empleado')
        .on('click', function () {
            if (lotes.items.empleados_array.length === 0) return false;
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea quitar todos los empleados de la asignacion <br> ' +
                '<strong>CONTINUAR?</strong>', function () {
                    lotes.items.empleados_array = [];
                    lotes.list();
                })
        });
    //fin de seccion Empleados


    //Seccion Galpones
    lotes.list_galpon();
    $('#datatable_galpon_list tbody')
        .on('click', 'a[rel="select"]', function () {
            var tr = datatable_galpon_list.cell($(this).closest('td, li')).index();
            var data = datatable_galpon_list.row(tr.row).data();
            lotes.add_galpon(data);
        });
    $('#datatable_galpon_select tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = datatable_galpon_select.cell($(this).closest('td, li')).index();
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea quitar a este galpon de la asignacion <br> ' +
                '<strong>CONTINUAR?</strong>', function () {
                    lotes.items.galpones_array.splice(tr.row, 1);
                    lotes.list_galpon();
                })
        })
        .on('change keyup', 'input[name="cantidad"]', function () {
            var cantidad = parseInt($(this).val());
            var tr = datatable_galpon_select.cell($(this).closest('td, li')).index();
            lotes.items.galpones_array[tr.row].cantidad = cantidad;
            lotes.calculate();
        });
    $('#quitar_todo_galpon')
        .on('click', function () {
            if (lotes.items.galpones_array.length === 0) return false;
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea quitar todos los galpones de la asignacion <br> ' +
                '<strong>CONTINUAR?</strong>', function () {
                    lotes.items.galpones_array = [];
                    lotes.list_galpon();
                })
        });

    //fin de seccion Galpones
});