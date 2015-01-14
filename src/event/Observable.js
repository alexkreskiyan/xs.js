/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Observable mixin
 *
 * Usage example:
 *
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.Observable
 */
xs.define(xs.Class, 'ns.Observable', function (self, ns, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    Class.imports = [
        {IEvent: 'ns.IEvent'}
    ];

    /**
     * Observable is abstract class - can be only mixed
     *
     * @type {boolean}
     */
    Class.abstract = true;

    Class.const.events = {};

    Class.constructor = function () {
        var me = this;

        //register eventHandlers collections
        var handlers = me.private.eventsHandlers = {};
        Object.keys(self.events).forEach(function (name) {
            handlers[name] = new xs.core.Collection();
        });
    };

    Class.property.eventsHandlers = {
        set: xs.emptyFn
    };

    Class.method.fire = function (event, data) {
        var me = this;


        //check event
        //assert event name is string
        xs.assert.string(event, 'fire - given event name "$event" is not a string', {
            $event: event
        }, ObservableError);

        //assert that given event is registered
        xs.assert.ok(self.events.hasOwnProperty(event), 'fire - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ObservableError);


        //check data
        //assert that data is either not given or is object
        xs.assert.ok(arguments.length === 1 || xs.isObject(data), 'fire - given event "$event" data "$data" is not an object', {
            $event: event,
            $data: data
        }, ObservableError);


        //check event options
        //assert that given event options are object
        var options = self.events[event];
        xs.assert.object(options, 'fire - given event "$event" options "$options" are not an object', {
            $event: event,
            $options: options
        }, ObservableError);

        //check event constructor
        //assert that type is specified
        xs.assert.ok(options.hasOwnProperty('type'), 'fire - no type given for event "$event". Add event type to Class.const.events hash constant with property type, which value must be string, referencing name of imported Class', {
            $event: event
        }, ObservableError);

        //assert that type is string
        xs.assert.string(options.type, 'fire - given event "$event" type "$type" is not a string', {
            $event: event
        }, ObservableError);

        var EventClass = imports[options.type];

        //assert that EventClass is class
        xs.assert.Class(EventClass, 'fire - given event "$event" type "$Event" is not a class', {
            $event: event,
            $Event: EventClass
        });

        //assert that EventClass implements IEvent interface
        xs.assert.ok(EventClass.implements(imports.IEvent), 'fire - given event "$event" type "$Event" does not implement base event interface "$Interface"', {
            $event: event,
            $Event: EventClass,
            $Interface: imports.IEvent.label
        });


        //fire

        //create event object
        var eventObject = data ? new EventClass(data) : new EventClass;

        //handle preventable option
        var preventable;
        if (options.hasOwnProperty('preventable')) {
            preventable = options.preventable;

            //assert that preventable is boolean
            xs.assert.boolean(preventable, 'fire - given event "$event" preventable option value "$preventable" is not a boolean', {
                $preventable: preventable
            }, ObservableError);

        } else {
            preventable = true;
        }


        //handle fire
        //handlers
        var handlers = me.private.eventsHandlers[event];
        if (preventable) {
            handlers.find(function (item) {

                return item.realHandler(eventObject) === false;
            });
        } else {
            handlers.each(function (item) {
                item.realHandler(eventObject);
            });
        }
    };

    Class.method.on = function (event, handler, options) {
        var me = this;


        //check event
        //assert event name is string
        xs.assert.string(event, 'on - given event name "$event" is not a string', {
            $event: event
        }, ObservableError);

        //assert that given event is registered
        xs.assert.ok(self.events.hasOwnProperty(event), 'on - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ObservableError);


        //check handler
        //assert that given handler is function
        xs.assert.fn(handler, 'on - given event "$event" handler "$handler" is not a function', {
            $event: event,
            $handler: handler
        }, ObservableError);


        //check options (if given)
        xs.assert.ok(arguments.length === 2 || xs.isObject(options), 'on - given options "$options" are not an object', {
            $options: options
        }, ObservableError);


        //if no options given - simply add
        if (!options) {

            me.private.eventsHandlers[event].add({
                handler: handler,
                realHandler: handler,
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
            xs.assert.number(buffer, 'on - given buffer "$buffer" is not a number', {
                $buffer: buffer
            }, ObservableError);

            //assert that buffer is positive whole number
            xs.assert.ok(buffer > 0 && Math.round(buffer) === buffer, 'on - given buffer "$buffer" is not a number', {
                $buffer: buffer
            }, ObservableError);
        } else {
            buffer = false;
        }

        //check single
        var single;
        if (options.hasOwnProperty('single')) {
            single = options.single;

            //assert that buffer is number
            xs.assert.boolean(single, 'on - given single flag "$single" is not a boolean', {
                $single: single
            }, ObservableError);
        } else {
            single = false;
        }


        //combine single and buffer
        var realHandler; //real handler called when event is fired
        //create reference to event name
        var eventName = event;
        if (buffer) {
            if (single) {
                realHandler = function (event) {
                    //item is eventsHandler[event] collection item
                    var item = this;

                    //nothing done if item is suspended
                    if (item.suspended) {

                        return;
                    }

                    if (item.timeout) {
                        clearTimeout(item.timeout);
                    }
                    item.timeout = setTimeout(function (item, event) {
                        //turn off event by all name, handler and scope
                        me.off(eventName, item.handler, scope);

                        //call raw handler
                        item.handler.call(scope, event);
                    }, buffer, item, event);
                };
            } else {
                realHandler = function (event) {
                    //item is eventsHandler[event] collection item
                    var item = this;

                    //nothing done if item is suspended
                    if (item.suspended) {

                        return;
                    }

                    if (item.timeout) {
                        clearTimeout(item.timeout);
                    }
                    item.timeout = setTimeout(function (item, event) {

                        //call raw handler
                        item.handler.call(scope, event);
                    }, buffer, item, event);
                };
            }
        } else {
            if (single) {
                realHandler = function (event) {
                    //item is eventsHandler[event] collection item
                    var item = this;

                    //nothing done if item is suspended
                    if (item.suspended) {

                        return;
                    }

                    //turn off event by all name, handler and scope
                    me.off(eventName, item.handler, scope);

                    //call raw handler
                    item.handler.call(scope, event);
                };
            } else {
                realHandler = function (event) {
                    //item is eventsHandler[event] collection item
                    var item = this;

                    //nothing done if item is suspended
                    if (item.suspended) {

                        return;
                    }

                    //call raw handler
                    item.handler.call(scope, event);
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
            xs.assert.number(priority, 'on - given priority "$priority" is not a number', {
                $priority: priority
            }, ObservableError);
        } else {
            priority = false;
        }

        //if priority not given - add, else - insert
        if (priority === false) {
            //add item to collection
            me.private.eventsHandlers[event].add(item);
        } else {
            //priority in fact is index of item in handlers collection
            me.private.eventsHandlers[event].insert(priority, item);
        }

        return me;
    };

    Class.method.off = function (event, selector, flags) {
        var me = this;


        //check event
        //assert event name is string
        xs.assert.string(event, 'off - given event name "$event" is not a string', {
            $event: event
        }, ObservableError);

        //assert that given event is registered
        xs.assert.ok(self.events.hasOwnProperty(event), 'off - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ObservableError);


        //check selector
        //assert that selector is function if given
        xs.assert.ok(arguments.length === 1 || xs.isFunction(selector), 'off - given event "$event" selector "$selector" is not a function', {
            $event: event,
            $selector: selector
        }, ObservableError);


        //handle different scenarios

        var handlers = me.private.eventsHandlers[event];
        //truncate
        if (arguments.length === 1) {
            handlers.remove();

            return me;
        }

        //selector given
        handlers.removeBy(selector, flags);

        return me;
    };

    Class.method.suspend = function (event, selector, flags) {
        var me = this;


        //check event
        //assert event name is string
        xs.assert.string(event, 'suspend - given event name "$event" is not a string', {
            $event: event
        }, ObservableError);

        //assert that given event is registered
        xs.assert.ok(self.events.hasOwnProperty(event), 'suspend - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ObservableError);


        //check selector
        //assert that selector is function if given
        xs.assert.ok(arguments.length === 1 || xs.isFunction(selector), 'suspend - given event "$event" selector "$selector" is not a function', {
            $event: event,
            $selector: selector
        }, ObservableError);


        //handle different scenarios

        var handlers;
        //selector given
        if (arguments.length === 1) {

            //get handlers subset
            handlers = me.private.eventsHandlers[event].find(selector, flags);

            //all handlers suspended
        } else {
            handlers = me.private.eventsHandlers[event];
        }

        //mark each item as suspended
        handlers.each(function (item) {
            item.suspended = true;
        });

        return me;
    };

    Class.method.resume = function (event, selector, flags) {
        var me = this;


        //check event
        //assert event name is string
        xs.assert.string(event, 'resume - given event name "$event" is not a string', {
            $event: event
        }, ObservableError);

        //assert that given event is registered
        xs.assert.ok(self.events.hasOwnProperty(event), 'resume - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ObservableError);


        //check selector
        //assert that selector is function if given
        xs.assert.ok(arguments.length === 1 || xs.isFunction(selector), 'resume - given event "$event" selector "$selector" is not a function', {
            $event: event,
            $selector: selector
        }, ObservableError);


        //handle different scenarios

        var handlers;
        //selector given
        if (arguments.length === 1) {

            //get handlers subset
            handlers = me.private.eventsHandlers[event].find(selector, flags);

            //all handlers resumed
        } else {
            handlers = me.private.eventsHandlers[event];
        }

        //mark each item as resumed
        handlers.each(function (item) {
            item.suspended = false;
        });

        return me;
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ObservableError
     */
    function ObservableError(message) {
        this.message = self.label + '::' + message;
    }

    ObservableError.prototype = new Error();
});