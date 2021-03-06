var logotipo;
var datatable;
var action = 'add';
var pk = '';

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
            {"data": "full_name_list"},
            {"data": "cedula"},
            {"data": "correo"},
            {"data": "telefono"},
            {"data": "celular"},
            {"data": "direccion"},
            {"data": "cargo"},
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
                            columns: [0, 1, 2, 3, 4, 5, 6],
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
        ]
    });
}

var num_emp = $('#num_emp').val();

$(function () {

    datatable_fun();
    $('#datatable tbody')
        .on('click', 'a[rel="del"]', function () {
            action = 'delete';
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id};
            parametros['action'] = action;
            save_estado('Alerta',
                '/empleado/nuevo', 'Esta seguro que desea eliminar este empleado?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar este empleado!', 'far fa-smile-wink', function () {
                        location.reload();
                    })
                })
        })
        .on('click', 'a[rel="edit"]', function () {
            $('#form').validate().resetForm();
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var sexo = '1';
            if (data.sexo === 'Femenino') {
                sexo = '0';
            }
            $('input[name="nombres"]').val(data.nombres);
            $('input[name="apellidos"]').val(data.apellidos);
            $('input[name="cedula"]').val(data.cedula).attr('readonly', true);
            $('input[name="correo"]').val(data.correo);
            $('select[name="sexo"]').val(sexo);
            $('input[name="telefono"]').val(data.telefono);
            $('input[name="celular"]').val(data.celular);
            $('input[name="direccion"]').val(data.direccion);
            action = 'edit';
            pk = data.id;
            $(this).attr('href', '#');
        });
    //boton agregar cliente
    $('#nuevo').on('click', function () {
        location.reload();
    });

    //enviar formulario de nuevo cliente
    $('#form').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (num_emp === '6' &&  action === 'add') {
            menssaje_error('Error', 'Ya esta llena la nomina de 6 empleados', '', function () {
            })
        } else {
            if (isvalid) {
                save_with_ajax2('Alerta',
                    '/empleado/nuevo', 'Esta seguro que desea guardar este empleado?', parametros,
                    function (response) {
                        menssaje_ok('Exito!', 'Exito al guardar este empleado!', 'far fa-smile-wink', function () {
                            location.reload();
                        });
                    });
            }
        }

    });


});
