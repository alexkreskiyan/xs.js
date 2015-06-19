/**
 * xs.storage.Cookie is a cookie instance, granting access to operations on concrete cookie
 *
 * @author
 *
 * @private
 *
 * @singleton
 *
 * @class xs.storage.Cookie
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Cookie', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    /**
     * Storage reference.
     *
     * @private
     *
     * @property cookies
     *
     * @type {Storage}
     */
    Class.constant.cookies = (function () {
        var cookies = {};
        var allCookies = document.cookie;

        if(allCookies === '') {
            return cookies;
        }
        var list = allCookies.split('; ');
        for (var i = 0; i< list.length; i++) {
            var cookie = list[i];
            var p = cookie.indexOf('=');
            var name = cookie.substring(0,p);
            var value = cookie.substring(p+1);
            value = decodeURIComponent(value);
            cookies[name] = value;
        }
        cookies['length'] = list.length;

        return cookies;
    }());

    /**
     * Returns all cookies keys
     *
     * @method keys
     *
     * @return {Array} cookies keys
     */
    Class.static.method.keys = function () {
        var keys = [];
        for (var key in this.cookies) {
            keys.push(key);
        }

        return keys;
    };

    /**
     * Returns the name of n-th cookie or null if n has gone beyond the range of indexes
     *
     * @method key
     *
     * @return {String} cookie name
     */
    Class.static.method.key = function (n) {
        var keys = this.keys();

        if (n <0 || n >= keys.length) {
            return null;
        }

        return keys[n];
    };

    /**
    * To obtain the existence of a cookie
    *
    * @method has
    *
    * @param {String} [name] cookie
    *
    *@return {Boolean}
    */
    Class.static.method.has = function (name) {
        var keys = this.keys();

        if (keys.length === 0) {
            return false;
        }

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === name) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns the value of the specified cookie or null
     *
     * @method get
     *
     * @param {String} [name] cookie
     *
     * @return {String} value cookie
     */
    Class.static.method.get = function (name) {
        return this.cookies[name] || null;
    };

    /**
    * Add cookie
    *
    * @method add
    *
    * @param {String} [name] cookie
    * @param {String} [value] cookie
    * @param {Object} [parameters:{
    *                    path:{String},
    *                    domain:{String},
    *                    max-age:{Number} the number of days of cookies,
    *                    expires:{String},
    *                    secure:{Boolean},
    *                    httpOnly:{Boolean}] optional. Parameters cookie
    */
    Class.static.method.add = function (name, value) {
        if (!navigator.cookieEnabled) {
            return;
        }

        if (this.has(name)) {
            return;
        }

        var parameters = arguments.length > 2 ? arguments[ 2 ] : null,
            cookie;


        if (typeof value === 'string') {
            cookie = name + '=' + encodeURIComponent(value);
        }


        if (parameters['path'] && typeof parameters['path'] === 'string') {
            cookie += '; path=' + parameters[ 'path' ];
        } else {
            cookie += '; path=/'
        }

        if (parameters['domain'] && typeof parameters['domain'] === 'string') {
            cookie += '; domain=' + parameters[ 'domain' ];
        }

        if (parameters['max-age'] && typeof parameters['max-age'] === 'number') {
            cookie += '; max-age=' + (parameters['max-age'] * 60 * 60 * 24);
        }

        if (parameters['expires'] && new Date(parameters['expires']) !== 'Invalid Date' && new Date(parameters['expires'] >= new Date())) {
            cookie += '; expires=' + parameters['expires'];
        }

        if (parameters['secure'] && typeof parameters['secure'] === 'boolean') {
            cookie += '; secure';
        }

        if (parameters['httpOnly'] && typeof parameters['httpOnly'] === 'boolean') {
            cookie += '; HttpOnly';
        }

        if (cookie !== '') {
            this.cookies[name] = value;
            this.cookies.length++;
            document.cookie = cookie;
        }
    };

    /**
     * set cookie
     *
     * @method set
     *
     * @param {String} [name] cookie
     * @param {*} [value] cookie
     * @param {Number} [daysToLive] optional. The number of days of cookies
     * @param {String} [path] optional. Restricts access to pages that match that path. Defaults to all pages
     * @param {String} [domain] optional. Configure access restrictions to the cookies with different subdomains
     * @param {Boolean} [secure] optional. If true use https Protocol used to transfer the cookies
     */
    Class.static.method.set = function (name, value) {
        if (!navigator.cookieEnabled) {
            return;
        }
        if (!this.has(name)) {
            return;
        }

        var parameters = arguments.length > 2 ? arguments[ 2 ] : null,
            cookie;


        if (typeof value === 'string') {
            cookie = name + '=' + encodeURIComponent(value);
        }


        if (parameters['path'] && typeof parameters['path'] === 'string') {
            cookie += '; path=' + parameters[ 'path' ];
        } else {
            cookie += '; path=/'
        }

        if (parameters['domain'] && typeof parameters['domain'] === 'string') {
            cookie += '; domain=' + parameters[ 'domain' ];
        }

        if (parameters['maxAge'] && typeof parameters['maxAge'] === 'number') {
            cookie += '; max-age=' + (parameters['maxAge'] * 60 * 60 * 24);
        }

        if (parameters['expires'] && new Date(parameters['expires']) !== 'Invalid Date' && new Date(parameters['expires'] >= new Date())) {
            cookie += '; expires=' + parameters['expires'];
        }

        if (parameters['secure'] && typeof parameters['secure'] === 'boolean') {
            cookie += '; secure';
        }

        if (parameters['httpOnly'] && typeof parameters['httpOnly'] === 'boolean') {
            cookie += '; HttpOnly';
        }

        if (cookie !== '') {
            this.cookies[name] = value;
            document.cookie = cookie;
        }
    };

    /**
     * Remove cookie
     *
     * @method remove
     *
     * @param {String} [name] cookie
     * @param {String} [path]
     */
    Class.static.method.remove = function () {
        var me = this;
        var name = (arguments.length > 0) ? arguments[ 0 ] : null;
        var parameters = arguments.length > 1 ? arguments[ 1 ] : null,
            cookie;

        if (parameters['path'] && typeof parameters['path'] === 'string') {
            cookie += '; path=' + parameters[ 'path' ];
        } else {
            cookie += '; path=/';
        }

        if (parameters['domain'] && typeof parameters['domain'] === 'string') {
            cookie += '; domain=' + parameters[ 'domain' ];
        }

        if (parameters['secure'] && typeof parameters['secure'] === 'boolean') {
            cookie += '; secure';
        }

        if (parameters['httpOnly'] && typeof parameters['httpOnly'] === 'boolean') {
            cookie += '; HttpOnly';
        }

        if (name && typeof name === 'string') {

            if (!this.has(name)) {
                return;
            }
            delete me.cookies[name];

            me.cookies.length--;
            document.cookie = name + '=' + cookie + '; max-age=0';
            return;
        }


        var keys = me.keys();

        for (var j = 0; j < keys.length; j++) {
            document.cookie = keys[ j ] + '=; max-age=0; path=/';
            delete me.cookies[keys[ j ]];
        }
    };

});