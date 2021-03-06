var tblcompra;
var tbl_galpon_seacrh;
var tasa_iva = ($('#id_tasa_iva').val()) * 100.00;
var dt_detalle;
var dt_detalle_alimentos;
var id_galpon = $('#id_galpon');

//<<<------------VARIEBLES PARA SECCION MEDICINA------------------------>>>

var dt_medicacion, action_medicacion, id_select_medicina = 0, tbl_detalle_medicina, id_medicacion;
var modal_medicacion = $('#modal_form_medicacion');


//<<<------------VARIEBLES PARA SECCION ALIMENTOS------------------------>>>

var dt_alimentacion, action_alimentacion, id_select_alimento = 0, tbl_detalle_alimento, id_alimentacion;
var modal_alimentacion = $('#modal_form_alimentacion');

//<<<------------VARIEBLES PARA SECCION MORTALIDAD------------------------>>>

var dt_mortalidad, action_mortalidad, id_mortalidad;
var modal_mortalidad = $('#modal_form_mortalidad');


//<<<------------VARIEBLES PARA SECCION PESO------------------------>>>

var dt_peso, action_peso, id_peso;
var modal_peso = $('#modal_form_peso');

//<<<------------VARIEBLES PARA SECCION GASTO------------------------>>>

var dt_gasto, action_gasto, id_gasto;
var modal_gasto = $('#modal_form_gasto');

function ajax_get_data(id) {
    $.ajax({
        type: "POST",
        url: '/produccion/control',
        data: {
            "id": id,
            "action": 'get_data'
        },
        dataType: 'json',
        success: function (data) {
            $.isLoading({
                text: "<strong>" + 'Cargando datos por favor espera...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            setTimeout(function () {
                $.isLoading('hide');
                produccion.add(data[0]);
            }, 3000);
            return false;
        }
    })
}

function clear_all() {
    $('#id_lote').val(null);
    $('#id_lote_cantidad').val(null);
    $('#id_capacidad').val(null);
    $('#id_cantidad_in_galpon').val(null);
    $('#id_lote_fecha').val(null);
    $('#id_tipo_ave').val(null);
    produccion.items.peso = [];
    produccion.items.mortalidad = [];
    produccion.list();
}

$(document).on('keypress', 'input[aria-controls="select2-id_galpon-results"]', function (e) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((e.which < 48 || e.which > 57)) {
        e.preventDefault();
    }
});

