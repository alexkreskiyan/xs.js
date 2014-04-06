function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';

function setUp() {
    return {
        inst: {
            one: xs.create('xs.util.Observable'),
            two: xs.create('xs.util.Observable'),
            three: xs.create('xs.util.Observable')
        },
        cnt: {
            one: 0,
            two: 0,
            three: 0
        },
        fn: {
            one: function(a) {
                console.log('fn1', this, a);
                cnt1++;
            },
            two: function(a, b) {
                console.log('fn2', this, a, b);
                cnt2++;
            },
            three: function(a, b, c) {
                console.log('fn3', this, a, b, c);
                cnt3++;
            }
        }
    };
}
module('xs.util.Observable');

test('hasEvent', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('a'), false, 'env.inst.one has no events');
});

test('addEvent', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('event'), false, 'env.inst.one has no event "event"');
    env.inst.one.addEvent('event');
    strictEqual(env.inst.one.hasEvent('event'), true, 'env.inst.one has events "event"');
});

test('deleteEvent', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('event'), false, 'env.inst.one has no event "event"');
    env.inst.one.addEvent('event');
    strictEqual(env.inst.one.hasEvent('event'), true, 'env.inst.one was add event "event"');
    env.inst.one.deleteEvent('event');
    strictEqual(env.inst.one.hasEvent('event'), false, 'env.inst.one was delete event "event"');
});

test('deleteAllEvent', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), false, 'env.inst.one has no event "bar"');

    env.inst.one.addEvent('foo');
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one was add event "foo"');

    env.inst.one.addEvent('bar');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one was add event "bar"');

    env.inst.one.deleteAllEvents();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), false, 'env.inst.one has no event "bar"');
});

test('applyMap', function() {
    var env = setUp();
    var map = {
        create: {
            handler: env.fn.one,
            callback: env.fn.two
        }
    };

    var instOne = env.inst.one;
    strictEqual(Object.keys(instOne.events).length, 0, 'env.inst.one has no events');
    env.inst.one.applyMap(map);
    strictEqual(Object.keys(instOne.events).toString(), 'create', 'env.inst.one has only create event');

    strictEqual(instOne.events.create.length, 1, 'env.inst.one has is not empty');
    strictEqual(instOne.events.create[0], map.create, 'env.inst.one has is not empty');

});

test('on', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');

    env.inst.one.on('foo', env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    env.inst.one.deleteAllEvents();

    env.inst.one.on(['foo', 'bar'], env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');
    env.inst.one.deleteAllEvents();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), false, 'env.inst.one has event "bar"');

    var eventMap = {
        foo: env.fn.one,
        bar: env.fn.two
    };
    env.inst.one.on(eventMap, {
        x: 'FooBar'
    });
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');

});

test('once', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');

    env.inst.one.once('foo', env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    env.inst.one.deleteAllEvents();

    env.inst.one.once(['foo', 'bar'], env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');
    env.inst.one.deleteAllEvents();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), false, 'env.inst.one has event "bar"');

    var eventMap = {
        foo: env.fn.one,
        bar: env.fn.two
    };
    env.inst.one.once(eventMap, {
        x: 'FooBar'
    });
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');

});


