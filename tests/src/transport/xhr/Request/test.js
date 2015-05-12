/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.xhr.Request', function () {

    'use strict';

    test('method', function () {
        var request;

        //must be set when request is unsent
        request = new xs.transport.xhr.Request();
        strictEqual(request.method, undefined);

        request.send()

        //must be valid xs.transport.xhr.Method element
        //is implemented correctly
    });

    test('url', function () {
        //must be set when request is unsent
        //must be xs.uri.HTTP instance
        //is implemented correctly
    });

    test('user', function () {
        //must be set when request is unsent
        //must be a string
    });

    test('password', function () {
        //must be set when request is unsent
        //must be a string
    });

    test('data', function () {
        //must be set when request is unsent
        //must be of valid type
        //every type is implemented correctly
    });

    test('type', function () {
        //must be set when request is unsent
        //must be valid xs.transport.xhr.Type element
        //every type is implemented correctly
    });

    test('headers', function () {
        //are set correctly
    });

    test('timeout', function () {
        //must be set when request is unsent
        //must be a string
        //works correctly
    });

    test('credentials', function () {
        //must be set when request is unsent
        //must be a string
        //are sent, if allowed
    });

    test('state', function () {
        //must be set when request is unsent
        //must be a string
        //changes correctly during request
    });

    test('send', function () {
        //request must be unsent
        //headers are applied (server returns headers)
        //data may be sent with POST/PUT method only
        //send returns promise
    });

    test('abort', function () {
        //must be called when request is sent
    });

    test('demo', function () {
        expect(0);

        var length = 1e6;
        var data = '';

        for (var i = 0; i < length; i++) {
            data += 'abcdefghijklmntoprst';
        }

        window.request = function (method, url, upload, file) {
            var xhr = new XMLHttpRequest();

            //add upload event listeners
            xhr.upload.addEventListener('loadstart', console.log.bind(console, 'upload.loadstart'));
            xhr.upload.addEventListener('progress', console.log.bind(console, 'upload.progress'));
            xhr.upload.addEventListener('load', console.log.bind(console, 'upload.load'));
            xhr.upload.addEventListener('error', console.log.bind(console, 'upload.error'));
            xhr.upload.addEventListener('abort', console.log.bind(console, 'upload.abort'));

            //add event listeners
            xhr.addEventListener('progress', console.log.bind(console, 'progress'));
            xhr.addEventListener('load', console.log.bind(console, 'load'));
            xhr.addEventListener('error', console.log.bind(console, 'error'));
            xhr.addEventListener('abort', console.log.bind(console, 'abort'));

            xhr.open(method, url);

            if (upload) {

                if (file) {
                    xhr.send(file);
                } else {

                    //works if not set. is ok?
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    file = new File([ data ], {
                        type: 'text/plain'
                    });

                    var formData = new FormData();
                    formData.append('data', file);

                    xhr.send(file); //or formData
                }
            } else {
                xhr.send();
            }

            return xhr;
        };

        window.upload = function () {
            return window.request('post', 'http://localhost:3000/upload', true);
        };

        window.download = function () {
            return window.request('get', 'http://localhost:3000/download');
        };

        window.revert = function () {
            return window.request('post', 'http://localhost:3000/revert', true);
        };

        window.xrequest = function (method, url, upload, file) {
            var xhr = new xs.transport.xhr.Request();
            var event = xs.transport.xhr.event;

            //add upload event listeners
            xhr.on(event.UploadProgress, console.log.bind(console, 'upload.progress'));
            xhr.on(event.Upload, console.log.bind(console, 'upload.load'));

            //add download event listeners
            xhr.on(event.Headers, console.log.bind(console, 'load.headers'));
            xhr.on(event.LoadProgress, console.log.bind(console, 'load.progress'));
            xhr.on(event.Load, console.log.bind(console, 'load.load'));

            xhr.on(event.Done, console.log.bind(console, 'done'));
            xhr.on(event.Error, console.log.bind(console, 'error'));
            xhr.on(event.Abort, console.log.bind(console, 'abort'));
            xhr.on(event.Timeout, console.log.bind(console, 'timeout'));

            xhr.method = method;
            xhr.url = new xs.uri.HTTP(url, xs.uri.query.QueryString);

            if (upload) {

                if (file) {
                    xhr.data = file;
                } else {

                    //works if not set. is ok?
                    //xhr.headers.add('Content-Type', 'application/x-www-form-urlencoded');


                    file = new File([ data ], {
                        type: 'text/plain'
                    });

                    var formData = new FormData();
                    formData.append('data', file);

                    xhr.data = data; //or formData
                }
            }

            xhr.send().then(console.log.bind(console, 'resolved'), console.log.bind(console, 'rejected'), console.log.bind(console, 'updated'));

            return xhr;
        };

        window.xupload = function () {
            return window.xrequest(xs.transport.xhr.Method.POST, 'http://localhost:3000/upload', true);
        };

        window.xdownload = function () {
            return window.xrequest(xs.transport.xhr.Method.GET, 'http://localhost:3000/download');
        };

        window.xrevert = function () {
            return window.xrequest(xs.transport.xhr.Method.POST, 'http://localhost:3000/revert', true);
        };

    });
});