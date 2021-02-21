var indice;
function cal_pvp(){
    indice = (1+($('#indice').val()/100));
     var pcp_val=$('input[name="pcp"]').val();
            var pvp_val = pcp_val * indice;
            $('input[name="pvp"]').val(pvp_val.toFixed(2));
}
$(document).ready(function () {

    var action = '';
    var pk = '';
    $('#id_pcp').val(1.00).TouchSpin({
        min: 0.05,
        max: 1000000,
        step: 0.01,
        decimals: 2,
        forcestepdivisibility: 'none',
        boostat: 5,
        maxboostedstep: 10,
        prefix: '$'
    })
        .on('change keyup', this, function () {
            cal_pvp();
        });
    $('input[name="pvp"]').prop('readonly', true);
    validador();
    $("#form_prod").validate({
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
            categoria: {
                required: true
            }
        },
        messages: {
            nombre: {
                required: "Porfavor ingresa el nombre del producto",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            descripcion: {
                required: "Porfavor ingresa una descripcion del producto",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            categoria: {
                required: "Debe escoger una categoria de producto",

            },
        },
    });
    $("#form").validate({
        rules: {
            producto_base: {
                required: true
            },
            descr:{required:true},
            cat:{required:true},
            presentacion: {
                required: true
            },
            imagen: {
                required: false
            }
        },
        messages: {
            producto_base: {
                required: "Por favor selecciona un producto"
            },
            descr: {
                required: "Por favor selecciona un producto para que se muestre su descripcion"
            },
            cat: {
                required: "Por favor selecciona un producto para que se muestre su categoria"
            },
            presentacion: {
                required: "Por favor selecciona una presentacion"
            },
        },
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


