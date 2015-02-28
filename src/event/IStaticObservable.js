/**
 * Static observable interface. Is introduced to describe interface, that is implemented by all static observable classes
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.IStaticObservable
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IStaticObservable', function () {

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
     * @static
     *
     * @method fire
     *
     * @param {String} event name of registered event
     * @param {Object} [data] optional object data
     */
    Class.static.method.fire = function (event, data) {
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
     * @static
     *
     * @method on
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
    Class.static.method.on = function (event, handler, options) {
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
     * @static
     *
     * @method off
     *
     * @param {String} [event] name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#removeBy}
     *
     * @chainable
     */
    Class.static.method.off = function (event, selector, flags) {
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
     * @static
     *
     * @method suspend
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.static.method.suspend = function (event, selector, flags) {
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
     * @static
     *
     * @method resume
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.static.method.resume = function (event, selector, flags) {
    };

});