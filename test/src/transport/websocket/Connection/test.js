/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.websocket.Connection', function () {

    'use strict';

    var server = 'ws://localhost:3001';

    test('url', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();

        //url must be instance of xs.uri.WebSocket
        throws(function () {
            connection.url = new xs.uri.Http(xs.uri.query.QueryString);
        });

        //correctly - goes ok
        var url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);
        connection.url = url;
        strictEqual(connection.url, url);

        //connection must be closed
        connection.open().then(function () {
            connection.close();
            me.done();
        });
        throws(function () {
            connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);
        });

        return false;
    });

    test('binaryType', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        //binary type must be a member of xs.transport.websocket.BinaryType
        throws(function () {
            connection.binaryType = 'array';
        });

        //if connection is connecting or opened - changes connection binary type
        var log = [];
        connection.on(xs.transport.websocket.event.Binary, function (event) {
            log.push(event);

            if (log.length % 2) {
                connection.binaryType = xs.transport.websocket.BinaryType.ArrayBuffer;
            } else {
                connection.binaryType = xs.transport.websocket.BinaryType.Blob;
            }

            if (log.length >= 3) {
                connection.close();
                strictEqual(log[ 0 ].data instanceof defaultType, true);
                strictEqual(log[ 1 ].data instanceof ArrayBuffer, true);
                strictEqual(log[ 2 ].data instanceof Blob, true);
                me.done();
            }
        });

        var defaultType;
        connection.open().then(function () {
            defaultType = connection.binaryType === 'blob' ? Blob : ArrayBuffer;
            connection.send(new ArrayBuffer(1));
            connection.send(new ArrayBuffer(1));
            connection.send(new ArrayBuffer(1));
        });

        return false;
    });

    test('state', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        var log = [ connection.state ];
        connection.on(function () {
            log.push(connection.state);
        });

        connection.open().then(function () {
            connection.close().then(function () {
                strictEqual(log.toString(), [
                    xs.transport.websocket.State.Closed,
                    xs.transport.websocket.State.Connecting,
                    xs.transport.websocket.State.Opened,
                    xs.transport.websocket.State.Closing,
                    xs.transport.websocket.State.Closed
                ].toString());
                me.done();
            });
            log.push(connection.state);
        });
        log.push(connection.state);

        return false;
    });

    test('protocol', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        //check protocol get - undefined, when closed
        strictEqual(connection.protocol, undefined);

        //when set, must be a undefined|String|String[]
        connection.protocol = undefined;
        throws(function () {
            connection.protocol = null;
        });
        throws(function () {
            connection.protocol = [ null ];
        });
        connection.protocol = [
            'chat',
            'superchat'
        ];

        //setting doesn't make sense when closed
        strictEqual(connection.protocol, undefined);

        connection.open().then(function () {
            //when opened, contains selected protocol
            strictEqual(xs.isString(connection.protocol), true);
            connection.close();
            me.done();
        });

        return false;
    });

    test('extensions', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        //check extensions get - undefined, when closed
        strictEqual(connection.protocol, undefined);

        connection.open().then(function () {

            //when opened, contains selected extensions collection
            strictEqual(connection.extensions instanceof xs.core.Collection, true);

            connection.close().then(function () {

                //check extensions get - undefined, when closed
                strictEqual(connection.protocol, undefined);

                me.done();
            });
        });

        return false;
    });

    test('buffer', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        //check buffer get - undefined, when closed
        strictEqual(connection.buffer, undefined);

        connection.open().then(function () {

            //when opened, contains current buffer size
            strictEqual(xs.isNumber(connection.buffer), true);

            connection.close().then(function () {

                //check buffer get - undefined, when closed
                strictEqual(connection.buffer, undefined);

                me.done();
            });
        });

        return false;
    });

    test('open', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();

        //url must be defined
        throws(function () {
            connection.open();
        });

        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);
        connection.open().then(function () {
            connection.close();
            me.done();
        });

        //after open state is changed to `connecting`
        strictEqual(connection.state, xs.transport.websocket.State.Connecting);

        //connection must be closed
        throws(function () {
            connection.open();
        });

        return false;
    });

    test('send', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        var log = [];
        connection.on(xs.transport.websocket.event.Text, function (event) {
            log.push(event);
        });
        connection.on(xs.transport.websocket.event.Binary, function (event) {
            log.push(event);
            strictEqual(log.length, 2);
            strictEqual(log[ 0 ].data, text);
            strictEqual(log[ 1 ].data.size, blob.size);
            connection.close();
            me.done();
        });

        //connection must be opened
        throws(function () {
            connection.send('');
        });

        var text = 'some text';
        var blob = new Blob([ new ArrayBuffer(5) ], {});

        connection.open().then(function () {
            //data must be valid
            throws(function () {
                connection.send(null);
            });

            connection.send(text);
            connection.send(blob);
        });

        //connection must be opened
        throws(function () {
            connection.send('');
        });

        return false;
    });

    test('close', function () {
        var me = this;

        var connection = new xs.transport.websocket.Connection();
        connection.url = new xs.uri.WebSocket(server, xs.uri.query.QueryString);

        //connection must be `opened` to close
        throws(function () {
            connection.close();
        });

        var log = [];
        connection.on(xs.transport.websocket.event.Close, xs.bind(log.push, log));
        connection.open().then(function () {
            //connection can be closed without close code and reason
            return connection.close();
        }).then(function () {
            return connection.open();
        }).then(function () {
            //code/reason must be valid
            throws(function () {
                connection.close(null);
            });

            //connection can be closed with close code only
            return connection.close(3500);
        }).then(function () {
            return connection.open();
        }).then(function () {

            //connection can be closed with reason only
            return connection.close('end');
        }).then(function () {
            return connection.open();
        }).then(function () {
            //connection can be closed with both code and reason
            return connection.close(3500, 'end');
        }).then(function () {
            strictEqual(log[ 0 ].code + ':' + log[ 0 ].reason, '1000:');
            strictEqual(log[ 1 ].code + ':' + log[ 1 ].reason, '3500:');
            strictEqual(log[ 2 ].code + ':' + log[ 2 ].reason, '1000:end');
            strictEqual(log[ 3 ].code + ':' + log[ 3 ].reason, '3500:end');
            me.done();
        });

        return false;

        //connection can be closed without close code and reason
        //connection can be closed with close code only
        //connection can be closed with reason only
        //connection can be closed with both close code and reason
    });

});