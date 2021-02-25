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
            {"data": "id"},
            {"data": "capacidad"},
            {"data": "estado_text"},
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
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>';
                }
            },
            {
                targets: [-3],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + parseInt(data) + '</span>';
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
            if (data.estado === 0 ) {
                $('td', row).eq(2).find('span').addClass('badge badge-success').attr("style", "color: white");
            } else if (data.estado === 1) {
                 console.log(data.estado);
                $('td', row).eq(2).find('span').addClass('badge badge-warning').attr("style", "color: white");
            }
        }
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
                '/galpon/nuevo', 'Esta seguro que desea eliminar este galpon?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar  este galpon!', 'far fa-smile-wink', function () {
                        location.reload();
                    })
                });
        })
        .on('click', 'a[rel="edit"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            action = 'edit';
            pk = data.id;
            $('#id_capacidad').val(data.capacidad);
            $('#id_numero').val(data.id);
            $('#input_numero').show("slow");
        });

    $('#id_capacidad').TouchSpin({
        min: 1,
        max: 1000000
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
                '/galpon/nuevo', 'Esta seguro que desea guardar este galpon?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este galpon!', 'far fa-smile-wink', function () {
                        location.reload();
                    });
                });
        }
    });

});