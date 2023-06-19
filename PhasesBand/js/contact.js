$(document).ready(function(){
    // IMPEDIRE UTILIZZO SPAZI
    $("input").on('keydown', function(e){
        const KEY_CODE = e.which;
        if (KEY_CODE == 32) {
            if (!$(this).val() || $(this).attr('id') == "email") {
                e.preventDefault();
            }
        }
    });

    $("textarea").on('keydown', function(e){
        const KEY_CODE = e.which;
        if (KEY_CODE == 8 || KEY_CODE == 32) {
            if (!$(this).val()) {
                e.preventDefault();
            }
        }
    });

    // MODIFICHE STILI DI INPUT E TEXTAREA
    $("input").focusout(function(){
        if($(this).val() != ''){
            $('label[for="'+ $(this).attr('id') +'"]').css({
                'color': '#b8b8b8',
                'opacity' : '1',
                'visibility': 'visible',
            });
        }
    });

    $("input").keyup(function(){
        if($(this).val() == ''){
            $('label[for="'+ $(this).attr('id') +'"]').removeAttr('style');
        }
    });

    $("textarea").focusout(function(){
        if($(this).val() != ''){
            $(this).css({
                'border-top': '2px solid #d6d6d6',
                'border-right': '2px solid #d6d6d6',
                'border-left': '2px solid #d6d6d6',
            });
            $('label[for="'+ $(this).attr('id') +'"]').css({
                'color': '#b8b8b8',
                'opacity' : '1',
                'visibility': 'visible',
            });
        }
    });
    
    $("textarea").keyup(function(){
        if($(this).val() == ''){
            $(this).removeAttr('style');
            $('label[for="'+ $(this).attr('id') +'"]').removeAttr('style');
        }
    });

    // CHIAMATA AJAX INVIO MAIL
    $("#form").on('submit', function(e){
        e.preventDefault();
        const FORM_DATA = {
            'oggetto' : $('#oggetto').val(),
            'email' : $('#email').val(),
            'messaggio' : $('#messaggio').val()
        };
        $.ajax({
            url: $("#form").attr('action'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(FORM_DATA),
            beforeSend: function(){
                $("#loader-wrapper").css("display", "flex");
            }
        }).done(function(response){
            $("#form-wrapper").html(`
                <div id="response-container">
                    <div id="text-wrapper">
                        <h1>Grazie</h1>
                        <h3>per averci contattato!</h3>
                        <p>Risponderemo il prima possibile</p>
                    </div>
                    <div class="short-divider">
                        <span></span>
                    </div>
                    <div id="user-message-container">
                        <ul>
                            <li><p>`+response.oggetto+`</p></li>
                            <li>Da: <p>`+response.email+`</p></li>
                            <li>A: <p>phasesacoustic@gmail.com</p></li>
                        </ul>
                        <p>`+response.messaggio+`</p>
                    </div>
                </div>
            `);
        }).fail(function(response){
            if(response.status == 403){
                window.location = '/homepage.html';
            };
            if(response.responseJSON && response.responseJSON.errorsArray){
                const ERRORS = response.responseJSON.errorsArray;
                $.each(ERRORS, function(i, val){
                    $(window).scrollTop(0);
                    $("#"+i+"-error").css('visibility', 'visible');
                    $("#"+i+"-error").html("* "+val+"");
                    $("#"+i+"").css({
                        'color': '#cf1020',
                    });
                    $("#"+i+"").focus(function(){
                        let attr = $(this).attr('style');
                        if(typeof attr !== 'undefined' && attr !== false){
                            $(this).removeAttr('style');
                        }
                        let keypress = $("#"+i+"-error").css('visibility');
                            if(keypress = 'visible'){
                                $(this).keypress(function(){
                                $("#"+i+"-error").css('color', 'black');
                            });
                        }
                    });
                });
            }else if(response.responseJSON && response.responseJSON.emptyFields){
                const ERRORS = response.responseJSON.emptyFields;
                $.each(ERRORS, function(i, val){
                    $(window).scrollTop(0);
                    $("#"+val+"-error").css('visibility', 'visible');
                    $("#"+val+"-error").html("* Compilare questo campo");
                    $("#"+val+"").css({
                        'color': '#cf1020',
                    });
                    $("#"+val+"").focus(function(){
                        let style = $(this).attr('style');
                        if(typeof style !== 'undefined' && style !== false){
                            $(this).removeAttr('style');
                        }
                        let keypress = $("#"+val+"-error").css('visibility');
                            if(keypress = 'visible'){
                                $(this).keypress(function(){
                                $("#"+val+"-error").css('visibility', 'hidden');
                            });
                        }
                    });
                });
            }else{
                $("#form-wrapper").html(`
                    <div id="response-container">
                        <div id="text-wrapper">
                            <h1 class="red-col-error">Ops!</h1>
                            <h3 id="h3-margintop-error">Ci scusiamo per il disagio</h3>
                            <p class="p-margin-error red-col-error">Servizio momentaneamente non disponibile</p>
                            <p id="p-links-error" class="p-margin-error">Puoi contattarci su <a href="https://wa.me/+393335317979" target="_blank">Whatsapp</a></p>
                        </div>
                        <div class="short-divider" id="divider-margin-error">
                            <span class="red-bckgrnd-error"></span>
                        </div>
                    </div>
                    <div id="user-message-container"></div>
                `);

                if (response.responseJSON && response.responseJSON.userData){
                    $("#p-links-error").append(`
                        o all'indirizzo <a href="mailto:phasesacoustic@gmail.com?subject=`+response.responseJSON.userData.oggetto+`&body=`+response.responseJSON.userData.messaggio+`" target="_blank">
                            phasesacoustic@gmail.com
                        </a>
                    `);
                    $("#user-message-container").append(`
                        <ul>
                            <li><p>`+response.responseJSON.userData.oggetto+`</p></li>
                            <li>Da: <p>`+response.responseJSON.userData.email+`</p></li>
                            <li>A: <p>phasesacoustic@gmail.com</p></li>
                        </ul>
                        <p>`+response.responseJSON.userData.messaggio+`</p>
                    `);                 
                } else {
                    $("#p-links-error").append(`
                        o all'indirizzo <a href="mailto:phasesacoustic@gmail.com" target="_blank">
                            phasesacoustic@gmail.com
                        </a>
                    `);
                }
            }
        }).always(function(){
            $("#loader-wrapper").css("display", "none");
        });
    }); 
});