/**
 * xs.js XHR implementation part - response class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.Response
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Response', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr';

    Class.imports = [
        {
            Status: 'ns.Status'
        }
    ];

    Class.constructor = function (request) {
        var me = this;

        //save request reference
        me.private.request = request;
    };

    Class.property.response = {
        get: function () {
            return this.private.request.private.xhr.response;
        },
        set: xs.noop
    };

    Class.property.status = {
        get: function () {
            return this.private.request.private.xhr.status;
        },
        set: xs.noop
    };

    Class.property.statusText = {
        get: function () {
            return this.private.request.private.xhr.statusText;
        },
        set: xs.noop
    };

    Class.property.headers = {
        set: xs.noop
    };

});