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
            'event.Error': 'ns.event.Error'
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

        //set defaults
        me.private.state = imports.State.Closed;
    };

    Class.property.url = {
        set: function (url) {
            var me = this;
            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Closed, 'url:set - connection must be closed to set url');

            //assert, that url is instance of imports.Url
            self.assert.ok(url instanceof imports.Url, 'url:set - given url `$url` is not an instance of `$Url`', {
                $url: url,
                $Url: imports.Url
            });

            this.private.url = url;
        }
    };

    Class.property.binaryType = {
        set: function (type) {
            var me = this;

            //assert, that type is defined in imports.BinaryType
            self.assert.ok(imports.BinaryType.has(type), 'binaryType:set - given unknown binary type `$type`', {
                $type: type
            });

            me.private.type = type;

            //set binary type for connection, if it is connecting or opened
            if (me.private.state & (imports.State.Connecting | imports.State.Opened)) {
                me.private.connection.binaryType = type;
            }
        }
    };

    Class.property.state = {
        set: xs.noop
    };

    Class.property.protocol = {
        get: function () {
            var me = this;

            //return connection protocol, if connection is opened, else - undefined
            return me.private.state & imports.State.Opened ? me.private.connection.protocol : undefined;
        },
        set: function (protocol) {
            var me = this;

            self.assert.ok((function () {
                if (xs.isString(protocol)) {
                    return true;
                }

                self.assert.array(protocol, 'protocol:set - given protocol `$protocol` is nor an array neither a string', {
                    $protocol: protocol
                });

                for (var i = 0; i < protocol.length; i++) {
                    self.assert.string(protocol[ i ], 'protocol:set - given protocol `$protocol` is not a string', {
                        $protocol: protocol
                    });
                }

                return true;
            })());

            //save protocol
            me.private.protocol = protocol;
        }
    };

    Class.property.extensions = {
        get: function () {
            var me = this;

            //return connection extensions, if connection is opened, else - undefined
            return me.private.state & imports.State.Opened ? me.private.connection.extensions : undefined;
        },
        set: xs.noop
    };

    Class.property.buffer = {
        get: function () {
            var me = this;

            //return connection buffered amount, if connection is opened, else - undefined
            return me.private.state & imports.State.Opened ? me.private.connection.bufferedAmount : undefined;
        },
        set: xs.noop
    };

    Class.method.open = function () {
        var me = this;

        //assert, that request is close
        self.assert.ok(me.private.state & imports.State.Closed, 'open - connection must be closed to open it');

        //assert, that url is specified
        self.assert.defined(me.private.url, 'open - connection url is not specified');

        //set request state
        me.private.state = imports.State.Connecting;


        //create socket connection
        var connection = me.private.connection = me.private.protocol ? new WebSocket(me.private.url, me.private.protocol) : new WebSocket(me.private.url);


        //create state object
        var state = {
            send: me.private.stream.send,
            private: me.private
        };

        //add connection listeners
        connection.onopen = xs.bind(handleOpen, state);
        connection.onclose = xs.bind(handleClose, state);
        connection.onmessage = xs.bind(handleMessage, state);
        connection.onerror = xs.bind(handleError, state);
    };

    Class.method.send = function (data) {
        var me = this;

        //assert, that request is opened
        self.assert.ok(me.private.state & imports.State.Opened, 'send - connection must be closed to open it');

        //assert, that data is a string, array buffer or blob
        self.assert.ok(validateData(data), 'send - given data `$data` is not a string, ArrayBuffer or Blob', {
            $data: data
        });

        me.private.connection.send(data);
    };

    Class.method.close = function (code, reason) {
        var me = this;

        //assert, that request is connecting or opened
        self.assert.ok(me.private.state & (imports.State.Connecting | imports.State.Opened), 'close - connection must be opened to close it');

        //if no arguments - close normally with empty reason
        if (!arguments.length) {
            //set closing state
            me.private.state = imports.State.Closing;

            //close connection
            me.private.connection.close(imports.CloseCode.Normal, '');

            return;
        }

        //verify close code (if given)
        self.assert.ok((arguments.length === 1 && xs.isString(arguments[ 0 ])) || validateCloseCode(code), 'close - given close code `$code` is not valid', {
            $code: code
        });

        //use first argument as reason, if needed
        if (arguments.length === 1) {
            if (xs.isString(arguments[ 0 ])) {
                code = imports.CloseCode.Normal;
                reason = arguments[ 0 ];
            } else {
                reason = '';
            }
        }

        //verify reason (if given)
        self.assert.string(reason, 'close - given close reason `$reason` is not a string', {
            $reason: reason
        });

        //set closing state
        me.private.state = imports.State.Closing;

        //close connection
        me.private.connection.close(code, '');
    };


    var handleOpen = function () {
        var me = this;

        //set request state
        me.private.state = imports.State.Opened;

        //send event
        me.send(new imports.event.Open());
    };

    var handleMessage = function (event) {
        var me = this;

        if (xs.isString(event.data)) {

            //send event
            me.send(new imports.event.Text(event.data));

        } else {

            //send event
            me.send(new imports.event.Binary(event.data));

        }
    };

    var handleError = function () {
        var me = this;

        //send event
        me.send(new imports.event.Error());
    };

    var handleClose = function (event) {
        var me = this;

        //set request state
        me.private.state = imports.State.Closed;

        //send event
        me.send(new imports.event.Close(event));
        console.log.bind(console, 'close', event);
    };

    var validateData = function (data) {

        return xs.isString(data) || data instanceof Blob || data instanceof ArrayBuffer;
    };

    var validateCloseCode = function (code) {
        self.assert.number(code, 'validateCloseCode - given code `$code` is not a number', {
            $code: code
        });

        self.assert.ok(code === imports.CloseCode.Normal || (code >= 3000 && code < 5000), 'validateCloseCode - given code `$code` exceeds allowed limits. It must be equal to 1000, or be between 3000 and 4999', {
            $code: code
        });

        return true;
    };

});