const url = window.location.href;
const homepages = [ '/', 'index.html', '/index.html'];
let storageName = "";
let pageShown = false;

if (homepages.indexOf(window.location.pathname) >= 0) {
    storageName = "homepage_previously_loaded";
} else {
    if (url.split(location.host)[1] == '/galleria.html') {
        storageName = "gallery_previously_loaded";
    }
}
var previouslyLoaded = localStorage.getItem(storageName);

function showPage() {
    if (!pageShown){
        $('#loading-page').fadeOut();
        $('body').removeClass('stop-scrolling');
        $('body').unbind('touchmove');
        pageShown = true;
    }
}

if (!previouslyLoaded) {
    $(document).ready(function(){
        $('#loading-page').html(`
            <div id="loader-wrapper" style="display: flex; position: relative;">
                <div id="flex-container">
                    <div id="loading-logo">
                        <img src="media/loghi/phases_logo_black.png" alt="Phases Band logo">
                    </div>
                    <div id="gooey">
                        <span id="special-dot" class="common-dot"></span>
                        <div id="dots-container">
                        <span class="common-dot"></span>
                        <span class="common-dot"></span>
                        <span class="common-dot"></span>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').addClass('stop-scrolling');
        $('body').bind('touchmove', function(e){e.preventDefault()});
    });
   
    $(window).on('load', function() {
        localStorage.setItem(storageName, "1");
        showPage();
    });

    setTimeout(function() {
        showPage();
    }, 6000);

} else {
    showPage();
}