var produccion = {
    items: {
        distribuicion_id: '',
        medicacion: [],
        alimentacion: [],
        peso: [],
        mortalidad: [],
        gasto: [],
    },
    add: function (data) {
        this.items.distribuicion_id = data.lote_data[0].id;
        $('#id_lote').val(data.lote_data[0].lote.id);
        $('#id_lote_cantidad').val(data.lote_data[0].lote.cantidad);
        $('#id_capacidad').val(data.lote_data[0].galpon.capacidad);
        $('#id_cantidad_in_galpon').val(data.lote_data[0].cantidad_pollos);
        $('#id_lote_fecha').val(data.lote_data[0].lote.fecha);
        $('#id_tipo_ave').val(data.lote_data[0].lote.raza.nombre);
        this.items.peso = data.peso;
        this.items.mortalidad = data.mortalidad;
        this.items.gasto = data.gastos;
        this.items.medicacion = data.medicacion;
        this.items.alimentacion = data.alimentacion;
        this.list();

    },
    list: function () {
        dt_peso = $("#datatable_peso").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.peso,
            columns: [
                {"data": "fecha"},
                {"data": "peso_promedio"},
                {"data": "id"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                },
                {
                    targets: [-2],
                    class: 'text-center',
                    width: "15%",
                    render: function (data, type, row) {
                        return data + ' ' + 'lbs'
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        var edit = '<button class="btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Editar" name="edit"><i class="fas fa-edit"></i></button>' + ' ';
                        var del = '<button class="btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Eliminar" name="del"><i class="fas fa-trash"></i></button>';
                        return edit + del
                    }
                },

            ]
        });
        dt_mortalidad = $("#datatable_mortalidad").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.mortalidad,
            columns: [
                {"data": "fecha"},
                {"data": "causa.nombre"},
                {"data": "cantidad_muertes"},
                {"data": "descrpcion"},
                {"data": "id"},
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        var edit = '<button class="btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Editar" name="edit"><i class="fas fa-edit"></i></button>' + ' ';
                        var del = '<button class="btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Eliminar" name="del"><i class="fas fa-trash"></i></button>';
                        return edit + del
                    }
                },

            ]
        });
        dt_gasto = $("#datatable_gasto").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.gasto,
            columns: [
                {"data": "fecha_pago"},
                {"data": "tipo_gasto.nombre"},
                {"data": "valor"},
                {"data": "detalle"},
                {"data": "id"},
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        var edit = '<button class="btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Editar" name="edit"><i class="fas fa-edit"></i></button>' + ' ';
                        var del = '<button class="btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" ' +
                            'title="Eliminar" name="del"><i class="fas fa-trash"></i></button>';
                        return edit + del
                    }
                },

            ]
        });
        dt_medicacion = $("#datatable_medicacion").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.medicacion,
            columns: [
                {"data": "fecha"},
                {"data": "medicina__insumo__nombre"},
                {"data": "medicina__tipo_medicina__nombre"},
                {"data": "total"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
        dt_alimentacion = $("#datatable_alimentacion").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.alimentacion,
            columns: [
                {"data": "fecha"},
                {"data": "alimento__insumo__nombre"},
                {"data": "alimento__presentacion__nombre"},
                {"data": "total"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
    }
};
$(function () {
    produccion.list();
    id_galpon.select2({
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
        ajax: {
            delay: 250,
            type: 'POST',
            url: '/produccion/control',
            data: function (params) {
                return {
                    term: params.term,
                    'action': 'search_galpon'
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };

            },

        },
        placeholder: 'Busca una galpon por numero',
        minimumInputLength: 1,
    })
        .on('select2:select', function (e) {
            e.preventDefault();
            ajax_get_data($('#id_galpon option:selected').val());
        })
        .on('select2:clearing', function () {
            clear_all();
        })
        .on('change', function () {
            if ($(this).val() > 0) {
                ajax_get_data($(this).val());
            }
        });

    $('#id_search_galpon')
        .on('click', function () {
            $('.tooltip').remove();
            $('#modal_search_galpon').modal('show');
            tbl_galpon_seacrh = $("#datatable_search_galpon").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/produccion/control',
                    type: 'POST',
                    data: {'action': 'list_list'},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "galpon.id"},
                    {data: "galpon.estado_text"},
                    {data: "id"}
                ],
                columnDefs: [
                    {
                        targets: [-1],
                        class: 'text-center',
                        width: '10%',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="take" ' +
                                'data-toggle="tooltip" title="Seleccionar Galpon"><i class="fa fa-check"></i></a>' + ' '

                        }
                    },
                ]
            });
        });

    $('#datatable_search_galpon tbody')
        .on('click', 'a[rel="take"]', function () {
            var tr = tbl_galpon_seacrh.cell($(this).closest('td, li')).index();
            var data = tbl_galpon_seacrh.row(tr.row).data();
            var newOption = new Option('Galpon N°: ' + data.galpon['id'], data['id'], false, true);
            id_galpon.append(newOption).trigger('change');
            $('#modal_search_galpon').modal('hide');
        });


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------SECCION MEDICACION------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $('#add_medicacion')
        .on('click', function () {
            if (id_galpon.val() === '') return false;
            action_medicacion = 'add';
            data_form_medicacion();
            $('#modal_search_medicacion').modal('show').modal('hide');
        });

    function data_form_medicacion() {
        modal_medicacion.modal('show');
    }

    $('#id_medicina')
        .select2({
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
            ajax: {
                delay: 250,
                type: 'POST',
                url: '/medicacion/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search',
                        'ids': id_select_medicina
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca una medicina',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            id_select_medicina = $('#id_medicina option:selected').val();
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/medicacion/lista',
                data: {
                    "id": id_select_medicina,
                    'action': 'get'
                },
                dataType: 'json',
                success: function (data) {
                    show_stock(data[0]['stock_actual__sum']);
                },
                error: function (xhr, status, data) {
                    alert(data);
                },

            })
        })
        .on('select2:clearing', function () {
            $('#dosis_cantidad').fadeOut();
            $("#id_dosis").trigger('touchspin.destroy').val(1);
            id_select_medicina = 0;
        });

    function show_stock(max) {
        $('#dosis_cantidad').fadeIn();
        $('#id_dosis').TouchSpin({
            min: 1,
            max: max,
            step: 1,
            boostat: 5,
            maxboostedstep: 10
        });
    }

    $('#id_search_medicina')
        .on('click', function () {
            $('#modal_search_medicacion').modal('show');
            tbl_detalle_medicina = $("#datatable_search_medicacion").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/medicacion/lista',
                    type: 'POST',
                    data: {'action': 'list_list', 'ids': id_select_medicina},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "insumo.nombre"},
                    {data: "tipo_medicina.nombre"},
                    {data: 'stock'},
                    {data: "id"}
                ],
                columnDefs: [
                    {
                        targets: [-1],
                        class: 'text-center',
                        width: '10%',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="take" ' +
                                'data-toggle="tooltip" title="Seleccionar Insumo"><i class="fa fa-check"></i></a>' + ' '

                        }
                    },
                ]
            });
        });
    $("#datatable_search_medicacion tbody").on('click', 'a[rel="take"]', function () {
        var tr = tbl_detalle_medicina.cell($(this).closest('td, li')).index();
        var data = tbl_detalle_medicina.row(tr.row).data();
        var newOption = new Option(data.insumo.nombre + ' / stock: ' + data.stock, data.insumo.id, false, true);
        $('#id_medicina').append(newOption).trigger('change');
        id_select_medicina = data.insumo.id;
        $('#modal_search_medicacion').modal('hide');
        show_stock(data.stock);
    });


    modal_medicacion.on('hidden.bs.modal', function () {
        $('#id_dosis').val(1);
        $('#id_medicina').val(null).trigger('change');
        $('#dosis_cantidad').hide();
        $("#id_dosis").trigger('touchspin.destroy').val(1);
        id_select_medicina = 0;
    });

    $('#save_medicacion').on('click', function () {
        var parametros = {
            'distribucion_id': produccion.items.distribuicion_id,
            'dosis': $('#id_dosis').val(),
            'insumo': $('#id_medicina').val(),
            'action': action_medicacion,
            'id': id_medicacion,
            'fecha': $('#id_fecha_medicacion').val()
        };
        save_with_ajax('Alerta', '/medicacion/nuevo', 'Esta seguro que desea agregar esta medicacion en ' +
            'este Galpon?', parametros, function () {
            $('#modal_form_medicacion').modal('hide');
            ajax_get_data(produccion.items.distribuicion_id);
        })
    });

    $('#datatable_medicacion tbody')
        .on('click', 'button[name="del"]', function () {
            action_medicacion = 'delete';
            var tr = dt_medicacion.cell($(this).closest('td, li')).index();
            id_medicacion = parseInt(produccion.items.medicacion[tr.row].id);
            var parametros = {
                'action': action_medicacion,
                'id': id_medicacion
            };
            save_estado('Alerta', '/medicacion/nuevo', 'Esta seguro que desea eliminar este registro de medicacion',
                parametros, function () {
                    ajax_get_data(produccion.items.distribuicion_id);
                })
        });


    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------SECCION ALIMENTACION------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $('#add_alimentacion')
        .on('click', function () {
            if (id_galpon.val() === '') return false;
            action_alimentacion = 'add';
            data_form_alimentacion();
            $('#modal_search_alimentacion').modal('show').modal('hide');
        });

    function data_form_alimentacion() {
        modal_alimentacion.modal('show');
    }

    $('#id_alimento')
        .select2({
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
            ajax: {
                delay: 250,
                type: 'POST',
                url: '/alimentacion/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search',
                        'ids': id_select_alimento
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca un alimento',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            id_select_alimento = $('#id_alimento option:selected').val();
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/alimentacion/lista',
                data: {
                    "id": id_select_alimento,
                    'action': 'get'
                },
                dataType: 'json',
                success: function (data) {
                    show_stock_alimento(data[0]['stock_actual__sum']);
                },
                error: function (xhr, status, data) {
                    alert(data);
                },

            })
        })
        .on('select2:clearing', function () {
            $('#cantidad_alimento').fadeOut();
            $("#id_cantidad").trigger('touchspin.destroy').val(1);
            id_select_alimentacion = 0;
        });

    function show_stock_alimento(max) {
        $('#cantidad_alimento').fadeIn();
        $('#id_cantidad').TouchSpin({
            min: 1,
            max: max,
            step: 1,
            boostat: 5,
            maxboostedstep: 10
        });
    }

    $('#id_search_alimento')
        .on('click', function () {
            $('#modal_search_alimentacion').modal('show');
            tbl_detalle_alimento = $("#datatable_search_alimentacion").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/alimentacion/lista',
                    type: 'POST',
                    data: {'action': 'list_list', 'ids': id_select_alimento},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "insumo.nombre"},
                    {data: "presentacion.nombre"},
                    {data: 'stock'},
                    {data: "id"}
                ],
                columnDefs: [
                    {
                        targets: [-1],
                        class: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="take" ' +
                                'data-toggle="tooltip" title="Seleccionar Alimento"><i class="fa fa-check"></i></a>' + ' '

                        }
                    },
                ]
            });
        });
    $("#datatable_search_alimentacion tbody").on('click', 'a[rel="take"]', function () {
        var tr = tbl_detalle_alimento.cell($(this).closest('td, li')).index();
        var data = tbl_detalle_alimento.row(tr.row).data();
        var newOption = new Option(data.insumo.nombre + ' / stock: ' + data.stock, data.insumo.id, false, true);
        $('#id_alimento').append(newOption).trigger('change');
        id_select_alimento = data.insumo.id;
        $('#modal_search_alimentacion').modal('hide');
        show_stock_alimento(data.stock);
    });


    modal_alimentacion.on('hidden.bs.modal', function () {
        $('#id_alimento').val(null).trigger('change');
        $('#cantidad_alimento').hide();
        $("#id_cantidad").trigger('touchspin.destroy').val(1);
        id_select_alimento = 0;
    });

    $('#save_alimentacion').on('click', function () {
        var parametros = {
            'distribucion_id': produccion.items.distribuicion_id,
            'cantidad': $('#id_cantidad').val(),
            'insumo': $('#id_alimento').val(),
            'action': action_alimentacion,
            'id': id_alimentacion,
            'fecha': $('#id_fecha_alimentacion').val()
        };
        save_with_ajax('Alerta', '/alimentacion/nuevo', 'Esta seguro que desea agregar esta alimentacion en ' +
            'este Galpon?', parametros, function () {
            $('#modal_form_alimentacion').modal('hide');
            ajax_get_data(produccion.items.distribuicion_id);
        })
    });

    $('#datatable_alimentacion tbody')
        .on('click', 'button[name="del"]', function () {
            action_alimentacion = 'delete';
            var tr = dt_alimentacion.cell($(this).closest('td, li')).index();
            id_alimentacion = parseInt(produccion.items.alimentacion[tr.row].id);
            var parametros = {
                'action': action_alimentacion,
                'id': id_alimentacion
            };
            save_estado('Alerta', '/alimentacion/nuevo', 'Esta seguro que desea eliminar este registro de alimentacion',
                parametros, function () {
                    ajax_get_data(produccion.items.distribuicion_id);
                })
        });


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------SECCION MORTALIDAD------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $('#add_mortalidad')
        .on('click', function () {
            if (id_galpon.val() === '') return false;
            action_mortalidad = 'add';
            data_form_mortalidad();
        });

    $('#add_causa_muerte')
        .on('click', function () {
            $('#modal_form_causa_muerte').modal('show');
        });
    $('#id_causa')
        .select2({
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
            ajax: {
                delay: 250,
                type: 'POST',
                url: '/causa_muerte/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search'
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca una Causa de muerte',
            minimumInputLength: 1,
        });

    $('#modal_form_causa_muerte').on('hidden.bs.modal', function () {
        $('#form_causa_muerte').validate().resetForm();
        $('#id_nombre_causa_muerte').val('');
    });

    $('#form_causa_muerte').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', 'add');
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/causa_muerte/nuevo', 'Esta seguro que desea guardar esta causa de muerte?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar!', 'far fa-smile-wink', function () {
                        $('#modal_form_causa_muerte').modal('hide');
                        var newOption = new Option(response['nombre'], response['id'], false, true);
                        $('#id_causa').append(newOption).trigger('change');
                    });
                });
        }

    });

    function data_form_mortalidad() {
        modal_mortalidad.modal('show');
        $('#modal_form_causa_muerte').modal('show').modal('hide');
        $('#id_cantidad_muertes').TouchSpin({
            min: 1,
            max: $('#id_cantidad_in_galpon').val(),
            step: 1,
            boostat: 5,
            maxboostedstep: 10,
            prefix: '<i class="fas fa-skull-crossbones"></i>'
        })
    }

    modal_mortalidad.on('hidden.bs.modal', function () {
        $('#id_cantidad_muertes').val(1);
        $('#id_descrpcion_mortalidad').val('');
        $('#id_causa').val(null).trigger('change');
    });

    $('#form_mortalidad').on('submit', function (e) {
        e.preventDefault();
        var isvalid = $(this).valid();
        if (isvalid) {
            var parametros = {
                'distribucion_id': produccion.items.distribuicion_id,
                'cantidad_muertes': $('#id_cantidad_muertes').val(),
                'causa': $('#id_causa').val(),
                'descrpcion': $('#id_descrpcion_mortalidad').val(),
                'action': action_mortalidad,
                'id': id_mortalidad,
                'fecha': $('#id_fecha_mortalidad').val()
            };
            save_with_ajax('Alerta', '/mortalidad/nuevo', 'Esta seguro que desea guardar este numero de bajas a ' +
                'este Galpon?', parametros, function () {
                $('#modal_form_mortalidad').modal('hide');
                ajax_get_data(produccion.items.distribuicion_id);
            })
        }
    });

    $('#datatable_mortalidad tbody')
        .on('click', 'button[name="edit"]', function () {
            action_mortalidad = 'edit';
            var tr = dt_mortalidad.cell($(this).closest('td, li')).index();
            id_mortalidad = parseInt(produccion.items.mortalidad[tr.row].id);
            var newOption = new Option(produccion.items.mortalidad[tr.row].causa.nombre, produccion.items.mortalidad[tr.row].causa.id, false, true);
            $('#id_causa').append(newOption).trigger('change');
            $('#id_cantidad_muertes').val(parseInt(produccion.items.mortalidad[tr.row].cantidad_muertes));
            $('#id_descrpcion_mortalidad').val(produccion.items.mortalidad[tr.row].descrpcion);
            $('#id_fecha_mortalidad').val(produccion.items.mortalidad[tr.row].fecha).prop('disabled', false).daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: '<i class="fas fa-search"></i> Selccionar',
                    cancelLabel: '<i class="fas fa-times"></i> Cancelar',
                },
                singleDatePicker: true,
                maxDate: new Date(),

            });
            data_form_mortalidad();
        })
        .on('click', 'button[name="del"]', function () {
            action_mortalidad = 'delete';
            var tr = dt_mortalidad.cell($(this).closest('td, li')).index();
            id_mortalidad = parseInt(produccion.items.mortalidad[tr.row].id);
            var parametros = {
                'action': action_mortalidad,
                'distribucion_id': produccion.items.distribuicion_id,
                'id': id_mortalidad
            };
            save_estado('Alerta', '/mortalidad/nuevo', 'Esta seguro que desea eliminar estas bajas',
                parametros, function () {
                    ajax_get_data(produccion.items.distribuicion_id);
                })
        });


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------SECCION PESO------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $('#add_peso')
        .on('click', function () {
            if (id_galpon.val() === '') return false;
            action_peso = 'add';
            data_form_peso();
        });

    function data_form_peso() {
        modal_peso.modal('show');
        $('#id_peso_promedio').TouchSpin({
            min: 0.01,
            max: 300,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10,
            prefix: '<i class="fas fa-weight"></i>',
            postfix: 'lbs'
        })
    }

    modal_peso.on('hidden.bs.modal', function () {
        $('#id_peso_promedio').val(0.01);
    });

    $('#save_peso').on('click', function () {
        var parametros = {
            'distribucion_id': produccion.items.distribuicion_id,
            'peso_promedio': $('#id_peso_promedio').val(),
            'action': action_peso,
            'id': id_peso,
            'fecha': $('#id_fecha_peso').val()
        };
        save_with_ajax('Alerta', '/peso/nuevo', 'Esta seguro que desea guardar este peso promedio en ' +
            'este Galpon?', parametros, function () {
            $('#modal_form_peso').modal('hide');
            ajax_get_data(produccion.items.distribuicion_id);
        })
    });

    $('#datatable_peso tbody')
        .on('click', 'button[name="edit"]', function () {
            action_peso = 'edit';
            var tr = dt_peso.cell($(this).closest('td, li')).index();
            id_peso = parseInt(produccion.items.peso[tr.row].id);
            $('#id_peso_promedio').val(parseFloat(produccion.items.peso[tr.row].peso_promedio).toFixed(2));
            $('#id_fecha_peso').val(produccion.items.peso[tr.row].fecha).prop('disabled', false).daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: '<i class="fas fa-search"></i> Selccionar',
                    cancelLabel: '<i class="fas fa-times"></i> Cancelar',
                },
                singleDatePicker: true,
                maxDate: new Date(),

            });
            data_form_peso();
        })
        .on('click', 'button[name="del"]', function () {
            action_peso = 'delete';
            var tr = dt_peso.cell($(this).closest('td, li')).index();
            id_peso = parseInt(produccion.items.peso[tr.row].id);
            var parametros = {
                'action': action_peso,
                'id': id_peso
            };
            save_estado('Alerta', '/peso/nuevo', 'Esta seguro que desea eliminar este registro de peso',
                parametros, function () {
                    ajax_get_data(produccion.items.distribuicion_id);
                })
        });


    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------SECCION GASTO------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $('#add_gasto')
        .on('click', function () {
            if (id_galpon.val() === '') return false;
            action_gasto = 'add';
            data_form_gasto();
        });

    $('#add_tipo_gasto')
        .on('click', function () {
            $('#modal_form_tipo_gasto').modal('show');
        });
    $('#id_tipo_gasto')
        .select2({
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
            ajax: {
                delay: 250,
                type: 'POST',
                url: '/tipo_gasto/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search'
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca una tipo de Gasto',
            minimumInputLength: 1,
        });

    $('#modal_form_tipo_gasto').on('hidden.bs.modal', function () {
        $('#form_tipo_gasto').validate().resetForm();
        $('#id_nombre_tipo_gasto').val('');
    });

    $('#form_tipo_gasto').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', 'add');
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/tipo_gasto/nuevo', 'Esta seguro que desea guardar este tipo de Gasto?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar!', 'far fa-smile-wink', function () {
                        $('#modal_form_tipo_gasto').modal('hide');
                        var newOption = new Option(response['nombre'], response['id'], false, true);
                        $('#id_tipo_gasto').append(newOption).trigger('change');
                    });
                });
        }

    });

    function data_form_gasto() {
        modal_gasto.modal('show');
        $('#modal_form_tipo_gasto').modal('show').modal('hide');
        $('#id_valor').TouchSpin({
            min: 1.00,
            decimals: 2,
            max: 10000000,
            step: 0.01,
            boostat: 5,
            maxboostedstep: 10,
            prefix: '$'
        })
    }

    modal_gasto.on('hidden.bs.modal', function () {
        $('#id_valor').val(1);
        $('#id_detalle').val('');
        $('#id_tipo_gasto').val(null).trigger('change');
    });

    $('#form_gasto').on('submit', function (e) {
        e.preventDefault();
        var isvalid = $(this).valid();
        if (isvalid) {
            var parametros = {
                'distribucion_id': produccion.items.distribuicion_id,
                'valor': $('#id_valor').val(),
                'tipo_gasto': $('#id_tipo_gasto').val(),
                'detalle': $('#id_detalle').val(),
                'action': action_gasto,
                'id': id_gasto,
                'fecha_pago': $('#id_fecha_pago').val()
            };
            save_with_ajax('Alerta', '/gasto/nuevo', 'Esta seguro que desea guardar este nuevo gasto a ' +
                'este Galpon?', parametros, function () {
                $('#modal_form_gasto').modal('hide');
                ajax_get_data(produccion.items.distribuicion_id);
            })
        }
    });

    $('#datatable_gasto tbody')
        .on('click', 'button[name="edit"]', function () {
            action_gasto = 'edit';
            var tr = dt_gasto.cell($(this).closest('td, li')).index();
            id_gasto = parseInt(produccion.items.gasto[tr.row].id);
            var newOption = new Option(produccion.items.gasto[tr.row].tipo_gasto.nombre, produccion.items.gasto[tr.row].tipo_gasto.id, false, true);
            $('#id_tipo_gasto').append(newOption).trigger('change');
            $('#id_valor').val(parseFloat(produccion.items.gasto[tr.row].valor).toFixed(2));
            $('#id_detalle').val(produccion.items.gasto[tr.row].detalle);
            $('#id_fecha_pago').val(produccion.items.gasto[tr.row].fecha_pago).prop('disabled', false).daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: '<i class="fas fa-search"></i> Selccionar',
                    cancelLabel: '<i class="fas fa-times"></i> Cancelar',
                },
                singleDatePicker: true,
                maxDate: new Date(),

            });
            data_form_gasto();
        })
        .on('click', 'button[name="del"]', function () {
            action_gasto = 'delete';
            var tr = dt_gasto.cell($(this).closest('td, li')).index();
            id_gasto = parseInt(produccion.items.gasto[tr.row].id);
            var parametros = {
                'action': action_gasto,
                'distribucion_id': produccion.items.distribuicion_id,
                'id': id_gasto
            };
            save_estado('Alerta', '/gasto/nuevo', 'Esta seguro que desea eliminar estos gastos',
                parametros, function () {
                    ajax_get_data(produccion.items.distribuicion_id);
                })
        });

});





