var logotipo;
var datatable;


function datatable_fun() {
    datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {'action': 'list'},
            dataSrc: ""
        },
        columns: [
            {"data": "nombre"},
            {"data": "tipo"},
            {"data": "num_doc"},
            {"data": "correo"},
            {"data": "telefono"},
            {"data": "direccion"},
            {"data": "id"}
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: {
            dom: {
                button: {
                    className: 'btn',

                },
                container: {
                    className: 'buttons-container'
                }
            },
            buttons: [
                {
                    text: '<i class="fa fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger btn-space float-right',
                    extend: 'pdfHtml5',
                    //filename: 'dt_custom_pdf',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    // download: 'open',
                    exportOptions:
                        {
                            columns: [0, 1, 2, 3, 4, 5],
                            search: 'applied',
                            order: 'applied'
                        },
                    customize: customize
                },

            ]
        },
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center',
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var edit = '<a style="color: white" type="button" class="btn btn-primary btn-xs" rel="edit" ' +
                        'data-toggle="tooltip" title="Editar Datos"><i class="fa fa-user-edit"></i></a>' + ' ';
                    var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-trash"></i></a>' + ' ';
                    return edit + del

                }
            },
        ],

    });
}

$(function () {
    var action = 'add';
    var pk = '';
    datatable_fun();
    $('#datatable tbody')
        .on('click', 'a[rel="del"]', function () {
            action = 'delete';
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id};
            parametros['action'] = action;
            save_estado('Alerta',
                '/proveedor/nuevo', 'Esta seguro que desea eliminar este proveedor?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar este proveedor!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false)
                    })
                })
        })
        .on('click', 'a[rel="edit"]', function () {

            $(this).attr('href', '#');
            $('#form').validate().resetForm();
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var sexo = '1';
            if (data.sexo==='Femenino'){
                sexo = '0';
            }
            $('input[name="nombre"]').val(data.nombre);
            $('select[name="tipo"]').val(data.tipo_val).prop('disabled', true);
            $('input[name="num_doc"]').val(data.num_doc).attr('readonly', true);
            $('input[name="correo"]').val(data.correo);
            $('input[name="telefono"]').val(data.telefono);
            $('input[name="direccion"]').val(data.direccion);
            action = 'edit';
            pk = data.id;

        });
    //boton agregar cliente
    $('#nuevo').on('click', function () {
        action = 'add';
        pk = '';
        reset('#form');
        $('input[name="cedula"]').attr('readonly', false);
    });

    //enviar formulario de nuevo cliente
    $('#form').on('submit', function (e) {
        e.preventDefault();
        $('select[name="tipo"]').prop('disabled', false);
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/proveedor/nuevo', 'Esta seguro que desea guardar este proveedor?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este proveedor!', 'far fa-smile-wink', function () {
                        window.location.reload();
                    });
                });
        }
    });


});
