var tblcompra;
var tbl_galpon_seacrh;
var id_galpon = $('#id_galpon');

//<<<------------VARIEBLES PARA SECCION MEDICINA------------------------>>>

var dt_medicacion, action_medicacion, id_select_medicina = 0, tbl_detalle_medicina, id_medicacion;
var modal_medicacion = $('#modal_form_medicacion');


//<<<------------VARIEBLES PARA SECCION ALIMENTOS------------------------>>>

var dt_alimentacion, action_alimentacion, id_select_alimento = 0, tbl_detalle_alimento, id_alimentacion;
var modal_alimentacion = $('#modal_form_alimentacion');

//<<<------------VARIEBLES PARA SECCION MORTALIDAD------------------------>>>

var dt_mortalidad, action_mortalidad, id_mortalidad;
var modal_mortalidad = $('#modal_form_mortalidad');


//<<<------------VARIEBLES PARA SECCION PESO------------------------>>>

var dt_peso, action_peso, id_peso;
var modal_peso = $('#modal_form_peso');

//<<<------------VARIEBLES PARA SECCION GASTO------------------------>>>

var dt_gasto, action_gasto, id_gasto;
var modal_gasto = $('#modal_form_gasto');

function ajax_get_data(id) {
    $.ajax({
        type: "POST",
        url: '/produccion/reporte',
        data: {
            "id": id,
            "action": 'get_data'
        },
        dataType: 'json',
        success: function (data) {
            $.isLoading({
                text: "<strong>" + 'Cargando datos por favor espera...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            setTimeout(function () {
                $.isLoading('hide');
                produccion.add(data[0]);
            }, 3000);
            return false;
        }
    })
}

function clear_all() {
    $('#id_lote').val(null);
    $('#id_lote_cantidad').val(null);
    $('#id_capacidad').val(null);
    $('#id_cantidad_in_galpon').val(null);
    $('#id_lote_fecha').val(null);
    $('#id_tipo_ave').val(null);
    produccion.items.peso = [];
    produccion.items.mortalidad = [];
    produccion.list();
}

$(document).on('keypress', 'input[aria-controls="select2-id_galpon-results"]', function (e) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((e.which < 48 || e.which > 57)) {
        e.preventDefault();
    }
});
$(document).on('click', '#report_pdf', function (e) {
    if (id_galpon.val() === '') return false;
    window.location.href = '/produccion/printpdf/' + id_galpon.val()
});

var produccion = {
    items: {
        distribuicion_id: '',
        medicacion: [],
        alimentacion: [],
        peso: [],
        mortalidad: [],
        gasto: [],
    },
    add: function (data) {
        this.items.distribuicion_id = data.lote_data[0].id;
        $('#id_lote').val(data.lote_data[0].lote.id);
        $('#id_lote_cantidad').val(data.lote_data[0].lote.cantidad);
        $('#id_capacidad').val(data.lote_data[0].galpon.capacidad);
        $('#id_cantidad_in_galpon').val(data.lote_data[0].cantidad_pollos);
        $('#id_lote_fecha').val(data.lote_data[0].lote.fecha);
        $('#id_tipo_ave').val(data.lote_data[0].lote.raza.nombre);
        $('#id_total_bajas').val(data.total_bajas);
        $('#id_gastos_alimentos').val(data.gastos_alimentos);
        $('#id_gastos_medicina').val(data.gastos_medicina);
        $('#id_gastos_varios').val(data.gastos_varios);
        this.items.peso = data.peso;
        this.items.mortalidad = data.mortalidad;
        this.items.gasto = data.gastos;
        this.items.medicacion = data.medicacion;
        this.items.alimentacion = data.alimentacion;
        this.list();

    },
    list: function () {
        dt_peso = $("#datatable_peso").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.peso,
            columns: [
                {"data": "fecha"},
                {"data": "peso_promedio"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                },
                {
                    targets: [-2],
                    class: 'text-center',
                    width: "15%",
                    render: function (data, type, row) {
                        return data + ' ' + 'lbs'
                    }
                },
            ]
        });
        dt_mortalidad = $("#datatable_mortalidad").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.mortalidad,
            columns: [
                {"data": "fecha"},
                {"data": "causa.nombre"},
                {"data": "cantidad_muertes"},
                {"data": "descrpcion"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
        dt_gasto = $("#datatable_gasto").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.gasto,
            columns: [
                {"data": "fecha_pago"},
                {"data": "tipo_gasto.nombre"},
                {"data": "valor"},
                {"data": "detalle"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
        dt_medicacion = $("#datatable_medicacion").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.medicacion,
            columns: [
                {"data": "fecha"},
                {"data": "medicina__insumo__nombre"},
                {"data": "medicina__tipo_medicina__nombre"},
                {"data": "total"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
        dt_alimentacion = $("#datatable_alimentacion").DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            "order": [[0, "desc"]],
            dom: 'tipr',
            data: this.items.alimentacion,
            columns: [
                {"data": "fecha"},
                {"data": "alimento__insumo__nombre"},
                {"data": "alimento__presentacion__nombre"},
                {"data": "total"}
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            },
            columnDefs: [
                {
                    targets: '_all',
                    class: 'text-center',

                }
            ]
        });
    }
};
$(function () {
    produccion.list();
    id_galpon.select2({
        theme: "classic",
        language: {
            inputTooShort: function () {
                return "Ingresa al menos un caracter...";
            },
            "noResults": function () {
                return "Sin resultados";
            },
            "searching": function () {
                return "Buscando...";
            }
        },
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            url: '/produccion/reporte',
            data: function (params) {
                return {
                    term: params.term,
                    'action': 'search_galpon'
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };

            },

        },
        placeholder: 'Busca una galpon por numero',
        minimumInputLength: 1,
    })
        .on('select2:select', function (e) {
            e.preventDefault();
            ajax_get_data($('#id_galpon option:selected').val());
        })
        .on('select2:clearing', function () {
            clear_all();
        })
        .on('change', function () {
            if ($(this).val() > 0) {
                ajax_get_data($(this).val());
            }
        });

    $('#id_search_galpon')
        .on('click', function () {
            $('.tooltip').remove();
            $('#modal_search_galpon').modal('show');
            tbl_galpon_seacrh = $("#datatable_search_galpon").DataTable({
                destroy: true,
                autoWidth: false,
                dataSrc: "",
                responsive: true,
                ajax: {
                    url: '/produccion/reporte',
                    type: 'POST',
                    data: {'action': 'list_list'},
                    dataSrc: ""
                },
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                columns: [
                    {data: "galpon.id"},
                    {data: "galpon.estado_text"},
                    {data: "id"}
                ],
                columnDefs: [
                    {
                        targets: [-1],
                        class: 'text-center',
                        width: '10%',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a style="color: white" type="button" class="btn btn-success btn-xs" rel="take" ' +
                                'data-toggle="tooltip" title="Seleccionar Galpon"><i class="fa fa-check"></i></a>' + ' '

                        }
                    },
                ]
            });
        });

    $('#datatable_search_galpon tbody')
        .on('click', 'a[rel="take"]', function () {
            var tr = tbl_galpon_seacrh.cell($(this).closest('td, li')).index();
            var data = tbl_galpon_seacrh.row(tr.row).data();
            var newOption = new Option('Galpon N°: ' + data.galpon['id'], data['id'], false, true);
            id_galpon.append(newOption).trigger('change');
            $('#modal_search_galpon').modal('hide');
        });
});





