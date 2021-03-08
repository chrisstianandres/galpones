$(document).ready(function () {
    $('#id_permissions').select2({
        theme: 'classic',
        languaje: 'es',
        placeholder: 'Buscar...',
    });
    validador();
$("#form").validate({
    rules: {
        name: {
            required: true,
            maxlength: 25,
            minlength: 3,
            lettersonly: true
        },
        permissions: {
            required: true
        }
    },
    messages: {
        name: {
            required: "Este campo es requerido",
            maxlength: "Maximo 25 caracteres",
            minlength: "Minimi 3 caracteres",
        },
        permissions: {
            required: "Elige al menos un permiso"
        },
    },
});

});
