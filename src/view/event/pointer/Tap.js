/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Tap
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Tap', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event.pointer';

    Class.implements = [
        'ns.IEvent'
    ];

    Class.static.method.capture = function (element) {
        //var capture = {
        //    element: element
        //};
        //
        ////handle mobile and desktop differently
        //if (xs.isMobile) {
        //
        //} else {
        //    capture.handler = function
        //}
        console.log('capture ' + self.label + ' for', element);
    };

    Class.static.method.release = function (capture) {
        console.log('release ' + self.label + ' capture', capture);
    };

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} event event data
     */
    Class.constructor = function () {
        var me = this;

        if (!arguments.length) {

            return;
        }

        //check data
        //assert that data is object
        self.assert.ok(xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assign attributes
        me.private.attribute = data.attribute;
        me.private.old = data.old;
        me.private.new = data.new;
    };

    /**
     * Event `attribute` property. Event attribute is name of changed attribute
     *
     * @property attribute
     *
     * @type {Object}
     */
    Class.property.attribute = {
        set: xs.noop
    };

    /**
     * Event `old` property. Event old is old value at given position
     *
     * @property old
     *
     * @type {Object}
     */
    Class.property.old = {
        set: xs.noop
    };

    /**
     * Event `new` property. Event new is a value, that replaces current one
     *
     * @property new
     *
     * @type {Object}
     */
    Class.property.new = {
        set: xs.noop
    };

});