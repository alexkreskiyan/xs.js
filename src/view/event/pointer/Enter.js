/**
 * Event class for events, being thrown when pointer enters element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Enter
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Enter', function (self) {

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

        //capture pointerEnter event
        capture.handlePointerEnter = xs.bind(handlePointerEnter, capture);
        target.private.el.addEventListener(self.pointerEvents.pointerEnter, capture.handlePointerEnter);

        return capture;
    };

    Class.static.method.release = function (target, capture) {
        //call parent
        self.parent.release(target, capture);

        target.private.el.removeEventListener(self.pointerEvents.pointerEnter, capture.handlePointerEnter);
    };

    //define handle for `click` event
    var handlePointerEnter = function (event) {
        var me = this;
        //console.log('pointer enter happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});