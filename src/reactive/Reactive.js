'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, XsReactiveReactiveError);

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

/**
 * Reactive targets enum
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.reactive
 *
 * @singleton
 */

/**
 * Data target. Is used to listen to reactive data changes. Default value
 *
 * @readonly
 *
 * @property Data
 *
 * @type {Number}
 */
xs.reactive.Data = 0x1;

/**
 * Destroy target. Is used to listen to single event of reactive destroying
 *
 * @readonly
 *
 * @property Warning
 *
 * @type {Number}
 */
xs.reactive.Destroy = 0x2;


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
 * @param {Function} generator stream generator function
 * @param {Array} sources additional sources, used by reactive object
 */
var Reactive = function (generator, sources) {
    var me = this;

    log.trace('constructor - creating reactive from `$generator` and `$sources`', {
        $generator: generator,
        $sources: sources
    });

    //assert, that generator is a function
    assert.fn(generator, 'constructor - given generator `$generator` is not a function', {
        $emitter: generator
    });

    //verify sources
    assert.ok(arguments.length === 1 || xs.isArray(sources), 'constructor - given dependent sources list `$sources` is not an array of reactive elements', {
        $sources: sources
    });

    //run generator with send, end and given sources
    var handlers = generator.apply(undefined, [
        handleSend.bind(me),
        handleDestroy.bind(me)
    ].concat(sources ? sources : []));

    //create private storage
    me.private = {};

    //initially reactive is inactive
    me.private.isActive = false;

    //create reactiveHandlers collection
    me.private.reactiveHandlers = new xs.core.Collection();

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
 * @param {Function} handler reactive change handler
 * @param {Object} [options] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.on = function (handler, options) {
    var me = this;

    //assert, that handler is a function
    assert.fn(handler, 'on - given handler `$handler` is not a function', {
        $handler: handler
    });

    //assert, that options (if given) are an object
    assert.ok(arguments.length === 1 || xs.isObject(options), 'on - given options `$options` are not an object', {
        $options: options
    });

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //if no options given - simply add
    if (!options) {

        log.trace('on - adding handler `$handler` without options', {
            $handler: handler
        });

        handlers.add({
            handler: handler,
            target: xs.reactive.Data,
            suspended: false,
            scope: undefined
        });

        //sync active state to true - new item not-suspended was added
        syncActive.call(me, true);

        return me;
    }


    log.trace('on - add handler `$handler` with options `$options`', {
        $handler: handler,
        $options: options
    });

    //process target (if given)
    var target;
    if (options.hasOwnProperty('target')) {
        target = options.target;

        //assert that target is a number
        assert.number(target, 'on - given target `$target` is not a number', {
            $target: target
        });
    } else {
        target = xs.reactive.Data;
    }

    //process suspended option
    var suspended = options.hasOwnProperty('suspended') ? Boolean(options.suspended) : false;

    //define handler item
    var item = {
        handler: handler,
        target: target,
        suspended: suspended,
        scope: options.hasOwnProperty('scope') ? options.scope : undefined
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

    return me;
};

/**
 * Removes selected handler(s) for reactive changes
 *
 * @method off
 *
 * @param {Function} [selector] selector, that matches removed handlers
 * @param {Object} [flags] reactive handler options
 *
 * @chainable
 */
Reactive.prototype.off = function (selector, flags) {
    var me = this;

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

    //selector given
    if (arguments.length === 1) {
        log.trace('off - removing handlers by selector `$selector`', {
            $selector: selector
        });
        handlers.removeBy(selector);
    } else {
        log.trace('off - removing handlers by selector `$selector` and flags `$flags`', {
            $selector: selector
        });
        handlers.removeBy(selector, flags);
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

    log.trace('destroy - destroying reactive');

    //call off handler, if given
    if (me.private.off) {
        me.private.off();
    }

    var handlers = me.private.reactiveHandlers;

    delete me.private;

    //send destroy notification
    send(handlers, xs.reactive.Destroy);

    //remove all handlers
    handlers.remove();
};

function handleSend(data, silent) {
    var me = this;
    if (silent) {

        return;
    }

    //verify stream
    assert.not(me.isDestroyed, 'send - reactive is destroyed');

    //send data
    send(me.private.reactiveHandlers, xs.reactive.Data, data);
}

function handleDestroy() {
    var me = this;

    //verify stream
    assert.not(me.isDestroyed, 'send - reactive is destroyed');

    //destroy stream
    me.destroy();
}

function send(handlers, target, data) {

    log.trace('send - sending `$data` to ' + (target === xs.reactive.Data ? 'Data' : 'Destroy'), {
        $data: data
    });

    //return whether handlers processing was cancelled
    return !handlers.find(function (item) {

        //ignore, if item is suspended or has another target
        if (item.suspended || !(item.target & target)) {

            return;
        }

        //if handler returns false - it cancels processing
        return item.handler.call(item.scope, data) === false;
    });
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