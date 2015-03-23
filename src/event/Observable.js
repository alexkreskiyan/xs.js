/**
 * Observable mixin
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.Observable
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Observable', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    Class.imports = [
        {
            IEvent: 'ns.IEvent'
        }
    ];

    Class.implements = [ 'ns.IObservable' ];

    /**
     * Observable is abstract class - can be only mixed
     *
     * @ignore
     */
    Class.abstract = true;

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
     *                 stoppable: true
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
     *  - stoppable ({@link Boolean}). Specifies, whether event processing can be stopped by event handler, returning false, or not
     *
     * @static
     *
     * @readonly
     *
     * @property events
     *
     * @type {Object}
     */
    Class.constant.events = {};

    /**
     * Observable constructor
     *
     * @constructor
     */
    Class.constructor = function () {
        var me = this;

        //assert that events are given
        self.assert.object(me.self.events, 'constructor - events are given incorrectly. Class constant events must be an object');

        //register eventHandlers collections
        me.private.eventsHandlers = {};
    };

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
     *
     * @return {Boolean} whether event processing was not stopped.
     *
     * Notice, that:
     *
     * - if event is not stoppable, method will always return true
     * - if method is stoppable, it will return true, if no handler stopped processing and false - otherwise
     */
    Class.method.fire = function (event, data) {
        var me = this;

        self.log.trace('fire - event ' + event, {
            data: data
        });

        //check event
        //assert event name is non-empty string
        self.assert.ok(event && xs.isString(event), 'fire - given event name `$event` is not a string', {
            $event: event
        });


        //check data
        //assert that data is either not given or is object
        self.assert.ok(arguments.length === 1 || xs.isObject(data), 'fire - given event `$event` data `$data` is not an object', {
            $event: event,
            $data: data
        });


        //check event options
        //assert that given event is registered
        self.assert.ok(me.self.events.hasOwnProperty(event), 'fire - given event `$event` is not registered within Class.constant.events hash constant. Add event `$event` configuration there', {
            $event: event
        });

        //assert that given event options are object
        var options = me.self.events[ event ];
        self.assert.object(options, 'fire - given event `$event` options `$options` are not an object', {
            $event: event,
            $options: options
        });

        //check event constructor
        //assert that type is specified
        self.assert.ok(options.hasOwnProperty('type'), 'fire - no type given for event `$event`. Add event type to Class.constant.events hash constant with property type, which value must be string, referencing name of imported Class', {
            $event: event
        });

        //assert that type is non-empty string
        self.assert.ok(options.type && xs.isString(options.type), 'fire - given event `$event` type `$type` is not a string', {
            $event: event,
            $type: options.type
        });

        //try to get EventClass
        var EventClass = xs.ContractsManager.get(me.self.descriptor.resolveName(options.type));

        //assert that EventClass is class
        self.assert.Class(EventClass, 'fire - given event `$event` type `$Event` is not a class', {
            $event: event,
            $Event: EventClass
        });

        //assert that EventClass implements IEvent interface
        self.assert.ok(EventClass.implements(imports.IEvent), 'fire - given event `$event` type `$Event` does not implement base event interface `$Interface`', {
            $event: event,
            $Event: EventClass,
            $Interface: imports.IEvent
        });


        //fire

        //create event object
        var eventObject = data ? new EventClass(data) : new EventClass();

        //handle stoppable option
        var stoppable;

        if (options.hasOwnProperty('stoppable')) {
            stoppable = options.stoppable;

            //assert that stoppable is boolean
            self.assert.boolean(stoppable, 'fire - given event `$event` stoppable option value `$stoppable` is not a boolean', {
                $stoppable: stoppable
            });

        } else {
            stoppable = true;
        }

        self.log.trace('fire - event is ' + (stoppable ? 'stoppable' : 'not stoppable') + ', processing');


        //handle fire

        //get handlers list for event
        var handlers = me.private.eventsHandlers[ event ];

        //if no handlers exist in a moment - return true
        if (!handlers) {

            return true;
        }

        //non-stoppable event always returns true
        if (!stoppable) {
            handlers.each(function (item) {
                item.realHandler(eventObject);
            });

            return true;
        }

        //if event is stoppable - result is opposite to whether some handler found:
        //if any handler returns false, find return relative item, and that true-like value is returned as false
        //if no handler returns false, find return undefined, and that false-like value is returned as true
        return !handlers.find(function (item) {

            return item.realHandler(eventObject) === false;
        });
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
    Class.method.on = function (event, handler, options) {
        var me = this;

        self.log.trace('on - ' + arguments.length + ' arguments given', {
            event: event,
            handler: handler,
            options: options
        });

        //check event
        //assert event name is non-empty string
        self.assert.ok(event && xs.isString(event), 'on - given event name `$event` is not a string', {
            $event: event
        });

        //assert that given event is registered
        self.assert.ok(me.self.events.hasOwnProperty(event), 'on - given event `$event` is not registered within Class.constant.events hash constant. Add event `$event` configuration there', {
            $event: event
        });


        //check handler
        //assert that given handler is function
        self.assert.fn(handler, 'on - given event `$event` handler `$handler` is not a function', {
            $event: event,
            $handler: handler
        });

        var eventsHandlers = me.private.eventsHandlers;

        //assert that given handler was not assigned yet
        self.assert.ok(!eventsHandlers.hasOwnProperty(event) || !eventsHandlers[ event ].find(function (item) {
            return item.handler === handler;
        }), 'on - given event `$event` handler `$handler` is already assigned', {
            $event: event,
            $handler: handler
        });


        //check options (if given)
        self.assert.ok(arguments.length === 2 || xs.isObject(options), 'on - given options `$options` are not an object', {
            $options: options
        });

        //add handlers collection for event if not existing yet
        if (!eventsHandlers.hasOwnProperty(event)) {
            eventsHandlers[ event ] = new xs.core.Collection();
        }

        var handlers = eventsHandlers[ event ];

        //if no options given - simply add
        if (!options) {
            self.log.trace('on - no options given, simply adding handler');

            handlers.add({
                handler: handler,
                realHandler: function (event) {
                    //item is eventsHandler[event] collection item
                    var me = this;

                    //nothing done if item is suspended
                    if (me.suspended) {

                        return;
                    }

                    //call raw handler
                    return me.handler(event);
                },
                suspended: false,
                scope: undefined
            });

            return me;
        }


        //process options

        //scope
        var scope = options.hasOwnProperty('scope') ? options.scope : undefined;

        //check buffer
        var buffer;

        if (options.hasOwnProperty('buffer')) {
            buffer = options.buffer;

            //assert that buffer is number
            self.assert.number(buffer, 'on - given buffer `$buffer` is not a number', {
                $buffer: buffer
            });

            //assert that buffer is positive whole number
            self.assert.ok(buffer > 0 && Math.round(buffer) === buffer, 'on - given buffer `$buffer` is not a number', {
                $buffer: buffer
            });
        } else {
            buffer = false;
        }

        self.log.trace('on - handler is ' + (buffer ? 'buffered' : 'not buffered'));

        //check calls
        var calls;

        if (options.hasOwnProperty('calls')) {
            calls = options.calls;

            //assert that calls is number
            self.assert.number(calls, 'on - given calls `$calls` is not a number', {
                $calls: calls
            });

            //assert that calls is positive whole number
            self.assert.ok(calls > 0 && Math.round(calls) === calls, 'on - given calls `$calls` is not a number', {
                $calls: calls
            });
        } else {
            calls = 0;
        }

        self.log.trace('on - handler has ' + (calls ? calls : 'infinite') + ' calls');

        //combine calls and buffer
        var realHandler; //real handler called when event is fired

        //create reference to event name
        var eventName = event;

        if (buffer) {
            if (calls) {
                realHandler = function (event) {
                    //nothing done if item is suspended
                    if (this.suspended) {

                        return;
                    }

                    if (this.timeout) {
                        clearTimeout(this.timeout);
                    }

                    this.timeout = setTimeout(function (item, event) {
                        //decrease item.calls
                        item.calls--;

                        var handler = item.handler;

                        //disable handler if calls is 0
                        if (!item.calls) {
                            //turn off event by all name, handler and scope
                            me.off(eventName, function (item) {
                                return item.handler === handler;
                            });
                        }

                        //call raw handler
                        handler.call(item.scope, event);
                    }, buffer, this, event);
                };
            } else {
                realHandler = function (event) {
                    //nothing done if item is suspended
                    if (this.suspended) {

                        return;
                    }

                    if (this.timeout) {
                        clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(function (item, event) {

                        //call raw handler
                        item.handler.call(item.scope, event);
                    }, buffer, this, event);
                };
            }
        } else {
            if (calls) {
                realHandler = function (event) {
                    //nothing done if item is suspended
                    if (this.suspended) {

                        return;
                    }

                    //decrease item.calls
                    this.calls--;

                    var handler = this.handler;

                    //disable handler if calls is 0
                    if (!this.calls) {
                        //turn off event by all name, handler and scope
                        me.off(eventName, function (item) {
                            return item.handler === handler;
                        });
                    }

                    //call raw handler
                    return this.handler.call(this.scope, event);
                };
            } else {
                realHandler = function (event) {
                    //nothing done if item is suspended
                    if (this.suspended) {

                        return;
                    }

                    //call raw handler
                    return this.handler.call(this.scope, event);
                };
            }
        }


        var item = {
            handler: handler,
            realHandler: realHandler,
            suspended: false,
            scope: scope
        };

        //process priority (if given)
        var priority;

        if (options.hasOwnProperty('priority')) {
            priority = options.priority;

            //assert that priority is number
            self.assert.number(priority, 'on - given priority `$priority` is not a number', {
                $priority: priority
            });
        } else {
            priority = false;
        }

        self.log.trace('on - handler is ' + (priority === false ? 'added to the end of the handlers stack' : 'inserted at the ' + priority + ' position'));

        //if priority not given - add, else - insert
        if (priority === false) {
            //add item to collection
            handlers.add(item);
        } else {
            //priority in fact is index of item in handlers collection
            handlers.insert(priority, item);
        }

        return me;
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
     * @method off
     *
     * @param {String} [event] name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#removeBy}
     *
     * @chainable
     */
    Class.method.off = function (event, selector, flags) {
        var me = this;

        self.log.trace('off - ' + arguments.length + ' arguments given', {
            event: event,
            selector: selector,
            flags: flags
        });

        //check event (if given)
        //assert event name is non-empty string (if given)
        self.assert.ok(!arguments.length || (event && xs.isString(event)), 'off - given event name `$event` is not a string', {
            $event: event
        });

        //assert that given event is registered
        self.assert.ok(!arguments.length || me.self.events.hasOwnProperty(event), 'off - given event `$event` is not registered within Class.constant.events hash constant. Add event `$event` configuration there', {
            $event: event
        });


        //check selector
        //assert that selector is function if given
        self.assert.ok(arguments.length <= 1 || xs.isFunction(selector), 'off - given event `$event` selector `$selector` is not a function', {
            $event: event,
            $selector: selector
        });


        //handle different scenarios
        var eventsHandlers = me.private.eventsHandlers;

        //complete truncate of all handlers
        if (!arguments.length) {
            self.log.trace('off - truncate scenario: removing all listeners on all events');

            Object.keys(eventsHandlers).forEach(function (event) {
                eventsHandlers[ event ].remove();

                //remove empty collection
                delete eventsHandlers[ event ];
            });

            return me;
        }

        //working with single event
        var handlers = eventsHandlers[ event ];

        //if no handlers exist in a moment - return
        if (!handlers) {

            return me;
        }

        //truncate
        if (arguments.length === 1) {
            self.log.trace('off - event truncate scenario: removing all listeners on ' + event + ' event');

            handlers.remove();

            //remove empty collection
            delete eventsHandlers[ event ];

            return me;
        }

        //selector given
        if (arguments.length === 2) {
            self.log.trace('off - selector removing scenario: removing all listeners on ' + event + ', that match selector', {
                selector: selector
            });
            handlers.removeBy(selector);
        } else {
            self.log.trace('off - selector removing scenario: removing all listeners on ' + event + ', that match selector width flags', {
                selector: selector,
                flags: flags
            });
            handlers.removeBy(selector, flags);
        }

        //if handlers collection is empty - remove it
        if (!handlers.size) {

            //remove empty collection
            delete eventsHandlers[ event ];
        }

        return me;
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
     * @method suspend
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.method.suspend = function (event, selector, flags) {
        var me = this;

        self.log.trace('suspend - ' + arguments.length + ' arguments given', {
            event: event,
            selector: selector,
            flags: flags
        });

        //check event
        //assert event name is non-empty string
        self.assert.ok(event && xs.isString(event), 'suspend - given event name `$event` is not a string', {
            $event: event
        });

        //assert that given event is registered
        self.assert.ok(me.self.events.hasOwnProperty(event), 'suspend - given event `$event` is not registered within Class.constant.events hash constant. Add event `$event` configuration there', {
            $event: event
        });


        //check selector
        //assert that selector is function if given
        self.assert.ok(arguments.length <= 1 || xs.isFunction(selector), 'suspend - given event `$event` selector `$selector` is not a function', {
            $event: event,
            $selector: selector
        });


        //handle different scenarios
        var eventsHandlers = me.private.eventsHandlers;

        //if no handlers exist in a moment - return
        if (!eventsHandlers.hasOwnProperty(event)) {

            return me;
        }

        var handlers;

        //selector given
        if (arguments.length >= 2) {

            //get handlers subset
            if (arguments.length === 2) {
                self.log.trace('suspend - selector suspending scenario: suspending all listeners on ' + event + ', that match selector', {
                    selector: selector
                });
                handlers = eventsHandlers[ event ].find(selector);
            } else {
                self.log.trace('suspend - selector suspending scenario: suspending all listeners on ' + event + ', that match selector with flags', {
                    selector: selector,
                    flags: flags
                });
                handlers = eventsHandlers[ event ].find(selector, flags);
            }

            //all handlers suspended
        } else {
            self.log.trace('suspend - event truncate scenario: removing all listeners on ' + event + ' event');
            handlers = eventsHandlers[ event ];
        }

        //if handlers collection found
        if (handlers instanceof xs.core.Collection) {
            //mark each item as suspended
            handlers.each(function (item) {
                item.suspended = true;
            });


            //else if single handler found
        } else if (xs.isObject(handlers)) {
            handlers.suspended = true;
        }

        return me;
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
     * @method resume
     *
     * @param {String} event name of registered event
     * @param {Function} [selector] handlers selector function
     * @param {Number} [flags] handlers selector flags. For supported flags, look to {@link xs.core.Collection#find}
     *
     * @chainable
     */
    Class.method.resume = function (event, selector, flags) {
        var me = this;

        self.log.trace('resume - ' + arguments.length + ' arguments given', {
            event: event,
            selector: selector,
            flags: flags
        });

        //check event
        //assert event name is non-empty string
        self.assert.ok(event && xs.isString(event), 'resume - given event name `$event` is not a string', {
            $event: event
        });

        //assert that given event is registered
        self.assert.ok(me.self.events.hasOwnProperty(event), 'resume - given event `$event` is not registered within Class.constant.events hash constant. Add event `$event` configuration there', {
            $event: event
        });


        //check selector
        //assert that selector is function if given
        self.assert.ok(arguments.length <= 1 || xs.isFunction(selector), 'resume - given event `$event` selector `$selector` is not a function', {
            $event: event,
            $selector: selector
        });


        //handle different scenarios
        var eventsHandlers = me.private.eventsHandlers;

        //if no handlers exist in a moment - return
        if (!eventsHandlers.hasOwnProperty(event)) {

            return me;
        }

        var handlers;
        //selector given
        if (arguments.length >= 2) {

            //get handlers subset
            if (arguments.length === 2) {
                self.log.trace('resume - selector suspending scenario: suspending all listeners on ' + event + ', that match selector', {
                    selector: selector
                });
                handlers = eventsHandlers[ event ].find(selector);
            } else {
                self.log.trace('resume - selector suspending scenario: suspending all listeners on ' + event + ', that match selector with flags', {
                    selector: selector,
                    flags: flags
                });
                handlers = eventsHandlers[ event ].find(selector, flags);
            }

            //all handlers resumed
        } else {
            self.log.trace('resume - event truncate scenario: removing all listeners on ' + event + ' event');
            handlers = eventsHandlers[ event ];
        }

        //if handlers collection found
        if (handlers instanceof xs.core.Collection) {
            //mark each item as resumed
            handlers.each(function (item) {
                item.suspended = false;
            });


            //else if single handler found
        } else if (xs.isObject(handlers)) {
            handlers.suspended = false;
        }

        return me;
    };

    /**
     * Destroys observable object
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        self.log.trace('destroy - destroying observable');
        this.off();
    };

});