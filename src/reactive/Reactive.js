'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, ReactiveError);

var Reactive = function (generator, sources) {
    var me = this;

    log.info('constructor - creating reactive from `$generator` and `$sources`', {
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
        function (data) {
            //send data
            send.call(me, Reactive.Data, data);
        },
        function () {
            //destroy stream
            me.destroy();
        }
    ].concat(sources ? sources : []));

    log.info('constructor - generator returned `$handlers`', {
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

    //create private storage
    me.private = {};

    //initially reactive is inactive
    me.private.isActive = false;

    //create reactiveHandlers collection
    me.private.reactiveHandlers = new xs.core.Collection();

    //save handlers
    me.private.on = handlers.on;
    me.private.off = handlers.off;
};

//save reference to module
module.Reactive = Reactive;

Reactive.Data = 0x1;
Reactive.Destroy = 0x2;

Object.defineProperty(Reactive.prototype, 'isDestroyed', {
    get: function () {
        return !this.hasOwnProperty('private');
    },
    set: xs.emptyFn,
    configurable: false,
    enumerable: true
});

Object.defineProperty(Reactive.prototype, 'isActive', {
    get: function () {
        return this.private.isActive;
    },
    set: xs.emptyFn,
    configurable: false,
    enumerable: true
});

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
            target: Reactive.Data,
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
        target = Reactive.Data;
    }

    //process suspended option
    var suspended = options.hasOwnProperty('scope') ? Boolean(options.suspended) : false;

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

Reactive.prototype.resume = function (selector, flags) {
    var me = this;

    //get handlers reference
    var handlers = me.private.reactiveHandlers;

    //all items resumed
    if (!arguments.length) {

        log.trace('resume - resuming all handlers');

        //mark each item as resumed
        handlers.each(function (item) {
            item.suspended = true;
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
            item.resumeed = true;
        });

        //else if single handler found
    } else if (xs.isObject(resumed)) {
        resumed.resumeed = true;
    }

    //sync active state - perhaps, some handlers were resumed and it is true
    syncActive.call(me);

    return me;
};

Reactive.prototype.destroy = function () {
    var me = this;

    log.trace('destroy - destroying reactive');

    //send destroy notification
    send.call(me, Reactive.Destroy);

    //remove all reactiveHandlers
    me.private.reactiveHandlers.remove();

    //call off handler
    me.private.off();

    delete me.private;
};

function send(target, data) {
    var me = this;

    log.trace('send - sending `$data` to ' + (target === Reactive.Data ? 'Data' : 'Destroy'), {
        $data: data
    });

    //return whether handlers processing was cancelled
    return !me.private.reactiveHandlers.find(function (item) {

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

    //call on/off
    if (value) {
        log.trace('syncActive - resuming reactive with `$on`', {
            $on: me.private.on
        });
        me.private.on();
    } else {
        log.trace('syncActive - suspending reactive with `$off`', {
            $off: me.private.off
        });
        me.private.off();
    }
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class ReactiveError
 */
function ReactiveError(message) {
    this.message = 'xs.reactive.Reactive::' + message;
}

ReactiveError.prototype = new Error();