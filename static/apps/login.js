$(function () {
    $('#formlogin').on('submit', function (e) {
        e.preventDefault();
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
            'password': $('input[name="password"]').val()
        };
        login('/connect/', parametros, function () {
            $.isLoading({
                text: "<strong>" + 'Iniciando Sesion...' + "</strong>",
                tpl: '<span class="isloading-wrapper %wrapper%"><i class="fas fa-spinner fa-2x fa-spin"></i><br>%text%</span>',
            });
            setTimeout(function () {
                $.isLoading('hide');
                window.location.href = '/menu';
            }, 1000);
            return false;

        });
    });
});

