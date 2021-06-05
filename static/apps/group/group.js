var datatable;
var action = $('input[name="option"]').val();

var datos = {
    items: {
        nombre: '',
        modelos: []
    },
    fechas: {
        'action': action
    },
    add: function () {
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: this.fechas,
            success: function (data) {
                datos.items.modelos = data;
                listar();
            }
        });
    }
};
$(document).ready(function () {
    validador();
    $("#form").validate({
        rules: {
            name: {
                required: true,
                maxlength: 25,
                minlength: 3,
                lettersonly: true
            }
        },
        messages: {
            name: {
                required: "Este campo es requerido",
                maxlength: "Maximo 25 caracteres",
                minlength: "Minimi 3 caracteres",
            }
        },
    });
    datos.add();
    $('#datatable tbody')
        .on('change', 'input[name="check"]', function (e) {
            e.preventDefault();
            var ver = $(this).is(':checked') ? 1 : 0;
            var tr = datatable.cell($(this).closest('td, li')).index();
            datos.items.modelos[tr.row].check = ver;
        });

    $('#form')
        .on('submit', function (e) {
                e.preventDefault();
                var parametros;
                datos.items.nombre = $('#id_name').val();
                parametros = {'permisos': JSON.stringify(datos.items)};
                parametros['action'] = 'add';
                var isvalid = $(this).valid();
                if (isvalid) {
                    save_with_ajax('Alerta',window.location.pathname,
                        'Esta seguro que desea agregar este rol', parametros, function () {
                            window.location.href = '/user/groups'
                        });
                }
            }
        );
});


function listar() {
    datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        search: false,
        destroy: true,
        info: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        data: datos.items.modelos,
        columns: [
            {"data": "num"},
            {"data": "nombre"},
            {"data": "check"},
        ],

        dom:
            "<'row'<'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                width: '10%',
                orderable: false,
                render: function (data, type, row) {
                    return data === 0 ? '<input type="checkbox" name="check">' : '<input type="checkbox" checked="checked" name="check">';
                }
            },
        ]
    });

}