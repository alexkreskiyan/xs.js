/**
 * Event class for events, being thrown when pointer appears over element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Over
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Over', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.TargetChange';

    Class.static.method.capture = function (target) {
        //call parent
        self.parent.capture(target);

        var capture = {
            target: target
        };

        //capture pointerOver event
        capture.handlePointerOver = xs.bind(handlePointerOver, capture);
        target.private.el.addEventListener(self.pointerEvents.pointerOver, capture.handlePointerOver);

        return capture;
    };

    Class.static.method.release = function (target, capture) {
        //call parent
        self.parent.release(target, capture);

        target.private.el.removeEventListener(self.pointerEvents.pointerOver, capture.handlePointerOver);
    };

    //define handle for `click` event
    var handlePointerOver = function (event) {
        var me = this;
        //console.log('pointer over happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});