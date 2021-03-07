var tbl_productos;

// function mostrar() {
//     $('#div_table').removeClass('col-xl-12').addClass('col-xl-8 col-lg-12');
//     $('#div_form').show();
//     datatable.destroy();
//     datatable_fun();
//     $('#nuevo').hide();
// }
//
// function ocultar(form) {
//     reset(form);
//     $('#div_table').removeClass('col-xl-8 col-lg-12').addClass('col-xl-12');
//     $('#div_form').hide();
//     datatable.destroy();
//     datatable_fun();
//     $('#nuevo').show();
// }
//
// $('#cancel').on('click', function () {
//     $('#div_table').removeClass('col-xl-8 col-lg-12').addClass('col-xl-12');
//     ocultar('#form');
// });
//

function borrar_todo_alert(title, content, callback, callback2) {
    Swal.fire({
        title: title,
        html: content,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="far fa-thumbs-up"></i> Si',
        cancelButtonText: '<i class="far fa-thumbs-down"></i> No'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    })
}

//
function save_with_ajax(title, url, content, parametros, callback) {
    Swal.fire({
        title: title,
        text: content,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: url,
                data: parametros,
            }).done(function (data) {
                if (!data.hasOwnProperty('error')) {
                    $.isLoading({
                        text: "<strong>" + 'Cargando..' + "</strong>",
                        tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
                    });
                    setTimeout(function () {
                        $.isLoading('hide');
                        callback(data);
                    }, 1000);
                    return false;
                }
                menssaje_error('Error', data.error, 'fas fa-exclamation-circle');

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        }
    })
}

function callback(response) {
    printpdf('Alerta!', '¿Desea generar el comprobante en PDF?', function () {
        window.open('/venta/printpdf/' + response['id'], '_blank');
        // location.href = '/venta/printpdf/' + response['id'];
        localStorage.clear();
        location.href = '/venta/lista';
    }, function () {
        localStorage.clear();
        location.href = '/venta/lista';
    })

}

function callback_2(response, entidad) {
    printpdf('Alerta!', '¿Desea generar el comprobante en PDF?', function () {
        window.open('/' + entidad + '/printpdf/' + response['id'], '_blank');
        localStorage.clear();
        location.href = '/' + entidad + '/lista';
    }, function () {
        localStorage.clear();
        location.href = '/' + entidad + '/lista';
    })

}

function save_estado(title, url, content, parametros, callback) {
    Swal.fire({
        title: title,
        text: content,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: url,
                data: parametros,
            }).done(function (data) {
                if (!data.hasOwnProperty('error')) {
                    $.isLoading({
                        text: "<strong>" + 'Cargando..' + "</strong>",
                        tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
                    });
                    setTimeout(function (data) {
                        $.isLoading('hide');
                        callback(data);
                    }, 1000);
                    return false;
                }
                menssaje_error(data.error, data.content, 'fa fa-times-circle');
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + ': ' + errorThrown);
                });
        }
    })
}

function printpdf(title, content, callback, cancel) {
    $.confirm({
            theme: 'modern',
            type: 'blue',
            icon: 'fas fa-exclamation-circle',
            title: title,
            content: content,
            columnClass: 'small',
            draggable: true,
            buttons: {
                si: {
                    text: '<i class="fas fa-check"></i> Si',
                    btnClass: 'btn-blue',
                    action: function () {
                        callback();
                    }
                },
                no: {
                    text: '<i class="fas fa-times"></i> No',
                    btnClass: 'btn-red',
                    action: function () {
                        cancel();
                    }
                }
            }
        }
    );
}

function menssaje_error(title, content, icon, callback) {
    var obj = Swal.fire(
        title,
        content,
        'error'
    );
    setTimeout(function () {
        // some point in future.
        obj.close();
    }, 3000);
}

function error_login(title, content, icon, callback) {
    $.confirm({
        theme: 'modern',
        icon: icon,
        title: title,
        type: 'red',
        content: content,
        draggable: true,
        buttons: {
            info: {
                text: '<i class="fas fa-check"></i> Ok',
                btnClass: 'btn-blue',
                action: function () {
                    callback();
                }

            },
        }
    });
}

