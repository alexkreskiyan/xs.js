'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, XsReactiveReactiveError);

/**
 * Private reactive core. Represents some reactive object
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class Reactive
 *
 *
 *
 * @constructor
 *
 * Creates reactive instance
 *
 * @param {Function} generator reactive generator function
 * @param {xs.reactive.emitter.Emitter} emitter reactive emitter
 * @param {Array} sources additional sources, used by reactive object
 */
var Reactive = function (generator, emitter, sources) {
    var me = this;

    log.trace('constructor - creating reactive from `$generator` and `$sources`', {
        $generator: generator,
        $sources: sources
    });

    //assert, that generator is a function
    assert.fn(generator, 'constructor - given generator `$generator` is not a function', {
        $emitter: generator
    });

    //assert, that emitter is correct instance
    assert.ok(emitter instanceof module.emitter.Emitter, 'constructor - given generator `$generator` is not a function', {
        $emitter: generator
    });

    //verify sources
    assert.ok(arguments.length === 2 || xs.isArray(sources), 'constructor - given dependent sources list `$sources` is not an array', {
        $sources: sources
    });

    //create private storage
    me.private = {};

    //initially reactive is inactive
    me.private.isActive = false;

    //create collection for basic handlers
    me.private.externalHandlers = new xs.core.Collection();

    //create collection for internal handlers
    me.private.internalHandlers = new xs.core.Collection();

    //define cache for list of active events
    me.private.activeEvents = new xs.core.Collection();

    //add underConstruction flag
    me.underConstruction = true;

    //run generator with send, end and given sources
    var handlers;

    if (sources) {
        handlers = generator.apply(emitter, sources);
    } else {
        handlers = generator.call(emitter);
    }

    //remove underConstruction flag
    delete me.underConstruction;

    //save emitter
    me.private.emitter = emitter;

    //if handlers are not defined - return
    if (!xs.isDefined(handlers)) {

        return;
    }

    log.trace('constructor - generator returned `$handlers`', {
        $handlers: handlers
    });

    //assert, that handlers is an object
    assert.object(handlers, 'constructor - given handlers hash `$handlers` is not an object', {
        $handlers: handlers
    });

    //assert, that handlers.on is a function
    assert.fn(handlers.on, 'constructor - given handlers.on `$on` is not a function', {
        $on: handlers.on
    });

    //assert, that handlers.off is a function
    assert.fn(handlers.off, 'constructor - given handlers.off `$off` is not a function', {
        $off: handlers.off
    });

    //save handlers
    me.private.on = handlers.on;
    me.private.off = handlers.off;
};

//save reference to module
module.Reactive = Reactive;

/**
 * Reactive emitter instance
 *
 * @property emitter
 *
 * @readonly
 *
 * @type {Boolean}
 */
