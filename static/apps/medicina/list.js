var logotipo;
var datatable;
var action = 'add';
var pk;
var tipo = $('#id_tipo_medicina');
var cat = $('#id_categoria');

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
            {"data": "insumo.nombre"},
            {"data": "tipo_medicina.nombre"},
            {"data": "insumo.descripcion"},
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
            {
                targets: '__all',
                class: 'text-center'
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
            $('#id_nombre_insumo').val(data.insumo.nombre);
            $('#id_descripcion_insumo').val(data.insumo.descripcion);
            var newOption = new Option(data.tipo_medicina.nombre, data.tipo_medicina.id, false, true);
            $('#id_tipo_medicina').append(newOption).trigger('change');
            var newOption2 = new Option(data.insumo.categoria.nombre, data.insumo.categoria.id, false, true);
            $('#id_categoria').append(newOption2).trigger('change');
            $(this).attr('href', '#');
        });

    $('#cancel').on('click', function () {
        $('#form').validate().resetForm();
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
        $('#modal_cat').modal('show');
        action = 'add';
        pk = '';
    });
     $('#modal_cat').on('hidden.bs.modal', function () {
        $('#id_nombre_categoria').val('').parent().removeClass('has-error').removeClass('has-success');
        $('#id_descripcion_categoria').val('').parent().removeClass('has-error').removeClass('has-success');
        $('#id_nombre_categoria-error').text('');
        $('#id_descripcion_categoria-error').text('');
    });



    $('#form_tipo').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
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
                        $('#modal_cat').modal('hide');
                        var newOption = new Option(response['nombre'], response['id'], false, true);
                        $('#id_categoria').append(newOption).trigger('change');
                    });
                });
        }
    });
    tipo.select2({
            theme: "classic",
            language: {
                "noResults": function () {
                    return "Sin resultados";
                },
                "searching": function () {
                    return "Buscando...";
                }
            },
            placeholder: 'Busca un Tipo de Medicina',
        })
        .on('change click', function () {
        if ($(this).val() === '') {
            $(this).parent().parent().addClass('has-error');
            $('#tipo_error').html('<strong>Debe escoger un tipo de medicina</strong>');
        } else {
            $('#tipo_error').html('');
            $(this).parent().parent().removeClass('has-error').addClass('has-success');
        }
    });

    cat.on('change click', function () {
            if ($(this).val() === '') {
                $(this).parent().parent().addClass('has-error');
                $('#tipo_error_cat').html('<strong>Debe escoger un tipo de categoria</strong>');
            } else {

                $('#tipo_error_cat').html('');
                $(this).parent().parent().removeClass('has-error').addClass('has-success');
            }
        })
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
                    return {
                        term: params.term,
                        'action': 'search'
                    };
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
         if (cat.val() === '') {
            $(cat).parent().parent().addClass('has-error');
            $('#tipo_error_cat').html('<strong>Debe escoger una categoria</strong>');
        }
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/medicina/nuevo', 'Esta seguro que desea guardar esta medicina?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar esta medicina!', 'far fa-smile-wink', function () {
                        location.reload();
                    });
                });
        }
    });

});