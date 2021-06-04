$(function () {
    validador();
    $.validator.addMethod("passwordcheck", function (value) {
        return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
            && /[\[\]?*+|{}\\()@.\n\r]/.test(value)// has a special character
    }, "La contraseña debe contener de 8 a 20 carácteres alfanuméricos (a-z A-Z), contener mínimo un dígito (0-9) y un carácter especial");
    $("#formlogin").validate({
        rules: {
            username: {
                required: true,
                minlength: 2,
                maxlength: 150,
            },
            password: {
                required: true,
                minlength: 2,
                maxlength: 128,
            }
        },
        messages: {
            username: {
                required: '',
                minlength: "Ingrese al menos 2 caracteres",
                maxlength: "Ingrese maximo 150 caracteres"

            },
            password: {
                required: '',
                minlength: "Ingrese al menos 2 caracteres",
                maxlength: "Ingrese maximo 128 caracteres"

            }
        }
    });

    $('#formlogin').on('submit', function (e) {
        e.preventDefault();
        var isvalid = $(this).valid();
        if (isvalid) {
            $.isLoading({
                text: "<strong>" + 'Iniciando Sesion...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            if ($('input[name="username"]').val() === "") {
                menssaje_error('Error!', "Debe ingresar un Username", 'far fa-times-circle');
                return false
            } else if ($('input[name="password"]').val() === "") {
                menssaje_error('Error!', "Debe ingresar una contraseña", 'far fa-times-circle');
                return false
            }
            var parametros;
            parametros = {
                'username': $('input[name="username"]').val(),
                'password': $('input[name="password"]').val(),
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            };
            login(window.location.pathname, parametros, function () {
                $.isLoading('hide');
                window.location.href = '/menu';
                return false;

            });
        }
    });


    $('#form').on('submit', function (e) {
        e.preventDefault();
        var isvalid = $(this).valid();
        if (isvalid) {
            $.isLoading({
                text: "<strong>" + 'Enviando correo por favor espera un momento...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            var parametros = new FormData(this);
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: window.location.pathname,
                processData: false,
                contentType: false,
                data: parametros,
            }).done(function (data) {
                $.isLoading('hide');
                if (!data.hasOwnProperty('error')) {
                    menssaje_ok('Exito!', 'Correo de cambio de contrseña enviado, revisa tu correo y ' +
                        'sigue las instrucciones', 'success', function () {
                        window.location.href = '/login'
                    });
                    return false;
                }
                menssaje_error('Error', data.error, 'fas fa-exclamation-circle');

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        }
    });
    $('#form_change')
        .validate({
            rules: {
                password: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    passwordcheck: true
                },
                confirmPassword: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                    equalTo: "#id_confirmPassword",
                    passwordcheck: true
                }
            },
            messages: {
                password: {
                    required: "Por favor ingresa una contraseña valida",
                    minlength: "La contraseña debe contener de 5 a 20 carácteres alfanuméricos (a-z A-Z), contener mínimo un dígito (0-9) y un carácter especial",
                    maxlength: "La contraseña debe contener de 5 a 20 carácteres alfanuméricos (a-z A-Z), contener mínimo un dígito (0-9) y un carácter especial",
                },
                confirmPassword: {
                    required: "Las contraseñas deben coincidir",
                    equalTo: "Las contraseñas deben coincidir",
                    minlength: "La contraseña debe contener de 5 a 20 carácteres alfanuméricos (a-z A-Z), contener mínimo un dígito (0-9) y un carácter especial",
                    maxlength: "La contraseña debe contener de 5 a 20 carácteres alfanuméricos (a-z A-Z), contener mínimo un dígito (0-9) y un carácter especial",
                }
            },
        });
    $('#form_change').on('submit', function (e) {
        e.preventDefault();
        var isvalid = $(this).valid();
        if (isvalid) {
            $.isLoading({
                text: "<strong>" + 'Cambiando contraseña por favor espera un momento...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            var parametros = new FormData(this);
            $.ajax({
                dataType: 'JSON',
                type: 'POST',
                url: window.location.pathname,
                processData: false,
                contentType: false,
                data: parametros,
            }).done(function (data) {
                 $.isLoading('hide');
                if (!data.hasOwnProperty('error')) {
                    menssaje_ok('Exito!', 'La contrseña ha sido cambiada con exito, vuelve a inciar sesion', 'success', function () {
                        window.location.href = '/login'
                    });
                    return false;
                }
                menssaje_error('Error', data.error, 'fas fa-exclamation-circle');

            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });
        }
    });
});

