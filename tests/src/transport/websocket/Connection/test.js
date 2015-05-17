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
        //var socket = window.rawsocket = new WebSocket('ws://localhost:3001');
        //socket.onopen = console.log.bind(console, 'open');
        //socket.onerror = console.error.bind(console, 'error');
        //socket.onclose = console.log.bind(console, 'close');
        //socket.onmessage = console.info.bind(console, 'message');
    });

    test('demo', function () {
        expect(0);
        var socket = window.socket = new xs.transport.websocket.Connection();
        socket.url = new xs.uri.WebSocket('ws://localhost:3001', xs.uri.query.QueryString);
        socket.open();
        socket.on(function (event) {
            console.log(event.self, event);
        });
    });

});