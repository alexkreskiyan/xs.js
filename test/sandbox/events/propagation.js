'use strict';

xs.Loader.paths.add({
    xs: '/src',
    stats: 'src'
});

var body, log, boxes, isClear, capture, events, xevent;
events = [];

window.onload = function () {
    xs.require([
        'xs.view.Element',
        'xs.view.event.pointer.Tap'
    ], xs.noop);
    xs.onReady([
        'xs.view.Element',
        'xs.view.event.pointer.Tap'
    ], run);
};
function run() {
    var Tap = xs.view.event.pointer.Tap;

    body = new xs.view.Element(document.body);
    log = body.query('#log');
    boxes = body.query('div.box', xs.view.Element.All);
    capture = body.query('#useCapture');
    capture.on(Tap, function () {
        removeListeners();
        addListeners();
    });
    paint();
    addListeners();

    function removeListeners() {
        boxes.each(function (box) {
            box.off(Tap, function (item) {
                return item.handler === handleBoxClick;
            }, xs.core.Collection.All);
        });
    }

    function addListeners() {
        boxes.each(function (box) {
            box.on(Tap, handleBoxClick);
        });
    }

    function handleBoxClick(event) {
        xevent = event;

        if (isClear) {
            isClear = false;
            paint();
            events.slice(0, events.length);
            setTimeout(reset, 10);
        }

        events.push(event);

        var level;

        switch (event.phase) {
            case xs.view.event.Phase.Capture:
                level = 'capturing';
                break;
            case xs.view.event.Phase.Target:
                event.currentTarget.private.el.style.backgroundColor = 'red';
                level = 'target';
                break;
            case xs.view.event.Phase.Bubble:
                level = 'bubbling';
                break;
            default :
                level = 'error';
        }

        log.private.el.innerHTML += event.currentTarget.attributes.get('id') + '; eventPhase: ' + level + '<br/>';
    }

    function paint() {
        boxes.each(function (box, key) {
            box.private.el.style.backgroundColor = (key & 1) ? '#f6eedb' : '#cceeff';
        });

        log.private.el.innerHTML = '';
    }

    function reset() {
        isClear = true;
    }
}