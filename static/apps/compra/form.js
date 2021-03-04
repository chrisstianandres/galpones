var tblcompra;
var tblalimentos_seacrh;
var tasa_iva = ($('#id_tasa_iva').val()) * 100.00;
var dt_detalle;
var dt_detalle_alimentos;
var compras = {
    items: {
        fecha_compra: '',
        comprobante: '',
        proveedor: '',
        subtotal: 0.00,
        iva: 0.00,
        tasa_iva: 0.00,
        total: 0.00,
        medicinas: [],
        alimentos: [],
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
        this.items.medicinas.push(data);
        this.list();

    },
    add_alimento: function (data) {
        this.items.alimentos.push(data);
        this.list_alimentos();

    },
    list: function () {
        this.calculate();
        dt_detalle = $("#datatable_detalle").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            dom: 'tipr',
            data: this.items.medicinas,
            columns: [
                {"data": "insumo.nombre"},
                {"data": "insumo.categoria.nombre"},
                {"data": "tipo_medicina.nombre"},
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
    //Iva porcentaje
    $('#id_tasa_iva')
        .TouchSpin({
            min: 0.01,
            decimals: 2,
            max: 100000000,
            step: 0.01,
            prefix: '<i class="fas fa-percent"></i>'
        })
        .val(tasa_iva)
        .on('change keyup', function () {
            tasa_iva = ($(this).val());
            compras.calculate();
        });
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
    $('#vaciar_medicina')
        .on('click', function () {
            if (compras.items.medicinas.length === 0) return false;
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea eliminar todos las medicinas seleccionadas?', function () {
                    compras.items.medicinas = [];
                    menssaje_ok('Confirmacion!', 'Medicinas eliminados', 'far fa-smile-wink', function () {
                        compras.list();
                    });
                });
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

    $('#datatable_search_medicina tbody')
        .on('click', 'a[rel="take"]', function () {
            var tr = tbl_productos.cell($(this).closest('td, li')).index();
            var data = tbl_productos.row(tr.row).data();
            compras.add(data);
            $('#modal_search_medicina').modal('hide');
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
    $('#vaciar_alimentos')
        .on('click', function () {
            if (compras.items.alimentos.length === 0) return false;
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea eliminar todos las alimentos seleccionadas?', function () {
                    compras.items.alimentos = [];
                    menssaje_ok('Confirmacion!', 'Alimentos eliminados', 'far fa-smile-wink', function () {
                        compras.list_alimentos();
                    });
                });
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

    $('#datatable_search_alimento tbody')
        .on('click', 'a[rel="take"]', function () {
            var tr = tblalimentos_seacrh.cell($(this).closest('td, li')).index();
            var data = tblalimentos_seacrh.row(tr.row).data();
            compras.add_alimento(data);
            $('#modal_search_alimento').modal('hide');
        });

    $('#id_new_proveedor')
        .on('click', function () {
            $('#Modal_person').modal('show');
        });

    $('#form_person')
        .on('submit', function (e) {
            e.preventDefault();
            var parametros = new FormData(this);
            parametros.append('action', 'add');
            parametros.append('id', '');
            var isvalid = $(this).valid();
            if (isvalid) {
                save_with_ajax2('Alerta',
                    '/proveedor/nuevo', 'Esta seguro que desea guardar este proveedor?', parametros,
                    function (response) {
                        menssaje_ok('Exito!', 'Exito al guardar este proveedor!', 'far fa-smile-wink', function () {
                            $('#Modal_person').modal('hide');
                            var newOption = new Option(response.proveedor['full_name'], response.proveedor['id'], false, true);
                            $('#id_proveedor').append(newOption).trigger('change');
                        });
                    });
            }

        });

    $('#id_proveedor')
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
                url: '/proveedor/lista',
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
            placeholder: 'Busca un proveedor',
            minimumInputLength: 1,
        });

    $('#id_insumo')
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
                url: '/medicina/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search',
                        'ids': JSON.stringify(compras.get_ids())
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
            $.ajax({
                type: "POST",
                url: '/medicina/lista',
                data: {
                    "id": $('#id_insumo option:selected').val(),
                    "action": 'get'
                },
                dataType: 'json',
                success: function (data) {
                    compras.add(data[0]);
                    $('#id_insumo').val(null).trigger('change');

                },
                error: function (xhr, status, data) {
                    alert(data['0']);
                },

            })
        });
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
                url: '/alimento/lista',
                data: function (params) {
                    return {
                        term: params.term,
                        'action': 'search',
                        'ids': JSON.stringify(compras.get_ids_alimento())
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
            $.ajax({
                type: "POST",
                url: '/alimento/lista',
                data: {
                    "id": $('#id_alimento option:selected').val(),
                    "action": 'get'
                },
                dataType: 'json',
                success: function (data) {
                    compras.add_alimento(data[0]);
                    $('#id_alimento').val(null).trigger('change');

                },
                error: function (xhr, status, data) {
                    alert(data['0']);
                },

            })
        });

    $('#Modal_person')
        .on('hidden.bs.modal', function (e) {
            reset('#form_person');
            $('#form_person').trigger("reset");
        });

    $('#save')
        .on('click', function () {
            if ($('select[name="proveedor"]').val() === "") {
                menssaje_error('Error!', "Debe seleccionar un proveedor", 'far fa-times-circle');
                return false
            } else if (compras.items.medicinas.length === 0 && compras.items.alimentos.length === 0) {
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

    $("#id_comprobante").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errmsg").html("Solo numeros").show().fadeOut("slow");
            return false;
        }
    });

});

