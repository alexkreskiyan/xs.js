/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.event.StaticObservable', function () {

    'use strict';

    test('fire', function () {
        var me = this;
        me.Class = xs.Class(function () {
            var Class = this;

            Class.namespace = 'tests.event.StaticObservable';

            Class.imports = [
                {Event: 'xs.event.Event'}
            ];

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
                },
                bufferedCalls: {
                    type: 'xs.event.Event'
                },
                bufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                eventWithoutOptions: undefined,
                eventWithoutType: {},
                eventWithIncorrectType: {
                    type: undefined
                },
                eventWithNonClassType: {
                    type: 'NotClass'
                },
                eventWithClassNotEvent: {
                    type: 'xs.class.Base'
                },
                eventWithIncorrectStoppable: {
                    type: 'xs.event.Event',
                    stoppable: null
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //check string event name only allowed
        throws(function () {
            me.Classfire();
        });
        throws(function () {
            me.Class.fire(1);
        });

        //check data must be either given as object or not given
        throws(function () {
            me.Class.fire('unknown', []);
        });

        //check event has to be registered
        throws(function () {
            me.Class.fire('unknown');
        });

        //check event options must be an object
        throws(function () {
            me.Class.fire('eventWithoutOptions');
        });

        //check event constructor name must be given
        throws(function () {
            me.Class.fire('eventWithoutType');
        });

        //check event constructor name must be a string
        throws(function () {
            me.Class.fire('eventWithIncorrectType');
        });

        //check event constructor is class
        throws(function () {
            me.Class.fire('eventWithNonClassType');
        });

        //check event constructor implements IEvent interface
        throws(function () {
            me.Class.fire('eventWithClassNotEvent');
        });

        //check stoppable, if given, is boolean
        throws(function () {
            me.Class.fire('eventWithIncorrectStoppable');
        });

        //by default - no eventsHandlers collection
        strictEqual(me.Class.private.hasOwnProperty('eventsHandlers'), false);

        //check stoppable event firing
        var stoppableSum = 5;
        me.Class.on('add', function (event) {
            stoppableSum *= event.data.mod;
        });
        me.Class.on('add', function (event) {
            stoppableSum -= event.data.mod;

            return false;
        });
        me.Class.on('add', function (event) {
            stoppableSum /= event.data.mod;
        });

        //verify value, returned by fire
        strictEqual(me.Class.fire('add', {
            mod: 5
        }), false);
        strictEqual(stoppableSum, 20);

        //check non-stoppable event firing
        var unstoppableSum = 5;
        me.Class.on('remove', function (event) {
            unstoppableSum *= event.data.mod;
        });
        me.Class.on('remove', function (event) {
            unstoppableSum -= event.data.mod;

            return false;
        });
        me.Class.on('remove', function (event) {
            unstoppableSum /= event.data.mod;
        });
        strictEqual(me.Class.fire('remove', {
            mod: 5
        }), true);
        strictEqual(unstoppableSum, 4);
    });

    test('on', function () {
        var me = this;
        me.Class = xs.Class(function () {
            var Class = this;

            Class.namespace = 'tests.event.StaticObservable';

            Class.imports = [
                {Event: 'xs.event.Event'}
            ];

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
                },
                bufferedCalls: {
                    type: 'xs.event.Event'
                },
                bufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                eventWithoutOptions: undefined,
                eventWithoutType: {},
                eventWithIncorrectType: {
                    type: undefined
                },
                eventWithNonClassType: {
                    type: 'NotClass'
                },
                eventWithClassNotEvent: {
                    type: 'xs.class.Base'
                },
                eventWithIncorrectStoppable: {
                    type: 'xs.event.Event',
                    stoppable: null
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //check string event name only allowed
        throws(function () {
            me.Class.on();
        });
        throws(function () {
            me.Class.on(1);
        });

        //check event has to be registered
        throws(function () {
            me.Class.on('unknown');
        });

        //check handler has to be function
        throws(function () {
            me.Class.on('add');
        });
        throws(function () {
            me.Class.on('add', {});
        });

        //check duplicate handler denied
        var duplicateHandler = function () {
        };

        //by default - no eventsHandlers collection
        strictEqual(me.Class.private.hasOwnProperty('eventsHandlers'), false);

        me.Class.on('add', duplicateHandler);
        throws(function () {
            me.Class.on('add', duplicateHandler);
        });

        //add listeners collection created
        strictEqual(me.Class.private.eventsHandlers.hasOwnProperty('add'), true);

        me.Class.off();

        //check options must be either given as object or not given
        throws(function () {
            me.Class.on('add', xs.emptyFn, undefined);
        });

        //check simple case without options - only event and handler
        me.Class.on('add', xs.emptyFn);
        strictEqual(me.Class.private.eventsHandlers.add.size, 1);
        strictEqual(me.Class.private.eventsHandlers.add.at(0).handler, xs.emptyFn);
        me.Class.off();

        //check buffer, if given, must be number
        throws(function () {
            me.Class.on('add', xs.emptyFn, {
                buffer: undefined
            });
        });

        //check buffer must be positive integer number
        throws(function () {
            me.Class.on('add', xs.emptyFn, {
                buffer: 0.5
            });
        });

        //check calls, if given, must be number
        throws(function () {
            me.Class.on('add', xs.emptyFn, {
                calls: undefined
            });
        });

        //check calls must be positive integer number
        throws(function () {
            me.Class.on('add', xs.emptyFn, {
                calls: 0.5
            });
        });

        //check priority, if given, must be number
        throws(function () {
            me.Class.on('add', xs.emptyFn, {
                priority: undefined
            });
        });

        //check simple case with priority
        var fn1 = function () {
        };
        var fn2 = function () {
        };
        me.Class.on('add', fn1);
        me.Class.on('add', fn2, {
            priority: 0
        });
        me.Class.off();

        //check buffered handler with calls
        var bufferedCallsSum = 5;
        me.Class.on('bufferedCalls', function (event) {
            bufferedCallsSum += event.data.mod;
        }, {
            buffer: 1,
            calls: 1
        });

        me.Class.fire('bufferedCalls', {mod: 5});
        me.Class.fire('bufferedCalls', {mod: 4});
        setTimeout(function () {
            me.Class.fire('bufferedCalls', {mod: 4});
            setTimeout(function () {
                me.Class.off();
                strictEqual(bufferedCallsSum, 9);
            }, 5);
        }, 5);

        //check buffered handler without calls
        var bufferedNoCallsSum = 5;
        me.Class.on('bufferedNoCalls', function (event) {
            bufferedNoCallsSum += event.data.mod;
        }, {
            buffer: 1
        });

        me.Class.fire('bufferedNoCalls', {mod: 5});
        me.Class.fire('bufferedNoCalls', {mod: 4});
        setTimeout(function () {
            me.Class.fire('bufferedNoCalls', {mod: 4});
            setTimeout(function () {
                me.Class.off();
                strictEqual(bufferedNoCallsSum, 13);
                me.done();
            }, 5);
        }, 5);

        //check unbuffered handler with calls
        var unbufferedCallsSum = 5;
        me.Class.on('unbufferedCalls', function (event) {
            unbufferedCallsSum += event.data.mod;
        }, {
            calls: 1
        });

        me.Class.fire('unbufferedCalls', {mod: 5});
        me.Class.fire('unbufferedCalls', {mod: 4});
        strictEqual(unbufferedCallsSum, 10);

        //check unbuffered handler without calls
        var unbufferedNoCallsSum = 5;
        me.Class.on('unbufferedNoCalls', function (event) {
            unbufferedNoCallsSum += event.data.mod;
        });

        me.Class.fire('unbufferedNoCalls', {mod: 5});
        me.Class.fire('unbufferedNoCalls', {mod: 4});
        strictEqual(unbufferedNoCallsSum, 14);
        return false;
    });

    test('off', function () {
        var me = this;
        me.Class = xs.Class(function () {
            var Class = this;

            Class.namespace = 'tests.event.StaticObservable';

            Class.imports = [
                {Event: 'xs.event.Event'}
            ];

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
                },
                bufferedCalls: {
                    type: 'xs.event.Event'
                },
                bufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                eventWithoutOptions: undefined,
                eventWithoutType: {},
                eventWithIncorrectType: {
                    type: undefined
                },
                eventWithNonClassType: {
                    type: 'NotClass'
                },
                eventWithClassNotEvent: {
                    type: 'xs.class.Base'
                },
                eventWithIncorrectStoppable: {
                    type: 'xs.event.Event',
                    stoppable: null
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //check string event name only allowed
        throws(function () {
            me.Class.off(1);
        });

        //check event has to be registered
        throws(function () {
            me.Class.off('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            me.Class.off('add', {});
        });

        //check complete truncate scenario
        me.Class.on('add', function () {
        });
        me.Class.on('add', xs.emptyFn);
        me.Class.on('remove', xs.emptyFn);
        strictEqual(me.Class.private.eventsHandlers.add.size, 2);
        strictEqual(me.Class.private.eventsHandlers.remove.size, 1);
        me.Class.off();
        strictEqual(Object.keys(me.Class.private.eventsHandlers).length, 0);

        //check event truncate scenario
        me.Class.on('add', function () {
        });
        me.Class.on('add', xs.emptyFn);
        me.Class.on('remove', xs.emptyFn);
        strictEqual(me.Class.private.eventsHandlers.add.size, 2);
        strictEqual(me.Class.private.eventsHandlers.remove.size, 1);
        me.Class.off('add');
        strictEqual(me.Class.private.eventsHandlers.hasOwnProperty('add'), false);
        strictEqual(me.Class.private.eventsHandlers.remove.size, 1);
        me.Class.off();

        //check selector scenario
        me.Class.on('add', function () {
        });
        me.Class.on('add', xs.emptyFn);
        me.Class.on('remove', xs.emptyFn);
        strictEqual(me.Class.private.eventsHandlers.add.size, 2);
        strictEqual(me.Class.private.eventsHandlers.remove.size, 1);
        me.Class.off('add', function (item) {
            return item.handler === xs.emptyFn; //note, that by default, xs.core.Collection.removeBy removes only first matched element
        });
        strictEqual(me.Class.private.eventsHandlers.add.size, 1);
        strictEqual(me.Class.private.eventsHandlers.remove.size, 1);
    });

    test('suspend', function () {
        var me = this;
        me.Class = xs.Class(function () {
            var Class = this;

            Class.namespace = 'tests.event.StaticObservable';

            Class.imports = [
                {Event: 'xs.event.Event'}
            ];

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
                },
                bufferedCalls: {
                    type: 'xs.event.Event'
                },
                bufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                eventWithoutOptions: undefined,
                eventWithoutType: {},
                eventWithIncorrectType: {
                    type: undefined
                },
                eventWithNonClassType: {
                    type: 'NotClass'
                },
                eventWithClassNotEvent: {
                    type: 'xs.class.Base'
                },
                eventWithIncorrectStoppable: {
                    type: 'xs.event.Event',
                    stoppable: null
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //check string event name only allowed
        throws(function () {
            me.Class.suspend();
        });
        throws(function () {
            me.Class.suspend(1);
        });

        //check event has to be registered
        throws(function () {
            me.Class.suspend('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            me.Class.suspend('add', {});
        });

        //check all scenario
        var allSum = 5;
        me.Class.on('add', function (event) {
            allSum += event.data.mod;
        });
        me.Class.on('add', function (event) {
            allSum *= event.data.mod;
        });
        me.Class.fire('add', {mod: 5});
        strictEqual(allSum, 50);
        allSum = 5;
        me.Class.suspend('add');
        me.Class.fire('add', {mod: 5});
        strictEqual(allSum, 5);
        me.Class.off();

        //check selector scenario
        var scenarioSum = 5;
        me.Class.on('add', function (event) {
            scenarioSum += event.data.mod;
        });
        me.Class.on('add', function (event) {
            scenarioSum *= event.data.mod;
        });
        me.Class.fire('add', {mod: 5});
        strictEqual(scenarioSum, 50);
        scenarioSum = 5;
        me.Class.suspend('add', function () {
            return true; //note, that by default xs.core.Collection.find, used in suspend - matches only first item
        });
        me.Class.fire('add', {mod: 5});
        strictEqual(scenarioSum, 25);
        me.Class.off();
    });

    test('resume', function () {
        var me = this;
        me.Class = xs.Class(function () {
            var Class = this;

            Class.namespace = 'tests.event.StaticObservable';

            Class.imports = [
                {Event: 'xs.event.Event'}
            ];

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
                },
                bufferedCalls: {
                    type: 'xs.event.Event'
                },
                bufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedCalls: {
                    type: 'xs.event.Event'
                },
                unbufferedNoCalls: {
                    type: 'xs.event.Event'
                },
                eventWithoutOptions: undefined,
                eventWithoutType: {},
                eventWithIncorrectType: {
                    type: undefined
                },
                eventWithNonClassType: {
                    type: 'NotClass'
                },
                eventWithClassNotEvent: {
                    type: 'xs.class.Base'
                },
                eventWithIncorrectStoppable: {
                    type: 'xs.event.Event',
                    stoppable: null
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //check string event name only allowed
        throws(function () {
            me.Class.resume();
        });
        throws(function () {
            me.Class.resume(1);
        });

        //check event has to be registered
        throws(function () {
            me.Class.resume('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            me.Class.resume('add', {});
        });

        //check all scenario
        var allSum = 5;
        me.Class.on('add', function (event) {
            allSum += event.data.mod;
        });
        me.Class.on('add', function (event) {
            allSum *= event.data.mod;
        });
        me.Class.suspend('add');
        me.Class.fire('add', {mod: 5});
        strictEqual(allSum, 5);

        allSum = 5;
        me.Class.resume('add');
        me.Class.fire('add', {mod: 5});
        strictEqual(allSum, 50);
        me.Class.off();

        //check selector scenario
        var scenarioSum = 5;
        me.Class.on('add', function (event) {
            scenarioSum += event.data.mod;
        });
        me.Class.on('add', function (event) {
            scenarioSum *= event.data.mod;
        });
        me.Class.suspend('add');
        me.Class.fire('add', {mod: 5});
        strictEqual(scenarioSum, 5);

        scenarioSum = 5;
        me.Class.suspend('add');
        me.Class.resume('add', function () {
            return true; //note, that by default xs.core.Collection.find, used in suspend - matches only first item
        });
        me.Class.fire('add', {mod: 5});
        strictEqual(scenarioSum, 10);
        me.Class.off();
    });

});