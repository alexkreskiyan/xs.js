/**
 * Event class for events, being thrown when element loses focus
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.element.Blur
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.element.Blur', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.Event';

    Class.imports = {
        Element: 'xs.view.Element'
    };

    Class.implements = [
        'ns.pointer.IEvent'
    ];

    Class.static.method.capture = function (target) {
        self.assert.ok(target instanceof imports.Element, 'capture - given `$target` is not an instance of `$Element`', {
            $target: target,
            $Element: imports.Element
        });

        var capture = {
            target: target
        };

        //capture blur event
        capture.handleBlur = xs.bind(handleBlur, capture);
        target.private.el.addEventListener('blur', capture.handleBlur);

        return capture;
    };

    Class.static.method.release = function (target, capture) {
        self.assert.ok(target instanceof imports.Element, 'release - given `$target` is not an instance of `$Element`', {
            $target: target,
            $Element: imports.Element
        });

        self.assert.object(capture, 'release - given `$capture` is not an object', {
            $capture: capture
        });

        target.private.el.removeEventListener('blur', capture.handleBlur);
    };

    //define handle for `click` event
    var handleBlur = function (event) {
        var me = this;
        //console.log('pointer out happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});