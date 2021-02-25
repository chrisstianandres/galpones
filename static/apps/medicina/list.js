var logotipo;
var datatable;
var action;
var pk;
var tipo = $('#id_tipo_medicina');

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
            {"data": "nombre"},
            {"data": "tipo_medicina.nombre"},
            {"data": "descripcion"},
            {"data": "precio"},
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
            ],
        },

        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columnDefs: [
            // {
            //     targets: [3],
            //     class: 'text-center',
            //     orderable: false,
            //     render: function (data, type, row) {
            //         return '<span>' + data + '</span>';
            //     }
            // },
            {
                targets: [-2],
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
            // {
            //     targets: [-2],
            //     class: 'text-center',
            //     orderable: false,
            //     render: function (data, type, row) {
            //         return '<img src="' + data + '" width="30" height="30" class="img-circle elevation-2">';
            //     }
            // },
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
                '/medicina/nuevo', 'Esta seguro que desea eliminar esta medicina?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar esta medicina!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false);
                    })
                });
        })
        .on('click', 'a[rel="edit"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            action = 'edit';
            pk = data.id;
            $('#id_nombre').val(data.nombre);
            $('#id_descripcion').val(data.descripcion);
            $('#id_precio').val(data.precio);
            var newOption = new Option(data.tipo_medicina.nombre, data.tipo_medicina.id, false, true);
            $('#id_tipo_medicina').append(newOption).trigger('change');
            $(this).attr('href', '#');
        });

    $('#cancel').on('click', function () {
        $('#form').validate().resetForm();
    });
    $('#id_precio').TouchSpin({
        min: 0.05,
        max: 1000000,
        step: 0.01,
        decimals: 2,
        forcestepdivisibility: 'none',
        boostat: 5,
        maxboostedstep: 10,
        prefix: '$'
    });

    // $('#id_tipo_medicina')
    //     .select2({
    //         theme: "classic",
    //         language: {
    //             inputTooShort: function () {
    //                 return "Ingresa al menos un caracter...";
    //             },
    //             "noResults": function () {
    //                 return "Sin resultados";
    //             },
    //             "searching": function () {
    //                 return "Buscando...";
    //             }
    //         },
    //         allowClear: true,
    //         ajax: {
    //             delay: 250,
    //             type: 'POST',
    //             url: '/producto/nuevo',
    //             data: function (params) {
    //                 var queryParameters = {
    //                     term: params.term,
    //                     'action': 'search'
    //                 };
    //                 return queryParameters;
    //             },
    //             processResults: function (data) {
    //                 return {
    //                     results: data,
    //                 };
    //             },
    //         },
    //         placeholder: 'Busca un Producto',
    //         minimumInputLength: 1,
    //     })
    //     .on('select2:select', function (e) {
    //         $.ajax({
    //             type: "POST",
    //             url: '/producto/nuevo',
    //             data: {
    //                 "id": $('#id_producto_base option:selected').val(),
    //                 'action': 'get'
    //             },
    //             dataType: 'json',
    //             success: function (data) {
    //                 $('#id_des').val(data[0].descripcion);
    //                 $('#id_cat').val(data[0]['categoria'].nombre);
    //             },
    //             error: function (xhr, status, data) {
    //                 alert(data);
    //             },
    //
    //         })
    //     });

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

    $('#id_new_medicine').on('click', function () {
        $('#modal_tipo').modal('show');
        action = 'add';
        pk = '';
    });
    $('#modal_tipo').on('hidden.bs.modal', function () {
        $('#id_nombre_tipo').val('').parent().removeClass('has-error').removeClass('has-success');
        $('#id_nombre_tipo-error').text('');
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


    $('#form_tipo').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', id);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/tipo_medicine/nuevo', 'Esta seguro que desea guardar este tipo de medicina?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este tipo de medicina!', 'far fa-smile-wink', function () {
                        $('#modal_tipo').modal('hide');
                        var newOption = new Option(response['nombre'], response['id'], false, true);
                        $('#id_tipo_medicina').append(newOption).trigger('change');
                    });
                });
        }
    });
    $('#id_tipo_medicina').on('change click', function () {
        if ($(this).val() === '') {
            $(this).parent().parent().addClass('has-error');
            $('#tipo_error').html('<strong>Debe escoger un tipo de medicina</strong>');
        } else {
            $('#tipo_error').html('');
            $(this).parent().parent().removeClass('has-error').addClass('has-success');
        }
    });

    //enviar formulario de nuevo producto
    $('#form').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        if (tipo.val() === '') {
            $(tipo).parent().parent().addClass('has-error');
            $('#tipo_error').html('<strong>Debe escoger un tipo de medicina</strong>');
        }
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/medicina/nuevo', 'Esta seguro que desea guardar este producto?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este producto!', 'far fa-smile-wink', function () {
                        location.reload();
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

    tipo.select2({
        theme: "classic"
    })
});