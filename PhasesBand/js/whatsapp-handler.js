$(document).ready(function(){
    const $whatsappBtn = $('#whatsapp-floating-btn');
    let startPos;
    let endPos;

    function isElementInViewport(el) {
        const EL_TOP_POS = $(el).offset().top;
        const EL_BOTTOM_POS = EL_TOP_POS + $(el).outerHeight();
        const VIEWPORT_TOP = $(window).scrollTop();
        const VIEWPORT_BOTTOM = VIEWPORT_TOP + $(window).height();
        return EL_BOTTOM_POS > VIEWPORT_TOP && EL_TOP_POS < VIEWPORT_BOTTOM;
    }

    if (window.innerWidth > 1024) {
        $whatsappBtn.show();
    }

    $(window).scroll(function(){
        if (window.innerWidth <= 1024){
            if ($(this).scrollTop() > 100 && !isElementInViewport($('footer'))){
                $whatsappBtn.fadeIn();
            } else {
                $whatsappBtn.fadeOut();
            }
        }
    });
    
    $(window).resize(function(){
        startPos = $('#main-titles-wrapper').offset().top;
        endPos = $('#header').offset().top + $('#header').outerHeight();
        if(window.innerWidth > 1024 || (startPos != endPos && !isElementInViewport($('footer')))){
            $whatsappBtn.show();
        } else {
            $whatsappBtn.hide();
        }      
    });
});