function menssaje_ok(title, content, icon, callback) {
    Swal.fire({
            title: title,
            text: content,
            icon: 'success',
        }
    ).then((result) => {
        if (result.isConfirmed) {
            callback();

        }
    });
}

function login(url, parametros, callback, callback2) {
    $.ajax({
        dataType: 'JSON',
        type: 'POST',
        url: url,
        data: parametros,
    }).done(function (data) {
        if (!data.hasOwnProperty('error')) {
            callback();
            return false;
        }
        error_login('Error', data.error, 'fas fa-exclamation-circle', callback2);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })


}

function save_with_ajax2(title, url, content, parametros, callback) {
    Swal.fire({
        title: title,
        text: content,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: url,
                processData: false,
                contentType: false,
                data: parametros,
            }).done(function (data) {
                if (!data.hasOwnProperty('error')) {
                    $.isLoading({
                        text: "<strong>" + 'Cargando..' + "</strong>",
                        tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
                    });
                    setTimeout(function () {
                        $.isLoading('hide');
                        callback(data);
                    }, 1000);
                    return false;
                }
                menssaje_error('Error', data.error, 'fas fa-exclamation-circle');

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        }
    })
}


function reset(formulario) {
    $(formulario)[0].reset();
    var validator = $(formulario).validate();
    validator.resetForm();
    $('.has-success').removeClass('has-success');
    $('.has-error').removeClass('has-error');
}

function menssaje_error_form(title, content, icon, callback) {
    var html = '<ul>';
    $.each(content, function (key, value) {
        html += '<li>' + key + ': ' + value + '</li>'
    });
    html += '</ul>';
    $.confirm({
        theme: 'modern',
        icon: icon,
        title: title,
        type: 'red',
        content: html,
        draggable: true,
        buttons: {
            info: {
                text: '<i class="fas fa-check"></i> Ok',
                btnClass: 'btn-blue'
            },
        }
    });
}


// function borrar_producto_carito(title, content, callback) {
//     var obj = $.dialog({
//         icon: 'fa fa-spinner fa-spin',
//         title: title,
//         content: content,
//         type: 'blue',
//         typeAnimated: true,
//         draggable: true,
//         onClose: function () {
//             callback();
//         },
//     });
//     setTimeout(function () {
//         // some point in future.
//         obj.close();
//     }, 2000);
//
//
// }
//
//
function customize(doc) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];
    var date = new Date();

    function formatDateToString(date) {
        // 01, 02, 03, ... 29, 30, 31
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        // 01, 02, 03, ... 10, 11, 12
        // month < 10 ? '0' + month : '' + month; // ('' + month) for string result
        var MM = monthNames[date.getMonth() + 1]; //monthNames[d.getMonth()])
        // 1970, 1971, ... 2015, 2016, ...
        var yyyy = date.getFullYear();
        // create the format you want
        return (dd + " de " + MM + " de " + yyyy);
    }

    var jsDate = formatDateToString(date);
    //[izquierda, arriba, derecha, abajo]
    doc.pageMargins = [25, 50, 25, 50];
    doc.defaultStyle.fontSize = 12;
    doc.styles.tableHeader.fontSize = 12;
    doc.content[1].table.body[0].forEach(function (h) {
        h.fillColor = '#c4dfa9'
    });
    doc.styles.title = {color: '#2D1D10', fontSize: '16', alignment: 'center'};
    doc['header'] = (function () {
        return {
            columns: [
                {
                    text: $("#nombre_empresa").val()+'\n\n', fontSize: 30,
                    alignment: 'center',
                },
                // {
                //     text: $('#direccion_empresa').val(), fontSize: 45, alignment: 'center', margin: [-90, 33, 0]
                // },
            ],
            margin: [20, 10, 0, 0],  //[izquierda, arriba, derecha, abajo]


        }
    });
    doc['footer'] = (function (page, pages) {
        return {
            columns: [
                {
                    alignment: 'left',
                    text: ['Reporte creado el: ', {text: jsDate.toString()}]
                },
                {
                    alignment: 'right',
                    text: ['Pagina ', {text: page.toString()}, ' de ', {text: pages.toString()}]
                }
            ],
            margin: 20
        }
    });
    var objLayout = {};
    objLayout['hLineWidth'] = function (i) {
        return .5;
    };
    objLayout['vLineWidth'] = function (i) {
        return .5;
    };
    objLayout['hLineColor'] = function (i) {
        return '#000000';
    };
    objLayout['vLineColor'] = function (i) {
        return '#000000';
    };
    objLayout['paddingLeft'] = function (i) {
        return 4;
    };
    objLayout['paddingRight'] = function (i) {
        return 4;
    };
    doc.content[0].layout = objLayout;
    doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
    doc.styles.tableBodyEven.alignment = 'center';
    doc.styles.tableBodyOdd.alignment = 'center';
}

