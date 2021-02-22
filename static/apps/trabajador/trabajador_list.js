$(function () {
    var datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            dataSrc: "",
            data: {'action': 'list'}
        },
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            searchPanes: {
                clearMessage: 'Limpiar Filtros',
                collapse: {
                    0: 'Filtros de Busqueda',
                    _: 'Filtros seleccionados (%d)'
                },
                title: {
                    _: 'Filtros seleccionados - %d',
                    0: 'Ningun Filtro seleccionados',
                },
                activeMessage: 'Filtros activos (%d)',
                emptyPanes: 'No existen suficientes datos para generar filtros :('

            }
        },
        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: {
            dom: {
                button: {
                    className: '',

                },
                container: {
                    className: 'buttons-container right',
                }
            },
            buttons: [
                {
                    text: '<i class="fa fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger my_class',
                    extend: 'pdfHtml5',
                    //filename: 'dt_custom_pdf',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize: customize
                },
            ],
        },
        columns: [
            {"data": "username"},
            {"data": "full_name"},
            {"data": "cedula"},
            {"data": "celular"},
            {"data": "telefono"},
            {"data": "direccion"},
            {"data": "sexo"},
            {"data": "avatar"},
            {"data": "estado"},
            {"data": "id"},
        ],
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
                    return '<img src="' + data + '" width="50" height="50" class="img-circle elevation-2" alt="User Image">';
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                width: '10%',
                render: function (data, type, row) {
                    var edit = '<a style="color: white" href="/user/editar/' + data + '" type="button" class="btn btn-warning btn-xs" rel="edit" ' +
                        'data-toggle="tooltip" title="Editar Datos"><i class="fa fa-user-edit"></i></a>' + ' ';
                    var del = '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-user-times"></i></a>' + ' ';
                    var estado = '<a type="button" class="btn btn-primary btn-xs" style="color: white" ' +
                        'data-toggle="tooltip" title="Gestionar Estado" rel="estado"> <i class="fa fa-user-cog"></i></a>' + ' ';
                    return edit + estado + del;
                }
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.estado === 'ACTIVO') {
                $('td', row).eq(8).find('span').addClass('badge badge-success');
            } else if (data.estado === 'INACTIVO') {
                $('td', row).eq(8).find('span').addClass('badge badge-danger');
            }

        }
    });

    $('#datatable tbody')
        .on('click', 'a[rel="estado"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'estado'};
            save_estado('Alerta',
                window.location.pathname, 'Esta seguro que desea cambiar el estado de este trabajador?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito en la actualizacion', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false);
                    })
                });
        })
        .on('click', 'a[rel="del"]', function () {
            action = 'delete';
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'delete'};
            parametros['action'] = action;
            save_estado('Alerta',
                window.location.pathname, 'Esta seguro que desea eliminar este usuario?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar este usuario!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false)
                    })
                })
        });

    $('#nuevo').on('click', function () {
            window.location.href = '/user/nuevo'


    })
});

