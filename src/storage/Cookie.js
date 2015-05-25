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

    Class.static.method.getCookie = function () {
        var cookies = {};
        var all = document.cookie;

        if(all === '') {
            return null;
        }

        var list = all.split('; ');
        for (var i = 0; i< list.length; i++) {
            var cookie = list[i];
            var p = cookie.indexOf('=');
            var name = cookie.substring(0,p);
            var value = cookie.substring(p+1);
            value = decodeURIComponent(value);
            cookies[name] = value;
        }
        return cookies;
    };

    Class.static.method.setCookie = function (name, value, daysToLive) {
        var cookie = name + '=' + encodeURIComponent(value);

        if (typeof daysToLive === 'number') {
            cookie += '; max-age=' + (daysToLive*60*60*24);
        }
        document.cookie = cookie;
    };

});