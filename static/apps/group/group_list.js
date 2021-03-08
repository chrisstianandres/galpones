
$(function () {
    var datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        ajax: {
            url: '/user/groups',
            type: 'POST',
            data: {'action': 'list'},
            dataSrc: ""
        },
        columns: [
            {"data": "id"},
            {"data": "nombre"},
            {"data": "permisos"},
             {"data": "id"},
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
                    columns: [0, 1, 2],
                    search: 'applied',
                    order: 'applied'
                },
                customize: customize
            }
        ]
        },

       dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>"+
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
                orderable: false,
                render: function (data, type, row) {
                    var edit = '<a style="color: white" type="button" class="btn btn-warning btn-xs" rel="edit" ' +
                        'data-toggle="tooltip" href="/user/grupo_editar/'+ data +'" title="Editar Datos"><i class="fa fa-edit"></i></a>' + ' ';
                    var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-trash"></i></a>' + ' ';
                    return edit + del

                }
            },
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var html = '';
                    $.each(row.permisos, function (key, value) {
                        html += '<span class="badge badge-success">' + value.nombre + '</span>'+' '
                    });
                    return html;

                }
            },
        ],
        // createdRow: function (row, data, dataIndex) {
        //     console.log(data);
        //     if (data.producto_base.stock >= 51) {
        //         $('td', row).eq(4).find('span').addClass('badge badge-success').attr("style", "color: white");
        //     } else if (data.producto_base.stock >= 10) {
        //         $('td', row).eq(4).find('span').addClass('badge badge-warning').attr("style", "color: white");
        //     } else if (data.producto_base.stock <= 9) {
        //         $('td', row).eq(4).find('span').addClass('badge badge-danger').attr("style", "color: white");
        //     }
        //
        // }

    });
    $('#datatable tbody').on('click', 'a[rel="del"]', function () {
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data.id, 'action': 'delete'};
        save_estado('Alerta',
            '/user/groups', 'Esta seguro que desea eliminar este grupo?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al eliminar el grupo!', 'far fa-smile-wink', function () {
                    datatable.ajax.reload(null, false);
                })
            });
    });

    $('#nuevo').on('click', function () {
        window.location.replace('/user/newgroup')

    })
});