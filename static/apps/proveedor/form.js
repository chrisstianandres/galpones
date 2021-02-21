$(document).ready(function () {
    $.validator.addMethod("tipo", function (value, element) {

        var tipo = $("#id_tipo").val();
        if (tipo === '0') {
            return ((value.length === 10));
        } else if (tipo === '1') {
            return ((value.length === 13));
        }
    }, "");
    validador();

    $("#form").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 5,
                maxlength: 50,
                lettersonly: true,
            },
            tipo: {
                required: true
            },
            num_doc: {
                required: true,
                tipo: true,
                digits: true,
                val_ced: true
            },
            correo: {
                required: true,
                email: true
            },
            telefono: {
                required: true,
                minlength: 10,
                digits: true
            },
            direccion: {
                required: true,
                minlength: 5,
                maxlength: 50
            },


        },
        messages: {
            nombre: {
                required: "Por favor ingresa tus nombres y apellidos",
                minlength: "Debe ingresar al menos un nombre y un apellido",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            num_doc: {
                required: "Por favor ingresa tu numero de documento",
                tipo: "Error en el numero de digitos (10 para cedula o 13 para ruc)",
                // minlength: "Numero de digitos deficiente (10 para cedula)",
                digits: "Debe ingresar unicamente numeros",
                val_ced: "Numero de documento no valido para Ecuador",
            },
            correo: "Debe ingresar un correo valido",
            telefono: {
                required: "Por favor ingresa tu numero celular",
                minlength: "Tu numero de documento debe tener al menos 10 digitos",
                digits: "Debe ingresar unicamente numeros",
                maxlength: "Tu numero de documento debe tener maximo 10 digitos",
            },
            direccion: {
                required: "Porfavor ingresa una direccion",
                minlength: "Ingresa al menos 5 letras",
                maxlength: "Tu direccion debe tener maximo 50 caracteres",
            },
        },
    });
    $("#form_person").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 5,
                maxlength: 50,
                lettersonly: true,
            },
            tipo: {
                required: true
            },
            num_doc: {
                required: true,
                tipo: true,
                digits: true,
                val_ced: true
            },
            correo: {
                required: true,
                email: true
            },
            telefono: {
                required: true,
                minlength: 10,
                digits: true
            },
            direccion: {
                required: true,
                minlength: 5,
                maxlength: 50
            },


        },
        messages: {
            nombre: {
                required: "Por favor ingresa tus nombres y apellidos",
                minlength: "Debe ingresar al menos un nombre y un apellido",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            num_doc: {
                required: "Por favor ingresa tu numero de documento",
                tipo: "Error en el numero de digitos (10 para cedula o 13 para ruc)",
                // minlength: "Numero de digitos deficiente (10 para cedula)",
                digits: "Debe ingresar unicamente numeros",
                val_ced: "Numero de documento no valido para Ecuador",
            },
            correo: "Debe ingresar un correo valido",
            telefono: {
                required: "Por favor ingresa tu numero celular",
                minlength: "Tu numero de documento debe tener al menos 10 digitos",
                digits: "Debe ingresar unicamente numeros",
                maxlength: "Tu numero de documento debe tener maximo 10 digitos",
            },
            direccion: {
                required: "Porfavor ingresa una direccion",
                minlength: "Ingresa al menos 5 letras",
                maxlength: "Tu direccion debe tener maximo 50 caracteres",
            },
        },
    });

    $('#id_nombres').keyup(function () {
        var changue = $(this).val().replace(/\b\w/g, function (l) {
            return l.toUpperCase()
        });
        $(this).val(changue);
    });

});
