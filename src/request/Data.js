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
 * @class xs.request.Data represents request data object
 */
'use strict';
xs.define('xs.request.Data', function () {

    return {
        constructor: function () {
            var me = this;
            me.__set('items', {});
        },
        properties: {
            method: {
                set: function (method) {
                    var me = this;

                    if (!xs.isString(method)) {
                        return;
                    }

                    method = method.toLowerCase();
                    xs.Array.has(methods, method) && me.__set('method', method);

                    me.url && syncParams(me, 'method');
                },
                default: 'get'
            },
            url: {
                set: function (url) {
                    var me = this;

                    if (xs.isString(url)) {
                        url = xs.create('xs.uri.Url', {url: url});
                    } else if (xs.isObject(url)) {
                        url = xs.create('xs.uri.Url', url);
                    } else if (!xs.is(url, xs.uri.Url)) {
                        var loc = xs.location;
                        url = xs.create('xs.uri.Url', {
                            url: loc.protocol + '//' + loc.host + (loc.port ? ':' + loc.port : '') + loc.pathname + loc.search + loc.hash
                        });
                    }
                    me.__set('url', url);

                    syncParams(me, 'url');

                    setRequest(me);
                }
            },
            params: {
                set: function (params) {
                    var me = this;

                    if (!xs.isObject(params)) {
                        return;
                    }

                    me.__set('params', params);
                    syncParams(me, 'params');
                }
            },
            user: {
                set: function (user) {
                    var me = this;
                    if (xs.isString(user)) {
                        me.__set('user', user);
                    } else if (!user) {
                        me.__set('user', null);
                    }
                }
            },
            password: {
                set: function (password) {
                    var me = this;
                    if (xs.isString(password)) {
                        me.__set('password', password);
                    } else if (!password) {
                        me.__set('password', null);
                    }
                }
            },
            async: {
                set: function (async) {
                    xs.isDefined(async) && this.__set('async', Boolean(async));
                },
                default: true
            },
            credentials: {
                set: function (credentials) {
                    xs.isDefined(credentials) && this.__set('credentials', Boolean(credentials));
                },
                default: false
            },
            headers: {
                set: function (headers) {
                    xs.isObject(headers) && this.__set('headers', headers);
                }
            },
            timeout: {
                set: function (timeout) {
                    var me = this;
                    xs.isNumeric(timeout) && me.__set('timeout', Number(timeout));
                    me.xhr && (me.xhr.timeout = me.__get('timeout'));
                },
                default: 30000
            },
            timeoutId: 0,
            xhr: {
                set: xs.emptyFn
            },
            isCrossDomain: {
                set: xs.emptyFn
            },
            isXhr: {
                set: xs.emptyFn
            },
            deferred: {
                set: xs.emptyFn
            },
            postContentType: {
                set: function (postContentType) {
                    xs.isString(postContentType) && this.__set('postContentType', postContentType);
                },
                default: 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        },
        methods: {
            send: function () {
                var me = this,
                    data = me.method == 'get' ? '' : toQueryString(me.params, false);

                open(me);

                me.isCrossDomain && me.isXhr && (me.xhr.withCredentials = me.credentials);

                setHeaders(me);
                setEventHandlers(me);

                me.timeoutId = setTimeout(function () {
                    me.abort(true);
                }, me.timeout);

                me.xhr.send(data);

                return me.deferred.promise;
            },
            abort: function (timedOut) {
                var me = this;
                me.deferred.reject(Boolean(timedOut));
            }
        }
    };
});