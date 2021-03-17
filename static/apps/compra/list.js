var datatable;
var logotipo;
var formulario = $('#formulario_transaccion');
var listado = $('#listado');
var datos = {
    fechas: {
        'start_date': '',
        'end_date': '',
        'action': 'list'
    },
    add: function (data) {
        if (data.key === 1) {
            this.fechas['start_date'] = data.startDate.format('YYYY-MM-DD');
            this.fechas['end_date'] = data.endDate.format('YYYY-MM-DD');
        } else {
            this.fechas['start_date'] = '';
            this.fechas['end_date'] = '';
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: this.fechas,
            success: function (data) {
                datatable.clear();
                datatable.rows.add(data).draw();
            }
        });

    },
};

function datatable_fun() {
    datatable = $("#datatable").DataTable({
        destroy: true,
        scrollX: true,
        autoWidth: false,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: datos.fechas,
            dataSrc: ""
        },
        columns: [
            {"data": "fecha_compra"},
            {"data": "proveedor.nombre"},
            {"data": "user"},
            {"data": "total"},
            {"data": "comprobante"},
            {"data": "jpg"},
            {"data": "estado"},
            {"data": "id"}
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
        },
        order: [[4, "desc"]],
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
                    className: 'buttons-container float-md-right'
                }
            },
            buttons: [
                {
                    text: '<i class="fa fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger my_class',
                    extend: 'pdfHtml5',
                    filename: 'Listado de Compras',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 6],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize: customize
                },
            ],
        },
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center',

            },
            {
                targets: [-1],
                class: 'text-center',
                width: "15%",
                render: function (data, type, row) {
                    var detalle = '<a type="button" rel="detalle" class="btn btn-success btn-xs btn-round" style="color: white" data-toggle="tooltip" title="Detalle de Productos" ><i class="fa fa-search"></i></a>' + ' ';
                    var devolver = '<a type="button" rel="devolver" class="btn btn-danger btn-xs btn-round" style="color: white" data-toggle="tooltip" title="Devolver"><i class="fa fa-times"></i></a>' + ' ';
                    return detalle + devolver;
                }
            },
            {
                targets: [-2],
                render: function (data, type, row) {
                    return row.estado_text;
                }
            },
            {
                targets: [-3],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<img src="' + data + '" width="50" height="50" class="img-circle elevation-2" alt="Image">';
                }
            },
            {
                targets: [-5],
                render: function (data, type, row) {
                    return '$ ' + data;
                }
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.estado === 1) {
                $('td', row).eq(6).html('<span class = "badge badge-success" style="color: white ">'+data.estado_text+' </span>');
            } else  {
                $('td', row).eq(6).html('<span class = "badge badge-danger" style="color: white "> '+data.estado_text+' </span>');
                $('td', row).eq(7).find('a[rel="devolver"]').hide();
            }

        }
    });
}


function daterange() {
    $('input[name="fecha"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: '<i class="fas fa-search"></i> Buscar',
            cancelLabel: '<i class="fas fa-times"></i> Cancelar',
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        picker['key'] = 1;
        datos.add(picker);
        // filter_by_date();

    }).on('cancel.daterangepicker', function (ev, picker) {
        picker['key'] = 0;
        datos.add(picker);

    });

}


$(function () {
    formulario.prop('style', 'display:none');
    daterange();
    datatable_fun();
    $('#datatable tbody')
        .on('click', 'a[rel="devolver"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data.id, 'action': 'devolucion'};
        save_estado('Alerta',
            '/compra/lista', 'Esta seguro que desea devolver esta compra?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al devolver la compra', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });

    })
        .on('click', 'img[alt="Image"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        $('#Modal_image').modal('show');
        $('#image_modal').html('<img src="' + data.jpg + '" width="650" height="650" class="elevation-2" alt="Image">')})
        .on('click', 'a[rel="detalle"]', function () {
            $('.tooltip').remove();
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            $('#Modal').modal('show');
            $("#tbldetalle_insumos").DataTable({
                responsive: true,
                autoWidth: false,
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                destroy: true,
                ajax: {
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'detalle_medicina',
                        'id': data.id
                    },
                    dataSrc: ""
                },
                columns: [
                    {data: 'insumo.insumo.nombre'},
                    {data: 'insumo.insumo.categoria.nombre'},
                    {data: 'insumo.tipo_medicina.nombre'},
                    {data: 'insumo.insumo.descripcion'},
                    {data: 'cantidad'},
                    {data: 'p_compra'},
                    {data: 'subtotal'}
                ],
                columnDefs: [
                    {
                        targets: '_all',
                        class: 'text-center'
                    },
                    {
                        targets: [-1, -2],
                        class: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            return '$' + parseFloat(data).toFixed(2);
                        }
                    },
                ],
            });
            $("#tbldetalle_alimentos").DataTable({
                responsive: true,
                autoWidth: false,
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                destroy: true,
                ajax: {
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'detalle_alimentos',
                        'id': data.id
                    },
                    dataSrc: ""
                },
                columns: [
                    {data: 'insumo.insumo.nombre'},
                    {data: 'insumo.insumo.categoria.nombre'},
                    {data: 'insumo.presentacion.nombre'},
                    {data: 'insumo.insumo.descripcion'},
                    {data: 'cantidad'},
                    {data: 'p_compra'},
                    {data: 'subtotal'}
                ],
                columnDefs: [
                    {
                        targets: '_all',
                        class: 'text-center'
                    },
                    {
                        targets: [-1, -2],
                        class: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            return '$' + parseFloat(data).toFixed(2);
                        }
                    },
                ],
            });
        });

    $('#nuevo').on('click', function () {
        listado.fadeOut();
        formulario.fadeIn();
        compras.list();
        compras.list_alimentos();
    });
    $('#cancal_shop').on('click', function () {
        listado.fadeIn();
        formulario.fadeOut();
    })
});

