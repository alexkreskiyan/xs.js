/**
 * Event class for events, being thrown when some data operations are executed
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.Event
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Event', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.operation';

    Class.imports = [
        {
            IOperation: 'ns.IOperation'
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
     * @param {Object} [data] event data
     */
    Class.constructor = function (data) {
        var me = this;

        //check data
        //assert that data is object
        self.assert.ok(xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert that operation is an interface
        self.assert.interface(data.operation, 'constructor - given data.operation `$Operation` is not a interface', {
            $Operation: data.operation
        });

        //assert that operation is an imports.IOperation ancestor
        self.assert.ok(data.operation.inherits(imports.IOperation), 'constructor - given data.operation `$Operation` is not a interface', {
            $Operation: data.operation
        });

        //assign attributes
        me.private.operation = data.operation;
        me.private.data = data.data;
    };

    /**
     * Event `operation` property. Event operation is reference to operation interface of performed operation
     *
     * @property operation
     *
     * @type {xs.data.operation.IOperation}
     */
    Class.property.operation = {
        set: xs.noop
    };

    /**
     * Event `data` property. Event data is data, operation was performed with
     *
     * @property attribute
     *
     * @type {Object}
     */
    Class.property.data = {
        set: xs.noop
    };

});