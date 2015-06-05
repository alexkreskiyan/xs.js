'use strict';

var log = new xs.log.Logger('xs.event.Reactive');

var assert = new xs.core.Asserter(log, XsEventReactiveError);

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
 * @param {xs.event.emitter.Emitter} emitter reactive emitter
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
    assert.ok(emitter instanceof module.Emitter, 'constructor - given generator `$generator` is not a function', {
        $emitter: generator
    });

    //verify sources
    assert.ok(arguments.length === 2 || xs.isArray(sources), 'constructor - given dependent sources list `$sources` is not an array of reactive elements', {
        $sources: sources
    });

    //create private storage
    me.private = {};

    //initially reactive is inactive
    me.private.isActive = false;

    //create reactiveHandlers collection
    me.private.reactiveHandlers = new xs.core.Collection();

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
        handleOff.call(me, arguments[ 0 ], arguments[ 1 ], arguments[ 2 ]);
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
        handleSuspend.call(me, arguments[ 0 ], arguments[ 1 ], arguments[ 2 ]);
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
        handleResume.call(me, arguments[ 0 ], arguments[ 1 ], arguments[ 2 ]);
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

    var handlers = me.private.reactiveHandlers;

    delete me.private;

    //send destroy notification
    module.send(handlers, new xs.event.Destroy());

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

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //if no options given - simply add
    if (!options) {

        log.trace('on - adding handler `$handler` with event `$event` without options', {
            $event: event,
            $handler: handler
        });

        handlers.add({
            event: event,
            handler: handler,
            suspended: false,
            scope: me
        });

        //sync active state to true - new item not-suspended was added
        syncActive.call(me, true);

        return me;
    }

    log.trace('on - adding handler `$handler` with event `$event` with options `$options`', {
        $event: event,
        $handler: handler,
        $options: options
    });

    //process suspended option
    var suspended = options.hasOwnProperty('suspended') ? Boolean(options.suspended) : false;

    //define handler item
    var item = {
        event: event,
        handler: handler,
        suspended: suspended,
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

    //sync active state to true - new item not-suspended was added
    if (!suspended) {
        syncActive.call(me, true);
    }
}

function handleOff(event, selector, flags) {
    var me = this;

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    var handler = getSelectionHandler(event, selector, flags);

    if (handler) {

        if (flags === false) {
            handlers.removeBy(handler);
        } else {
            handlers.removeBy(handler, flags);
        }

        //sync active state - perhaps, no handlers left and it is false
        syncActive.call(me);

    } else {

        //remove all handlers
        handlers.remove();

        //sync active state to false - all handlers were removed
        syncActive.call(me, false);
    }

    return me;
}

function handleSuspend(event, selector, flags) {
    var me = this;

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    var handler = getSelectionHandler(event, selector, flags);

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

        //mark each item as suspended
        suspended.each(function (item) {
            item.suspended = true;
        });

        //else if single handler found
    } else if (xs.isObject(suspended)) {
        suspended.suspended = true;
    }

    //sync active state - perhaps, no handlers left and it is false
    syncActive.call(me);

    return me;
}

function handleResume(event, selector, flags) {
    var me = this;

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    var handler = getSelectionHandler(event, selector, flags);

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

        //mark each item as resumed
        resumed.each(function (item) {
            item.suspended = false;
        });

        //else if single handler found
    } else if (xs.isObject(resumed)) {
        resumed.suspended = false;
    }

    //sync active state - perhaps, no handlers left and it is false
    syncActive.call(me);

    return me;
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
    if (event !== false && selector !== false) {

        return function (item) {

            return item.event === event && selector(item);
        };
    }

    //remove by event
    if (event !== false) {
        return function (item) {
            return item.event === event;
        };

    }

    //remove by selector
    if (selector !== false) {

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

    return (prototype instanceof Event) || (prototype instanceof module.Event) || (xs.isClass(candidate) && candidate.implements(xs.event.IEvent));
}

function syncActive(value) {
    var me = this;

    //if no exact state given - evaluate
    if (!arguments.length) {

        log.trace('syncActive - no value given, evaluating');

        value = me.private.reactiveHandlers.find(function (item) {
                return !item.suspended;
            }) !== undefined;

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

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsEventReactiveError
 */
function XsEventReactiveError(message) {
    this.message = 'xs.event.Reactive::' + message;
}

XsEventReactiveError.prototype = new Error();