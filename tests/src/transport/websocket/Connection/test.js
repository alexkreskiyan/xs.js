/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.websocket.Connection', function () {

    'use strict';

    test('demo', function () {
        expect(0);
        var socket = new WebSocket('ws://localhost:3001');
        socket.onopen = console.log.bind(console, 'open');
        socket.onerror = console.error.bind(console, 'error');
        socket.onclose = console.log.bind(console, 'close');
        socket.onmessage = console.info.bind(console, 'message');
    });

});