$(document).ready(function(){
    let src;
    let currentImgId;
    const $carouselImg = $('#carosello-img-wrapper img');

    $(".img-preview").click(function (e) {
        e.stopPropagation();
        src = $(this).attr("src");
        currentImgId = $(this).attr("id");

        $("#carosello-img-wrapper img").attr("src", src);
        $("#carosello").fadeIn(200)
    });

    $("#next-btn").click(function () {
        const lastImgWrapper = $('.gallery-img-wrapper').last();
        const numberOfImgs = lastImgWrapper.find(":first-child").attr("id");

        (currentImgId == numberOfImgs) ? currentImgId = 1 : currentImgId++; 
        src = $("#" + currentImgId).attr("src");
    
        $carouselImg.fadeOut(200, function () {
            $carouselImg.attr("src", src);
            $carouselImg.fadeIn(200);
        });
    });

    $("#previous-btn").click(function () {
        const lastImgWrapper = $('.gallery-img-wrapper').last();
        const numberOfImgs = lastImgWrapper.find(":first-child").attr("id");

        (currentImgId == 1) ? currentImgId = numberOfImgs : currentImgId--; 
        src = $("#" + currentImgId).attr("src");
    
        $carouselImg.fadeOut(200, function () {
            $carouselImg.attr("src", src);
            $carouselImg.fadeIn(200);
        });
    });

    $('#carosello').swipe( {
        swipeLeft:function() {
            $("#next-btn").click();
        },
        swipeRight:function() {
            $("#previous-btn").click();
        }
    });

    $(document).on("click", function (e) {
        const $carouselElements = $("#carosello-img-wrapper img, #next-btn, #previous-btn");
        if ($("#carosello").is(e.target) || !$carouselElements.is(e.target) && $carouselElements.has(e.target).length === 0) {
            $("#carosello").fadeOut(200);
        }
    });

    $(document).keydown(function(e) {
        if ($("#carosello").is(":visible")) {
            if (e.keyCode == 37) { // freccia sinistra
                $("#previous-btn").click();
            }
            if (e.keyCode == 39) { // freccia destra
                $("#next-btn").click();
            }
            if (e.keyCode == 27) {  // ESC
                $("#carosello").fadeOut(200);
            }
        }
    });
});