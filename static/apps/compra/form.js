var tblcompra;
var compras = {
    items: {
        fecha_compra: '',
        proveedor: '',
        subtotal: 0.00,
        iva: 0.00,
        iva_emp: 0.00,
        total: 0.00,
        productos: [],
    },
    get_ids: function () {
        var ids = [];
        $.each(this.items.productos, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    calculate: function () {
        var subtotal = 0.00;
        var iva_emp = 0.00;
        $.each(this.items.productos, function (pos, dict) {
            dict.subtotal = dict.cantidad * parseFloat(dict.pcp);
            subtotal += dict.subtotal;
            iva_emp = dict.iva_emp;
        });
        this.items.subtotal = subtotal;
        this.items.iva = this.items.subtotal * (iva_emp / 100);
        this.items.total = this.items.subtotal + this.items.iva;
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="iva"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },
    add: function (data) {
        this.items.productos.push(data);
        this.items.productos = this.exclude_duplicados(this.items.productos);
        this.list();

    },
    list: function () {
        this.calculate();
        tblcompra = $("#datatable").DataTable({
            destroy: true,
            autoWidth: false,
            dataSrc: "",
            scrollX: true,
            language: {
                "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
            data: this.items.productos,
            columns: [
                {data: 'id'},
                {data: "producto_base.nombre"},
                {data: "producto_base.categoria.nombre"},
                {data: "presentacion.nombre"},
                {data: "imagen"},
                {data: "cantidad"},
                {data: "pcp"},
                {data: "subtotal"}
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" type="button" class="btn btn-danger btn-sm btn-flat" style="color: white" data-toggle="tooltip" title="Eliminar Insumo"><i class="fa fa-trash-alt"></i></a>';
                        //return '<a rel="remove" class="btn btn-danger btn-sm btn-flat"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                {
                    targets: [-1, -2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<img src="' + data + '" width="30" height="30" class="img-circle elevation-2" alt="">';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" name="cantidad" class="form-control form-control-sm input-sm" autocomplete="off" value="' + data + '">';

                    }
                }],
            rowCallback: function (row, data) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 1,
                    max: 100000000,
                    step: 1
                });
            }
        });
    },

    exclude_duplicados: function (array) {
        this.items.productos = [];
        let hash = {};
        result = array.filter(o => hash[o.id] ? false : hash[o.id] = true);
        return result;

    }

};
$(function () {
    //cantidad de productos
    $('#datatable tbody')
        .on('click', 'a[rel="remove"]', function () {
            var tr = tblcompra.cell($(this).closest('td, li')).index();
            borrar_todo_alert('Alerta de Eliminación',
                'Esta seguro que desea eliminar este producto de tu detalle?', function () {
                    var p = compras.items.productos[tr.row];
                    compras.items.productos.splice(tr.row, 1);
                    $('#id_material').append('<option value="' + p.id + '">' + p.nombre + '</option>');
                    menssaje_ok('Confirmacion!', 'Producto eliminado', 'far fa-smile-wink', function () {
                        compras.list();
                    });
                })
        })
        .on('change', 'input[name="cantidad"]', function () {
            var cantidad = parseInt($(this).val());
            var tr = tblcompra.cell($(this).closest('td, li')).index();
            compras.items.productos[tr.row].cantidad = cantidad;
            compras.calculate();
            $('td:eq(6)', tblcompra.row(tr.row).node()).html('$' + compras.items.productos[tr.row].subtotal.toFixed(2));
        });
    $('.btnRemoveall')
        .on('click', function () {
        if (compras.items.productos.length === 0) return false;
        borrar_todo_alert('Alerta de Eliminación',
            'Esta seguro que desea eliminar todos los productos seleccionados?', function () {
                compras.items.productos = [];
                menssaje_ok('Confirmacion!', 'Productos eliminados', 'far fa-smile-wink', function () {
                    compras.list();
                });
            });
    });

    $('#save')
        .on('click', function () {
        if (compras.items.productos.length === 0) {
            menssaje_error('Error!', "Debe seleccionar al menos un producto", 'far fa-times-circle');
            return false
        } else {
            $('#Modal_detalle').modal('show');
        }
    });
    $('#facturar')
        .on('click', function () {
        if ($('select[name="proveedor"]').val() === "") {
            menssaje_error('Error!', "Debe seleccionar un proveedor", 'far fa-times-circle');
            return false
        }
        var action = $('input[name="action"]').val();
        var key = $('input[name="key"]').val();
        var parametros;
        compras.items.fecha_compra = $('input[name="fecha_compra"]').val();
        compras.items.proveedor = $('#id_proveedor option:selected').val();
        parametros = {'compras': JSON.stringify(compras.items)};
        parametros['action'] = 'add';
        parametros['id'] = '';
        save_with_ajax('Alerta',
            window.location.pathname, 'Esta seguro que desea guardar esta compra?', parametros, function (response) {
                var ok = {'productos': response['productos']};
                $('[name="datos"]').attr('value', JSON.stringify(response['productos']));
                window.location.replace('/compra/lista')
                // printpdf('Alerta!', '¿Desea generar el comprobante en PDF?', function () {
                //     window.open('/compra/printpdf/' + response['id'], '_blank');
                //     // $('#form_in').submit();
                // }, function () {
                //     // $('#form_in').submit();
                //
                // });
            });
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
            placeholder: 'Busca un proveedor',
            minimumInputLength: 1,
        });

    $('#id_producto')
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
                url: '/producto/lista',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'search_no_stock',
                        'ids': JSON.stringify(compras.get_ids())
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca un producto',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            $.ajax({
                type: "POST",
                url: '/producto/lista',
                data: {
                    "id": $('#id_producto option:selected').val(),
                    "action": 'get'
                },
                dataType: 'json',
                success: function (data) {
                    compras.add(data[0]);
                    $('#id_producto').val(null).trigger('change');

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

    $('#id_search_table')
        .on('click', function () {
        $('#Modal_search').modal('show');
        tbl_productos = $("#tbl_productos").DataTable({
            destroy: true,
            autoWidth: false,
            dataSrc: "",
            responsive: true,
            ajax: {
                url: '/producto/lista',
                type: 'POST',
                data: {'action': 'list_list', 'ids': JSON.stringify(compras.get_ids())},
                dataSrc: ""
            },
            language: {
                "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
            columns: [
                {data: "producto_base.nombre"},
                {data: "producto_base.categoria.nombre"},
                {data: "presentacion.nombre"},
                {data: "stock"},
                {data: "producto_base.descripcion"},
                {data: "pvp"},
                {data: "pcp"},
                {data: "imagen"},
                {data: "id"}
            ],
            columnDefs: [
                {
                    targets: [-3, -4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<img src="' + data + '" width="30" height="30" class="img-circle elevation-2">';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    width: '10%',
                    orderable: false,
                    render: function (data, type, row) {
                        var edit = '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="take" ' +
                            'data-toggle="tooltip" title="Seleccionar Producto"><i class="fa fa-check"></i></a>' + ' ';
                        return edit

                    }
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 1,
                    max: data.producto_base.stock,
                    step: 1
                });
            }
        });
    });

    $('#tbl_productos tbody')
        .on('click', 'a[rel="take"]', function () {
            var tr = tbl_productos.cell($(this).closest('td, li')).index();
            var data = tbl_productos.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'get'};
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: '/producto/lista',
                data: parametros,
            }).done(function (data) {
                if (!data.hasOwnProperty('error')) {
                    compras.add(data[0]);
                    $('#Modal_search').modal('hide');
                    return false;
                }
                menssaje_error(data.error, data.content, 'fa fa-times-circle');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        });

});

