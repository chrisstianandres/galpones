var check = 0;
var user_tipo = parseInt($('input[name="user_tipo"]').val());

function graficos() {
    // myLineChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    //         datasets: [{
    //             label: "Ventas",
    //             lineTension: 0.3,
    //             backgroundColor: "rgba(78, 115, 223, 0.05)",
    //             borderColor: "rgba(78, 115, 223, 1)",
    //             pointRadius: 3,
    //             pointBackgroundColor: "rgba(78, 115, 223, 1)",
    //             pointBorderColor: "rgba(78, 115, 223, 1)",
    //             pointHoverRadius: 3,
    //             pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
    //             pointHoverBorderColor: "rgba(78, 115, 223, 1)",
    //             pointHitRadius: 10,
    //             pointBorderWidth: 2,
    //         }],
    //     },
    //     options: {
    //         maintainAspectRatio: false,
    //         layout: {
    //             padding: {
    //                 left: 10,
    //                 right: 25,
    //                 top: 25,
    //                 bottom: 0
    //             }
    //         },
    //         scales: {
    //             xAxes: [{
    //                 time: {
    //                     unit: 'date'
    //                 },
    //                 gridLines: {
    //                     display: false,
    //                     drawBorder: false
    //                 },
    //                 ticks: {
    //                     maxTicksLimit: 7
    //                 }
    //             }],
    //             yAxes: [{
    //                 ticks: {
    //                     maxTicksLimit: 5,
    //                     padding: 10,
    //                     // Include a dollar sign in the ticks
    //                     callback: function (value, index, values) {
    //                         return '$' + number_format(value);
    //                     }
    //                 },
    //                 gridLines: {
    //                     color: "rgb(234, 236, 244)",
    //                     zeroLineColor: "rgb(234, 236, 244)",
    //                     drawBorder: false,
    //                     borderDash: [2],
    //                     zeroLineBorderDash: [2]
    //                 }
    //             }],
    //         },
    //         legend: {
    //             display: false
    //         },
    //         tooltips: {
    //             backgroundColor: "rgb(255,255,255)",
    //             bodyFontColor: "#858796",
    //             titleMarginBottom: 10,
    //             titleFontColor: '#6e707e',
    //             titleFontSize: 14,
    //             borderColor: '#dddfeb',
    //             borderWidth: 1,
    //             xPadding: 15,
    //             yPadding: 15,
    //             displayColors: false,
    //             intersect: false,
    //             mode: 'index',
    //             caretPadding: 10,
    //             callbacks: {
    //                 label: function (tooltipItem, chart) {
    //                     var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
    //                     return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
    //                 }
    //             }
    //         }
    //     }
    // });
    // myPieChart = new Chart(ctx2, {
    //     type: 'doughnut',
    //     data: {
    //         datasets: [{
    //             hoverBorderColor: "rgba(234, 236, 244, 1)",
    //         }],
    //     },
    //     options: {
    //         maintainAspectRatio: false,
    //         tooltips: {
    //             backgroundColor: "rgb(255,255,255)",
    //             bodyFontColor: "#858796",
    //             borderColor: '#dddfeb',
    //             borderWidth: 1,
    //             xPadding: 15,
    //             yPadding: 15,
    //             displayColors: false,
    //             caretPadding: 10,
    //         },
    //         legend: {
    //             display: true
    //         },
    //         cutoutPercentage: 80,
    //     },
    // });
    //
    // // grapie = Highcharts.chart('grapie', {
    // //     chart: {
    // //         plotBackgroundColor: null,
    // //         plotBorderWidth: 0,
    // //         plotShadow: false
    // //     },
    // //     title: {
    // //         text: 'Porcentaje de venta por Producto',
    // //     },
    // //     tooltip: {
    // //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    // //     },
    // //     accessibility: {
    // //         point: {
    // //             valueSuffix: '%'
    // //         }
    // //     },
    // //     plotOptions: {
    // //         pie: {
    // //             dataLabels: {
    // //                 enabled: true,
    // //                 distance: -50,
    // //                 style: {
    // //                     fontWeight: 'bold',
    // //                     color: 'white'
    // //                 }
    // //             },
    // //             startAngle: -90,
    // //             endAngle: 90,
    // //             center: ['50%', '75%'],
    // //             size: '110%'
    // //         }
    // //     },
    // // });
    // // chart = Highcharts.chart('container2', {
    // //     chart: {
    // //         inverted: true,
    // //         polar: false
    // //     },
    // //
    // //     title: {
    // //         text: 'Total de Ventas del año'
    // //     },
    // //     xAxis: {
    // //         categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    // //     },
    // //     yAxis: {
    // //         title: {
    // //             text: 'Valores'
    // //         }
    // //     },
    // //
    // // });
    // // graph = Highcharts.chart('container3', {
    // //     chart: {
    // //         type: 'line'
    // //     },
    // //     title: {
    // //         text: ''
    // //     },
    // //     subtitle: {
    // //         text: 'Contraste de compras y ventas'
    // //     },
    // //     xAxis: {
    // //         categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    // //     },
    // //     yAxis: {
    // //         title: {
    // //             text: 'Dolares $'
    // //         }
    // //     },
    // //     plotOptions: {
    // //         line: {
    // //             dataLabels: {
    // //                 enabled: true
    // //             },
    // //             enableMouseTracking: false
    // //         }
    // //     },
    // // });
    // $.ajax({
    //     url: '/venta/chart',
    //     type: 'POST',
    //     data: {'action': 'chart'},
    //     dataSrc: "",
    // }).done(function (data) {
    //     addData(myLineChart, data['dat'].titulo, data['dat'].data);
    //     addDataPie(myPieChart, data['chart2'].titulo, data['chart2'].data);
    //
    //     // chart.addSeries(data['dat']);
    //     // grapie.addSeries(
    //     //     {
    //     //         type: 'pie',
    //     //         name: 'Total',
    //     //         innerSize: '50%',
    //     //         data: data['chart2'].data
    //     //     }
    //     // );
    //     // graph.addSeries(
    //     //     {
    //     //         name: 'Compras',
    //     //         data: data['chart3'].compras
    //     //     },
    //     // );
    //     // graph.addSeries(
    //     //     {
    //     //         name: 'Ventas',
    //     //         data: data['chart3'].ventas
    //     //     }
    //     // );
    //     var tarjets = data['tarjets'];
    //     $('#ganacias').html('$' + tarjets['data'].ventas);
    //     $('#ganacias_anual').html('$' + tarjets['data'].ventas_anuales);
    //     $('#total_compra').html('$' + tarjets['data'].compras);
    //     $('#compras_anual').html('$' + tarjets['data'].compras_anual);
    // });
}


