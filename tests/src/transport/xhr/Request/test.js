/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.xhr.Request', function () {

    'use strict';

    var data = (function () {
        var length = 1e6;
        var data = '';

        for (var i = 0; i < length; i++) {
            data += 'abcdefghijklmntoprst';
        }

        return data;
    })();

    var server = 'http://localhost:3000';

    test('method', function () {
        var me = this;

        var request;

        //method must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        request.send();

        throws(function () {
            request.method = xs.transport.xhr.Method.GET;
        });

        //must be valid xs.transport.xhr.Method element
        request = new xs.transport.xhr.Request();
        throws(function () {
            request.method = 'TRACE';
        });

        //is implemented correctly
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.PUT;
        request.url = new xs.uri.HTTP(server + '/echo', xs.uri.query.QueryString);
        strictEqual(request.method, xs.transport.xhr.Method.PUT);
        request.send().then(function (response) {

            //validate echoed method
            strictEqual(response.headers.at('x-request-method'), xs.transport.xhr.Method.PUT);

            me.done();
        }, function () {

            //handle fail
            strictEqual(true, false, 'request failed');

            me.done();
        });

        return false;
    });

    test('url', function () {
        var me = this;

        var request;

        //url must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        request.send();

        throws(function () {
            request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        });

        //must be xs.uri.HTTP instance
        request = new xs.transport.xhr.Request();
        throws(function () {
            request.url = 'localhost';
        });

        //is implemented correctly
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP(server + '/echo', xs.uri.query.QueryString);
        strictEqual(request.url.toString(), server + '/echo');
        request.send().then(function (response) {

            //validate echoed uri
            strictEqual(response.headers.at('x-request-uri'), '/echo');

            me.done();
        }, function () {

            //handle fail
            strictEqual(true, false, 'request failed');

            me.done();
        });

        return false;
    });

    test('user', function () {
        var request;

        //url must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        request.user = 'max';
        request.send();

        throws(function () {
            request.user = 'max';
        });

        //must be a string
        request = new xs.transport.xhr.Request();
        throws(function () {
            request.user = null;
        });

        //is implemented correctly
        request = new xs.transport.xhr.Request();
        request.user = 'max';
        strictEqual(request.user, 'max');
    });

    test('password', function () {
        var request;

        //url must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        request.password = 'max';
        request.send();

        throws(function () {
            request.password = 'max';
        });

        //must be a string
        request = new xs.transport.xhr.Request();
        throws(function () {
            request.password = null;
        });

        //is implemented correctly
        request = new xs.transport.xhr.Request();
        request.password = 'max';
        strictEqual(request.password, 'max');
    });

    test('data', function () {
        expect(0);
        //must be set when request is unsent
        //must be of valid type
        //every type is implemented correctly
    });

    test('type', function () {
        expect(0);
        //must be set when request is unsent
        //must be valid xs.transport.xhr.Type element
        //every type is implemented correctly
    });

    test('headers', function () {
        var me = this;

        var request;

        //headers must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP(server + '/echo', xs.uri.query.QueryString);
        request.headers.add('x-custom-header', 'custom header value');

        //is implemented correctly
        strictEqual(JSON.stringify(request.headers.toSource()), '{"x-custom-header":"custom header value"}');
        request.send().then(function (response) {

            //validate echoed header
            strictEqual(response.headers.at('x-custom-header'), 'custom header value');

            me.done();
        }, function () {

            //handle fail
            strictEqual(true, false, 'request failed');

            me.done();
        });

        return false;
    });

    test('timeout', function () {
        var me = this;

        var request;

        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP('', xs.uri.query.QueryString);
        request.timeout = 50;

        //timeout must be a positive number
        throws(function () {
            request.timeout = '10';
        });
        throws(function () {
            request.timeout = -1;
        });

        request.send();

        //timeout must be set when request is unsent
        throws(function () {
            request.timeout = 10;
        });

        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP(server + '/long', xs.uri.query.QueryString);
        request.timeout = 10;


        //is implemented correctly
        var timedOut = false;
        strictEqual(request.timeout, 10);
        request.on(xs.transport.xhr.event.Timeout, function () {
            //request must be timed out
            me.done();
            timedOut = true;
        });
        request.send().always(function () {
            if (timedOut) {
                return;
            }

            //handle fail
            strictEqual(true, false, 'request failed');

            me.done();
        });

        return false;
    });

    test('credentials', function () {
        var me = this;

        var request;

        //credentials flag must be set when request is unsent
        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP(server + '/echo', xs.uri.query.QueryString);
        request.credentials = true;

        //credentials must be a boolean
        throws(function () {
            request.credentials = '10';
        });

        request.send();

        //credentials must be set when request is unsent
        throws(function () {
            request.credentials = false;
        });

        request = new xs.transport.xhr.Request();
        request.method = xs.transport.xhr.Method.GET;
        request.url = new xs.uri.HTTP(server + '/credentials', xs.uri.query.QueryString);
        var cookie = 'custom=demo';
        request.headers.add('cookies', cookie);
        request.credentials = true;


        //is implemented correctly
        strictEqual(request.credentials, true);
        request.send().then(function (response) {

            request = new xs.transport.xhr.Request();
            request.method = xs.transport.xhr.Method.GET;
            request.url = new xs.uri.HTTP(server + '/credentials', xs.uri.query.QueryString);
            request.credentials = true;


            request.send().then(function (response) {

                //validate echoed header
                strictEqual(response.headers.at('cookies'), cookie);

                me.done();
            }, function () {

                //handle fail
                strictEqual(true, false, 'request failed');

                me.done();
            });

        }, function () {

            //handle fail
            strictEqual(true, false, 'request failed');

            me.done();
        });

        return false;
    });

    test('state', function () {
        expect(0);
        //must be set when request is unsent
        //must be a string
        //changes correctly during request
    });

    test('send', function () {
        expect(0);
        //request must be unsent
        //headers are applied (server returns headers)
        //data may be sent with POST/PUT method only
        //send returns promise
    });

    test('abort', function () {
        expect(0);
        //must be called when request is sent
    });

    test('demo', function () {
        expect(0);

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