$(document).ready(function() {
    let img_id;
    const $lastImg = $("#gallery div").last();
    const $secondLastImg = $("#gallery div").eq(-2);

    // Per risolvere un bug del css (le ultime due immagini sarebbero invertite)
    $lastImg.remove();
    $secondLastImg.remove();
    $("#gallery").append($secondLastImg);
    $("#gallery").append($lastImg);

    let is_last_removed = false;
    let is_scnd_last_removed = false;

    if(window.innerWidth <= 1024){
        $lastImg.remove();
        is_last_removed = true;
    }

    if(window.innerWidth <= 768){
        $secondLastImg.remove();
        is_scnd_last_removed = true;
    }

    $(window).resize(function() {
        if(window.innerWidth <= 1024 && !is_last_removed){
            $lastImg.remove();
            is_last_removed = true;
        }
        if(window.innerWidth > 1024 && is_last_removed){
            $("#gallery").append($lastImg);
            is_last_removed = false;
        }

        if(window.innerWidth <= 768 && !is_scnd_last_removed){
            $secondLastImg.remove();
            is_scnd_last_removed = true;
        }
        if(window.innerWidth > 768 && is_scnd_last_removed){
            $("#gallery").append($secondLastImg);
            is_scnd_last_removed = false;
        }
    })

    
    function addClasses() {
        $('.gallery-img-wrapper').each(function(i, obj) {
            img_id = ++i;
            $(obj).removeClass().addClass('gallery-img-wrapper');
    
            if (window.innerWidth <= 768) {
                switch (img_id) {
                    case 2:
                        $(obj).addClass("hor-1");
                        break;
                    case 3:
                        $(obj).addClass("hor-2");
                        break;
                    case 5:
                        $(obj).addClass("vert-1");
                        break;
                    case 6:
                        $(obj).addClass("vert-2");
                        break;
                    case 9:
                        $(obj).addClass("hor-3");
                        break;
                    case 12:
                        $(obj).addClass("hor-4");
                        break;
                    case 13:
                        $(obj).addClass("vert-3");
                        break;
                    case 14:
                        $(obj).addClass("hor-5");
                        break;
                    case 21:
                        $(obj).addClass("hor-6");
                        break;
                }
            } else {
                switch (img_id) {
                    case 3:
                        $(obj).addClass("vert-1");
                        break;
                    case 8:
                        $(obj).addClass("hor-1");
                        break;
                    case 15:
                        $(obj).addClass("hor-2");
                        break;
                    case 16:
                        $(obj).addClass("vert-2");
                        break;
                    case 17:
                        $(obj).addClass("vert-3");
                        break;
                }
            }
        });
    }

    addClasses();

    $(window).resize(function() {
        addClasses();
    });

});