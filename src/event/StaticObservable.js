/**
 * StaticObservable mixin
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.StaticObservable
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.StaticObservable', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    Class.abstract = true;

    Class.static.method.on = function (target, handler, options) {
        var stream = this.events;
        stream.on.apply(stream, arguments);

        return this;
    };

    Class.static.method.off = function (target, selector, flags) {
        var stream = this.events;
        stream.off.apply(stream, arguments);

        return this;
    };

    Class.static.method.suspend = function (target, selector, flags) {
        var stream = this.events;
        stream.suspend.apply(stream, arguments);

        return this;
    };

    Class.static.method.resume = function (target, selector, flags) {
        var stream = this.events;
        stream.resume.apply(stream, arguments);

        return this;
    };

});