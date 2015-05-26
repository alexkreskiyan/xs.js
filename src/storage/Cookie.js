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
     * Get value cookie
     *
     * @method getCookie
     *
     * @param {String} [name] cookie
     */
    Class.static.method.getCookie = function (name) {
        var all = document.cookie;

        if(all === '') {
            return null;
        }

        var list = all.split('; ');
        for (var i = 0; i< list.length; i++) {
            var cookie = list[i];
            var p = cookie.indexOf('=');
            var key = cookie.substring(0,p);
            if (key === name) {
                var value = cookie.substring(p+1);
                value = decodeURIComponent(value);
                return value;
            }

        }
        return null;
    };

    /**
     * Add cookie
     *
     * @method setItem
     *
     * @param {String} [name] cookie
     * @param {*} [value] cookie
     * @param {Number} [daysToLive] optional. The number of days of cookies
     * @param {String} [path] optional. Restricts access to pages that match that path. Defaults to all pages
     * @param {String} [domain] optional. Configure access restrictions to the cookies with different subdomains
     * @param {Boolean} [secure] optional. If true use https Protocol used to transfer the cookies
     */
    Class.static.method.setCookie = function (name, value) {
        var arg = arguments,
        daysToLive = arg.length > 2 ? arg[2] : null,
        path = arg.length > 3 ? arg[3] : '/',
        domain = arg.length > 4 ? arg[4] : null,
        secure = arg.length > 5 ? arg[5] : false,
        cookie;

        if (typeof value === 'object') {
            cookie = name + '=' + encodeURIComponent(JSON.stringify(value, function (key, value) {
                if (typeof value === 'function') {
                    return undefined;
                }
                return value;
            }));
        } else {
            cookie = name + '=' + encodeURIComponent(value);
        }

        if (typeof daysToLive === 'number') {
            cookie += '; max-age=' + (daysToLive*60*60*24);
        }

        if (typeof path === 'string') {
            cookie += '; path' + path;
        }

        if (typeof domain === 'string') {
            cookie += '; domain' + domain;
        }

        if (typeof secure === 'boolean') {
            cookie += '; secure';
        }
        document.cookie = cookie;
    };

    /**
     * Remove cookie
     *
     * @method clearCookie
     *
     * @param {String} [name] cookie
     * @param {String} [path]
     */
    Class.static.method.clearCookie = function (name, path) {
        if (this.getCookie(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; max-age=0; path=' + path;
        }

    };

});