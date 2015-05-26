/**
 * xs.storage.CookieStorage is a singleton, that provides access to browser's cookie storage
 *
 * @author
 *
 * @private
 *
 * @singleton
 *
 * @class xs.storage.CookieStorage
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.CookieStorage', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    Class.imports = [
        {
            'event.AddBefore': 'ns.event.AddBefore'
        },
        {
            'event.Add': 'ns.event.Add'
        },
        {
            'event.SetBefore': 'ns.event.SetBefore'
        },
        {
            'event.Set': 'ns.event.Set'
        },
        {
            'event.RemoveBefore': 'ns.event.RemoveBefore'
        },
        {
            'event.Remove': 'ns.event.Remove'
        },
        {
            'event.Clear': 'ns.event.Clear'
        }
    ];

    Class.mixins.observable = 'xs.event.StaticObservable';

    Class.abstract = true;

    /**
     * Collection length
     *
     * @property size
     *
     * @readonly
     *
     * @type Number
     */
    Class.static.property.size = {
        get: function () {
            return this.cookies.length;
        },
        set: xs.noop
    };

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
    * Returns the value of the specified cookie or null
    *
    * @method getItem
    *
    * @return {*} value with specified key
    */
    Class.static.method.getItem = function(name) {
       return this.cookies[name] || null;
    };

    /**
    * Add cookie
    *
    * @method setItem
    *
    * @param {String} key key of added value
    * @param {*} value value, added to storage
    */
    Class.static.method.setItem = function (key, value, maxage, path) {
        var me = this;

        if (!(key in me.cookies)) {
            me.keys().push(key);
            me.cookies.length++;
        }

        me.cookies[key] = value;

        var cookie = key + '=' + encodeURIComponent(value);

        if (maxage) {
            cookie += '; max-age=' + maxage;
        }

        if (path) {
            cookie += '; path=' + path;
        }

        document.cookie = cookie;
    };

    /**
    * Removes the specified cookie
    *
    * @method removeItem
    *
    * @param {Number|String} key key of removed value
    */
    Class.static.method.removeItem = function (key) {
       var me = this;

        if (!(key in me.cookies)) {
            return;
        }

        delete me.cookies[key];

        var keys = me.keys();
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) {
                keys.splice(i,1);
                break;
            }
        }
        me.cookies.length--;

        document.cookie = key + '=; max-age=0';
    };

    /**
    *Remove all cookies
    *
    * @method clear
    */
    Class.static.method.clear = function () {
        var me = this;
        var keys =  me.keys();
        for (var i = 0; i < keys.length; i++) {
            document.cookie = keys[i] + '=; max-age=0';
        }
        me.cookies = {};
    }
});