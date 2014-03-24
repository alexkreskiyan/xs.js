/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * The Connection class encapsulates a connection to the page's originating domain, allowing requests to be made either
 * to a configured URL, or to a URL specified at request time.
 *
 * Requests made by this class are asynchronous, and will return immediately. No data from the server will be available
 * to the statement immediately following the {@link #request} call.
 */
xs.define('xs.data.Connection', {
    requires: ['xs.promise.Deferred'],
    statics: {
        /**
         * @property requestId {Integer} counter
         */
        requestId: 0
    },
    constructor: function (config) {
        config = config || {};
        xs.extend(this, config);
        this.requests = {};
    },
    properties: {
        /**
         * @cfg {String} request URL
         */
        url: null,
        /**
         * @cgf {Boolean} whether request should be async
         */
        async: true,
        /**
         * @cfg {String} The default HTTP method to be used for requests: GET,POST,DELETE,PUT, etc
         *
         * If not set, but {@link #request} params are present, POST will be used;
         * otherwise, GET will be used.
         */
        method: 'GET',
        /**
         * @cfg {String} username for auth
         */
        username: '',
        /**
         * @cfg {String} password for auth
         */
        password: '',
        /**
         * @cfg {Boolean} disableCaching
         * True to add a unique cache-buster param to GET requests.
         */
        disableCaching: true,
        /**
         * @cfg {Boolean} withCredentials
         * True to set `withCredentials = true` on the XHR object
         */
        withCredentials: false,
        /**
         * @cfg {Boolean} cors
         * True to enable CORS support on the XHR object. Currently the only effect of this option
         * is to use the XDomainRequest object instead of XMLHttpRequest if the browser is IE8 or above.
         */
        cors: false,
        /**
         * @property {Boolean} whether request is XDomainRequest or XMLHttpRequest
         */
        isXdr: false,
        /**
         * @property {String} default content type for XDR
         */
        defaultXdrContentType: 'text/plain',
        /**
         * @cfg {Number} timeout
         * The timeout in milliseconds to be used for requests.
         */
        timeout: 30000,
        /**
         * @cfg {Object} extraParams
         * Any parameters to be appended to the request.
         */
        extraParams: null,
        /**
         * @cfg {Boolean} [autoAbort=false]
         * Whether this request should abort any pending requests.
         */
        autoAbort: false,
        /**
         * @cfg {Object} defaultHeaders
         * An object containing request headers which are added to each request made by this object.
         */
        defaultHeaders: {},

        defaultPostHeader: 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader: true,
        defaultXhrHeader: 'XMLHttpRequest'
    },
    methods: {
        /**
         * Sends an HTTP request to a remote server.
         *
         * **Important:** Ajax server requests are asynchronous, and this call will
         * return before the response has been received. Process any returned data
         * in a callback function.
         *
         *     xs.Ajax.request({
         *         url: 'ajax_demo/sample.json',
         *         success: function(response, opts) {
         *             var obj = Ext.decode(response.responseText);
         *             console.dir(obj);
         *         },
         *         failure: function(response, opts) {
         *             console.log('server-side failure with status code ' + response.status);
         *         }
         *     });
         *
         * To execute a callback function in the correct scope, use the `scope` option.
         *
         * @param {Object} options An object which may contain the following properties:
         *
         * (The options object may also contain any other property which might be needed to perform
         * postprocessing in a callback because it is passed to callback functions.)
         *
         * @param {String/Function} options.url The URL to which to send the request, or a function
         * to call which returns a URL string. The scope of the function is specified by the `scope` option.
         * Defaults to the configured `url`.
         *
         * @param {Object/String/Function} options.params An object containing properties which are
         * used as parameters to the request, a url encoded string or a function to call to get either. The scope
         * of the function is specified by the `scope` option.
         *
         * @param {String} options.method The HTTP method to use
         * for the request. Defaults to the configured method, or if no method was configured,
         * "GET" if no parameters are being sent, and "POST" if parameters are being sent.  Note that
         * the method name is case-sensitive and should be all caps.
         *
         * @param {Number} options.timeout The timeout in milliseconds to be used for this request.
         * Defaults to 30 seconds.
         *
         * @param {Object} options.headers Request headers to set for the request.
         *
         * @param {Boolean} options.withCredentials True to add the withCredentials property to the XHR object
         *
         * @return {Object} The request object. This may be used to cancel the request.
         */
        request: function (options) {
            options = options || {};
            var me = this,
                scope = options.scope || window,
                username = options.username || me.username,
                password = options.password || me.password || '',
                async,
                requestOptions,
                request,
                headers,
                xhr;

            requestOptions = me.setOptions(options, scope);

            // if autoAbort is set, cancel the current transactions
            if (options.autoAbort || me.autoAbort) {
                me.abort();
            }

            // create a connection object
            async = options.async !== false ? (options.async || me.async) : false;
            xhr = me.openRequest(options, requestOptions, async, username, password);

            // XDR doesn't support setting any headers
            if (!me.isXdr) {
                headers = me.setupHeaders(xhr, options, requestOptions.data);
            }

            // create the transaction object
            request = {
                id: ++xs.data.Connection.requestId,
                xhr: xhr,
                headers: headers,
                options: options,
                async: async,
                timeout: setTimeout(function () {
                    request.timedout = true;
                    me.abort(request);
                }, options.timeout || me.timeout)
            };
            async && (request.deferred = xs.create('xs.promise.Deferred'));

            me.requests[request.id] = request;
            me.latestId = request.id;
            // bind our stateChange listener
            if (async && !me.isXdr) {
                xhr.onreadystatechange = xs.bind(me.stateChange, me, [request]);
            }

            if (me.isXdr) {
                me.processXdrRequest(request, xhr);
            }

            // start the request!
            xhr.send(requestOptions.data);
            if (!async) {
                return me.complete(request);
            }

            //save deferred promise instead deferred
            request.promise = request.deferred.promise;
            delete request.deferred;

            return request;
        },
        /**
         * process XDR request
         * @param request
         * @param xhr
         */
        processXdrRequest: function (request, xhr) {
            var me = this;

            // Mutate the request object as per XDR spec.
            delete request.headers;

            request.contentType = request.options.contentType || me.defaultXdrContentType;

            xhr.onload = xs.bind(me.stateChange, me, [request, true]);
            xhr.onerror = xhr.ontimeout = xs.bind(me.stateChange, me, [request, false]);
        },

        /**
         * process XDR response
         * @param response
         * @param xhr
         */
        processXdrResponse: function (response, xhr) {
            // Mutate the response object as per XDR spec.
            response.getAllResponseHeaders = function () {
                return [];
            };
            response.getResponseHeader = function () {
                return '';
            };
            response.contentType = xhr.contentType || this.defaultXdrContentType;
        },

        /**
         * Sets various options such as the url, params for the request
         * @param {Object} options The initial options
         * @param {Object} scope The scope to execute in
         * @return {Object} The params for the request
         */
        setOptions: function (options, scope) {
            var me = this,
                params = options.params || {},
                url = options.url || me.url,
                method;


            // allow params to be a method that returns the params object
            if (xs.isFunction(params)) {
                params = params.call(scope, options);
            }

            // allow url to be a method that returns the actual url
            if (xs.isFunction(url)) {
                url = url.call(scope, options);
            }

            //<debug>
            if (!url) {
                throw new Error('No URL specified');
            }
            //</debug>

            // make sure params are a url encoded string and include any extraParams if specified
            if (xs.isObject(params)) {
                params = xs.toQueryString(params);
            }

            // decide the proper method for this request
            method = (options.method || me.method).toUpperCase();

            // if the method is get or there is json/xml data append the params to the url
            if (method == 'GET' && params) {
                url = xs.urlAppend(url, params);
                params = null;
            }

            return {
                url: url,
                method: method,
                data: params || null
            };
        },

        /**
         * Setup all the headers for the request
         * @private
         * @param {Object} xhr The xhr object
         * @param {Object} options The options for the request
         * @param {Object} data The data for the request
         */
        setupHeaders: function (xhr, options, data) {
            var me = this,
                headers = xs.extend({}, options.headers || {}, me.defaultHeaders || {}),
                contentType = me.defaultPostHeader;

            if (!headers['Content-Type'] && data) {
                headers['Content-Type'] = contentType;
            }

            if (me.useDefaultXhrHeader && !headers['X-Requested-With']) {
                headers['X-Requested-With'] = me.defaultXhrHeader;
            }
            // set up all the request headers on the xhr object
            xs.each(headers, function (header, name) {
                xhr.setRequestHeader(name, header);
            });
            return headers;
        },

        /**
         * Creates the appropriate XHR transport for a given request on this browser. On IE
         * this may be an `XDomainRequest` rather than an `XMLHttpRequest`.
         * @private
         */
        newRequest: function (options) {
            var me = this,
                xhr;

            if ((options.cors || me.cors) && window.XDomainRequest) {
                xhr = me.getXdrInstance();
                me.isXdr = true;
            } else {
                xhr = me.getXhrInstance();
            }

            return xhr;
        },

        /**
         * Creates and opens an appropriate XHR transport for a given request on this browser.
         * This logic is contained in an individual method to allow for overrides to process all
         * of the parameters and options and return a suitable, open connection.
         * @private
         */
        openRequest: function (options, requestOptions, async, username, password) {
            var me = this,
                xhr = me.newRequest(options);

            if (username) {
                xhr.open(requestOptions.method, requestOptions.url, async, username, password);
            } else {
                if (me.isXdr) {
                    xhr.open(requestOptions.method, requestOptions.url);
                } else {
                    xhr.open(requestOptions.method, requestOptions.url, async);
                }
            }

            if (options.withCredentials || me.withCredentials) {
                xhr.withCredentials = true;
            }

            return xhr;
        },

        /**
         * Creates the appropriate XDR transport for this browser.
         * - IE 7 and below don't support CORS
         * - IE 8 and 9 support CORS with native XDomainRequest object
         * - IE 10 (and above?) supports CORS with native XMLHttpRequest object
         * @private
         */
        getXdrInstance: function () {
            return new XDomainRequest();
        },

        /**
         * Creates the appropriate XHR transport for this browser.
         * @private
         */
        getXhrInstance: function () {
            return new XMLHttpRequest();
        },

        /**
         * Determines whether this object has a request outstanding.
         * @param {Object} [request] Defaults to the last transaction
         * @return {Boolean} True if there is an outstanding request.
         */
        isLoading: function (request) {
            request = request || this.getLatest();

            if (!(request && request.xhr)) {
                return false;
            }

            // if there is a connection and readyState is not 0 or 4
            var state = request.xhr.readyState;
            return state !== 0 && state !== 4;
        },

        /**
         * Aborts an active request.
         * @param {Object} [request] Defaults to the last request
         */
        abort: function (request) {
            var me = this;

            request = request || this.getLatest();

            if (!request || !me.isLoading(request)) {
                return;
            }
            /*
             * Clear out the onreadystatechange here, this allows us
             * greater control, the browser may/may not fire the function
             * depending on a series of conditions.
             */
            var xhr = request.xhr;
            xhr.onreadystatechange = null;
            xhr.abort();
            me.clearTimeout(request);
            if (!request.timedout) {
                request.aborted = true;
            }
            var response = me.complete(request);
            response.ok ? request.deferred.resolve(response) : request.deferred.reject(response.statusText);

            me.cleanup(request);
        },

        /**
         * Gets the most recent request
         * @private
         * @return {Object} The request. Null if there is no recent request
         */
        getLatest: function () {
            var id = this.latestId,
                request;

            if (id) {
                request = this.requests[id];
            }
            return request || null;
        },

        /**
         * Fires when the state of the xhr changes
         * @private
         * @param {Object} request The request
         * @param {Boolean} xdrResult
         */
        stateChange: function (request, xdrResult) {
            var me = this;

            // Using CORS with IE doesn't support readyState so we fake it
            if ((request.xhr && request.xhr.readyState == 4) || me.isXdr) {
                me.clearTimeout(request);
                var response = me.complete(request, xdrResult);
                response.ok ? request.deferred.resolve(response) : request.deferred.reject(response.statusText);
                me.cleanup(request);
            }
        },

        /**
         * Clears the timeout on the request
         * @private
         * @param {Object} request The request
         */
        clearTimeout: function (request) {
            clearTimeout(request.timeout);
            delete request.timeout;
        },

        /**
         * Cleans up any left over information from the request
         * @private
         * @param {Object} request The request
         */
        cleanup: function (request) {
            request.xhr = null;
            delete request.xhr;
        },

        /**
         * To be called when the request has come back from the server
         * @private
         * @param request {Object}
         * @param xdrResult {Boolean}
         * @returns {*}
         */
        complete: function (request, xdrResult) {
            var me = this,
                result,
                success,
                response;

            try {
                result = me.parseStatus(request.xhr.status);
            } catch (e) {
                // in some browsers we can't access the status if the readyState is not 4, so the request has failed
                result = {
                    success: false,
                    isException: false
                };

            }
            success = me.isXdr ? xdrResult : result.success;

            if (success) {
                response = me.createResponse(request);
                //deferred here
            } else {
                if (result.isException || request.aborted || request.timedout) {
                    response = me.createException(request);
                } else {
                    response = me.createResponse(request);
                }
                //deferred here
            }
            delete me.requests[request.id];
            return response;
        },

        /**
         * Checks if the response status was successful
         * @param {Number} status The status code
         * @return {Object} An object containing success/status state
         */
        parseStatus: function (status) {
            // see: https://prototype.lighthouseapp.com/projects/8886/tickets/129-ie-mangles-http-response-status-code-204-to-1223
            status = status == 1223 ? 204 : status;

            var success = (status >= 200 && status < 300) || status == 304,
                isException = false;

            if (!success) {
                switch (status) {
                    case 12002:
                    case 12029:
                    case 12030:
                    case 12031:
                    case 12152:
                    case 13030:
                        isException = true;
                        break;
                }
            }
            return {
                success: success,
                isException: isException
            };
        },

        /**
         * Creates the response object
         * @private
         * @param {Object} request
         */
        createResponse: function (request) {
            var me = this,
                xhr = request.xhr,
                isXdr = me.isXdr,
                headers = {},
                lines = isXdr ? [] : xhr.getAllResponseHeaders().replace(/\r\n/g, '\n').split('\n'),
                response;

            xs.eachReverse(lines, function (line) {
                var index = line.indexOf(':');
                if (index < 0) {
                    return;
                }
                var key = line.substr(0, index).toLowerCase();
                if (line.charAt(index + 1) == ' ') {
                    ++index;
                }
                headers[key] = line.substr(index + 1);
            });

            request.xhr = null;
            delete request.xhr;

            response = {
                request: request,
                requestId: request.id,
                status: xhr.status,
                statusText: xhr.statusText,
                getResponseHeader: function (header) {
                    return headers[header.toLowerCase()];
                },
                getAllResponseHeaders: function () {
                    return headers;
                },
                ok: true
            };

            if (isXdr) {
                me.processXdrResponse(response, xhr);
            }

            response.responseText = xhr.responseText;
            response.responseXML = xhr.responseXML;

            // If we don't explicitly tear down the xhr reference, IE6/IE7 will hold this in the closure of the
            // functions created with getResponseHeader/getAllResponseHeaders
            xhr = null;
            return response;
        },

        /**
         * Creates the exception object
         * @private
         * @param {Object} request
         */
        createException: function (request) {
            return {
                request: request,
                requestId: request.id,
                status: request.aborted ? -1 : 0,
                statusText: request.aborted ? 'transaction aborted' : 'communication failure',
                aborted: request.aborted,
                timedout: request.timedout,
                ok: false
            };
        }

    }

});