function customize_report(doc) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];
    var date = new Date();

    function formatDateToString(date) {
        // 01, 02, 03, ... 29, 30, 31
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        // 01, 02, 03, ... 10, 11, 12
        // month < 10 ? '0' + month : '' + month; // ('' + month) for string result
        var MM = monthNames[date.getMonth() + 1]; //monthNames[d.getMonth()])
        // 1970, 1971, ... 2015, 2016, ...
        var yyyy = date.getFullYear();
        // create the format you want
        return (dd + " de " + MM + " de " + yyyy);
    }

    var jsDate = formatDateToString(date);
    //[izquierda, arriba, derecha, abajo]
    doc.pageMargins = [25, 50, 25, 50];
    doc.defaultStyle.fontSize = 12;
    doc.styles.tableHeader.fontSize = 12;
    doc.content[1].table.body[0].forEach(function (h) {
        h.fillColor = '#97af83'
    });
    doc.content[1].table.body[doc.content[1].table.body.length - 1].forEach(function (h) {
        h.fillColor = '#97AF83'
    });
    doc.styles.title = {color: '#2D1D10', fontSize: '16', alignment: 'center'};
    doc['header'] = (function () {
        return {
            columns: [
                {
                    text: $("#nombre_empresa").val()+'\n\n', fontSize: 30,
                    alignment: 'center',
                },
                // {
                //     text: $('#direccion_empresa').val(), fontSize: 45, alignment: 'center', margin: [-90, 33, 0]
                // },
            ],
            margin: [20, 10, 0, 0],  //[izquierda, arriba, derecha, abajo]


        }
    });
    doc['footer'] = (function (page, pages) {
        return {
            columns: [
                {
                    alignment: 'left',
                    text: ['Reporte creado el: ', {text: jsDate.toString()}]
                },
                {
                    alignment: 'right',
                    text: ['Pagina ', {text: page.toString()}, ' de ', {text: pages.toString()}]
                }
            ],
            margin: 20
        }
    });
    var objLayout = {};
    objLayout['hLineWidth'] = function (i) {
        return .5;
    };
    objLayout['vLineWidth'] = function (i) {
        return .5;
    };
    objLayout['hLineColor'] = function (i) {
        return '#000000';
    };
    objLayout['vLineColor'] = function (i) {
        return '#000000';
    };
    objLayout['paddingLeft'] = function (i) {
        return 4;
    };
    objLayout['paddingRight'] = function (i) {
        return 4;
    };
    doc.content[0].layout = objLayout;
    doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
    doc.styles.tableBodyEven.alignment = 'center';
    doc.styles.tableBodyOdd.alignment = 'center';
}

