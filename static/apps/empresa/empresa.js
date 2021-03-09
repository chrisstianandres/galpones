$(document).ready(function () {
    $('#id_nombre').attr('readonly', true);
    $('#id_ciudad').attr('readonly', true);
    $('#id_ruc').attr('readonly', true);
    $('#id_correo').attr('readonly', true);
    $('#id_direccion').attr('readonly', true);
    $('#id_facebook').attr('readonly', true);
    $('#id_instagram').attr('readonly', true);
    $('#id_twitter').attr('readonly', true);
    $('#id_telefono').attr('readonly', true);
    $('#id_indice').TouchSpin({
        min: 1,
        max: 100,
        step: 1,
        boostat: 5,
        maxboostedstep: 10,
        prefix: '%'
    }).prop('disabled', true);
    $('#id_tasa').TouchSpin({
        min: 1,
        max: 100,
        step: 1,
        boostat: 5,
        maxboostedstep: 10,
        prefix: '%'
    }).prop('disabled', true);
    $('#editar').on("click", editar);
    $('input[name="iva"]').TouchSpin({
        min: 1,
        max: 100,
        step: 1,
        boostat: 5,
        maxboostedstep: 10,
        prefix: '%'
    }).prop('disabled', true);
    var newOption = new Option($('#id_text').val(), $('#id_prov').val(), false, true);
    var newOption2 = new Option($('#id_text_cant').val(), $('#id_cant').val(), false, true);
    var newOption3 = new Option($('#id_text_parr').val(), $('#id_parr').val(), false, true);

    $('#id_provincia')
        .select2({
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
                url: '/ubicacion/lista',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'provincia',
                        'id': ''
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca una Provincia',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            load_prov($('#id_provincia option:selected').val());
        })
        .on("change", function () {
            if ($(this).val() === null) {
                $('#id_canton').empty().trigger("change");
                $('#id_ubicacion').empty().trigger("change");
            }
        })
        .append(newOption).trigger('change')
        .prop('disabled', true);
    $('#id_canton')
        .select2({theme: "classic", allowClear: true})
        .append(newOption2).trigger('change')
        .prop('disabled', true);

    $('#id_ubicacion')
        .select2({theme: "classic", allowClear: true})
        .append(newOption3).trigger('change')
        .prop('disabled', true);

    $('#signupForm').on('submit', function (e) {
        e.preventDefault();
        if ($('#id_canton').val() === '0' || $('#id_canton').val() === null || $('#id_parroquia').val() === '0' || $('#id_parroquia').val() === null) {
            menssaje_error('Error!', 'Debe seleccionar una Provincia, Canton y Parroquia', '', function () {

            })
        } else {
            var parametros = new FormData(this);
            var isvalid = $(this).valid();
            if (isvalid) {
                save_with_ajax2('Alerta',
                    window.location.pathname, 'Esta seguro que desea editar los parametros de la empresa?', parametros,
                    function () {
                        menssaje_ok('Exito!', 'Exito al actulizar los parametros de la empresa!', 'far fa-smile-wink', function () {
                            location.reload();
                        });
                    });
            }
        }


    })


});

function load_prov(id) {
    $.ajax({
        type: "POST",
        url: '/ubicacion/lista',
        data: {
            "id": id,
            'action': 'canton_insert'
        },
        dataType: 'json',
        success: function (data) {
            $('#id_canton')
                .empty().trigger("change")
                .select2({
                    data: data, language: {
                        "noResults": function () {
                            return "Sin resultados";
                        },
                    }
                });
        },
        error: function (xhr, status, data) {
            alert(data);
        },

    })
}

function load_canton(id) {
    $.ajax({
        type: "POST",
        url: '/ubicacion/lista',
        data: {
            "id": id,
            'action': 'canton_insert'
        },
        dataType: 'json',
        success: function (data) {
            $('#id_canton')
                .empty().trigger("change")
                .select2({
                    data: data,
                    language: {
                        "noResults": function () {
                            return "Sin resultados";
                        },
                    }
                });
        },
        error: function (xhr, status, data) {
            alert(data);
        },

    })
}

function load_canton_edit(id) {
    $.ajax({
        type: "POST",
        url: '/ubicacion/lista',
        data: {
            "id": id,
            'action': 'canton_insert'
        },
        dataType: 'json',
        success: function (data) {
            $('#id_canton')
                .select2({
                    data: data,
                    language: {
                        "noResults": function () {
                            return "Sin resultados";
                        },
                    }
                })
                .val($('#id_cant').val()).trigger('change');
        },
        error: function (xhr, status, data) {
            alert(data);
        },

    })
}

