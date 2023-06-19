$(document).ready(function(){
    const $sidenav = $('#sidenav');
    const $navButton = $('#sidenav-btn');
    const $pageWrapper = $('#page-wrapper');
    const $overlay = $('<div id="sidenav-overlay"></div>');
    const $dropdownServizi = $('#sidenav-dropdown-servizi');
    let isDropdownOpen = false;

    $navButton.click(function(){
        $sidenav.css({
            'transform': 'translateX(0)',
            'box-sizing': 'content-box'
        });
        $pageWrapper.css({
            'right': '185px',
            'overflow-x': 'hidden'
        });

        $overlay.appendTo($pageWrapper);
        $('body').css('overflow', 'hidden');
    });

    function closeSidenav() {
        $pageWrapper.css({
            'right': '0',
            'overflow-x': 'auto'
        });

        $sidenav.css('transform', 'translateX(185px)');

        setTimeout(() => {
            $sidenav.css('box-sizing', 'border-box')
        }, 300);

        $overlay.remove();
        $('body').css('overflow', 'auto');
    }

    $('#sidenav-btn-close, #sidenav-overlay').click(function(){
        closeSidenav();
    }); 

    $pageWrapper.on('click', '#sidenav-overlay', function(){
        closeSidenav();
    });    


    $('#btn-open-dropdown-servizi').click(function(){
        if (isDropdownOpen) {
            $dropdownServizi.css('max-height', '0');
        } else {
            $dropdownServizi.css('max-height', '170px');
        }
        isDropdownOpen = !isDropdownOpen;
    });
});