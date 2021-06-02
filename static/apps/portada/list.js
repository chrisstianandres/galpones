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
        },
        dom: "<'row'<'col-sm-12 col-md-12'B>>" +
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columns: [
            {"data": "id"},
            {"data": "avatar"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-2],
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
                    return '<a type="button" class="btn btn-danger btn-xs"  style="color: white" rel="del" ' +
                        'data-toggle="tooltip" title="Eliminar"><i class="fa fa-user-times"></i></a>' + ' ';
                }
            },
        ],
    });

    $('#datatable tbody')
        .on('click', 'a[rel="del"]', function () {
            action = 'delete';
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            var parametros = {'id': data.id, 'action': 'delete'};
            parametros['action'] = action;
            save_estado('Alerta',
                window.location.pathname, 'Esta seguro que desea eliminar esta portada?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar esta portada!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false)
                    })
                })
        });
});

