/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.http.Request', function () {

    'use strict';

    var bigData = (function () {
        var length = 1e3;
        var data = '';

        for (var i = 0; i < length; i++) {
            data += 'someRandomText';
        }

        return data;
    })();

    var server = 'http://localhost:3000';

    test('method', function () {
        var me = this;

        var request;

        //method must be set when request is unsent
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.send();

        throws(function () {
            request.method = xs.transport.http.Method.GET;
        });

        //must be valid xs.transport.http.Method element
        request = new xs.transport.http.Request();
        throws(function () {
            request.method = 'TRACE';
        });

        //is implemented correctly
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.PUT;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        strictEqual(request.method, xs.transport.http.Method.PUT);
        request.send().then(function (response) {

            //validate echoed method
            strictEqual(response.headers.at('x-request-method'), xs.transport.http.Method.PUT);

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
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.send();

        throws(function () {
            request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        });

        //must be xs.uri.Http instance
        request = new xs.transport.http.Request();
        throws(function () {
            request.url = 'localhost';
        });

        //is implemented correctly
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
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

    test('data', function () {
        var me = this;

        var request;
        var promises = [];

        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        //data must be of accepted type
        throws(function () {
            request.data = 10;
        });

        request.send();

        //data must be set when request is unsent
        throws(function () {
            request.data = '';
        });


        var raw = '<label>demo</label>';
        var length = raw.length;
        var data, view, i;


        //verify ArrayBuffer sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        request.data = data = new ArrayBuffer(length);
        view = new Uint8Array(data);

        for (i = 0; i < length; i++) {
            view[ i ] = raw.charCodeAt(i);
        }

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify ArrayBufferView sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        data = new ArrayBuffer(length);
        request.data = view = new Uint8Array(data);

        for (i = 0; i < length; i++) {
            view[ i ] = raw.charCodeAt(i);
        }

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify Blob sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        request.data = new Blob([ data ], {
            type: 'text/plain'
        });

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify Document sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        request.data = (new DOMParser()).parseFromString(raw, 'text/xml');

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify String sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        request.data = raw;

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify FormData sending
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        request.data = new FormData();
        request.data.append('raw', raw);


        promises.push(request.send().then(function (response) {
            strictEqual(response.body.indexOf(raw) > 0, true);
        }));


        xs.core.Promise.all(promises).then(function () {
            me.done();
        });

        return false;
    });

    test('type', function () {
        var me = this;

        var request;
        var promises = [];

        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        //data must be of accepted type
        throws(function () {
            request.type = 10;
        });

        request.send();

        //data must be set when request is unsent
        throws(function () {
            request.type = xs.transport.http.Type.ArrayBuffer;
        });


        var raw = JSON.stringify({
            a: 1
        });


        //verify String receiving
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.data = raw;

        request.type = xs.transport.http.Type.Text;

        promises.push(request.send().then(function (response) {
            strictEqual(response.body, raw);
        }));


        //verify ArrayBuffer receiving
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.data = raw;

        request.type = xs.transport.http.Type.ArrayBuffer;

        promises.push(request.send().then(function (response) {
            var array = new Uint8Array(response.body);
            var data = '';

            for (var i = 0; i < array.length; i++) {
                data += String.fromCharCode(array[ i ]);
            }
            strictEqual(data, raw);
        }));


        //verify Blob receiving
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.data = raw;

        request.type = xs.transport.http.Type.Blob;

        promises.push(request.send().then(function (response) {
            var promise = new xs.core.Promise();

            var reader = new FileReader();
            reader.onload = function () {
                strictEqual(reader.result, raw);
                promise.resolve();
            };
            reader.readAsText(response.body);

            return promise;
        }));


        //verify JSON receiving
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.data = raw;

        request.type = xs.transport.http.Type.JSON;

        promises.push(request.send().then(function (response) {
            strictEqual(JSON.stringify(response.body), raw);
        }));


        xs.core.Promise.all(promises).then(function () {
            me.done();
        });

        return false;
    });

    test('headers', function () {
        var me = this;

        var request;

        //headers must be set when request is unsent
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
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

        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
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

        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/long', xs.uri.query.QueryString);
        request.timeout = 10;


        //is implemented correctly
        var timedOut = false;
        strictEqual(request.timeout, 10);
        request.on(xs.transport.http.event.Timeout, function () {
            timedOut = true;
        });
        request.send().always(function () {
            //request must be timed out
            strictEqual(request.state, xs.transport.http.State.TimedOut, 'request failed');
            strictEqual(timedOut, true, 'request failed');

            me.done();
        });

        return false;
    });

    test('credentials', function () {
        var me = this;

        var request;

        //credentials flag must be set when request is unsent
        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
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

        request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.GET;
        request.url = new xs.uri.Http(server + '/credentials', xs.uri.query.QueryString);
        var cookie = 'custom=demo';
        request.headers.add('cookies', cookie);
        request.credentials = true;


        //is implemented correctly
        strictEqual(request.credentials, true);
        request.send().then(function () {

            request = new xs.transport.http.Request();
            request.method = xs.transport.http.Method.GET;
            request.url = new xs.uri.Http(server + '/credentials', xs.uri.query.QueryString);
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
        var me = this;

        var state = [];

        var request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/revert', xs.uri.query.QueryString);
        request.data = bigData;

        //push current state
        state.push(request.state);

        request.on(function () {

            //if duplicate - no action
            if (state[ state.length - 1 ] === request.state) {
                return;
            }

            //push new state to log
            state.push(request.state);
        });

        request.send().then(function () {

            strictEqual(state.toString(), [
                xs.transport.http.State.Unsent,
                xs.transport.http.State.UploadStarted,
                xs.transport.http.State.Uploading,
                xs.transport.http.State.Uploaded,
                xs.transport.http.State.HeadersReceived,
                xs.transport.http.State.Loading,
                xs.transport.http.State.Loaded
            ].toString());

            me.done();
        });

        //push state after sent
        state.push(request.state);


        return false;
    });

    test('send', function () {
        var me = this;

        var request = new xs.transport.http.Request();
        request.data = 'data';

        //method is required
        throws(function () {
            request.send();
        });

        request.method = xs.transport.http.Method.GET;

        //url is required
        throws(function () {
            request.send();
        });

        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);

        //invalid method for data request
        throws(function () {
            request.send();
        });

        request.method = xs.transport.http.Method.POST;

        //all goes ok
        request.send().then(me.done);

        //state must be unsent
        throws(function () {
            request.send();
        });

        return false;
    });

    test('abort', function () {
        var me = this;

        var request = new xs.transport.http.Request();
        request.method = xs.transport.http.Method.POST;
        request.url = new xs.uri.Http(server + '/echo', xs.uri.query.QueryString);
        request.data = 'data';

        var aborted = false;
        request.on(xs.transport.http.event.Abort, function () {
            aborted = true;
        });
        request.send().always(function () {
            //request must be aborted
            strictEqual(request.state, xs.transport.http.State.Aborted, 'request failed');
            strictEqual(aborted, true, 'request failed');

            me.done();
        });

        request.abort();

        return false;
    });

});