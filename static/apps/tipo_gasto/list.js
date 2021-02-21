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
            {"data": "id"},
            {"data": "nombre"},
            {"data": "id"}
        ],
        language:
            {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
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
    var action = '';
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
                '/tipo_gasto/nuevo', 'Esta seguro que desea eliminar este tipo de Gasto?', parametros,
                function () {
                    menssaje_ok('Exito!', 'Exito al eliminar este tipo de Gasto!', 'far fa-smile-wink', function () {
                        datatable.ajax.reload(null, false)
                    })
                })
        })
        .on('click', 'a[rel="edit"]', function () {
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            $('input[name="nombre"]').val(data.nombre);
            $('input[name="descripcion"]').val(data.descripcion);
            mostrar();
            action = 'edit';
            pk = data.id;
        });


    $('#nuevo').on('click', function () {
        reset('#form');
        mostrar();
        action = 'add';
        pk = '';
    });

    //enviar formulario de nuevo tipo de gasto
    $('#form').on('submit', function (e) {
        e.preventDefault();
        var parametros = new FormData(this);
        parametros.append('action', action);
        parametros.append('id', pk);
        var isvalid = $(this).valid();
        if (isvalid) {
            save_with_ajax2('Alerta',
                '/tipo_gasto/nuevo', 'Esta seguro que desea guardar este tipo de gasto?', parametros,
                function (response) {
                    menssaje_ok('Exito!', 'Exito al guardar este tipo de gasto!', 'far fa-smile-wink', function () {
                        ocultar('#form');
                    });
                });
        }
    });
});