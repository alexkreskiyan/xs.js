/**
 * xs.js XHR implementation part - request class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.Request
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Request', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr';

    Class.imports = [
        {
            Method: 'ns.Method'
        },
        {
            Response: 'ns.Response'
        },
        {
            State: 'ns.State'
        },
        {
            Type: 'ns.Type'
        },
        {
            Url: 'xs.uri.HTTP'
        },
        {
            'event.Abort': 'ns.event.Abort'
        },
        {
            'event.Done': 'ns.event.Done'
        },
        {
            'event.Error': 'ns.event.Error'
        },
        {
            'event.Headers': 'ns.event.Headers'
        },
        {
            'event.Load': 'ns.event.Load'
        },
        {
            'event.LoadProgress': 'ns.event.LoadProgress'
        },
        {
            'event.Timeout': 'ns.event.Timeout'
        },
        {
            'event.Upload': 'ns.event.Upload'
        },
        {
            'event.UploadProgress': 'ns.event.UploadProgress'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        //create XMLHttpRequest object
        me.private.xhr = new XMLHttpRequest();

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);

        //set defaults
        me.private.method = imports.Method.GET;
        me.private.type = imports.Type.Text;
        me.private.headers = new xs.core.Collection();
        me.private.timeout = 0;
        me.private.credentials = false;
        me.private.state = imports.State.Unsent;
    };

    Class.property.method = {
        set: function (method) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'method:set - request must not be sent to set method');

            //assert, that method is defined in imports.Method
            self.assert.ok(imports.Method.has(method), 'method:set - given unknown method `$method`', {
                $method: method
            });

            me.private.method = method;
        }
    };

    Class.property.url = {
        set: function (url) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'method:set - request must not be sent to set url');

            //assert, that url is instance of imports.Url
            self.assert.ok(url instanceof imports.Url, 'url:set - given url `$url` is not an instance of `$Url`', {
                $url: url,
                $Url: imports.Url
            });

            this.private.url = url;
        }
    };

    Class.property.data = {
        set: function (data) {
            var me = this;

            if (!xs.isDefined(data)) {
                delete me.private.data;

                return;
            }

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'data:set - request must not be sent to set data');

            //assert, that data is acceptable
            self.assert.ok([
                data instanceof ArrayBuffer,
                data instanceof Int8Array,
                data instanceof Uint8Array,
                data instanceof Int16Array,
                data instanceof Uint16Array,
                data instanceof Int32Array,
                data instanceof Uint32Array,
                data instanceof Float32Array,
                data instanceof Float64Array,
                data instanceof Blob,
                data instanceof Document,
                xs.isString(data),
                data instanceof FormData
            ].indexOf(true) >= 0, 'data:set - given data `$data` can not be sent with XMLHttpRequest. Use ArrayBuffer/ArrayBufferView/Blob/Document/DOMString/FormData');

            //set data
            me.private.data = data;
        }
    };

    Class.property.type = {
        set: function (type) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'method:set - request must not be sent to set response type');

            //assert, that method is defined in imports.Type
            self.assert.ok(imports.Type.has(type), 'type:set - given unknown type `$type`', {
                $type: type
            });

            me.private.type = type;
        }
    };

    Class.property.headers = {
        set: xs.noop
    };

    Class.property.timeout = {
        set: function (timeout) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'method:set - request must not be sent to set timeout');

            //assert, that timeout is a number
            self.assert.number(timeout, 'timeout:set - given timeout `$timeout` is not a number', {
                $timeout: timeout
            });

            //assert, that timeout is a positive number
            self.assert.ok(timeout >= 0, 'timeout:set - given timeout `$timeout` is negative', {
                $timeout: timeout
            });

            me.private.timeout = timeout;
        }
    };

    Class.property.credentials = {
        set: function (credentials) {
            var me = this;

            //assert, that request is not sent yet
            self.assert.equal(me.private.state, imports.State.Unsent, 'method:set - request must not be sent to set credentials flag');

            //assert, that timeout is a number
            self.assert.boolean(credentials, 'credentials:set - given credentials `$credentials` are not a boolean', {
                $credentials: credentials
            });

            me.private.credentials = credentials;
        }
    };

    Class.property.state = {
        set: xs.noop
    };

    Class.method.send = function () {
        var me = this;

        //assert, that request is not sent yet
        self.assert.equal(me.private.state, imports.State.Unsent, 'send - request must not be sent yet');

        //assert, that method is specified
        self.assert.defined(me.private.method, 'send - request method is not specified');

        //assert, that url is specified
        self.assert.defined(me.private.url, 'send - request url is not specified');

        //assert, that request is either POST or PUT when data given
        self.assert.ok(!me.private.data || me.private.method === imports.Method.POST || me.private.method === imports.Method.PUT, 'send - can not send data with method `$method`', {
            $method: imports.Method.keyOf(me.private.method)
        });

        //set request state
        me.private.state = imports.State.UploadStarted;


        //get xhr reference
        var xhr = me.private.xhr;

        //create state object
        var state = {
            response: new imports.Response(me),
            promise: new xs.core.Promise(),
            send: me.private.stream.send,
            private: me.private
        };


        //add upload listeners
        xhr.upload.onprogress = xs.bind(handleUploadProgress, state);
        xhr.upload.onabort = xs.bind(handleUploadAbort, state);
        xhr.upload.ontimeout = xs.bind(handleUploadTimeout, state);
        xhr.upload.onerror = xs.bind(handleUploadError, state);
        xhr.upload.onload = xs.bind(handleUpload, state);

        //catch headers received moment
        xhr.onreadystatechange = xs.bind(handleHeadersReceived, state);

        //add load listeners
        xhr.onprogress = xs.bind(handleLoadProgress, state);
        xhr.onabort = xs.bind(handleAbort, state);
        xhr.ontimeout = xs.bind(handleTimeout, state);
        xhr.onerror = xs.bind(handleError, state);
        xhr.onload = xs.bind(handleLoad, state);
        xhr.onloadend = xs.bind(handleDone, state);


        //open request
        xhr.open(me.private.method, me.private.url.toString(), true);

        //set headers
        me.private.headers.each(function (value, header) {
            xhr.setRequestHeader(header, value);
        });

        //set xhr options
        xhr.timeout = me.private.timeout;
        xhr.responseType = me.private.type;
        xhr.withCredentials = me.private.credentials;


        //send request
        if (me.private.data) {
            xhr.send(me.private.data);
        } else {
            xhr.send();
        }

        return state.promise;
    };

    Class.method.abort = function () {
        var me = this;

        //assert, that request is sent
        self.assert.ok(me.private.state !== imports.State.Unsent, 'abort - request must be sent to abort it');

        //abort request
        me.private.xhr.abort();
    };


    var handleUploadProgress = function (event) {
        var me = this;

        //set request state
        me.private.state = imports.State.Uploading;

        //send event
        me.send(new imports.event.UploadProgress({
            loaded: event.loaded,
            total: event.total
        }));
    };

    var handleUploadAbort = function () {
        var me = this;

        //set request state
        me.private.state = imports.State.Aborted;

        //send event
        me.send(new imports.event.Abort(me.response));
    };

    var handleUploadError = function () {
        var me = this;

        //set request state
        me.private.state = imports.State.Crashed;

        //send event
        me.send(new imports.event.Error(me.response));
    };

    var handleUploadTimeout = function () {
        var me = this;

        //set request state
        me.private.state = imports.State.TimedOut;

        //send event
        me.send(new imports.event.Timeout(me.response));
    };

    var handleUpload = function () {
        var me = this;

        //set request state
        me.private.state = imports.State.Uploaded;

        //send event
        me.send(new imports.event.Upload());
    };

    var handleHeadersReceived = function () {
        var me = this;

        var xhr = me.response.private.request.private.xhr;

        if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) {

            return;
        }

        //set request state - headers received
        me.private.state = imports.State.HeadersReceived;


        //set response headers
        var headersString = xhr.getAllResponseHeaders().trim();
        var headers = {};

        if (headersString) {
            var rawHeaders = xhr.getAllResponseHeaders().trim().split('\r\n');

            for (var i = 0; i < rawHeaders.length; i++) {
                var header = rawHeaders[ i ].split(':');
                headers[ header[ 0 ].trim() ] = header[ 1 ].trim();
            }
        }

        me.response.private.headers = new xs.core.Collection(headers);


        //send event
        me.send(new imports.event.Headers(me.response));
    };

    var handleLoadProgress = function (event) {
        var me = this;

        //set request state - response is loading
        me.private.state = imports.State.Loading;

        //send event
        me.send(new imports.event.LoadProgress({
            loaded: event.loaded,
            total: event.total
        }));
    };

    var handleDone = function () {
        var me = this;

        //send event
        me.send(new imports.event.Done(me.response));
    };

    var handleLoad = function () {
        var me = this;

        //set request state - response is loaded
        me.private.state = imports.State.Loaded;

        //send event
        me.send(new imports.event.Load(me.response));

        //resolve promise
        me.promise.resolve(me.response);
    };

    var handleAbort = function () {
        var me = this;

        //set request state - request is aborted
        me.private.state = imports.State.Aborted;

        //send event
        me.send(new imports.event.Abort(me.response));

        //reject promise
        me.promise.reject(me.response);
    };

    var handleError = function () {
        var me = this;

        //set request state - request crashed
        me.private.state = imports.State.Crashed;

        //send event
        me.send(new imports.event.Error(me.response));

        //reject promise
        me.promise.reject(me.response);
    };

    var handleTimeout = function () {
        var me = this;

        //set request state - request timed out
        me.private.state = imports.State.TimedOut;

        //send event
        me.send(new imports.event.Timeout(me.response));

        //reject promise
        me.promise.reject(me.response);
    };

});