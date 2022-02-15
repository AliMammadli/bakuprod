window.onload = function (e) {
    evt = e || window.event;

    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel';

    if (document.attachEvent) {
        document.getElementById('scroll').attachEvent('on' + mousewheelevt, scroll);
    } else {
        document.getElementById('scroll').addEventListener(mousewheelevt, scroll, false);
    }
}


function scroll(evt) {
    scrollTarget = evt.currentTarget || evt.srcElement;

    if (scrollTarget.scrollWidth > scrollTarget.offsetWidth) {
        var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
        evt.preventDefault();

        switch (delta) {
            case 1:
                scrollTarget.scrollLeft -= 32;
                break;

            case -1:
                scrollTarget.scrollLeft += 32;
                break;
        }
    }
}