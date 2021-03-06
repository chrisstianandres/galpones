// var datatable;
// var user_tipo = $('input[name="user_tipo"]').val();
// var logotipo;
//
// var datos = {
//     fechas: {
//         'start_date': '',
//         'end_date': '',
//         'action': 'list',
//     },
//     add: function (data) {
//         if (data.key === 1) {
//             this.fechas['start_date'] = data.startDate.format('YYYY-MM-DD');
//             this.fechas['end_date'] = data.endDate.format('YYYY-MM-DD');
//         } else {
//             this.fechas['start_date'] = '';
//             this.fechas['end_date'] = '';
//         }
//         $.ajax({
//             url: window.location.pathname,
//             type: 'POST',
//             data: this.fechas,
//             success: function (data) {
//                 datatable.clear();
//                 datatable.rows.add(data).draw();
//             }
//         });
//
//     },
// };
//
// function datatable_fun() {
//     datatable = $("#datatable").DataTable({
//         // responsive: true,
//         destroy: true,
//         scrollX: true,
//         autoWidth: false,
//         ajax: {
//             url: window.location.pathname,
//             type: 'POST',
//             data: datos.fechas,
//             dataSrc: ""
//         },
//         language: {
//             url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
//         },
//         order: [[6, "desc"]],
//         dom: "<'row'<'col-sm-12 col-md-12'B>>" +
//             "<'row'<'col-sm-12 col-md-3'l>>" +
//             "<'row'<'col-sm-12 col-md-12'f>>" +
//             "<'row'<'col-sm-12'tr>>" +
//             "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
//         buttons: {
//             dom: {
//                 button: {
//                     className: '',
//
//                 },
//                 container: {
//                     className: 'buttons-container float-md-right'
//                 }
//             },
//             buttons: [
//                 {
//                     text: '<i class="fa fa-file-pdf"> </i>PDF',
//                     className: 'btn btn-danger my_class',
//                     extend: 'pdfHtml5',
//                     //filename: 'dt_custom_pdf',
//                     orientation: 'landscape', //portrait
//                     pageSize: 'A4', //A3 , A5 , A6 , legal , letter
//                     download: 'open',
//                     exportOptions: {
//                         columns: [0, 1, 2, 3, 4, 5, 6, 7],
//                         search: 'applied',
//                         order: 'applied'
//                     },
//                     customize: function (doc) {
//                         const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
//                             "Noviembre", "Diciembre"
//                         ];
//                         var date = new Date();
//
//                         function formatDateToString(date) {
//                             // 01, 02, 03, ... 29, 30, 31
//                             var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
//                             // 01, 02, 03, ... 10, 11, 12
//                             // month < 10 ? '0' + month : '' + month; // ('' + month) for string result
//                             var MM = monthNames[date.getMonth() + 1]; //monthNames[d.getMonth()])
//                             // 1970, 1971, ... 2015, 2016, ...
//                             var yyyy = date.getFullYear();
//                             // create the format you want
//                             return (dd + " de " + MM + " de " + yyyy);
//                         }
//
//                         var jsDate = formatDateToString(date);
//
//                         //[izquierda, arriba, derecha, abajo]
//                         doc.pageMargins = [25, 180, 25, 50];
//                         doc.defaultStyle.fontSize = 12;
//                         doc.styles.tableHeader.fontSize = 14;
//                         doc['header'] = (function () {
//                             return {
//                                 columns: [{alignment: 'center', image: logotipo, width: 300}],
//                                 margin: [280, 10, 0, 50] //[izquierda, arriba, derecha, abajo]
//                             }
//                         });
//                         doc['footer'] = (function (page, pages) {
//                             return {
//                                 columns: [
//                                     {
//                                         alignment: 'left',
//                                         text: ['Reporte creado el: ', {text: jsDate.toString()}]
//                                     },
//                                     {
//                                         alignment: 'right',
//                                         text: ['Pagina ', {text: page.toString()}, ' de ', {text: pages.toString()}]
//                                     }
//                                 ],
//                                 margin: 20
//                             }
//                         });
//                         var objLayout = {};
//                         objLayout['hLineWidth'] = function (i) {
//                             return .5;
//                         };
//                         objLayout['vLineWidth'] = function (i) {
//                             return .5;
//                         };
//                         objLayout['hLineColor'] = function (i) {
//                             return '#000000';
//                         };
//                         objLayout['vLineColor'] = function (i) {
//                             return '#000000';
//                         };
//                         objLayout['paddingLeft'] = function (i) {
//                             return 4;
//                         };
//                         objLayout['paddingRight'] = function (i) {
//                             return 4;
//                         };
//                         doc.content[0].layout = objLayout;
//                         doc.content[1].table.widths = [65, '*', "*", 85, 75, 85, '*', '*'];
//                         doc.styles.tableBodyEven.alignment = 'center';
//                         doc.styles.tableBodyOdd.alignment = 'center';
//                     }
//                 },
//             ],
//         },
//         columns: [
//             {data: 'fecha'},
//             {data: "cliente.full_name_list"},
//             {data: "subtotal"},
//             {data: "iva"},
//             {data: "total"},
//             {data: "id"},
//             {data: "estado"},
//             {data: "id"},
//         ],
//         columnDefs: [
//             {
//                 targets: '_all',
//                 class: 'text-center',
//
//             },
//             {
//                 targets: [-4, -5, -6],
//                 class: 'text-center',
//                 orderable: false,
//                 render: function (data, type, row) {
//                     return '$' + parseFloat(data).toFixed(2);
//                 }
//             },
//             {
//                 targets: [-2],
//                 class: 'text-center',
//                 orderable: false,
//                 render: function (data, type, row) {
//                     return '<span>' + data + '</span>';
//                 }
//             },
//             {
//                 targets: [-1],
//                 class: 'text-center',
//                 width: "15%",
//                 render: function (data, type, row) {
//                     var detalle = '<a type="button" rel="detalle" class="btn btn-success btn-xs btn-round" ' +
//                         'style="color: white" data-toggle="tooltip" title="Detalle de Productos" >' +
//                         '<i class="fa fa-search"></i></a>' + ' ';
//                     var pagar = row.estado === "RESERVADA" ? '<a type="button" rel="pagar" class="btn btn-warning btn-xs btn-round" ' +
//                         'style="color: white" data-toggle="tooltip" title="Realizar pago" >' +
//                         '<i class="fas fa-hand-holding-usd"></i></a>' : ' ';
//                     var devolver = '<a type="button" rel="devolver" class="btn btn-danger btn-xs btn-round" ' +
//                         'style="color: white" data-toggle="tooltip" title="Devolver"><i class="fa fa-times"></i></a>' + ' ';
//                     var pdf = '<a type="button" href= "/venta/printpdf/' + data + '" rel="pdf" ' +
//                         'class="btn btn-primary btn-xs btn-round" style="color: white" data-toggle="tooltip" ' +
//                         'title="Reporte PDF"><i class="fa fa-file-pdf"></i></a>';
//                     return pagar + ' ' + detalle + devolver + pdf;
//                 }
//             },
//             {
//                 targets: [-3],
//                 render: function (data, type, row) {
//                     return pad(data, 10);
//                 }
//             }
//
//         ],
//         createdRow: function (row, data, dataIndex) {
//             if (data.estado === 'FINALIZADA') {
//                 if (user_tipo === '0') {
//                     $('td', row).eq(6).find('span').addClass('badge bg-success').attr("style", "color: white");
//                     $('td', row).eq(7).find('a[rel="devolver"]').hide();
//                 }
//                 $('td', row).eq(6).find('span').addClass('badge bg-success').attr("style", "color: white");
//
//             } else if (data.estado === 'DEVUELTA') {
//                 if (user_tipo === '0') {
//                     $('td', row).eq(6).find('span').addClass('badge bg-danger').attr("style", "color: white");
//                     $('td', row).eq(7).find('a[rel="devolver"]').hide();
//                     $('td', row).eq(7).find('a[rel="detalle"]').hide();
//                     $('td', row).eq(7).find('a[rel="pdf"]').hide();
//                 }
//                 $('td', row).eq(6).find('span').addClass('badge bg-danger').attr("style", "color: white");
//                 $('td', row).eq(7).find('a[rel="devolver"]').hide();
//                 $('td', row).eq(7).find('a[rel="detalle"]').hide();
//                 $('td', row).eq(7).find('a[rel="pdf"]').hide();
//             } else if (data.estado === 'RESERVADA') {
//                 if (user_tipo === '0') {
//                     $('td', row).eq(7).find('a[rel="pagar"]').hide();
//                     $('td', row).eq(6).find('span').addClass('badge bg-warning').attr("style", "color: white");
//                 }
//                 $('td', row).eq(7).find('span').addClass('badge bg-warning').attr("style", "color: white");
//             }
//         },
//     });
// }
//
// function daterange() {
//     $("div.toolbar").html('<br><div class="col-lg-3"><input type="text" name="fecha" id="filtro_fecha" ' +
//         'class="form-control form-control-sm input-sm"></div> <br>');
//     $('#filtro_fecha').daterangepicker({
//         locale: {
//             format: 'YYYY-MM-DD',
//             applyLabel: '<i class="fas fa-search"></i> Buscar',
//             cancelLabel: '<i class="fas fa-times"></i> Cancelar',
//         }
//     }).on('apply.daterangepicker', function (ev, picker) {
//         picker['key'] = 1;
//         datos.add(picker);
//         // filter_by_date();
//
//     }).on('cancel.daterangepicker', function (ev, picker) {
//         picker['key'] = 0;
//         datos.add(picker);
//     });
//
// }
//
// function pad(str, max) {
//     str = str.toString();
//     return str.length < max ? pad("0" + str, max) : str;
// }
//
//
// $(function () {
//     daterange();
//     datatable_fun();
//
//     $('#datatable tbody')
//         .on('click', 'a[rel="devolver"]', function () {
//             $('.tooltip').remove();
//             var tr = datatable.cell($(this).closest('td, li')).index();
//             var data = datatable.row(tr.row).data();
//             var parametros = {'id': data.id, 'action': 'estado'};
//             save_estado('Alerta',
//                 window.location.pathname, 'Esta seguro que desea devolver esta venta?', parametros,
//                 function () {
//                     menssaje_ok('Exito!', 'Exito al devolver la venta', 'far fa-smile-wink', function () {
//                         datatable.ajax.reload(null, false);
//                     })
//                 });
//
//         })
//         .on('click', 'a[rel="pagar"]', function () {
//             $('.tooltip').remove();
//             var tr = datatable.cell($(this).closest('td, li')).index();
//             var data = datatable.row(tr.row).data();
//             var parametros = {'id': data.id, 'action': 'pagar'};
//             save_estado('Alerta',
//                 window.location.pathname, 'Esta seguro que desea realizar el pago de esta venta de $ <strong>' + data.transaccion.total + '</strong>?', parametros,
//                 function () {
//                     menssaje_ok('Exito!', 'Exito al realizar el pago de esta venta', 'far fa-smile-wink', function () {
//                         datatable.ajax.reload(null, false);
//                     })
//                 });
//
//         })
//         .on('click', 'a[rel="borrar"]', function () {
//             $('.tooltip').remove();
//             var tr = datatable.cell($(this).closest('td, li')).index();
//             var data = datatable.row(tr.row).data();
//             var parametros = {'id': data.id};
//             save_estado('Alerta',
//                 '/venta/eliminar', 'Esta seguro que desea eliminar esta venta?', parametros,
//                 function () {
//                     menssaje_ok('Exito!', 'Exito al Eliminar la venta', 'far fa-smile-wink')
//                 });
//         })
//         .on('click', 'a[rel="detalle"]', function () {
//             $('.tooltip').remove();
//             var tr = datatable.cell($(this).closest('td, li')).index();
//             var data = datatable.row(tr.row).data();
//             var resp = {};
//             $('#Modal').modal('show');
//             $("#tbldetalle_productos").DataTable({
//                 responsive: true,
//                 autoWidth: false,
//                 language: {
//                     "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
//                 },
//                 destroy: true,
//                 ajax: {
//                     url: window.location.pathname,
//                     type: 'Post',
//                     data: {
//                         'id': data.id,
//                         'action': 'detalle'
//                     },
//                     dataSrc: ""
//                 },
//                 columns: [
//                     {data: 'producto'},
//                     {data: 'categoria'},
//                     {data: 'presentacion'},
//                     {data: 'cantidad'},
//                     {data: 'pvp'},
//                     {data: 'subtotal'}
//                 ],
//                 columnDefs: [
//                     {
//                         targets: '_all',
//                         class: 'text-center'
//                     },
//
//                     {
//                         targets: [-1, -2],
//                         class: 'text-center',
//                         orderable: false,
//                         render: function (data, type, row) {
//                             return '$' + parseFloat(data).toFixed(2);
//                         }
//                     },
//                 ],
//                 footerCallback: function (row, data, start, end, display) {
//                     var api = this.api(), data;
//
//                     // Remove the formatting to get integer data for summation
//                     var intVal = function (i) {
//                         return typeof i === 'string' ?
//                             i.replace(/[\$,]/g, '') * 1 :
//                             typeof i === 'number' ?
//                                 i : 0;
//                     };
//                     // Total over this page
//                     pageTotal = api
//                         .column(3, {page: 'current'})
//                         .data()
//                         .reduce(function (a, b) {
//                             return intVal(a) + intVal(b);
//                         }, 0);
//
//                     // Update footer
//                     $(api.column(3).footer()).html(
//                         '$' + parseFloat(pageTotal).toFixed(2)
//                         // parseFloat(data).toFixed(2)
//                     );
//                 },
//             });
//         });
//
//     $('#nuevo').on('click', function () {
//         if (user_tipo === '0') {
//             window.location.href = '/venta/online'
//         } else {
//             window.location.href = '/venta/nuevo'
//         }
//
//
//     })
// });
//
//
//
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
            {"data": "fecha"},
            {"data": "cliente.nombre"},
            {"data": "total"},
            {"data": "id"},
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
                        columns: [0, 1, 2, 3, 4, 5],
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
                    var detalle = '<a type="button" rel="detalle" class="btn btn-success btn-xs btn-round" style="color: white" data-toggle="tooltip" title="Detalle de Venta" ><i class="fa fa-search"></i></a>' + ' ';
                    var devolver = '<a type="button" rel="devolver" class="btn btn-danger btn-xs btn-round" style="color: white" data-toggle="tooltip" title="Anular"><i class="fa fa-times"></i></a>' + ' ';
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
                targets: [-4],
                render: function (data, type, row) {
                    return '$ ' + data;
                }
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.estado === 1) {
                $('td', row).eq(5).html('<span class = "badge badge-success" style="color: white ">'+data.estado_text+' </span>');
            } else if (data[5] === 'DEVUELTA') {
                $('td', row).eq(5).html('<span class = "badge badge-danger" style="color: white "> '+data.estado_text+' </span>');
                $('td', row).eq(6).find('a[rel="devolver"]').hide();
            }

        }
    });
}


function daterange() {
    $('#fecha').daterangepicker({
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
        var parametros = {'id': data['4']};
        save_estado('Alerta',
            '/compra/estado', 'Esta seguro que desea devolver esta compra?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al devolver la compra', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });

    })
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
        });

    $('#nuevo').on('click', function () {
        listado.fadeOut();
        formulario.fadeIn();
        ventas.list();
    });
    $('#cancal_shop').on('click', function () {
        listado.fadeIn();
        formulario.fadeOut();
    })
});

