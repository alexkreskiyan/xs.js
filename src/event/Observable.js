/**
 * Observable mixin
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.Observable
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Observable', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    Class.abstract = true;

    Class.constructor = function (generator, sources) {
        var me = this;

        var send = null;
        //create event stream
        if (arguments.length < 2) {
            //save stream reference
            me.private.stream = new xs.event.Stream(function () {

                //save send reference
                send = this.send;

                //call generator
                return generator.call(this);
            });
        } else {
            //save stream reference
            me.private.stream = new xs.event.Stream(function () {

                //save send reference
                send = this.send;

                //call generator
                return generator.apply(this, arguments);
            }, sources);
        }

        //save send reference to stream
        me.private.stream.send = send;
    };

    Class.property.events = {
        get: function () {
            return this.private.stream;
        },
        set: xs.noop
    };

    Class.method.on = function (target, handler, options) {
        var stream = this.private.stream;
        stream.on.apply(stream, arguments);

        return this;
    };

    Class.method.off = function (target, selector, flags) {
        var stream = this.private.stream;
        stream.off.apply(stream, arguments);

        return this;
    };

    Class.method.suspend = function (target, selector, flags) {
        var stream = this.private.stream;
        stream.suspend.apply(stream, arguments);

        return this;
    };

    Class.method.resume = function (target, selector, flags) {
        var stream = this.private.stream;
        stream.resume.apply(stream, arguments);

        return this;
    };

    Class.method.destroy = function () {
        this.private.stream.destroy();
    };

});