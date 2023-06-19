let ticking = false;
let i = 0;
let elements = [];
const elms = document.querySelectorAll('.sticky-element');
const imgSections = document.querySelectorAll('.squares-img-section');

elms.forEach((elm) => {
    elements.push({
        value: false,
        label: elm
    });
});

// CHANGING SQUARES
function sticky_relocate() {
    if (i < elements.length) {
        elements.forEach(function(el, index) {
            if (el.value == false) {
                let rect = el.label.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2) {
                    if (window.innerWidth > 1366){
                        $(`#${el.label.id}`).addClass('tocenter');
                        $(`#${el.label.id}`).find('.img-spacer').css({
                            'width': 'clamp(120px, 10vw, 170px)'
                        });
                    } else if (window.innerWidth > 1024 && window.innerWidth <= 1366) {
                        if (index % 2 === 0) {
                            imgSections[index].style.marginLeft = 0;
                        } else {
                            imgSections[index].style.marginRight = 0;
                        }
                    }
                    el.value = true;
                    i++;
                }
            }
        });
    } else {
        document.removeEventListener('scroll', handle_scrolling);
    }
}

// SCROLL EVENT THROTTLING
function handle_scrolling() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            sticky_relocate();
            ticking = false;
        });
        ticking = true;
    }
}

// EVENT LISTENER
if(window.innerWidth > '1024'){
    document.addEventListener('scroll', handle_scrolling);
}

window.addEventListener('resize', function() {
    if (i == 0) {
        if (this.innerWidth > 1024) {
            document.addEventListener('scroll', handle_scrolling);
        }
    } else {
        elements.forEach(function(el, index) {
            if (el.value == true) {
                if (window.innerWidth > 1366){
                    $(`#${el.label.id}`).addClass('tocenter');
                    $(`#${el.label.id}`).find('.img-spacer').css({
                        'width': 'clamp(120px, 10vw, 170px)'
                    });
                } else if (window.innerWidth > 1024 && window.innerWidth <= 1366) {
                    if (index % 2 === 0) {
                        imgSections[index].style.marginLeft = 0;
                    } else {
                        imgSections[index].style.marginRight = 0;
                    }
                }
            }
        });
    }
});