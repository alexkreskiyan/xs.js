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

    Class.imports = [
        {
            BinaryType: 'ns.BinaryType'
        },
        {
            CloseCode: 'ns.CloseCode'
        },
        {
            State: 'ns.State'
        },
        {
            Url: 'xs.uri.WebSocket'
        },
        {
            'event.Binary': 'ns.event.Binary'
        },
        {
            'event.Close': 'ns.event.Close'
        },
        {
            'event.Open': 'ns.event.Open'
        },
        {
            'event.Text': 'ns.event.Text'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);
    };

    Class.property.url = {
        set: function (url) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Closed, 'url:set - connection must not be closed to set url');

            //assert, that url is instance of imports.Url
            self.assert.ok(url instanceof imports.Url, 'url:set - given url `$url` is not an instance of `$Url`', {
                $url: url,
                $Url: imports.Url
            });

            this.private.url = url;
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