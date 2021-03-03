$(document).ready(function () {
    validador();

    $("#form_causa_muerte").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50,
                lettersonly: true,
            }

        },
        messages: {
            nombre: {
                required: "Este valor es requerido",
                minlength: "Debe ingresar al menos 3 caracteres",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            }
        },
    });


    $("#form_mortalidad").validate({
        rules: {
            descrpcion: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            causa: {
                required: true
            }

        },
        messages: {
            descrpcion: {
                required: "Este valor es requerido",
                minlength: "Debe ingresar al menos 3 caracteres"
            },
            causa:{
                required: 'Elija una causa de muerte'
            }
        },
    });

    $("#form_gasto").validate({
        rules: {
            detalle: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            tipo_gasto: {
                required: true
            }

        },
        messages: {
            detalle: {
                required: "Este valor es requerido",
                minlength: "Debe ingresar al menos 3 caracteres"
            },
            tipo_gasto:{
                required: 'Elija un tipo de gasto'
            }
        },
    });

    $("#form_tipo_gasto").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50,
                lettersonly: true,
            }

        },
        messages: {
            nombre: {
                required: "Este valor es requerido",
                minlength: "Debe ingresar al menos 3 caracteres",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            }
        },
    });
});