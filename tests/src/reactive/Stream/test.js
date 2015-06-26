/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.reactive.Stream', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            return {
                on: function () {
                    me.send(null);
                    me.destroy();
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        //generator must be given
        throws(function () {
            return new xs.reactive.Stream();
        });

        //sources must be an array
        throws(function () {
            return new xs.reactive.Stream(me.generator, undefined);
        });

        //generator must return object or undefined
        me.stream = new xs.reactive.Stream(xs.noop);
        throws(function () {
            return new xs.reactive.Stream(function () {
                return null;
            });
        });

        //return.on must be a function
        throws(function () {

            return new xs.reactive.Stream(function () {

                return {};
            });
        });

        //return.off must be a function
        throws(function () {

            return new xs.reactive.Stream(function () {

                return {
                    on: xs.noop
                };
            });
        });

        //correct generator given
        me.stream = new xs.reactive.Stream(me.generator);

        //check basics
        strictEqual(me.stream.isActive, false);

    }, function () {
        var me = this;
        me.stream.destroy();
    });

    test('basics', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            return {
                on: function () {
                    me.send(null);
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        me.stream = new xs.reactive.Stream(me.generator);

        //stream is not active and not destroyed
        strictEqual(me.stream.isActive, false);
        strictEqual(me.stream.isDestroyed, false);

        me.stream.on(xs.reactive.event.Destroy, function () {
            //stream is not active and destroyed
            strictEqual(me.stream.isDestroyed, true);

            me.done();
        });

        xs.nextTick(function () {
            me.stream.destroy();
        });

        return false;
    });

    test('send', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            var emitter = function () {
                //send initial value silently
                me.send(null, true);

                var i = 0;

                while (i < 10) {
                    //if send ok, continue
                    if (me.send(i)) {
                        i++;

                        //if send cancelled, send null and end
                    } else {
                        me.send(null);
                        me.destroy();

                        return;
                    }
                }
                me.destroy();
            };

            return {
                on: function () {
                    xs.nextTick(emitter);
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        me.stream = new xs.reactive.Stream(me.generator);

        //stream is not active and not destroyed
        strictEqual(me.stream.isActive, false);
        strictEqual(me.stream.isDestroyed, false);

        var log = '';

        me.stream.on(function (data) {
            if (data === 5) {
                return false;
            }
        });

        me.stream.on(function (data) {
            log += data;
        });

        me.stream.on(xs.reactive.event.Destroy, function () {
            //stream is not active and destroyed
            strictEqual(me.stream.isDestroyed, true);

            //check log
            strictEqual(log, '01234null');

            me.done();
        });

        return false;
    });

    test('on', function () {
        var me = this;

        var EventOne = me.EventOne = function (value) {
            this.value = value;
        };
        xs.extend(EventOne, Event);

        var EventTwo = me.EventTwo = function (value) {
            this.value = value;
        };
        xs.extend(EventTwo, Event);

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                if (i % 2) {
                    me.send(new EventOne(i));
                } else {
                    me.send(new EventTwo(i));
                }
                i--;

                if (i === 0) {
                    me.destroy();
                }
            };

            return {
                on: function () {
                    intervalId = setInterval(generator, interval);
                },
                off: function () {
                    clearInterval(intervalId);
                }
            };
        };
    }, function () {
        var me = this;

        //correct generator given
        me.stream = new xs.reactive.Stream(me.generator);

        //no handler throws
        throws(function () {
            me.stream.on();
        });

        //not a function handler throws
        throws(function () {
            me.stream.on(null);
        });

        //incorrect event throws
        throws(function () {
            me.stream.on(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.stream.on(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.stream.on(MouseEvent, xs.noop, null);
        });


        var log = {
            simple: '',
            evented: '',
            suspended: '',
            scoped: '',
            positioned: '',
            internal: []
        };

        //add listeners for internal events
        var logInternals = xs.bind(log.internal.push, log.internal);
        me.stream.on(xs.reactive.event.Resume, logInternals);
        me.stream.on(xs.reactive.event.Suspend, logInternals);
        me.stream.on(xs.reactive.event.Destroy, logInternals);

        //stream is inactive, because only internal handlers added
        strictEqual(me.stream.isActive, false);

        //method can be added with initially non-active state
        me.stream.on(function (data) {
            log.suspended += data.value;
        }, {
            active: false
        });

        //this way stream is still inactive
        strictEqual(me.stream.isActive, false);

        //simply method appends new handler, that has undefined scope, undefined event and is active
        me.stream.on(function (data) {
            log.simple += data.value;
        });

        //and stream becomes active
        strictEqual(me.stream.isActive, true);

        //but internal log is empty - stream is not destroyed and not event-related handlers still added
        strictEqual(log.internal.length, 0);

        //incorrect priority throws exception
        throws(function () {
            me.stream.on(xs.noop, {
                priority: null
            });
        });

        //method can be evented directly, specifying event constructor(s)
        me.stream.on(me.EventOne, function (data) {
            log.evented += 'one' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventOne);
            });
        });
        me.stream.on(me.EventTwo, function (data) {
            log.evented += 'two' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventTwo);
            });
        });

        //internal log contains 2 resume events for added event-related handlers
        strictEqual(log.internal.length, 2);
        strictEqual(log.internal[ 0 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 0 ].event, me.EventOne);
        strictEqual(log.internal[ 1 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 1 ].event, me.EventTwo);

        me.stream.on(xs.reactive.event.Destroy, function () {
            log.evented += 'destroyed';
        });

        //method can be called within given scope
        me.stream.on(function (data) {
            log.scoped += data.value + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.stream.on(function (data) {
            log.positioned += data.value;

            if (data.value === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.stream.on(xs.reactive.event.Destroy, function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.evented, 'two10one9destroyed');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented

            //verify internal log
            strictEqual(log.internal.length, 5);
            strictEqual(log.internal[ 2 ].constructor, xs.reactive.event.Suspend);
            strictEqual(log.internal[ 2 ].event, me.EventTwo);
            strictEqual(log.internal[ 3 ].constructor, xs.reactive.event.Suspend);
            strictEqual(log.internal[ 3 ].event, me.EventOne);
            strictEqual(log.internal[ 4 ].constructor, xs.reactive.event.Destroy);

            me.done();
        });

        return false;
    });

    test('off', function () {
        var me = this;

        var EventOne = me.EventOne = function (value) {
            this.value = value;
        };
        xs.extend(EventOne, Event);

        var EventTwo = me.EventTwo = function (value) {
            this.value = value;
        };
        xs.extend(EventTwo, Event);

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                if (i % 2) {
                    me.send(new EventOne(i));
                } else {
                    me.send(new EventTwo(i));
                }
                i--;

                if (i === 0) {
                    me.destroy();
                }
            };

            return {
                on: function () {
                    intervalId = setInterval(generator, interval);
                },
                off: function () {
                    clearInterval(intervalId);
                }
            };
        };
    }, function () {
        var me = this;

        //correct generator given
        me.stream = new xs.reactive.Stream(me.generator);

        //add listeners for internal events
        var log = {
            internal: []
        };
        var logInternals = xs.bind(log.internal.push, log.internal);
        me.stream.on(xs.reactive.event.Resume, logInternals);
        me.stream.on(xs.reactive.event.Suspend, logInternals);
        me.stream.on(xs.reactive.event.Destroy, logInternals);

        //not a function handler throws
        throws(function () {
            me.stream.off(null);
        });

        //incorrect event throws
        throws(function () {
            me.stream.off(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.stream.off(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.stream.off(MouseEvent, xs.noop, null);
        });

        me.stream.on(xs.noop);

        me.stream.on(me.EventOne, function (data) {
            log.evented += 'one' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventOne);
            });
        });
        me.stream.on(me.EventTwo, function (data) {
            log.evented += 'two' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventTwo);
            });
        });

        //internal log contains 2 resume events for added event-related handlers
        strictEqual(log.internal.length, 2);
        strictEqual(log.internal[ 0 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 0 ].event, me.EventOne);
        strictEqual(log.internal[ 1 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 1 ].event, me.EventTwo);

        //empty argument - removes all external handlers
        me.stream.off();

        //internal log contains 2 new suspend events for removed event-related handlers
        strictEqual(log.internal.length, 4);
        strictEqual(log.internal[ 2 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 2 ].event, me.EventOne);
        strictEqual(log.internal[ 3 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 3 ].event, me.EventTwo);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventTwo, function () {

        });

        //verify internal log
        strictEqual(log.internal.length, 6);
        strictEqual(log.internal[ 4 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 4 ].event, me.EventOne);
        strictEqual(log.internal[ 5 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 5 ].event, me.EventTwo);

        //remove first handler
        me.stream.off(function () {

            return true;
        });

        //verify internal log
        strictEqual(log.internal.length, 6);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //remove all left handlers
        me.stream.off(function () {

            return true;
        }, xs.core.Collection.All);

        //verify internal log
        strictEqual(log.internal.length, 8);
        strictEqual(log.internal[ 6 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 6 ].event, me.EventOne);
        strictEqual(log.internal[ 7 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 7 ].event, me.EventTwo);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);

        me.stream.on(xs.reactive.event.Destroy, function () {

            //verify internal log
            strictEqual(log.internal.length, 9);
            strictEqual(log.internal[ 8 ].constructor, xs.reactive.event.Destroy);

            me.done();
        });

        xs.nextTick(function () {
            me.stream.destroy();
        });

        return false;
    });

    test('suspend', function () {
        var me = this;

        var EventOne = me.EventOne = function (value) {
            this.value = value;
        };
        xs.extend(EventOne, Event);

        var EventTwo = me.EventTwo = function (value) {
            this.value = value;
        };
        xs.extend(EventTwo, Event);

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                if (i % 2) {
                    me.send(new EventOne(i));
                } else {
                    me.send(new EventTwo(i));
                }
                i--;

                if (i === 0) {
                    me.destroy();
                }
            };

            return {
                on: function () {
                    intervalId = setInterval(generator, interval);
                },
                off: function () {
                    clearInterval(intervalId);
                }
            };
        };
    }, function () {
        var me = this;

        //correct generator given
        me.stream = new xs.reactive.Stream(me.generator);

        //add listeners for internal events
        var log = {
            internal: []
        };
        var logInternals = xs.bind(log.internal.push, log.internal);
        me.stream.on(xs.reactive.event.Resume, logInternals);
        me.stream.on(xs.reactive.event.Suspend, logInternals);
        me.stream.on(xs.reactive.event.Destroy, logInternals);

        //not a function handler throws
        throws(function () {
            me.stream.suspend(null);
        });

        //incorrect event throws
        throws(function () {
            me.stream.suspend(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.stream.suspend(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.stream.suspend(MouseEvent, xs.noop, null);
        });

        me.stream.on(xs.noop);

        me.stream.on(me.EventOne, function (data) {
            log.evented += 'one' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventOne);
            });
        });
        me.stream.on(me.EventTwo, function (data) {
            log.evented += 'two' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventTwo);
            });
        });

        //internal log contains 2 resume events for added event-related handlers
        strictEqual(log.internal.length, 2);
        strictEqual(log.internal[ 0 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 0 ].event, me.EventOne);
        strictEqual(log.internal[ 1 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 1 ].event, me.EventTwo);

        //empty argument - suspends all handlers
        me.stream.suspend();

        //internal log contains 2 new suspend events for removed event-related handlers
        strictEqual(log.internal.length, 4);
        strictEqual(log.internal[ 2 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 2 ].event, me.EventOne);
        strictEqual(log.internal[ 3 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 3 ].event, me.EventTwo);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.find is called
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventTwo, function () {

        });

        //verify internal log
        strictEqual(log.internal.length, 6);
        strictEqual(log.internal[ 4 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 4 ].event, me.EventOne);
        strictEqual(log.internal[ 5 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 5 ].event, me.EventTwo);

        //suspend first handler
        me.stream.suspend(function () {

            return true;
        });

        //verify internal log
        strictEqual(log.internal.length, 6);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //suspend all left handlers
        me.stream.suspend(function () {

            return true;
        }, xs.core.Collection.All);

        //verify internal log
        strictEqual(log.internal.length, 8);
        strictEqual(log.internal[ 6 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 6 ].event, me.EventOne);
        strictEqual(log.internal[ 7 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 7 ].event, me.EventTwo);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);

        me.stream.on(xs.reactive.event.Destroy, function () {

            //verify internal log
            strictEqual(log.internal.length, 9);
            strictEqual(log.internal[ 8 ].constructor, xs.reactive.event.Destroy);

            me.done();
        });

        xs.nextTick(function () {
            me.stream.destroy();
        });

        return false;
    });

    test('resume', function () {
        var me = this;

        var EventOne = me.EventOne = function (value) {
            this.value = value;
        };
        xs.extend(EventOne, Event);

        var EventTwo = me.EventTwo = function (value) {
            this.value = value;
        };
        xs.extend(EventTwo, Event);

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                if (i % 2) {
                    me.send(new EventOne(i));
                } else {
                    me.send(new EventTwo(i));
                }
                i--;

                if (i === 0) {
                    me.destroy();
                }
            };

            return {
                on: function () {
                    intervalId = setInterval(generator, interval);
                },
                off: function () {
                    clearInterval(intervalId);
                }
            };
        };
    }, function () {
        var me = this;

        //correct generator given
        me.stream = new xs.reactive.Stream(me.generator);

        //add listeners for internal events
        var log = {
            internal: []
        };
        var logInternals = xs.bind(log.internal.push, log.internal);
        me.stream.on(xs.reactive.event.Resume, logInternals);
        me.stream.on(xs.reactive.event.Suspend, logInternals);
        me.stream.on(xs.reactive.event.Destroy, logInternals);


        //not a function handler throws
        throws(function () {
            me.stream.resume(null);
        });

        //incorrect event throws
        throws(function () {
            me.stream.resume(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.stream.resume(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.stream.resume(MouseEvent, xs.noop, null);
        });

        me.stream.on(xs.noop);

        me.stream.on(me.EventOne, function (data) {
            log.evented += 'one' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventOne);
            });
        });
        me.stream.on(me.EventTwo, function (data) {
            log.evented += 'two' + data.value;

            xs.nextTick(function () {
                me.stream.off(me.EventTwo);
            });
        });

        //internal log contains 2 resume events for added event-related handlers
        strictEqual(log.internal.length, 2);
        strictEqual(log.internal[ 0 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 0 ].event, me.EventOne);
        strictEqual(log.internal[ 1 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 1 ].event, me.EventTwo);

        me.stream.suspend();

        //internal log contains 2 new suspend events for suspended event-related handlers
        strictEqual(log.internal.length, 4);
        strictEqual(log.internal[ 2 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 2 ].event, me.EventOne);
        strictEqual(log.internal[ 3 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 3 ].event, me.EventTwo);

        //stream is inactive
        strictEqual(me.stream.isActive, false);

        //empty argument - resumes all handlers
        me.stream.resume();

        //internal log contains 2 new resume events for resumed event-related handlers
        strictEqual(log.internal.length, 6);
        strictEqual(log.internal[ 4 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 4 ].event, me.EventOne);
        strictEqual(log.internal[ 5 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 5 ].event, me.EventTwo);

        //stream is activated
        strictEqual(me.stream.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventOne, xs.noop);
        me.stream.on(me.EventTwo, function () {

        });

        //verify internal log
        strictEqual(log.internal.length, 6);

        me.stream.suspend();

        //verify internal log
        strictEqual(log.internal.length, 8);
        strictEqual(log.internal[ 6 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 6 ].event, me.EventOne);
        strictEqual(log.internal[ 7 ].constructor, xs.reactive.event.Suspend);
        strictEqual(log.internal[ 7 ].event, me.EventTwo);

        //resume first handler
        me.stream.resume(function () {

            return true;
        });

        //verify internal log
        strictEqual(log.internal.length, 8);

        //stream is activated
        strictEqual(me.stream.isActive, true);

        //resume all left handlers
        me.stream.resume(function () {

            return true;
        }, xs.core.Collection.All);

        //internal log contains 2 new resume events for resumed event-related handlers
        strictEqual(log.internal.length, 10);
        strictEqual(log.internal[ 8 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 8 ].event, me.EventOne);
        strictEqual(log.internal[ 9 ].constructor, xs.reactive.event.Resume);
        strictEqual(log.internal[ 9 ].event, me.EventTwo);

        me.stream.on(xs.reactive.event.Destroy, function () {

            //verify internal log
            strictEqual(log.internal.length, 13);
            strictEqual(log.internal[ 10 ].constructor, xs.reactive.event.Suspend);
            strictEqual(log.internal[ 10 ].event, me.EventTwo);
            strictEqual(log.internal[ 11 ].constructor, xs.reactive.event.Suspend);
            strictEqual(log.internal[ 11 ].event, me.EventOne);
            strictEqual(log.internal[ 12 ].constructor, xs.reactive.event.Destroy);

            me.done();
        });

        return false;
    });

    test('fromPromise', function () {
        var me = this;

        var promise;

        //resolved promise
        promise = new xs.core.Promise();
        var resolved = xs.reactive.Stream.fromPromise(promise);

        var logResolved = [];
        resolved.on(function (data) {
            logResolved.push(data);
        });
        resolved.on(xs.reactive.event.Destroy, function () {
            strictEqual(JSON.stringify(logResolved), JSON.stringify([
                {
                    state: xs.core.Promise.Pending,
                    progress: 35
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 70
                },
                {
                    state: xs.core.Promise.Resolved,
                    data: 100
                }
            ]));
        });

        //update one
        promise.update(35);

        //update two
        promise.update(70);

        //resolve
        promise.resolve(100);

        //rejected promise
        promise = new xs.core.Promise();
        var rejected = xs.reactive.Stream.fromPromise(promise);

        var logRejected = [];
        rejected.on(function (data) {
            logRejected.push(data);
        });
        rejected.on(xs.reactive.event.Destroy, function () {
            strictEqual(JSON.stringify(logRejected), JSON.stringify([
                {
                    state: xs.core.Promise.Pending,
                    progress: 35
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 70
                },
                {
                    state: xs.core.Promise.Rejected,
                    error: 'fail'
                }
            ]));
            me.done();
        });

        //update one
        promise.update(35);

        //update two
        promise.update(70);

        //reject
        promise.reject('fail');

        return false;
    });

    test('fromEvent', function () {
        var me = this;

        var stream = xs.reactive.Stream.fromEvent(document.body, 'click');

        var log = [];
        stream.on(function (data) {
            log.push(data);
        });

        document.body.click();

        stream.on(xs.reactive.event.Destroy, function () {
            strictEqual(log.length, 1);

            me.done();
        });

        stream.destroy();

        return false;
    });

    test('toProperty', function () {
        var me = this;

        var log = [];
        (new xs.reactive.Stream(function () {
            var me = this;

            return {
                on: function () {
                    xs.nextTick(function () {
                        me.send(null);
                        xs.nextTick(function () {
                            me.destroy();
                        });
                    });
                },
                off: xs.noop
            };
        }))
            .toProperty(5)
            .on(function (data) {
                log.push({
                    data: data,
                    current: this.value
                });
            })
            .on(xs.reactive.event.Destroy, function () {
                strictEqual(JSON.stringify(log), JSON.stringify([
                    {
                        data: null,
                        current: 5
                    }
                ]));
                me.done();
            });

        return false;
    });

    test('map', function () {
        var me = this;

        var stream = new xs.reactive.Stream(function () {
            var me = this;

            xs.nextTick(function () {
                me.send(5);
                me.destroy();
            });
        });

        var log = [];
        stream
            .map(function (value) {

                return value * 2;
            })
            .on(function (data) {
                log.push(data);
            });

        stream.on(xs.reactive.event.Destroy, function () {
            strictEqual(JSON.stringify(log), '[10]');

            me.done();
        });

        return false;
    });

    test('filter', function () {
        var me = this;

        var stream = new xs.reactive.Stream(function () {
            var me = this;

            xs.nextTick(function () {
                me.send(5);
                me.send(10);
                me.destroy();
            });
        });

        var log = [];
        stream
            .filter(Number)
            .filter(function (value) {

                return value > 7;
            })
            .on(function (data) {
                log.push(data);
            });

        stream.on(xs.reactive.event.Destroy, function () {
            strictEqual(JSON.stringify(log), '[10]');

            me.done();
        });

        return false;
    });

    test('throttle', function () {
        var me = this;

        var stream = new xs.reactive.Stream(function () {
            var me = this;

            var interval = setInterval(function () {
                me.send((new Date()).valueOf());
            }, 0);
            setTimeout(function () {
                clearInterval(interval);
                me.destroy();
            }, 100);
        });

        var log = [];
        var diff = -Infinity;
        stream
            .throttle(15)
            .on(function (data) {
                log.push(data - diff);
                diff = data;
            })
            .on(xs.reactive.event.Destroy, function () {
                strictEqual((new xs.core.Collection(log)).all(function (value) {
                    return value >= 10;
                }), true);

                me.done();
            });

        return false;
    });

    test('debounce', function () {
        var me = this;

        var stream = new xs.reactive.Stream(function () {
            var me = this;

            var i = 0;
            var interval = setInterval(function () {
                me.send(++i);

                if (i === 10) {
                    clearInterval(interval);
                    me.destroy();
                }
            }, 5);
        });

        var log = [];
        stream
            .debounce(100)
            .on(function (data) {
                log.push(data);
            })
            .on(xs.reactive.event.Destroy, function () {
                strictEqual(JSON.stringify(log), '[1]');

                me.done();
            });

        return false;
    });

});