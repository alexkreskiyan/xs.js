/**
 * Event class for events, being thrown when element's content is changed
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.content.Change
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.content.Change', function (self, imports) {

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

        //capture change event
        capture.handleChange = xs.bind(handleChange, capture);
        target.private.el.addEventListener('change', capture.handleChange);

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

        target.private.el.removeEventListener('change', capture.handleChange);
    };

    //define handle for `click` event
    var handleChange = function (event) {
        var me = this;
        //console.log('pointer out happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});