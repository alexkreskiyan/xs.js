'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, XsReactiveReactiveError);

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

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
 * @param {Function} [target] change handler target(s)
 * @param {Function} handler reactive change handler
 * @param {Object} [options] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.on = function (target, handler, options) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'on - reactive is destroyed');

    //assert, that at least one argument given
    assert.ok(arguments.length, 'on - no handler given');

    //process different call scenarios
    if (arguments.length === 1) {
        handleOn.call(me, false, arguments[ 0 ], false);
    } else if (arguments.length === 2) {

        //assert, that arguments[1] is either a function (target, handler call) or an options (handler, options call)
        assert.ok(xs.isFunction(arguments[ 1 ]) || xs.isObject(arguments[ 1 ]), 'on - incorrect arguments given');

        //target, handler call
        if (xs.isFunction(arguments[ 1 ])) {
            handleOn.call(me, arguments[ 0 ], arguments[ 1 ], false);

            //handler, options call
        } else {
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
 * @param {Function} [target] change handler target(s)
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.off = function (target, selector, flags) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'off - reactive is destroyed');

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //complete truncate of all handlers
    if (!arguments.length) {

        log.trace('off - removing all handlers');

        //remove all handlers
        handlers.remove();

        //sync active state to false - all handlers were removed
        syncActive.call(me, false);

        return me;
    }

    //process different call scenarios
    var handler;
    var targetGiven = false;
    var selectorGiven = false;
    var flagsGiven = false;

    if (arguments.length === 1) {

        if (isTarget(arguments[ 0 ])) {
            targetGiven = true;
            handler = function (item) {
                return item.target === target;
            };

            //use selector instead of target
        } else {
            selectorGiven = true;
            target = undefined;
            selector = arguments[ 0 ];
            handler = selector;
        }

        //selector, flags scenario
    } else if (!xs.isFunction(arguments[ 1 ])) {
        selectorGiven = true;
        flagsGiven = true;
        selector = arguments[ 0 ];
        flags = arguments[ 1 ];
        handler = selector;

        //target, selector, [flags] scenario
    } else {
        targetGiven = true;
        selectorGiven = true;
        handler = function (item) {
            return item.target === target && selector(item);
        };
    }


    //check, that target (if given) is undefined or a function
    assert.ok(!targetGiven || !xs.isDefined(target) || xs.isFunction(target), 'off - given target `$target` is not valid', {
        $target: target
    });

    //assert, that selector (if given) is a function
    assert.ok(!selectorGiven || xs.isFunction(selector), 'off - given selector `$selector` is not a function', {
        $selector: selector
    });

    if (flagsGiven) {
        log.trace('off - removing handlers by selector `$selector` and flags `$flags`', {
            $selector: selector
        });
        handlers.removeBy(handler, flags);
    } else {
        log.trace('off - removing handlers by selector `$selector`', {
            $selector: selector
        });
        handlers.removeBy(handler);
    }

    //sync active state - perhaps, no handlers left and it is false
    syncActive.call(me);

    return me;
};

/**
 * Suspends selected handler(s) for reactive changes
 *
 * @method suspend
 *
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.suspend = function (selector, flags) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'suspend - reactive is destroyed');

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //all items suspended
    if (!arguments.length) {

        log.trace('suspend - suspending all handlers');

        //mark each item as suspended
        handlers.each(function (item) {
            item.suspended = true;
        });

        //sync active state to false - all handlers were suspended
        syncActive.call(me, false);

        return me;
    }

    //get suspended handlers subset
    var suspended;

    if (arguments.length === 1) {
        log.trace('suspend - suspending handlers by selector `$selector`', {
            $selector: selector
        });
        suspended = handlers.find(selector);
    } else {
        log.trace('suspend - suspending handlers by selector `$selector` and flags `$flags`', {
            $selector: selector
        });
        suspended = handlers.find(selector, flags);
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

    //sync active state - perhaps, all handlers were suspended and it is false
    syncActive.call(me);

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
    assert.not(me.isDestroyed, 'resume  - reactive is destroyed');

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //all items resumed
    if (!arguments.length) {

        log.trace('resume - resuming all handlers');

        //mark each item as resumed
        handlers.each(function (item) {
            item.suspended = false;
        });

        //sync active state to true - all handlers were resumed
        if (handlers.size) {
            syncActive.call(me, true);
        }

        return me;
    }

    //get resumed handlers subset
    var resumed;

    if (arguments.length === 1) {
        log.trace('resume - resuming handlers by selector `$selector`', {
            $selector: selector
        });
        resumed = handlers.find(selector);
    } else {
        log.trace('resume - resuming handlers by selector `$selector` and flags `$flags`', {
            $selector: selector
        });
        resumed = handlers.find(selector, flags);
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

    //sync active state - perhaps, some handlers were resumed and it is true
    syncActive.call(me);

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
    module.send(handlers, new xs.reactive.event.Destroy());

    //remove all handlers
    handlers.remove();
};

function handleOn(target, handler, options) {
    var me = this;

    //check, that target is false, undefined or a function
    assert.ok(target === false || !xs.isDefined(target) || isTarget(target), 'target - given target `$target` is not a function', {
        $target: target
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

        log.trace('on - adding handler `$handler` with target `$target` without options', {
            $target: target,
            $handler: handler
        });

        handlers.add({
            target: target,
            handler: handler,
            suspended: false,
            scope: me
        });

        //sync active state to true - new item not-suspended was added
        syncActive.call(me, true);

        return me;
    }

    log.trace('on - adding handler `$handler` with target `$target` with options `$options`', {
        $target: target,
        $handler: handler,
        $options: options
    });

    //process suspended option
    var suspended = options.hasOwnProperty('suspended') ? Boolean(options.suspended) : false;

    //define handler item
    var item = {
        target: target,
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

function isTarget(candidate) {
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
 * @class XsReactiveReactiveError
 */
function XsReactiveReactiveError(message) {
    this.message = 'xs.reactive.Reactive::' + message;
}

XsReactiveReactiveError.prototype = new Error();