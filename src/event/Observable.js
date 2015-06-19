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

        //save stream reference
        if (arguments.length > 1) {
            me.private.stream = new xs.reactive.Stream(generator, sources);
        } else {
            me.private.stream = new xs.reactive.Stream(generator);
        }
    };

    Class.property.events = {
        get: function () {
            return this.private.stream;
        },
        set: xs.noop
    };

    Class.method.on = function (event, handler, options) {
        var stream = this.private.stream;
        stream.on.apply(stream, arguments);

        return this;
    };

    Class.method.off = function (event, selector, flags) {
        var stream = this.private.stream;
        stream.off.apply(stream, arguments);

        return this;
    };

    Class.method.suspend = function (event, selector, flags) {
        var stream = this.private.stream;
        stream.suspend.apply(stream, arguments);

        return this;
    };

    Class.method.resume = function (event, selector, flags) {
        var stream = this.private.stream;
        stream.resume.apply(stream, arguments);

        return this;
    };

    Class.method.destroy = function () {
        this.private.stream.destroy();
    };

});