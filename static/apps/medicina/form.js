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
            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa el nombre de la medicina",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            descripcion: {
                required: "Por favor ingresa una descripcion del producto",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            tipo_medicina: {
                required: " ",

            },
        },
    });
    $("#form_tipo").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50
            }
        },
        messages: {
            nombre: {
                required: "Por favor ingresa el nombre de la medicina",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            }
        }
    });

    $('#id_nombre_tipo').keyup(function () {
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


