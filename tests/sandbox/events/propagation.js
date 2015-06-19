'use strict';

xs.Loader.paths.add({
    xs: '/src',
    stats: 'src'
});

var body, log, boxes, clearer, capturer, useCapture;

window.onload = function () {
    xs.require([
        'xs.view.Element',
        'xs.view.event.pointer.Tap'
    ], xs.noop);
    xs.onReady([
        'xs.view.Element',
        'xs.view.event.pointer.Tap'
    ], function () {
        body = new xs.view.Element(document.body);
        log = body.query('#divInfo');
        boxes = body.query('div.box', xs.view.Element.All);
        //var chCapture = document.getElementById('chCapture');
        //chCapture.onclick = function () {
        //    removeListeners();
        //    addListeners();
        //};
        //clear();
        //addListeners();
    });
};

function removeListeners() {
    for (var i = 0; i < divs.length; i++) {
        var d = divs[ i ];
        if (d.id != 'divInfo') {
            d.removeEventListener('click', OnDivClick, true);
            d.removeEventListener('click', OnDivClick, false);
        }
    }
}
function addListeners() {
    for (var i = 0; i < divs.length; i++) {
        var d = divs[ i ];
        if (d.id != 'divInfo') {
            d.addEventListener('click', OnDivClick, false);
            if (chCapture.checked) {
                d.addEventListener('click', OnDivClick, true);
            }
            d.onmousemove = function () {
                clear = true;
            };
        }
    }
}
function OnDivClick(e) {
    if (clear) {
        clear();
        clear = false;
    }

    if (e.eventPhase == 2) {
        e.currentTarget.style.backgroundColor = 'red';
    }

    var level =
        e.eventPhase == 0 ? 'none' :
            e.eventPhase == 1 ? 'capturing' :
                e.eventPhase == 2 ? 'target' :
                    e.eventPhase == 3 ? 'bubbling' : 'error';
    divInfo.innerHTML += e.currentTarget.id + '; eventPhase: ' + level + '<br/>';
}
function clear() {
    for (var i = 0; i < divs.length; i++) {
        if (divs[ i ].id != 'divInfo') {
            divs[ i ].style.backgroundColor = (i & 1) ? '#f6eedb' : '#cceeff';
        }
    }
    divInfo.innerHTML = '';
}