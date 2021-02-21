var logotipo;
var datatable;
var action;
var pk;

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
            data: {'action': 'list'},
            dataSrc: ""
        },
        columns: [
            {"data": "producto_base.nombre"},
            {"data": "producto_base.categoria.nombre"},
            {"data": "presentacion.nombre"},
            {"data": "stock"},
            {"data": "producto_base.descripcion"},
            {"data": "pvp"},
            {"data": "pcp"},
            {"data": "imagen"},
            {"data": "id"}
        ],
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
                    className: 'btn btn-danger btn-space',
                    extend: 'pdfHtml5',
                    //filename: 'dt_custom_pdf',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize,
                },
                {
                    text: '<i class="fa fa-file-excel"></i> Excel', className: "btn btn-success btn-space",
                    extend: 'excel'
                }
            ],
        },

        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columnDefs: [
            {
                targets: [3],
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
                    return '<span>$ ' + parseFloat(data).toFixed(2) + '</span>';
                }
            },
            {
                targets: '__all',
                class: 'text-center'
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
                    var edit = '<a style="color: white" type="button" class="btn btn-primary btn-xs" rel="edit" ' +
                        'data-toggle="tooltip" title="Editar Datos"><i class="fa fa-edit"></i></a>' + ' ';
                    var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-trash"></i></a>' + ' ';
                    return edit + del

                }
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.stock >= 51) {
                $('td', row).eq(3).find('span').addClass('badge badge-success').attr("style", "color: white");
            } else if (data.stock >= 10) {
                $('td', row).eq(3).find('span').addClass('badge badge-warning').attr("style", "color: white");
            } else if (data.stock <= 9) {
                $('td', row).eq(3).find('span').addClass('badge badge-danger').attr("style", "color: white");
            }

        }

    });
}

$(function () {
    datatable_fun();
    //Botones dentro de datatable
    $('#datatable tbody')
        .on('click', 'a[rel="del"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'delete'};
            save_estado('Alerta',
                '/producto/nuevo', 'Esta seguro que desea eliminar este producto?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar el producto!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false);
                    })
                });
        })
        .on('click', 'a[rel="edit"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            check_image(data);
            cal_pvp();
            mostrar();
            action = 'edit';
            pk = data.id;
        });

    //botones de formulario
    $('#nuevo').on('click', function () {
        reset('#form');
        mostrar();
        cal_pvp();
        action = 'add';
        pk = '';
    });
    $('#cancel_2').on('click', function () {
        $('#div_table').removeClass('col-xl-8 col-lg-12').addClass('col-xl-12');
        ocultar('#form');
        $('select[name="producto_base"]').val('').trigger('change');
        $('select[name="presentacion"]').val('').trigger('change');
        $('#check_image').html(
            '<input type="file" name="imagen" accept="image/*" id="id_imagen">');
    });

    $('#id_producto_base')
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
                url: '/producto/nuevo',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'search'
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
            },
            placeholder: 'Busca un Producto',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            $.ajax({
                type: "POST",
                url: '/producto/nuevo',
                data: {
                    "id": $('#id_producto_base option:selected').val(),
                    'action': 'get'
                },
                dataType: 'json',
                success: function (data) {
                    $('#id_des').val(data[0].descripcion);
                    $('#id_cat').val(data[0]['categoria'].nombre);
                },
                error: function (xhr, status, data) {
                    alert(data);
                },

            })
        })
        .on('change', function () {
            if ($(this).val() === '') {
                $('#id_des').val(null);
                $('#id_cat').val(null);
            }

        });

    $('#id_categoria')
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
                url: '/categoria/lista',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'search'
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
            },
            placeholder: 'Busca una Categoria',
            minimumInputLength: 1,
        });

    $('#id_presentacion_producto')
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
                url: '/presentacion/nuevo',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'search'
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
            },
            placeholder: 'Busca una Presentacion',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            $.ajax({
                type: "POST",
                url: '/presentacion/nuevo',
                data: {
                    "id": $('#id_presentacion_producto option:selected').val(),
                    'action': 'get'
                },
                dataType: 'json',
                success: function (data) {
                    $(this).val(data[0].nombre);
                },
                error: function (xhr, status, data) {
                    alert(data);
                },

            })
        });

    $('#id_new_producto').on('click', function () {
        $('#Modal_prod').modal('show');
        action = 'add';
        pk = '';
    });
    $('#id_new_categoria').on('click', function () {
        $('#Modal').modal('show');
        action = 'add';
        pk = '';
    });
    $('#id_new_presentacion').on('click', function () {
        $('#Modal2').modal('show');
        action = 'add';
        pk = '';
    });


    $('#form_prod').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', 'add_base');
        parametros.append('id', '');
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/producto/nuevo', 'Esta seguro que desea guardar este producto?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este producto!', 'far fa-smile-wink', function () {
                        $('#Modal_prod').modal('hide');
                        var newOption = new Option(response.producto_base['nombre'], response.producto_base['id'], false, true);
                        $('#id_producto_base').append(newOption).trigger('change');
                        $('#id_des').val(response.producto_base['descripcion']);
                        $('#id_cat').val(response.producto_base['categoria'].nombre);
                    });
                });
        }
    });
    $('#form_cat').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/categoria/nuevo', 'Esta seguro que desea guardar esta categoria?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar esta categoria!', 'far fa-smile-wink', function () {
                        $('#Modal').modal('hide');
                        var newOption = new Option(response.categoria['nombre'], response.categoria['id'], false, true);
                        $('#id_categoria').append(newOption).trigger('change');
                    });

                });
        }
    });
    $('#form_pre').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/presentacion/nuevo', 'Esta seguro que desea guardar esta presentacion?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar esta presentacion!', 'far fa-smile-wink', function () {
                        $('#Modal2').modal('hide');
                        var newOption = new Option(response.presentacion['full'], response.presentacion['id'], false, true);
                        $('#id_presentacion_producto').append(newOption).trigger('change');
                    });
                });
        }
    });

    //enviar formulario de nuevo producto
    $('#form').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/producto/nuevo', 'Esta seguro que desea guardar este producto?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este producto!', 'far fa-smile-wink', function () {
                        $('#div_table').removeClass('col-xl-8 col-lg-12').addClass('col-xl-12');
                        ocultar('#form');
                        $('select[name="producto_base"]').val('').trigger('change');
                        $('select[name="presentacion"]').val('').trigger('change');
                        $('#check_image').html(
                            '<input type="file" name="imagen" accept="image/*" id="id_imagen">');
                    });
                });
        }
    });

    function check_image(data) {
        if (data.check === 1) {
            $('#check_image').html(
                '<p class="file-upload"><strong>Actualmente:</strong> <a href="' + data.imagen + '"></a><br>'
                + data.name_imagen + '<br><span class="clearable-file-input"> <input type="checkbox" ' +
                'name="imagen-clear" id="imagen-clear_id"> <label for="imagen-clear_id">Limpiar</label></span><br>' +
                'Modificar: <input type="file" name="imagen" accept="image/*" id="id_imagen"></p>');
        } else {
            $('#check_image').html(
                '<input type="file" name="imagen" accept="image/*" id="id_imagen">');

        }
        $('#id_des').val(data.producto_base.descripcion);
        $('#id_cat').val(data.producto_base.categoria.nombre);
        $('#id_pcp').val(data.pcp);
        $('select[name="producto_base"]').val(data.producto_base.id).trigger('change');
        $('select[name="presentacion"]').val(data.presentacion.id).trigger('change');

    }
});