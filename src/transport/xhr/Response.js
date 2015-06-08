/**
 * xs.js XHR implementation part - response class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.Response
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Response', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr';

    Class.imports = {
        Type: 'ns.Type',
        State: 'ns.State',
        Status: 'ns.Status'
    };

    Class.constructor = function (request) {
        var me = this;

        //save request reference
        me.private.request = request;
    };

    Class.property.body = {
        get: function () {
            var privates = this.private;

            //return cached response
            if (privates.response) {

                return privates.response;
            }

            //get request
            var request = privates.request;

            //get xhr response
            var response = request.private.xhr.response;

            //if request finished - cache response. Else - return as is
            if (request.state & (imports.State.Loaded | imports.State.Aborted | imports.State.Crashed | imports.State.TimedOut)) {

                //convert to JSON, if not supported
                if (request.type === imports.Type.JSON && xs.isString(response)) {
                    response = JSON.parse(response);
                }

                //cache response
                privates.response = response;
            }

            return response;
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