function load_parroquia(id) {
    $.ajax({
        type: "POST",
        url: '/ubicacion/lista',
        data: {
            "id": id,
            'action': 'parroquia'
        },
        dataType: 'json',
        success: function (data) {
            $('#id_ubicacion')
                .empty().trigger("change")
                .select2({
                    data: data,
                    language: {
                        "noResults": function () {
                            return "Sin resultados";
                        },
                    }
                });
            // $.each(data, function (key, value) {
            //     var newOption = new Option(value.text, value.id, false, true);
            //     $('#id_canton').append(newOption).trigger('change');
            // })
        },
        error: function (xhr, status, data) {
            alert(data);
        },

    })
}

function load_parroquia_edit(id) {
    $.ajax({
        type: "POST",
        url: '/ubicacion/lista',
        data: {
            "id": id,
            'action': 'parroquia'
        },
        dataType: 'json',
        success: function (data) {
            $('#id_ubicacion')
                .select2({
                    data: data,
                    language: {
                        "noResults": function () {
                            return "Sin resultados";
                        },
                    }
                })
                .val($('#id_parr').val()).trigger("change");
        },
        error: function (xhr, status, data) {
            alert(data);
        },

    })
}

function editar() {
    $('#guardar').show();
    $('#editar').hide();
    $('#id_nombre').attr('readonly', false);
    $('#id_ciudad').attr('readonly', false);
    $('#id_ruc').attr('readonly', false);
    $('#id_correo').attr('readonly', false);
    $('#id_direccion').attr('readonly', false);
    $('#id_iva').prop('disabled', false);
    $('#id_indice').prop('disabled', false);
    $('#id_tasa').prop('disabled', false);
    $('#id_telefono').attr('readonly', false);


    load_canton_edit($('#id_provincia').val());
    load_parroquia_edit($('#id_canton').val());


    $('#id_canton')
        .select2({theme: "classic", allowClear: true})
        .on('select2:select', function (e) {
            if ($(this).val() !== 0) {
                load_parroquia($('#id_canton option:selected').val());
            }
        })
        .prop('disabled', false)
        .on('change', function () {
            if ($(this).val() === null || $(this).val() === '') {
                $('#id_ubicacion').empty().trigger("change");
            }
        });


    $('#id_provincia')
        .select2({
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
                url: '/ubicacion/lista',
                data: function (params) {
                    var queryParameters = {
                        term: params.term,
                        'action': 'provincia',
                        'id': ''
                    };
                    return queryParameters;
                },
                processResults: function (data) {
                    return {
                        results: data
                    };

                },

            },
            placeholder: 'Busca una Provincia',
            minimumInputLength: 1,
        })
        .on('select2:select', function (e) {
            if ($(this).val() !== 0) {
                load_canton($('#id_provincia option:selected').val());
            }
        })
        .on("change", function () {
            if ($(this).val() === null) {
                $('#id_canton').empty().trigger("change");
                $('#id_ubicacion').empty().trigger("change");
            }
        })
        .prop('disabled', false);

    $('#id_ubicacion')
        .select2({theme: "classic", allowClear: true})
        .prop('disabled', false);
}

jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z," "]+$/i.test(value);
}, "Letters and spaces only please");


validador();
$("#signupForm").validate({
    rules: {
        nombre: {
            required: true,
            minlength: 3,
            maxlength: 50
        },
        ciudad: {
            required: true,
            minlength: 3,
            maxlength: 25
        },
        ruc: {
            required: true,
            minlength: 13,
            maxlength: 13,
            digits: true
        },
        correo: {
            required: true,
            email: true
        },
        direccion: {
            required: true,
            minlength: 5,
            maxlength: 100
        },
        telefono: {
            required: true,
            minlength: 10,
            maxlength: 10,
            digits: true
        },
    },
    messages: {
        nombre: {
            required: "Porfavor ingresa el nombre de la empresa",
            minlength: "Debe ingresar al menos 3 letras",
            maxlength: "Debe ingresar hasta 50 letras",
            lettersonly: "Debe ingresar unicamente letras y espacios"
        },
        ciudad: {
            required: "Porfavor ingresa la ciudad donde se encuentra la empresa",
            minlength: "Debe ingresar al menos 3 letras",
            maxlength: "Debe ingresar hasta 25 letras",
            lettersonly: "Debe ingresar unicamente letras y espacios"
        },
        ruc: {
            required: "Porfavor ingresa el numero de ruc",
            minlength: "Tu numero de documento debe tener al menos 13 digitos",
            maxlength: "Tu numero de documento debe tener hasta 13 digitos",
            digits: "Debe ingresar unicamente numeros"
        },
        telefono: {
            required: "Porfavor ingresa el numero celular de la empresa",
            minlength: "Tu numero de documento debe tener al menos 10 digitos",
            digits: "Debe ingresar unicamente numeros",
            maxlength: "EL numero de documento debe tener maximo 10 digitos",
        },
        direccion: {
            required: "Porfavor ingresa una direccion de la empresa",
            minlength: "Ingresa al menos 5 letras",
            maxlength: "Tu direccion debe tener maximo 100 caracteres",
        }
    },
});

