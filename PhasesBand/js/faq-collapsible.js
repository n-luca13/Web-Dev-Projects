$(document).ready(function(){
    const $faq = $('.collapsible');

    $faq.on('click', function(){
        $(this).toggleClass('active');

        const [firstChild, lastChild] = this.children;
        $(lastChild).toggleClass("fa-circle-chevron-up fa-angle-down");

        const CONTENT = $(this).next()[0];
        CONTENT.style.maxHeight = CONTENT.style.maxHeight ? null : CONTENT.scrollHeight + "px";
    });
});