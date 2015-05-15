/**
 * xs.js WebSocket implementation part - connection class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.websocket.Connection
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Connection', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.websocket';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);
    };

    Class.property.url = {
        set: function () {

        }
    };

    Class.property.binaryType = {
        set: function () {

        }
    };

    Class.property.state = {
        set: xs.noop
    };

    Class.property.protocol = {
        set: xs.noop
    };

    Class.property.extensions = {
        set: xs.noop
    };

    Class.property.buffer = {
        set: xs.noop
    };

    Class.method.open = function () {

    };

    Class.method.close = function (code, reason) {

    };

});