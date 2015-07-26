/**
 * Event class for events, being thrown, when response is aborted because of timeout
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.http.event.Timeout
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Timeout', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.http';

    Class.imports = {
        Response: 'ns.Response'
    };

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {xs.transport.http.Response} response request response wrapper
     */
    Class.constructor = function (response) {
        var me = this;

        self.assert.ok(response instanceof imports.Response, 'constructor - given response `$response` is not a `$Response` instance', {
            $response: response,
            $Response: imports.Response
        });

        //save response
        me.private.response = response;
    };

    /**
     * Event `response` property. Event response is a response wrapper over XHR response
     *
     * @property response
     *
     * @type {Object}
     */
    Class.property.response = {
        set: xs.noop
    };

});