/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.event.Observable', function () {

    'use strict';

    test('fire', function () {
        var me = this;
        me.Class = xs.Class(function (self) {
            var Class = this;

            Class.namespace = 'tests.event.Observable';

            Class.imports = [
                {
                    Event: 'xs.event.Event'
                }
            ];

            Class.mixins.observable = 'xs.event.Observable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
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

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me);
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var object = new me.Class();

        //check string event name only allowed
        throws(function () {
            object.fire();
        });
        throws(function () {
            object.fire(1);
        });

        //check data must be either given as object or not given
        throws(function () {
            object.fire('unknown', []);
        });

        //check event has to be registered
        throws(function () {
            object.fire('unknown');
        });

        //check event options must be an object
        throws(function () {
            object.fire('eventWithoutOptions');
        });

        //check event constructor name must be given
        throws(function () {
            object.fire('eventWithoutType');
        });

        //check event constructor name must be a string
        throws(function () {
            object.fire('eventWithIncorrectType');
        });

        //check event constructor is class
        throws(function () {
            object.fire('eventWithNonClassType');
        });

        //check event constructor implements IEvent interface
        throws(function () {
            object.fire('eventWithClassNotEvent');
        });

        //check stoppable, if given, is boolean
        throws(function () {
            object.fire('eventWithIncorrectStoppable');
        });

        //by default - no eventsHandlers collection
        strictEqual(Object.keys(object.private.eventsHandlers).length, 0);

        //check stoppable event firing
        var stoppableSum = 5;
        object.on('add', function (event) {
            stoppableSum *= event.data.mod;
        });
        object.on('add', function (event) {
            stoppableSum -= event.data.mod;

            return false;
        });
        object.on('add', function (event) {
            stoppableSum /= event.data.mod;
        });

        //verify value, returned by fire
        strictEqual(object.fire('add', {
            mod: 5
        }), false);
        strictEqual(stoppableSum, 20);

        //check non-stoppable event firing
        var unstoppableSum = 5;
        object.on('remove', function (event) {
            unstoppableSum *= event.data.mod;
        });
        object.on('remove', function (event) {
            unstoppableSum -= event.data.mod;

            return false;
        });
        object.on('remove', function (event) {
            unstoppableSum /= event.data.mod;
        });
        strictEqual(object.fire('remove', {
            mod: 5
        }), true);
        strictEqual(unstoppableSum, 4);
    });

    test('on', function () {
        var me = this;
        me.Class = xs.Class(function (self) {
            var Class = this;

            Class.namespace = 'tests.event.Observable';

            Class.imports = [
                {
                    Event: 'xs.event.Event'
                }
            ];

            Class.mixins.observable = 'xs.event.Observable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
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

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me);
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var object = new me.Class();

        //check string event name only allowed
        throws(function () {
            object.on();
        });
        throws(function () {
            object.on(1);
        });

        //check event has to be registered
        throws(function () {
            object.on('unknown');
        });

        //check handler has to be function
        throws(function () {
            object.on('add');
        });
        throws(function () {
            object.on('add', {});
        });

        //check duplicate handler denied
        var duplicateHandler = function () {
        };

        //by default - no eventsHandlers collection
        strictEqual(Object.keys(object.private.eventsHandlers).length, 0);

        object.on('add', duplicateHandler);
        throws(function () {
            object.on('add', duplicateHandler);
        });

        //add listeners collection created
        strictEqual(object.private.eventsHandlers.hasOwnProperty('add'), true);

        object.off();

        //check options must be either given as object or not given
        throws(function () {
            object.on('add', xs.noop, undefined);
        });

        //check simple case without options - only event and handler
        object.on('add', xs.noop);
        strictEqual(object.private.eventsHandlers.add.size, 1);
        strictEqual(object.private.eventsHandlers.add.at(0).handler, xs.noop);
        object.off();

        //check buffer, if given, must be number
        throws(function () {
            object.on('add', xs.noop, {
                buffer: undefined
            });
        });

        //check buffer must be positive integer number
        throws(function () {
            object.on('add', xs.noop, {
                buffer: 0.5
            });
        });

        //check calls, if given, must be number
        throws(function () {
            object.on('add', xs.noop, {
                calls: undefined
            });
        });

        //check calls must be positive integer number
        throws(function () {
            object.on('add', xs.noop, {
                calls: 0.5
            });
        });

        //check priority, if given, must be number
        throws(function () {
            object.on('add', xs.noop, {
                priority: undefined
            });
        });

        //check simple case with priority
        var fn1 = function () {
        };
        var fn2 = function () {
        };
        object.on('add', fn1);
        object.on('add', fn2, {
            priority: 0
        });
        object.off();

        //check buffered handler with calls
        var bufferedCallsSum = 5;
        var bufferedCallsObject = new me.Class();
        bufferedCallsObject.on('add', function (event) {
            bufferedCallsSum += event.data.mod;
        }, {
            buffer: 1,
            calls: 1
        });

        bufferedCallsObject.fire('add', {
            mod: 5
        });
        bufferedCallsObject.fire('add', {
            mod: 4
        });
        setTimeout(function () {
            bufferedCallsObject.fire('add', {
                mod: 4
            });
            setTimeout(function () {
                bufferedCallsObject.off();
                strictEqual(bufferedCallsSum, 9);
            }, 5);
        }, 5);

        //check buffered handler without calls
        var bufferedNoCallsSum = 5;
        var bufferedNoCallsObject = new me.Class();
        bufferedNoCallsObject.on('add', function (event) {
            bufferedNoCallsSum += event.data.mod;
        }, {
            buffer: 1
        });

        bufferedNoCallsObject.fire('add', {
            mod: 5
        });
        bufferedNoCallsObject.fire('add', {
            mod: 4
        });
        setTimeout(function () {
            bufferedNoCallsObject.fire('add', {
                mod: 4
            });
            setTimeout(function () {
                bufferedNoCallsObject.off();
                strictEqual(bufferedNoCallsSum, 13);
                me.done();
            }, 5);
        }, 5);

        //check unbuffered handler with calls
        var unbufferedCallsSum = 5;
        var unbufferedCallsObject = new me.Class();
        unbufferedCallsObject.on('add', function (event) {
            unbufferedCallsSum += event.data.mod;
        }, {
            calls: 1
        });

        unbufferedCallsObject.fire('add', {
            mod: 5
        });
        unbufferedCallsObject.fire('add', {
            mod: 4
        });
        strictEqual(unbufferedCallsSum, 10);

        //check unbuffered handler without calls
        var unbufferedNoCallsSum = 5;
        var unbufferedNoCallsObject = new me.Class();
        unbufferedNoCallsObject.on('add', function (event) {
            unbufferedNoCallsSum += event.data.mod;
        });

        unbufferedNoCallsObject.fire('add', {
            mod: 5
        });
        unbufferedNoCallsObject.fire('add', {
            mod: 4
        });
        strictEqual(unbufferedNoCallsSum, 14);

        return false;
    });

    test('off', function () {
        var me = this;
        me.Class = xs.Class(function (self) {
            var Class = this;

            Class.namespace = 'tests.event.Observable';

            Class.imports = [
                {
                    Event: 'xs.event.Event'
                }
            ];

            Class.mixins.observable = 'xs.event.Observable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
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

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me);
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var object = new me.Class();

        //check string event name only allowed
        throws(function () {
            object.off(1);
        });

        //check event has to be registered
        throws(function () {
            object.off('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            object.off('add', {});
        });

        //check complete truncate scenario
        object.on('add', function () {
        });
        object.on('add', xs.noop);
        object.on('remove', xs.noop);
        strictEqual(object.private.eventsHandlers.add.size, 2);
        strictEqual(object.private.eventsHandlers.remove.size, 1);
        object.off();
        strictEqual(Object.keys(object.private.eventsHandlers).length, 0);

        //check event truncate scenario
        object.on('add', function () {
        });
        object.on('add', xs.noop);
        object.on('remove', xs.noop);
        strictEqual(object.private.eventsHandlers.add.size, 2);
        strictEqual(object.private.eventsHandlers.remove.size, 1);
        object.off('add');
        strictEqual(object.private.eventsHandlers.hasOwnProperty('add'), false);
        strictEqual(object.private.eventsHandlers.remove.size, 1);
        object.off();

        //check selector scenario
        object.on('add', function () {
        });
        object.on('add', xs.noop);
        object.on('remove', xs.noop);
        strictEqual(object.private.eventsHandlers.add.size, 2);
        strictEqual(object.private.eventsHandlers.remove.size, 1);
        object.off('add', function (item) {
            return item.handler === xs.noop; //note, that by default, xs.core.Collection.removeBy removes only first matched element
        });
        strictEqual(object.private.eventsHandlers.add.size, 1);
        strictEqual(object.private.eventsHandlers.remove.size, 1);
    });

    test('suspend', function () {
        var me = this;
        me.Class = xs.Class(function (self) {
            var Class = this;

            Class.namespace = 'tests.event.Observable';

            Class.imports = [
                {
                    Event: 'xs.event.Event'
                }
            ];

            Class.mixins.observable = 'xs.event.Observable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
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

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me);
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var object = new me.Class();

        //check string event name only allowed
        throws(function () {
            object.suspend();
        });
        throws(function () {
            object.suspend(1);
        });

        //check event has to be registered
        throws(function () {
            object.suspend('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            object.suspend('add', {});
        });

        //check all scenario
        var allSum = 5;
        object.on('add', function (event) {
            allSum += event.data.mod;
        });
        object.on('add', function (event) {
            allSum *= event.data.mod;
        });
        object.fire('add', {
            mod: 5
        });
        strictEqual(allSum, 50);
        allSum = 5;
        object.suspend('add');
        object.fire('add', {
            mod: 5
        });
        strictEqual(allSum, 5);
        object.off();

        //check selector scenario
        var scenarioSum = 5;
        object.on('add', function (event) {
            scenarioSum += event.data.mod;
        });
        object.on('add', function (event) {
            scenarioSum *= event.data.mod;
        });
        object.fire('add', {
            mod: 5
        });
        strictEqual(scenarioSum, 50);
        scenarioSum = 5;
        object.suspend('add', function () {
            return true; //note, that by default xs.core.Collection.find, used in suspend - matches only first item
        });
        object.fire('add', {
            mod: 5
        });
        strictEqual(scenarioSum, 25);
        object.off();
    });

    test('resume', function () {
        var me = this;
        me.Class = xs.Class(function (self) {
            var Class = this;

            Class.namespace = 'tests.event.Observable';

            Class.imports = [
                {
                    Event: 'xs.event.Event'
                }
            ];

            Class.mixins.observable = 'xs.event.Observable';

            Class.constant.events = {
                add: {
                    type: 'xs.event.Event'
                },
                remove: {
                    type: 'xs.event.Event',
                    stoppable: false
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

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me);
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var object = new me.Class();

        //check string event name only allowed
        throws(function () {
            object.resume();
        });
        throws(function () {
            object.resume(1);
        });

        //check event has to be registered
        throws(function () {
            object.resume('unknown');
        });

        //check selector, if given, has to be function
        throws(function () {
            object.resume('add', {});
        });

        //check all scenario
        var allSum = 5;
        object.on('add', function (event) {
            allSum += event.data.mod;
        });
        object.on('add', function (event) {
            allSum *= event.data.mod;
        });
        object.suspend('add');
        object.fire('add', {
            mod: 5
        });
        strictEqual(allSum, 5);

        allSum = 5;
        object.resume('add');
        object.fire('add', {
            mod: 5
        });
        strictEqual(allSum, 50);
        object.off();

        //check selector scenario
        var scenarioSum = 5;
        object.on('add', function (event) {
            scenarioSum += event.data.mod;
        });
        object.on('add', function (event) {
            scenarioSum *= event.data.mod;
        });
        object.suspend('add');
        object.fire('add', {
            mod: 5
        });
        strictEqual(scenarioSum, 5);

        scenarioSum = 5;
        object.suspend('add');
        object.resume('add', function () {
            return true; //note, that by default xs.core.Collection.find, used in suspend - matches only first item
        });
        object.fire('add', {
            mod: 5
        });
        strictEqual(scenarioSum, 10);
        object.off();
    });

});