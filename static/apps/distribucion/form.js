var tblcompra;
var tbl_galpon_seacrh;
var tasa_iva = ($('#id_tasa_iva').val()) * 100.00;
var dt_detalle;
var dt_detalle_alimentos;
var id_galpon = $('#id_galpon');
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
        medicinas: [],
        alimentos: [],
        peso: [],
        mortalidad: [],
        gasto:[],
    },
    get_ids: function () {
        var ids = [];
        $.each(this.items.medicinas, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    get_ids_alimento: function () {
        var ids = [];
        $.each(this.items.alimentos, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    calculate: function () {
        var subtotal = 0.00;
        var iva_emp = tasa_iva;
        $.each(this.items.medicinas, function (pos, dict) {
            dict.subtotal = dict.cantidad * parseFloat(dict.precio);
            subtotal += dict.subtotal;
        });
        $.each(this.items.alimentos, function (pos, dict) {
            dict.subtotal = dict.cantidad * parseFloat(dict.precio);
            subtotal += dict.subtotal;
        });
        this.items.subtotal = subtotal;
        this.items.iva = this.items.subtotal * (iva_emp / 100);
        this.items.total = this.items.subtotal + this.items.iva;
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="iva"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
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
        console.log(data);
        this.list();

    },
    add_alimento: function (data) {
        this.items.alimentos.push(data);
        this.list_alimentos();

    },
    list: function () {
        // dt_detalle = $("#datatable_detalle").DataTable({
        //     destroy: true,
        //     responsive: true,
        //     autoWidth: false,
        //     dom: 'tipr',
        //     data: this.items.medicinas,
        //     columns: [
        //         {"data": "insumo.nombre"},
        //         {"data": "insumo.categoria.nombre"},
        //         {"data": "tipo_medicina.nombre"},
        //         {"data": "precio"},
        //         {"data": "cantidad"},
        //         {"data": "subtotal"},
        //         {"data": "id"}
        //     ],
        //     language: {
        //         url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        //     },
        //     columnDefs: [
        //         {
        //             targets: '_all',
        //             class: 'text-center',
        //
        //         },
        //         {
        //             targets: [-1],
        //             class: 'text-center',
        //             width: "15%",
        //             render: function (data, type, row) {
        //                 return '<a type="button" rel="remove" class="btn btn-danger btn-xs btn-round" ' +
        //                     'style="color: white" data-toggle="tooltip" title="Quitar"><i class="fa fa-times"></i>' +
        //                     '</a>';
        //             }
        //         },
        //         {
        //             targets: [-4],
        //             render: function (data, type, row) {
        //                 return '<input type="text" class="form-control input-sm" value="' + data + '" name="precio">';
        //             }
        //         },
        //         {
        //             targets: [-3],
        //             render: function (data, type, row) {
        //                 return '<input type="text" class="form-control input-sm" value="' + data + '" name="cantidad">';
        //             }
        //         },
        //         {
        //             targets: [-2],
        //             render: function (data, type, row) {
        //                 return '$ ' + parseFloat(data).toFixed(2);
        //             }
        //         },
        //     ],
        //     createdRow: function (row, data, dataIndex) {
        //         $(row).find('input[name="cantidad"]').TouchSpin({
        //             min: 1,
        //             max: 1000000,
        //             step: 1
        //         });
        //         $(row).find('input[name="precio"]').TouchSpin({
        //             min: 1.00,
        //             decimals: 2,
        //             max: 100000000,
        //             step: 0.01,
        //             prefix: '<i class="fas fa-dollar-sign"></i>'
        //         });
        //
        //     }
        // });
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
                        return data + ' ' + 'KG'
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
    },
    list_alimentos: function () {
        this.calculate();
        dt_detalle_alimentos = $("#datatable_alimento").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            dom: 'tipr',
            data: this.items.alimentos,
            columns: [
                {"data": "insumo.nombre"},
                {"data": "insumo.categoria.nombre"},
                {"data": "presentacion.nombre"},
                {"data": "precio"},
                {"data": "cantidad"},
                {"data": "subtotal"},
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
                    targets: [-1],
                    class: 'text-center',
                    width: "15%",
                    render: function (data, type, row) {
                        return '<a type="button" rel="remove" class="btn btn-danger btn-xs btn-round" ' +
                            'style="color: white" data-toggle="tooltip" title="Quitar"><i class="fa fa-times"></i>' +
                            '</a>';
                    }
                },
                {
                    targets: [-4],
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-sm" value="' + data + '" name="precio">';
                    }
                },
                {
                    targets: [-3],
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-sm" value="' + data + '" name="cantidad">';
                    }
                },
                {
                    targets: [-2],
                    render: function (data, type, row) {
                        return '$ ' + parseFloat(data).toFixed(2);
                    }
                },
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 1,
                    max: 1000000,
                    step: 1
                });
                $(row).find('input[name="precio"]').TouchSpin({
                    min: 1.00,
                    decimals: 2,
                    max: 100000000,
                    step: 0.01,
                    prefix: '<i class="fas fa-dollar-sign"></i>'
                });

            }
        });
    },

};
$(function () {
    produccion.list();
    //seccion Medcicinas
    $('#datatable_detalle tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = dt_detalle.cell($(this).closest('td, li')).index();
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea eliminar esta medicina de tu detalle?', function () {
                    var p = compras.items.medicinas[tr.row];
                    compras.items.medicinas.splice(tr.row, 1);
                    menssaje_ok('Confirmacion!', 'Medicina eliminado', 'far fa-smile-wink', function () {
                        compras.list();
                    });
                })
        })
        .on('change', 'input[name="cantidad"]', function () {
            var cantidad = parseInt($(this).val());
            var tr = dt_detalle.cell($(this).closest('td, li')).index();
            compras.items.medicinas[tr.row].cantidad = cantidad;
            compras.calculate();
            $('td:eq(5)', dt_detalle.row(tr.row).node()).html('$' + compras.items.medicinas[tr.row].subtotal.toFixed(2));
        })
        .on('change', 'input[name="precio"]', function () {
            var precio = parseFloat($(this).val()).toFixed(2);
            var tr = dt_detalle.cell($(this).closest('td, li')).index();
            compras.items.medicinas[tr.row].precio = precio;
            compras.calculate();
            $('td:eq(5)', dt_detalle.row(tr.row).node()).html('$' + compras.items.medicinas[tr.row].subtotal.toFixed(2));
        });

    $('#id_search_medicina')
        .on('click', function () {
            $('#modal_search_medicina').modal('show');
            tbl_productos = $("#datatable_search_medicina").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/medicina/lista',
                    type: 'POST',
                    data: {'action': 'list_list', 'ids': JSON.stringify(compras.get_ids())},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "insumo.nombre"},
                    {data: "insumo.categoria.nombre"},
                    {data: "tipo_medicina.nombre"},
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

    //seccion alimentos
    $('#datatable_alimento tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = dt_detalle_alimentos.cell($(this).closest('td, li')).index();
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea eliminar este alimento de tu detalle?', function () {
                    compras.items.alimentos.splice(tr.row, 1);
                    menssaje_ok('Confirmacion!', 'Alimento eliminado', 'far fa-smile-wink', function () {
                        compras.list_alimentos();
                    });
                })
        })
        .on('change', 'input[name="cantidad"]', function () {
            var cantidad = parseInt($(this).val());
            var tr = dt_detalle_alimentos.cell($(this).closest('td, li')).index();
            compras.items.alimentos[tr.row].cantidad = cantidad;
            compras.calculate();
            $('td:eq(5)', dt_detalle_alimentos.row(tr.row).node()).html('$' + compras.items.alimentos[tr.row].subtotal.toFixed(2));
        })
        .on('change', 'input[name="precio"]', function () {
            var precio = parseFloat($(this).val()).toFixed(2);
            var tr = dt_detalle_alimentos.cell($(this).closest('td, li')).index();
            compras.items.alimentos[tr.row].precio = precio;
            compras.calculate();
            $('td:eq(5)', dt_detalle_alimentos.row(tr.row).node()).html('$' + compras.items.alimentos[tr.row].subtotal.toFixed(2));
        });

    $('#id_search_alimentos')
        .on('click', function () {
            $('#modal_search_alimento').modal('show');
            tblalimentos_seacrh = $("#datatable_search_alimento").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/alimento/lista',
                    type: 'POST',
                    data: {'action': 'list_list', 'ids': JSON.stringify(compras.get_ids_alimento())},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "insumo.nombre"},
                    {data: "insumo.categoria.nombre"},
                    {data: "presentacion.nombre"},
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


    $('#save')
        .on('click', function () {
            if ($('select[name="proveedor"]').val() === "") {
                menssaje_error('Error!', "Debe seleccionar un proveedor", 'far fa-times-circle');
                return false
            } else if (compras.items.medicinas.length === 0 || compras.items.alimentos.length === 0) {
                menssaje_error('Error!', "Debe seleccionar al menos una Medicina o un Alimento", 'far fa-times-circle');
                return false
            } else {
                var parametros;
                compras.items.fecha_compra = $('input[name="fecha_compra"]').val();
                compras.items.proveedor = $('#id_proveedor option:selected').val();
                compras.items.tasa_iva = $('#id_tasa_iva').val();
                compras.items.comprobante = $('#id_comprobante').val();
                parametros = {'compras': JSON.stringify(compras.items)};
                parametros['action'] = 'add';
                save_with_ajax('Alerta',
                    '/compra/nuevo', 'Esta seguro que desea guardar esta compra?', parametros, function (response) {
                        listado.fadeIn();
                        formulario.fadeOut();
                        $('#id_proveedor').val(null).trigger('change');
                        compras.items.medicinas = [];
                        compras.items.alimentos = [];
                        datatable.ajax.reload(null, false);
                    });
            }
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
            postfix: 'KG'
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


