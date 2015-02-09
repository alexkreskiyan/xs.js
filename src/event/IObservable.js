/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Observable interface. Is introduced to describe interface, that is implemented by all observable classes
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.IObservable
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IObservable', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    /**
     * Class registered events list. Must be declared in mixing class.
     *
     * For example:
     *
     *     var Class = xs.define(xs.Class, function(self, imports) {
     *
     *         'use strict';
     *
     *         var Class = this;
     *
     *         Class.imports= [
     *             { Event: 'ns.Event' } //For general purposes, xs.event.Event may be used
     *         ];
     *
     *         Class.constant.events = {
     *             add: {
     *                 type: 'ns.Event',
     *                 preventable: true
     *             },
     *             remove: {
     *                 type: 'SampleEvent'
     *             }
     *         };
     *     });
     *
     * As it is clear from example, events hash' properties' names are considered to be events names and values - events configurations
     * All fired object must be specified in events hash. Event configuration options:
     *
     *  - type ({@link String}). Each event specifies event type, that contains string, specifying name of imported Event class ({@link xs.event.IEvent} must be implemented).
     *  - preventable ({@link Boolean}). Specifies, whether event processing can be prevented by event handler, returning false, or not
     *
     * @static
     *
     * @readonly
     *
     * @property events
     *
     * @type {Object}
     */
    Class.constant = ['events'];

    /**
     * Events firing method.
     *
     * For example:
     *
     *     //with data
     *     object.fire('add', {
     *         item: item
     *     });
     *     //without data
     *     object.fire('reset');
     *
     * @method fire
     *
     * @param {String} event name of registered event
     * @param {Object} [data] optional object data
     */
    Class.method.fire = function (event, data) {
    };

    /**
     * Registers event listener for event
     *
     * For example:
     *
     *     object.on('add', function(event) {
     *         console.log('add', event);
     *     }, {
     *         buffer: 200,
     *         calls: 2,
     *         scope: {},
     *         priority: 0
     *     });
     *
     * @param {String} event registered event name
     * @param {Function} handler event handler
     * @param {Object} [options] Optional options for new handler
     * Valid options are:
     *
     * - buffer ({@link Number}). Event handling delay in milliseconds. Is useful, for example, to handle keyboard input events
     * - calls ({@link Number}). Count of handler calls before it will be removed from handlers list.
     *
     * @chainable
     */
    Class.method.on = function (event, handler, options) {
    };

    /**
     * Removes event handlers.
     *
     * For example:
     *
     *     //to remove all event handlers for all events
     *     object.off();
     *     //to remove all event handlers for event
     *     object.off('add');
     *     //removing with selector
     *     object.off('add', function(item) {
     *         return item.suspended;
     *     });
     *
     * @param {String} [event] name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#removeBy}
     *
     * @chainable
     */
    Class.method.off = function (event, selector, flags) {
    };

    /**
     * Suspends event handlers by selector
     *
     * For example:
     *
     *     //to suspend all event handlers
     *     object.suspend('add');
     *     //suspend with selector
     *     object.suspend('add', function(item) {
     *         return !item.suspended;
     *     });
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.method.suspend = function (event, selector, flags) {
    };

    /**
     * Resumes event handlers by selector
     *
     * For example:
     *
     *     //to resume all event handlers
     *     object.resume('add');
     *     //resume with selector
     *     object.resume('add', function(item) {
     *         return item.suspended;
     *     });
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.method.resume = function (event, selector, flags) {
    };
});