Object.defineProperty(Reactive.prototype, 'emitter', {
    get: function () {
        return this.private.emitter;
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Reactive destroyed state
 *
 * @property isDestroyed
 *
 * @readonly
 *
 * @type {Boolean}
 */
Object.defineProperty(Reactive.prototype, 'isDestroyed', {
    get: function () {
        return !this.hasOwnProperty('private');
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Reactive active state
 *
 * @property isActive
 *
 * @readonly
 *
 * @type {Boolean}
 */
Object.defineProperty(Reactive.prototype, 'isActive', {
    get: function () {
        return this.private.isActive;
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Adds handler for reactive changes
 *
 * @method on
 *
 * @param {Function} [event] change handler event
 * @param {Function} handler reactive change handler
 * @param {Object} [options] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.on = function (event, handler, options) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'on - reactive is destroyed');

    //assert, that at least one argument given
    assert.ok(arguments.length, 'on - no handler given');

    //process different call scenarios
    if (arguments.length === 1) {
        handleOn.call(me, false, arguments[ 0 ], false);
    } else if (arguments.length === 2) {

        //assert, that arguments[1] is either a function (event, handler call) or an options (handler, options call)
        assert.ok(xs.isFunction(arguments[ 1 ]) || xs.isObject(arguments[ 1 ]), 'on - incorrect arguments given');

        if (xs.isFunction(arguments[ 1 ])) {

            //event, handler call
            handleOn.call(me, arguments[ 0 ], arguments[ 1 ], false);

        } else {

            //handler, options call
            handleOn.call(me, false, arguments[ 0 ], arguments[ 1 ]);
        }

    } else {
        handleOn.apply(me, arguments);
    }

    return me;
};

/**
 * Removes selected handler(s) for reactive changes
 *
 * @method off
 *
 * @param {Function} [event] change handler event
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.off = function (event, selector, flags) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'off - reactive is destroyed');

    //complete truncate of all handlers
    if (!arguments.length) {

        handleOff.call(me, false, false, false);

    } else if (arguments.length === 1) {

        //if given target
        if (isEvent(arguments[ 0 ])) {

            //event scenario
            handleOff.call(me, arguments[ 0 ], false, xs.core.Collection.All);
        } else {

            //selector scenario
            handleOff.call(me, false, arguments[ 0 ], false);
        }

    } else if (arguments.length === 2) {

        if (xs.isFunction(arguments[ 1 ])) {

            //event, selector scenario
            handleOff.call(me, arguments[ 0 ], arguments[ 1 ], false);
        } else {

            //selector, flags scenario
            handleOff.call(me, false, arguments[ 0 ], arguments[ 1 ]);
        }

        //event, selector, flags scenario
    } else {
        handleOn.apply(me, arguments);
    }

    return me;
};

/**
 * Suspends selected handler(s) for reactive changes
 *
 * @method suspend
 *
 * @param {Function} [event] change handler event
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.suspend = function (event, selector, flags) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'off - reactive is destroyed');

    //complete suspend of all handlers
    if (!arguments.length) {

        handleSuspend.call(me, false, false, false);

    } else if (arguments.length === 1) {

        //if given target
        if (isEvent(arguments[ 0 ])) {

            //event scenario
            handleSuspend.call(me, arguments[ 0 ], false, xs.core.Collection.All);
        } else {

            //selector scenario
            handleSuspend.call(me, false, arguments[ 0 ], false);
        }

    } else if (arguments.length === 2) {

        if (xs.isFunction(arguments[ 1 ])) {

            //event, selector scenario
            handleSuspend.call(me, arguments[ 0 ], arguments[ 1 ], false);
        } else {

            //selector, flags scenario
            handleSuspend.call(me, false, arguments[ 0 ], arguments[ 1 ]);
        }

        //event, selector, flags scenario
    } else {
        handleOn.apply(me, arguments);
    }

    return me;
};

/**
 * Resumes selected handler(s) for reactive changes
 *
 * @method resume
 *
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.resume = function (selector, flags) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'off - reactive is destroyed');

    //complete truncate of all handlers
    if (!arguments.length) {

        handleResume.call(me, false, false, false);

    } else if (arguments.length === 1) {

        //if given target
        if (isEvent(arguments[ 0 ])) {

            //event scenario
            handleResume.call(me, arguments[ 0 ], false, xs.core.Collection.All);
        } else {

            //selector scenario
            handleResume.call(me, false, arguments[ 0 ], false);
        }

    } else if (arguments.length === 2) {

        if (xs.isFunction(arguments[ 1 ])) {

            //event, selector scenario
            handleResume.call(me, arguments[ 0 ], arguments[ 1 ], false);
        } else {

            //selector, flags scenario
            handleResume.call(me, false, arguments[ 0 ], arguments[ 1 ]);
        }

        //event, selector, flags scenario
    } else {
        handleOn.apply(me, arguments);
    }

    return me;
};

/**
 * Destroys reactive
 *
 * @method destroy
 */
Reactive.prototype.destroy = function () {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'destroy  - reactive is destroyed');

    log.trace('destroy - destroying reactive');

    //call off handler, if given
    if (me.private.off) {
        me.private.off();
    }

    var handlers = me.private.internalHandlers;

    delete me.private;

    //send destroy notification
    module.send(handlers, new xs.reactive.event.Destroy());

    //remove all handlers
    handlers.remove();
};

function handleOn(event, handler, options) {
    var me = this;

    //check, that event is false, undefined or a function
    assert.ok(event === false || isEvent(event), 'event - given event `$event` is not a function', {
        $event: event
    });

    //assert, that handler is false or a function
    assert.ok(handler === false || xs.isFunction(handler), 'on - given handler `$handler` is not a function', {
        $handler: handler
    });

    //assert, that options are false or an object
    assert.ok(options === false || xs.isObject(options), 'on - given options `$options` are not an object', {
        $options: options
    });

    //evaluate isInternal flag
    var isInternal = event && isInternalEvent(event);

    //get handlers reference
    var handlers = isInternal ? me.private.internalHandlers : me.private.externalHandlers;

    //get active events list
    var activeEvents = me.private.activeEvents;

    //if no options given - simply add
    if (!options) {

        log.trace('on - adding handler `$handler` with event `$event` without options', {
            $event: event,
            $handler: handler
        });

        handlers.add({
            event: event,
            handler: handler,
            active: true,
            scope: me
        });

        //return if internal
        if (isInternal) {
            return;
        }

        //sync active state to true - new active item added (for externals)
        syncActive.call(me, true);

        //send resume event if needed
        if (event && !activeEvents.has(event)) {
            resumeEvent.call(me, event);
        }

        return;
    }

    log.trace('on - adding handler `$handler` with event `$event` with options `$options`', {
        $event: event,
        $handler: handler,
        $options: options
    });

    //process active option
    var active = options.hasOwnProperty('active') ? Boolean(options.active) : true;

    //define handler item
    var item = {
        event: event,
        handler: handler,
        active: active,
        scope: options.hasOwnProperty('scope') ? options.scope : me
    };

    //process priority (if given)
    var priority;

    if (options.hasOwnProperty('priority')) {
        priority = options.priority;

        //assert that priority is number
        assert.number(priority, 'on - given priority `$priority` is not a number', {
            $priority: priority
        });
    } else {
        priority = false;
    }

    //if priority not given - add, else - insert
    if (priority === false) {

        //add item to collection
        handlers.add(item);

    } else {

        //priority in fact is index of item in handlers collection
        handlers.insert(priority, item);

    }

    log.trace('on - handler `$handler` was ' + (priority === false ? 'added' : 'inserted at ' + priority) + 'as `$item`', {
        $handler: handler,
        $item: item
    });

    //return if item was added in not-active state or internal handler added
    if (!active || isInternal) {

        return;
    }

    //sync active state to true - new active item added
    syncActive.call(me, true);

    //resume event if needed
    if (event && !activeEvents.has(event)) {
        resumeEvent.call(me, event);
    }
}

function handleOff(event, selector, flags) {
    var me = this;

    //get selection handler
    var handler = getSelectionHandler(event, selector, flags);

    //evaluate isInternal flag
    var isInternal = event && isInternalEvent(event);

    //get handlers reference
    var handlers = isInternal ? me.private.internalHandlers : me.private.externalHandlers;

    //get active events list
    var activeEvents = me.private.activeEvents;

    if (handler) {
        if (flags === false) {
            handlers.removeBy(handler);
        } else {
            handlers.removeBy(handler, flags);
        }
    } else {
        //remove all handlers
        handlers.remove();
    }

    //return if is internal
    if (isInternal) {
        return;
    }

    //sync active
    if (handler) {
        //sync active state - perhaps, no handlers left and it is false (only for externals)
        syncActive.call(me);
    } else {
        //sync active state to false - all handlers were removed (only for externals)
        syncActive.call(me, false);
    }

    //if event given
    if (event) {

        //return if event is already not active
        if (!activeEvents.has(event)) {

            return;
        }

        //suspend if no active handlers
        if (!checkActiveHandlers(handlers, event)) {
            suspendEvent.call(me, event);
        }
    } else if (handler) {

        //verify each event
        var i = 0;

        while (i < activeEvents.size) {
            event = activeEvents.at(i);

            //suspend if no active handlers
            if (!checkActiveHandlers(handlers, event)) {
                suspendEvent.call(me, event);
            } else {
                i++;
            }
        }
    } else {

        //suspend all active events
        while (activeEvents.size) {
            event = activeEvents.at(0);
            suspendEvent.call(me, event);
        }
    }
}

function handleSuspend(event, selector, flags) {
    var me = this;

    //get selection handler
    var handler = getSelectionHandler(event, selector, flags);

    //evaluate isInternal flag
    var isInternal = event && isInternalEvent(event);

    //get handlers reference
    var handlers = isInternal ? me.private.internalHandlers : me.private.externalHandlers;

    //get active events list
    var activeEvents = me.private.activeEvents;

    var suspended;

    if (handler) {
        if (flags === false) {
            suspended = handlers.find(handler);
        } else {
            suspended = handlers.find(handler, flags);
        }
    } else {
        suspended = handlers;
    }

    //if handlers collection found
    if (suspended instanceof xs.core.Collection) {

        //mark each item as not active
        suspended.each(function (item) {
            item.active = false;
        });

        //else if single handler found
    } else if (xs.isObject(suspended)) {
        suspended.active = false;
    }

    //return if is internal
    if (isInternal) {
        return;
    }

    //sync active
    if (handler) {
        //sync active state - perhaps, no active handlers left and it is false (only for externals)
        syncActive.call(me);
    } else {
        //sync active state to false - all handlers were suspended (only for externals)
        syncActive.call(me, false);
    }

    //if event given
    if (event) {

        //return if event is already not active
        if (!activeEvents.has(event)) {

            return;
        }

        //suspend if no active handlers
        if (!checkActiveHandlers(handlers, event)) {
            suspendEvent.call(me, event);
        }
    } else if (handler) {

        //verify each event
        var i = 0;

        while (i < activeEvents.size) {
            event = activeEvents.at(i);

            //suspend if no active handlers
            if (!checkActiveHandlers(handlers, event)) {
                suspendEvent.call(me, event);
            } else {
                i++;
            }
        }
    } else {

        //suspend all active events
        while (activeEvents.size) {
            event = activeEvents.at(0);
            suspendEvent.call(me, event);
        }
    }
}

function handleResume(event, selector, flags) {
    var me = this;

    //get selection handler
    var handler = getSelectionHandler(event, selector, flags);

    //evaluate isInternal flag
    var isInternal = event && isInternalEvent(event);

    //get handlers reference
    var handlers = isInternal ? me.private.internalHandlers : me.private.externalHandlers;

    //get active events list
    var activeEvents = me.private.activeEvents;

    var resumed;

    if (handler) {
        if (flags === false) {
            resumed = handlers.find(handler);
        } else {
            resumed = handlers.find(handler, flags);
        }
    } else {
        resumed = handlers;
    }

    //if handlers collection found
    if (resumed instanceof xs.core.Collection) {

        //mark each item as active
        resumed.each(function (item) {
            item.active = true;
        });

        //else if single handler found
    } else if (resumed) {
        resumed.active = true;
    }

    //return if is internal
    if (isInternal) {
        return;
    }

    //sync active state to true if anything resumed
    if (!(resumed instanceof xs.core.Collection) || resumed.size) {
        syncActive.call(me, true);
    }

    //if event given
    if (event) {

        //return if event already resumed
        if (activeEvents.has(event)) {

            return;
        }

        //resume if any active handlers
        if (checkActiveHandlers(handlers, event)) {
            resumeEvent.call(me, event);
        }
    } else {

        //verify each handler
        handlers.each(function (item) {

            //if handler has event and is active, but event not in cache - resume it
            if (item.active && item.event && !activeEvents.has(item.event)) {
                resumeEvent.call(me, item.event);
            }
        });
    }
}

function getSelectionHandler(event, selector, flags) {

    //check, that event is false, undefined or a function
    assert.ok(event === false || isEvent(event), 'handleOff - given event `$event` is not a function', {
        $event: event
    });

    //assert, that selector is false or a selector
    assert.ok(selector === false || xs.isFunction(selector), 'handleOff - given selector `$selector` is not a function', {
        $selector: selector
    });

    //assert, that flags are false or a number
    assert.ok(flags === false || xs.isNumber(flags), 'handleOff - given flags `$flags` are not a number', {
        $flags: flags
    });

    //remove by event and selector
    if (event && selector) {

        return function (item) {

            return item.event === event && selector(item);
        };
    }

    //remove by event
    if (event) {
        return function (item) {
            return item.event === event;
        };

    }

    //remove by selector
    if (selector) {

        return selector;
    }
}

function isEvent(candidate) {
    if (!xs.isDefined(candidate)) {

        return true;
    }

    if (!xs.isFunction(candidate)) {

        return false;
    }

    var prototype = candidate.prototype;

    return (prototype instanceof Event) || (prototype instanceof module.event.Event) || (xs.isClass(candidate) && candidate.implements(xs.event.IEvent));
}

//export isEvent method
module.isEvent = isEvent;

function syncActive(value) {
    var me = this;

    //if no exact state given - evaluate
    if (!arguments.length) {

        log.trace('syncActive - no value given, evaluating');

        value = Boolean(me.private.externalHandlers.find(function (item) {
            return item.active;
        }));

        log.trace('syncActive - evaluated value is ' + (value ? 'true' : 'false'));
    }

    //return if nothing changed
    if (me.private.isActive === value) {
        log.trace('syncActive - no changes, exiting');

        return;
    }

    //sync state
    me.private.isActive = value;

    //toggle reactive state
    var handle = value ? me.private.on : me.private.off;

    log.trace('syncActive - ' + (value ? 'resuming' : 'suspending') + ' reactive with `$handle`', {
        $handle: handle
    });

    //handle, if handle given
    if (handle) {
        handle();
    }
}

function isInternalEvent(event) {
    return event.prototype instanceof module.event.Event;
}

function checkActiveHandlers(handlers, event) {

    return Boolean(handlers.find(function (item) {

        return item.active && item.event === event;
    }));
}

function resumeEvent(event) {
    var me = this;

    //add event to cache
    me.private.activeEvents.add(event);

    //send internal Resume event
    module.send(me.private.internalHandlers, new xs.reactive.event.Resume(event));
}

function suspendEvent(event) {
    var me = this;

    //remove event to cache
    me.private.activeEvents.remove(event);

    //send internal Suspend event
    module.send(me.private.internalHandlers, new xs.reactive.event.Suspend(event));
}

module.defineInheritanceRelations = function (ancestor, descendant, dataHandler, destroyHandler) {

    //define descending dependencies
    ancestor.on(dataHandler);
    ancestor.on(xs.reactive.event.Destroy, destroyHandler);


    //define ascending dependencies
    descendant.on(xs.reactive.event.Destroy, function () {

        //nothing is done if ancestor is destroyed
        if (ancestor.isDestroyed) {

            return;
        }

        ancestor.off(function (item) {
            return item.handler === dataHandler;
        });
        ancestor.off(xs.reactive.event.Destroy, function (item) {
            return item.handler === destroyHandler;
        });
    });
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactiveReactiveError
 */
function XsReactiveReactiveError(message) {
    this.message = 'xs.reactive.Reactive::' + message;
}

XsReactiveReactiveError.prototype = new Error();