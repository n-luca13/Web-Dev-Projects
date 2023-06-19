let current = 0;
let previous = 0;
let cycleTimer;
let progressBarTimer;
let startTime = new Date();
let previousHoveredBtn;
let isBtnHovered = false;
const $dotsWrapper = $('#dots-wrapper');
const $dots = $('.dot');
const $mainButtons = $('.main-section-btn');
const $progressBar = $('#progress-bar-fill');
const $section = $('#main-titles-section');
const BUTTON_COUNT = $mainButtons.length;
const animationDuration = 5000;

function IntervalTimer(callback, interval) {
    this.timerId;
    this.startTime;
    this.remaining = interval;
    this.state = 0; //  0 = idle, 1 = running, 2 = paused, 3 = resumed

    this.pause = function () {
        if (this.state != 1) return;

        this.remaining = interval - (new Date() - this.startTime);
        window.clearInterval(this.timerId);
        this.state = 2;
    };

    this.resume = function () {
        if (this.state != 2) return;

        this.state = 3;
        window.setTimeout(this.timeoutCallback.bind(this), this.remaining);
    };

    this.timeoutCallback = function () {
        if (this.state != 3) return;

        callback();

        this.startTime = new Date();
        this.timerId = window.setInterval(callback, interval);
        this.state = 1;
    };

    this.startTime = new Date();
    this.timerId = window.setInterval(callback, interval);
    this.state = 1;
}

function updateProgressBar() {
    if (previousHoveredBtn !== current){
        const currentTime = new Date();
        const elapsedTime = currentTime - startTime;
        const progress = (elapsedTime / animationDuration) * 100;
        (progress <= 100) ? $progressBar.css('width', `${progress}%`) : $progressBar.css('width', '100%');
    }
}

function startProgressBarTimer() {
    progressBarTimer = new IntervalTimer(updateProgressBar, 50);
}

function resetProgressBarTimer() {
    progressBarTimer.pause();
    startTime = new Date();
    progressBarTimer.resume();
}


function changeStyle(currentBtn, btnIndex){
    currentBtn.addClass('hovered');

    if (window.innerWidth > 1024 && window.innerWidth <= 1366) {
            switch (btnIndex) {
                case 0:
                    $section.css('grid-template-columns', '1fr 0.5fr 0.5fr');
                    break;
                case 1:
                    $section.css('grid-template-columns', '0.5fr 1fr 0.5fr');
                    break;
                case 2:
                    $section.css('grid-template-columns', '0.5fr 0.5fr 1fr');
                    break;
            }
    }

    if (window.innerWidth <= 1024){
        $dots.each(function(i, dot) {
            (i == btnIndex) ? $(dot).css('background', '#d0a842') : $(dot).css('background', 'black');
        })
        $section.css('grid-template-columns', '1fr');
        $mainButtons.each(function(i, obj) {
            (i == btnIndex) ? $('#'+obj.id).css('display', 'block') : $('#'+obj.id).css('display', 'none')
        });
    }

    let hovered_id = currentBtn.attr('id'); 
    $('.img-background').each(function(i,obj) {
        if (obj.id.includes(hovered_id)) {
            $('#'+obj.id).css('display', 'block');
        } else {
            $('#'+obj.id).css('display', 'none');
        }
    });
}

function doCycle(curr) {
    if (!isBtnHovered){
        if (arguments.length == 0){
            startProgressBarTimer();
            changeStyle($('#'+$mainButtons[0].id), 0)
            curr = 0;
        } else {
            resetProgressBarTimer();
            $mainButtons.removeClass('hovered');
            changeStyle($('#'+$mainButtons[curr].id), curr);
        }
    }

    function cycleHelper() {
        doCycle(current);
    }

    previous = (curr === 0) ? 2 : curr - 1;
    previousHoveredBtn = current;
    current = (curr + 1) % BUTTON_COUNT;

    clearInterval(cycleTimer);
    cycleTimer = setInterval(cycleHelper, animationDuration);
}

$(document).ready(function() {    
    doCycle();
    
    $mainButtons.mouseenter(function() {
        isBtnHovered = true;

        $progressBar.css('visibility', 'hidden');
        resetProgressBarTimer();

        $mainButtons.removeClass('hovered');
        changeStyle($(this), $(this).index());
        current = $(this).index();
    });
    
    $mainButtons.mouseleave(function(){
        isBtnHovered = false;

        $progressBar.css('visibility', 'visible');
        $progressBar.css('width', '0%');
        progressBarTimer.resume();
        
        current = $(this).index();
        doCycle(current);
    });

    
    $('#previous-service').click(function() {
        current = $('#'+$mainButtons[previous].id).index();
        doCycle(current);
    });
    
    $('#next-service').click(function() {
        current = $('#'+$mainButtons[current].id).index();
        doCycle(current);
    });

    $(window).resize(function(){
        if (window.innerWidth > 1024){
            $mainButtons.each(function(i, obj) {
                $('#'+obj.id).css('display', 'block');
            });
        }

        if (window.innerWidth <= 1366){     
            current = (current - 1 + 3) % 3
            doCycle(current);
        } else {
            $section.css('grid-template-columns', '1fr 1fr 1fr');
        }
    });

    
    $('#main-titles-wrapper').swipe( {
        swipeLeft:function() {
            $('#next-service').click();
        },
        swipeRight:function() {
            $('#previous-service').click();
        }
    });
});