function datatbles() {
    $("#datatable").DataTable({
        destroy: true,
        scrollX: true,
        autoWidth: false,
        order: [[2, "asc"]],
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {'action': 'report'},
            dataSrc: ""
        },
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
                    className: '',

                },
                container: {
                    className: 'buttons-container float-right'
                }
            },
            buttons: [
                {
                    text: '<i class="far fa-file-pdf"></i> PDF</i>',
                    className: 'btn btn-danger',
                    extend: 'pdfHtml5',
                    footer: true,
                    //filename: 'dt_custom_pdf',
                    orientation: 'landscape', //portrait
                    pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                    download: 'open',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
                        search: 'applied',
                        order: 'applied'
                    },
                    customize:customize
                }
            ]
        },
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center',

            },
            {
                targets: [-1],
                width: '20%',
                render: function (data, type, row) {
                    return '<spam>' + data +'</spam>';
                }
            },
        ],
    });
}

function addData(chart, year, data) {
    $('#grap_ventas').html(year);
    chart.data.datasets.forEach((dataset) => {
        $.each(data, function (key, value) {
            dataset.data.push(value);
        });
    });
    chart.update();
}

function addDataPie(chart, fecha, data) {
    $('#text_chart_pie').html(fecha);
    var coloR = [];
    var dynamicColors = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    for (var i in data) {
        coloR.push(dynamicColors());
    }
    chart.data.datasets[0].backgroundColor = coloR;
    chart.data.datasets.forEach((dataset) => {
        $.each(data, function (key, value) {
            dataset.data.push(value['y']);
            chart.data.labels.push(value['name']);
        });
    });
    chart.update();
}


var barChartData = [];
var ctx = document.getElementById('myChart').getContext('2d');


$(function () {
    $.ajax({
        url: '/venta/chart',
        type: 'POST',
        data: {'action': 'chart'},
        dataSrc: "",
    }).done(function (data) {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
                    'Noviembre', 'Diciembre'],
                datasets: [{
                    label: 'Compras',
                    data: data['datos'].compras,
                    borderColor: [
                        'rgb(176,0,12)'
                    ],
                    borderWidth: 1

                },
                    {
                        label: 'Ventas',
                        data: data['datos'].ventas,
                        borderColor: [
                            'rgb(76,108,255)'
                        ],
                        borderWidth: 1

                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: 'Compras y ventas del año ' + data['year']+ ' en Dolares Americanos'
                }
            }
        });
        $('#lote_tar').html(data['tarjets'].lotes);
        $('#galpon_tar').html(data['tarjets'].galpones);
        $('#ave_tar').html(data['tarjets'].aves);
        $('#empleado_tar').html(data['tarjets'].empleados);

    });
    if (user_tipo === 1) {
        datatbles();
        graficos();
    }


});
//[{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: ['rgba(255, 99, 132, 0.2)'],
//             borderColor: ['rgba(255, 99, 132, 1)'],
//             borderWidth: 1
//         }]