test('off', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');

    env.inst.one.on('foo', env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    env.inst.one.off('foo', env.fn.one);
    var existsFoo = xs.Array.find(env.inst.one.events.foo, function(dispatcher) {
        return dispatcher.callback == env.fn.one;
    });

    strictEqual(existsFoo, undefined, 'env.inst.one has no event "foo"');
    env.inst.one.deleteAllEvents();

    env.inst.one.on(['foo', 'bar'], env.fn.one, {});
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');
    env.inst.one.off(['foo', 'bar'], env.fn.one);
    var existsFoo = xs.Array.find(env.inst.one.events.foo, function(dispatcher) {
        return dispatcher.callback == env.fn.one;
    });
    var existsBar = xs.Array.find(env.inst.one.events.bar, function(dispatcher) {
        return dispatcher.callback == env.fn.one;
    });
    strictEqual(existsFoo, undefined, 'env.inst.one has no event "foo"');
    strictEqual(existsBar, undefined, 'env.inst.one has no event "foo"');
    env.inst.one.deleteAllEvents();

    var eventMap = {
        foo: env.fn.one,
        bar: env.fn.two
    }
    env.inst.one.on(eventMap);
    strictEqual(env.inst.one.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    strictEqual(env.inst.one.hasEvent('bar'), true, 'env.inst.one has event "bar"');
    env.inst.one.off(eventMap);
    var existsFoo = xs.Array.find(env.inst.one.events.foo, function(dispatcher) {
        return dispatcher.callback == env.fn.one;
    });
    var existsBar = xs.Array.find(env.inst.one.events.bar, function(dispatcher) {
        return dispatcher.callback == env.fn.two;
    });
    strictEqual(existsFoo, undefined, 'env.inst.one has no event "foo"');
    strictEqual(existsBar, undefined, 'env.inst.one has no event "bar"');
    env.inst.one.deleteAllEvents();

});

test('listen', function() {
    var env = setUp();
    strictEqual(env.inst.one.hasEvent('foo'), false, 'env.inst.one has no event "foo"');
    strictEqual(env.inst.two.hasEvent('foo'), false, 'env.inst.two has no event "foo"');

    env.inst.one.listen(env.inst.two, 'foo', env.fn.one);
    var existsFoo = xs.Array.find(env.inst.two.events.foo, function(dispatcher) {
        return dispatcher.callback == env.fn.one;
    });
    strictEqual(env.inst.two.hasEvent('foo'), true, 'env.inst.one has event "foo"');
    env.inst.one.deleteAllEvents();

    //env.inst.one.listen(env.inst.two, ['foo', 'bar'], env.fn.one);
   /*  var eventMap = {
        foo: env.fn.one,
        bar: env.fn.two
    }*/
    //env.inst.one.listen(env.inst.two, eventMap);

})

// var run = function() {
//     var inst1 = xs.create('xs.util.Observable');
//     var inst2 = xs.create('xs.util.Observable');

//     /**
//      * Test 'on' methods
//      */
//     //simple use
//     inst1.on('create', function(a, b) {
//         console.log(this, a, b, 'test simple use');
//     }, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);

//     //give array
//     inst1.on(['create', 'delete'], function(a, b) {
//         console.log(this, a, b, 'array use');
//     }, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);
//     inst1.trigger('delete', 3, 4);

//     //test with event map
//     //init map
//     var eventMap = {
//         create: function(a, b) {
//             console.log(this, a, b, 'event map create');
//         },
//         delete: function(a, b) {
//             console.log(this, a, b, 'event map delete')
//         }
//     }
//     //give map into 'on'
//     inst1.on(eventMap, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);
//     inst1.trigger('delete', 3, 4);

//     /**
//      * Test 'once' methods
//      */
//     //simple use
//     inst1.once('create', function(a, b) {
//         console.log(this, a, b, 'once ');
//     }, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);

//     //use with array
//     inst1.once(['create', 'delete'], function(a, b) {
//         console.log(this, a, b);
//     }, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);
//     inst1.trigger('delete', 3, 4);

//     //use with event map
//     //init event map
//     eventMap = {
//         create: function(a, b) {
//             console(this, a, b, 'create');
//         },
//         delete: function(a, b) {
//             console(this, a, b, 'delete')
//         }
//     }

//     //give event map into function
//     inst1.once(eventMap, {
//         x: 1
//     });
//     inst1.trigger('create', 1, 2);
//     inst1.trigger('delete', 3, 4);

//     /**
//      * Test 'off' methods
//      */

//     //initiate simple handler
//     var fn = function(x, y) {
//         console.log(x + y)
//     };

//     //simple use
//     inst1.on('trololo', fn, {
//         x: 1
//     })
//     inst1.off('trololo', fn);
//     inst1.trigger('trololo', 1, 2);

//     //use with array
//     inst1.on(['foo', 'bar'], fn, {
//         x: 'test'
//     });
//     inst1.off(['foo', 'bar'], fn);
//     inst1.trigger('foo', 1, 2);
//     inst1.trigger('bar', 3, 4);

//     //use with event map
//     //init event map
//     eventMap = {
//         'foo': function(a, b) {
//             console(this, a, b, 'foo');
//         },
//         'bar': function(a, b) {
//             console(this, a, b, 'bar')
//         }
//     }

//     //give event map into function
//     inst1.on(eventMap, {
//         x: 'testEventMap'
//     });
//     inst1.off(eventMap);
//     inst1.trigger('foo', 1, 2);
//     inst1.trigger('bar', 3, 4);

//     //delete all handlers
//     inst1.on(eventMap, {
//         x: 'testEventMap'
//     });
//     inst1.off();
//     inst1.trigger('foo', 1, 2);
//     inst1.trigger('bar', 3, 4);

//     /**
//      * Test 'listen' method
//      */
//     //simple use
//     inst1.listen(inst2, 'foo', function(a, b) {
//         console.log(this, a, b)
//     }, {
//         x: 'testListen'
//     });
//     inst2.trigger('foo', 1, 2);

//     //array use
//     inst1.listen(inst2, ['foo', 'bar'], function(a, b) {
//         console.log(this, a, b)
//     }, {
//         x: 'testListen'
//     });
//     inst2.trigger('foo', 1, 2);
//     inst2.trigger('bar', 3, 4);

//     //use event map
//     //init event map
//     eventMap = {
//         foo: function(x, y) {
//             console.log(x + y, 'foo');
//         },
//         bar: function(x, y) {
//             console.log(x + y, 'bar');
//         }
//     }
//     inst1.listen(inst2, eventMap, {
//         x: 'testListen'
//     });
//     inst2.trigger('foo', 1, 2);
//     inst2.trigger('bar', 3, 4);

//     /**
//      * Test 'listenOnce' method
//      */
//     //simple use
//     inst1.listenOnce(inst2, 'foo', function(a, b) {
//         console.log(this, a, b)
//     }, {
//         x: 'testListen'
//     });
//     inst2.trigger('foo', 1, 2);

//     //array use
//     inst1.listenOnce(inst2, ['foo', 'bar'], function(a, b) {
//         console.log(this, a, b)
//     }, {
//         x: 'testListen'
//     });
//     inst2.trigger('foo', 1, 2);
//     inst2.trigger('bar', 3, 4);

//     //use event map
//     //init event map
//     eventMap = {
//         foo: function(x, y) {
//             console.log(x + y, 'foo');
//         },
//         bar: function(x, y) {
//             console.log(x + y, 'bar');
//         }
//     }
//     inst1.listenOnce(inst2, eventMap, {
//         x: 'testListenOnce'
//     });
//     inst2.trigger('foo', 1, 2);
//     inst2.trigger('bar', 3, 4);

//     /**
//      * Test 'ignore' method
//      */
//     //simple use
//     var fnTstIgnore = function(a, b) {
//         console.log(Math.pow(a, 2) + Math.pow(b, 2), 'fnTstIgnore');
//     };

//     inst1.listen(inst2, 'testIgnore', fnTstIgnore, {
//         x: 'ololo'
//     });
//     inst1.ignore(inst2, 'testIgnore', fnTstIgnore);
//     inst1.trigger('testIgnore');

//     //array use
//     inst1.listen(inst2, ['testIgnore1', 'testIgnore2'], fnTstIgnore, {
//         x: 'ololo'
//     });
//     inst1.ignore(inst2, ['testIgnore1', 'testIgnore2'], fnTstIgnore);
//     inst1.trigger('testIgnore1');
//     inst1.trigger('testIgnore2');

//     //use event map
//     //init event map
//     eventMap = {
//         testIgnore1: function(x, y) {
//             console.log(x + y, 'testIgnore1');
//         },
//         testIgnore2: function(x, y) {
//             console.log(x + y, 'testIgnore2');
//         },
//     }

//     inst1.listen(inst2, eventMap);
//     inst1.ignore(inst2, eventMap);
//     inst1.trigger('testIgnore1');
//     inst1.trigger('testIgnore2');
// };