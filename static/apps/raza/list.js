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
            data: {'action': 'list_table'},
            dataSrc: ""
        },
        columns: [
            {"data": "id"},
            {"data": "nombre"},
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
                        columns: [0, 1],
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
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var edit = '<a style="color: white" type="button" class="btn btn-primary btn-xs" rel="edit" ' +
                        'data-toggle="tooltip" title="Editar Datos"><i class="fa fa-edit"></i></a>' + ' ';
                    var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-trash"></i></a>' + ' ';
                    return edit + del

                }
            },
        ]
    });
}

$(function () {
    datatable_fun();
    action = 'add';
    //Botones dentro de datatable
    $('#datatable tbody')
        .on('click', 'a[rel="del"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'delete'};
            save_estado('Alerta',
                '/tipo_ave/nuevo', 'Esta seguro que desea eliminar este tipo de ave?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar  este tipo de ave!', 'far fa-smile-wink', function () {
                        location.reload();
                    })
                });
        })
        .on('click', 'a[rel="edit"]', function () {

            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            action = 'edit';
            pk = data.id;
            $('#id_nombre').val(data.nombre);
            $(this).attr('href', '#');
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
                '/tipo_ave/nuevo', 'Esta seguro que desea guardar este tipo de ave?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este tipo de ave!', 'far fa-smile-wink', function () {
                        location.reload();
                    });
                });
        }
    });


    validador();
    $("#form").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50,
                lettersonly: true,
            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa este valor",
                minlength: "Debe ingresar al menos 3 caracteres",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            }
        },
    });


});