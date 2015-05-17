/**
 * Event class for events, being thrown, when executed request is aborted
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Abort
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Close', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.websocket';

    Class.imports = [
        {
            CloseCode: 'ns.CloseCode'
        }
    ];

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} data event close data
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that data is an object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that data has a close code
        self.assert.ok(data.hasOwnProperty('code'), 'constructor - given data `$data` has no close code', {
            $data: data
        });

        //assert, that data.code is a number
        self.assert.number(data.code, 'constructor - given data.code `$code` is not a number', {
            $code: data.code
        });

        //assert, that data.code is valid
        self.assert.ok(validateCloseCode(data.code));

        //assert, that data has a close reason
        self.assert.ok(data.hasOwnProperty('reason'), 'constructor - given data `$data` has no close reason', {
            $data: data
        });

        //assert, that data.reason is a string
        self.assert.string(data.reason, 'constructor - given data.reason `$reason` is not a string', {
            $reason: data.reason
        });

        //save close code
        me.private.code = data.code;

        //save close reason
        me.private.reason = data.reason;
    };

    /**
     * Event `code` property. Event code is a code, connection was closed with
     *
     * @property code
     *
     * @type {Object}
     */
    Class.property.code = {
        set: xs.noop
    };

    /**
     * Event `reason` property. Event reason is a reason, connection was closed with
     *
     * @property reason
     *
     * @type {Object}
     */
    Class.property.reason = {
        set: xs.noop
    };


    var validateCloseCode = function (code) {
        self.assert.number(code, 'validateCloseCode - given code `$code` is not a number', {
            $code: code
        });

        self.assert.ok(imports.CloseCode.has(code) || (code >= 3000 && code < 5000), 'validateCloseCode - given code `$code` is not valid', {
            $code: code
        });

        return true;
    };

});