$(document).ready(function(){
    const $mainWrapper = document.getElementById("main-titles-wrapper"),
    $video = document.getElementById("maniac-videoclip-preview"),
    $videoHandlerBtn = document.getElementById("gif-handler");
    const $icon = $('#gif-handler i');
    
    function toggleClass(e){
        if (e.target.id === "main-titles-section" || e.target.closest("#main-titles-section") || document.getElementById("main-titles-section").contains(e.target)) {
            return;
        }

        ($video.paused) ? $video.play() : $video.pause();

        $icon.toggleClass("fa-circle-play");
        $icon.toggleClass("fa-circle-pause");
    }
        
    if ($mainWrapper && $videoHandlerBtn) {    
        $videoHandlerBtn.addEventListener('click', toggleClass);
        $mainWrapper.addEventListener('click', toggleClass);
    }

    $(function() {
        $('#maniac-videoclip-preview').hover(function() {
            $('#gif-handler i').css({
                'color': '#d0a842',
                'font-size': '1.6rem'
            });
        }, function() {
          $('#gif-handler i').css({
            'color': '',
            'font-size': ''
          });
        });

        $('#gif-handler-wrapper').hover(function() {
            $('#gif-handler i').css({
                'color': '#d0a842',
                'font-size': '1.6rem'
            });
        }, function() {
          $('#gif-handler i').css({
            'color': '',
            'font-size': ''
          });
        });
    });
});