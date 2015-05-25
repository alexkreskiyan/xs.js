'use strict';

(function () {
    window.addEventListener('load', function () {
        //window.initTouchTest();
        //window.initScrollTest();
        window.initInteractionTest();
    });
})();
(function () {

    window.initTouchTest = function () {
        var el = document.getElementById('touch');
        var box = el.getBoundingClientRect();
        el.width = box.width;
        el.height = box.height;
        el.addEventListener('touchstart', handleStart, false);
        el.addEventListener('touchend', handleEnd, false);
        el.addEventListener('touchcancel', handleCancel, false);
        el.addEventListener('touchleave', handleEnd, false);
        el.addEventListener('touchmove', handleMove, false);
        console.log('touch test: canvas initialized.');
    };

    var ongoingTouches = [];

    function handleStart(evt) {
        evt.preventDefault();
        console.log('touch test: touchstart.');
        var el = document.getElementById('touch');
        var ctx = el.getContext('2d');
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            console.log('touch test: touchstart:' + i + '...');
            ongoingTouches.push(copyTouch(touches[ i ]));
            var color = colorForTouch(touches[ i ]);
            ctx.beginPath();
            ctx.arc(touches[ i ].pageX, touches[ i ].pageY, 4, 0, 2 * Math.PI, false);  //a circle at the start
            ctx.fillStyle = color;
            ctx.fill();
            console.log('touch test: touchstart:' + i + '.');
        }
    }

    function handleMove(evt) {
        evt.preventDefault();
        var el = document.getElementById('touch');
        var ctx = el.getContext('2d');
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var color = colorForTouch(touches[ i ]);
            var idx = ongoingTouchIndexById(touches[ i ].identifier);

            if (idx >= 0) {
                console.log('touch test: continuing touch ' + idx);
                ctx.beginPath();
                console.log('touch test: ctx.moveTo(' + ongoingTouches[ idx ].pageX + ', ' + ongoingTouches[ idx ].pageY + ');');
                ctx.moveTo(ongoingTouches[ idx ].pageX, ongoingTouches[ idx ].pageY);
                console.log('touch test: ctx.lineTo(' + touches[ i ].pageX + ', ' + touches[ i ].pageY + ');');
                ctx.lineTo(touches[ i ].pageX, touches[ i ].pageY);
                ctx.lineWidth = 4;
                ctx.strokeStyle = color;
                ctx.stroke();

                ongoingTouches.splice(idx, 1, copyTouch(touches[ i ]));  //swap in the new touch record
                console.log('touch test: .');
            } else {
                console.log('touch test: can\'t figure out which touch to continue');
            }
        }
    }

    function handleEnd(evt) {
        evt.preventDefault();
        console.log('touch test: touchend/touchleave.');
        var el = document.getElementById('touch');
        var ctx = el.getContext('2d');
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var color = colorForTouch(touches[ i ]);
            var idx = ongoingTouchIndexById(touches[ i ].identifier);

            if (idx >= 0) {
                ctx.lineWidth = 4;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(ongoingTouches[ idx ].pageX, ongoingTouches[ idx ].pageY);
                ctx.lineTo(touches[ i ].pageX, touches[ i ].pageY);
                ctx.fillRect(touches[ i ].pageX - 4, touches[ i ].pageY - 4, 8, 8);  //and a square at the end
                ongoingTouches.splice(idx, 1);  //remove it; we're done
            } else {
                console.log('touch test: can\'t figure out which touch to end');
            }
        }
    }

    function handleCancel(evt) {
        evt.preventDefault();
        console.log('touch test: touchcancel.');
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            //remove it; we're done
            ongoingTouches.splice(i, 1);
        }
    }

    function colorForTouch(touch) {
        var r = touch.identifier % 16;
        var g = Math.floor(touch.identifier / 3) % 16;
        var b = Math.floor(touch.identifier / 7) % 16;
        //make it a hex digit
        r = r.toString(16);
        //make it a hex digit
        g = g.toString(16);
        //make it a hex digit
        b = b.toString(16);
        var color = '#' + r + g + b;
        console.log('touch test: color for touch with identifier ' + touch.identifier + ' = ' + color);

        return color;
    }

    function copyTouch(touch) {
        return {
            identifier: touch.identifier,
            pageX: touch.pageX,
            pageY: touch.pageY
        };
    }

    function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[ i ].identifier;

            if (id === idToFind) {
                return i;
            }
        }

        //not found
        return -1;
    }

})();
(function () {

    window.initScrollTest = function () {
        var el = document.getElementById('scroll');
        var events = [
            'scroll',
            'wheel',
            'mousewheel'
        ];

        for (var i = 0; i < events.length; i++) {
            el.addEventListener(events[ i ], console.log.bind(console, 'scroll sample', events[ i ]));
        }
        console.log('scroll initialized.');
    };

})();
(function () {

    window.initInteractionTest = function () {
        var el = document.getElementById('interaction');
        var events = [
            'click',
            'dblclick',
            'mousedown',
            'mouseup',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseover',
            'mouseout',
            'contextmenu',
            'touchstart',
            'touchenter',
            'touchmove',
            'touchleave',
            'touchend',
            'touchcancel'
        ];

        for (var i = 0; i < events.length; i++) {
            el.addEventListener(events[ i ], console.log.bind(console, 'interaction sample', events[ i ]));
            el.addEventListener(events[ i ], write.log.bind(write, 'interaction sample', events[ i ]));
        }

        console.log('interaction initialized.');
    };

})();