$(document).ready(function () {
    validador();
    $.validator.addMethod("validaSelect", function (value, element, arg) {
        return arg !== value;
    }, "Seleccione una opción");
    $("#form").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            descripcion: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            tipo_medicina: {
                validaSelect: "SELECCIONE UNA OPCIÓN"
            },
            categoria: {
                validaSelect: "SELECCIONE UNA OPCIÓN"
            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa el nombre de la medicina",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            descripcion: {
                required: "Por favor ingresa una descripcion de la medicina",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            tipo_medicina: {
                required: " ",

            },
            categoria: {
                required: " ",

            },
        },
    });
    $("#form_presentacion").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50,
                lettersonly: true
            },
            abreviatura: {
                required: true,
                minlength: 2,
                maxlength: 10,
                lettersonly: true
            },
            descripcion: {
                required: true,
                minlength: 3,
                maxlength: 50
            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa el nombre de la presentacion",
                minlength: "Debe ingresar al menos 3 letras",
                maxlength: "Debe ingresar maximo 50 caracteres",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            abreviatura: {
                required: "Por favor ingresa una abreviatura",
                minlength: "Debe ingresar al menos 2 letras",
                maxlength: "Debe ingresar maximo 10 caracteres",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            descripcion: {
                required: "Por favor ingresa una descripcion",
                minlength: "Debe ingresar al menos 3 letras",
                maxlength: "Debe ingresar maximo 50 caracteres"
            },
        }
    });
    $("#form_cat").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 25
            },
            descripcion: {
                required: true,
                minlength: 3,
                maxlength: 50

            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa el nombre de la categoria",
                maxlength: "Debe ingresar maximo 25 letras",
                minlength: "Debe ingresar al menos 3 letras"
            },
            descripcion: {
                required: "Por favor ingresa una descripcion",
                minlength: "Debe ingresar al menos 3 letras",
                maxlength: "Debe ingresar maximo 50 letras",
            }
        }
    });

    $('#id_nombre_presentacion').keyup(function () {
        var pal = $(this).val();
        var changue = pal.substr(0, 1).toUpperCase() + pal.substr(1);
        $(this).val(changue);
    });
    $('#id_nombre').keyup(function () {
        var pal = $(this).val();
        var changue = pal.substr(0, 1).toUpperCase() + pal.substr(1);
        $(this).val(changue);
    });
    $('#id_descripcion').keyup(function () {
        var pal = $(this).val();
        var changue = pal.substr(0, 1).toUpperCase() + pal.substr(1);
        $(this).val(changue);
    });
});