// function customize_report(doc) {
//     const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
//         "Noviembre", "Diciembre"
//     ];
//     var date = new Date();
//
//     function formatDateToString(date) {
//         // 01, 02, 03, ... 29, 30, 31
//         var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
//         // 01, 02, 03, ... 10, 11, 12
//         // month < 10 ? '0' + month : '' + month; // ('' + month) for string result
//         var MM = monthNames[date.getMonth() + 1]; //monthNames[d.getMonth()])
//         // 1970, 1971, ... 2015, 2016, ...
//         var yyyy = date.getFullYear();
//         // create the format you want
//         return (dd + " de " + MM + " de " + yyyy);
//     }
//
//     var jsDate = formatDateToString(date);
//     //[izquierda, arriba, derecha, abajo]
//     doc.pageMargins = [25, 150, 25, 50];
//     doc.defaultStyle.fontSize = 12;
//     doc.styles.tableHeader.fontSize = 12;
//     doc.content[1].table.body[0].forEach(function (h) {
//         h.fillColor = '#4e73df'
//     });
//     doc.content[1].table.body[doc.content[1].table.body.length - 1].forEach(function (h) {
//         h.fillColor = '#4e73df'
//     });
//     doc.styles.title = {color: '#2D1D10', fontSize: '16', alignment: 'center'};
//     doc['header'] = (function () {
//         return {
//             columns: [
//                 {
//                     alignment: 'left', image: logotipo, width: 100, height: 100
//                 },
//                 {
//                     text: $('#nombre_empresa').text(), fontSize: 45, alignment: 'center', margin: [-90, 30, 0]
//                 },
//             ],
//             margin: [20, 10, 0, 0],  //[izquierda, arriba, derecha, abajo]
//
//
//         }
//     });
//     doc['footer'] = (function (page, pages) {
//         return {
//             columns: [
//                 {
//                     alignment: 'left',
//                     text: ['Reporte creado el: ', {text: jsDate.toString()}]
//                 },
//                 {
//                     alignment: 'right',
//                     text: ['Pagina ', {text: page.toString()}, ' de ', {text: pages.toString()}]
//                 }
//             ],
//             margin: 20
//         }
//     });
//     var objLayout = {};
//     objLayout['hLineWidth'] = function (i) {
//         return .5;
//     };
//     objLayout['vLineWidth'] = function (i) {
//         return .5;
//     };
//     objLayout['hLineColor'] = function (i) {
//         return '#000000';
//     };
//     objLayout['vLineColor'] = function (i) {
//         return '#000000';
//     };
//     objLayout['paddingLeft'] = function (i) {
//         return 4;
//     };
//     objLayout['paddingRight'] = function (i) {
//         return 4;
//     };
//     doc.content[0].layout = objLayout;
//     doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
//     doc.styles.tableBodyEven.alignment = 'center';
//     doc.styles.tableBodyOdd.alignment = 'center';
// }
//
//
function validador() {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z," "]+$/i.test(value);
    }, "Solo puede ingresar letras y espacios");


    $.validator.setDefaults({
        errorClass: 'help-block',

        highlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-success").removeClass("has-error");
        }
    });

    jQuery.validator.addMethod("val_ced", function (value, element) {
        var e = $(element).parent();
        if (e[0].classList.contains('has-success')) {
            return true;
        } else {
            if (value.length === 10 || value.length === 13) {
                $.ajax({
                    type: "POST",
                    url: '/verificar/',
                    data: {'data': value.toString()},
                    dataType: 'json',
                    success: function (data) {
                        if (!data.hasOwnProperty('error')) {
                            $(element).parent().addClass("has-success").removeClass("has-error");
                            $('#' + element['id'] + '-error').html('').hide();
                            return data['resp'];
                        }
                        $(element).parent().addClass("has-error").removeClass("has-success");
                        return false;
                    },
                })
            }
        }

        // return this.optional(element) || /^[a-z," "]+$/i.test(value);
    }, "");
}


function year_footer() {
    var ano = (new Date).getFullYear();
    $('#year').text(ano);

}

// function reloj() {
//     var fecha_js = new Date;
//     var segundos = fecha_js.getSeconds();
//     var hora = fecha_js.getHours();
//     var minutos = fecha_js.getMinutes();
//
//     segundos++;
//
//     if (segundos === 60) {
//         segundos = 0;
//         minutos++;
//         if (minutos === 60) {
//             minutos = 0;
//             hora++;
//             if (hora === 24) {
//                 hora = 0;
//             }
//         }
//     }
//     document.getElementById("reloj").innerHTML = " " + hora + ":" + minutos + ":" + segundos;
// }
//
// $(document).ready(function() {
//     setInterval(reloj, 1000);
// });

