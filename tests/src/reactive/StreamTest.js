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

        me.generator = function (stream) {
            return {
                on: function () {
                    stream.send(null);
                    stream.destroy();
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

        me.generator = function (stream) {
            return {
                on: function () {
                    stream.send(null);
                    stream.destroy();
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
            log += arguments.length + data;
        }, {
            target: [
                xs.reactive.event.Data,
                xs.reactive.event.Destroy
            ]
        });

        //stream is not active and destroyed
        strictEqual(me.stream.isDestroyed, true);

    });

    test('send', function () {
        var me = this;

        me.generator = function (stream) {
            var emitter = function () {
                //send initial value silently
                stream.send(null, true);

                var i = 0;

                while (i < 10) {
                    //if send ok, continue
                    if (stream.send(i)) {
                        i++;

                        //if send cancelled, send null and end
                    } else {
                        stream.send(null);
                        stream.destroy();

                        return;
                    }
                }
                stream.destroy();
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

        me.stream.on(function (event) {
            if (event.data === 5) {
                return false;
            }
        });

        me.stream.on(function (event) {
            log += event.data;
        });

        me.stream.on(function () {
            //stream is not active and destroyed
            strictEqual(me.stream.isDestroyed, true);

            //check log
            strictEqual(log, '01234null');

            me.done();
        }, {
            target: xs.reactive.event.Destroy
        });

        return false;
    });

    test('on', function () {
        var me = this;

        me.generator = function (stream) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                stream.send(i);
                i--;

                if (i === 0) {
                    stream.destroy();
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

        //not a function handler throws
        throws(function () {
            me.stream.on(null);
        });

        //not an object second argument throws
        throws(function () {
            me.stream.on(xs.noop, null);
        });


        var log = {
            simple: '',
            targeted: '',
            suspended: '',
            scoped: '',
            positioned: ''
        };

        //method can be added with initially suspended state
        me.stream.on(function (event) {
            log.suspended += event.data;
        }, {
            suspended: true
        });

        //this way stream is still inactive
        strictEqual(me.stream.isActive, false);

        //simply method appends new handler, that has undefined scope, xs.reactive.event.Data target and is not suspended
        me.stream.on(function (event) {
            log.simple += event.data;
        });

        //incorrect target throws exception
        throws(function () {
            me.stream.on(xs.noop, {
                target: null
            });
        });

        //incorrect priority throws exception
        throws(function () {
            me.stream.on(xs.noop, {
                priority: null
            });
        });

        //method can be targeted directly with target type flags
        me.stream.on(function (event) {
            log.targeted += event.data;
        }, {
            target: xs.reactive.event.Destroy
        });

        //method can be called within given scope
        me.stream.on(function (event) {
            log.scoped += event.data + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.stream.on(function (event) {
            log.positioned += event.data;

            if (event.data === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.stream.on(function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.targeted, 'undefined');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            me.done();
        }, {
            target: xs.reactive.event.Destroy
        });

        return false;
    });

    test('off', function () {
        var me = this;

        me.generator = function (stream) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                stream.send(i);
                i--;

                if (i === 0) {
                    stream.destroy();
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

        me.stream = new xs.reactive.Stream(me.generator);

        me.stream.on(xs.noop);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //empty argument - removes all handlers
        me.stream.off();

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.stream.on(xs.noop);
        me.stream.on(xs.noop);
        me.stream.on(function () {

        });

        //remove first handler
        me.stream.off(function () {

            return true;
        });

        //stream is active
        strictEqual(me.stream.isActive, true);

        //remove all left handlers
        me.stream.off(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);
    }, function () {
        var me = this;
        me.stream.destroy();
    });

    test('suspend', function () {
        var me = this;

        me.generator = function (stream) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                stream.send(i);
                i--;

                if (i === 0) {
                    stream.destroy();
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

        me.stream = new xs.reactive.Stream(me.generator);

        me.stream.on(xs.noop);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //empty argument - suspends all handlers
        me.stream.suspend();

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.find is called
        me.stream.on(xs.noop);
        me.stream.on(xs.noop);
        me.stream.on(function () {

        });

        //suspend first handler
        me.stream.suspend(function () {

            return true;
        });

        //stream is active
        strictEqual(me.stream.isActive, true);

        //suspend all left handlers
        me.stream.suspend(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.stream.isActive, false);
    }, function () {
        var me = this;
        me.stream.destroy();
    });

    test('resume', function () {
        var me = this;

        me.generator = function (stream) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                stream.send(i);
                i--;

                if (i === 0) {
                    stream.destroy();
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

        me.stream = new xs.reactive.Stream(me.generator);

        me.stream.on(xs.noop);

        me.stream.suspend();

        //stream is inactive
        strictEqual(me.stream.isActive, false);

        //empty argument - resumes all handlers
        me.stream.resume();

        //stream is activated
        strictEqual(me.stream.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.stream.on(xs.noop);
        me.stream.on(xs.noop);
        me.stream.on(function () {

        });

        me.stream.suspend();

        //resume first handler
        me.stream.resume(function () {

            return true;
        });

        //stream is activated
        strictEqual(me.stream.isActive, true);

        //resume all left handlers
        me.stream.resume(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is active
        strictEqual(me.stream.isActive, true);
    }, function () {
        var me = this;
        me.stream.destroy();
    });

    test('fromPromise', function () {
        var me = this;

        var promise;

        //resolved promise
        promise = new xs.core.Promise();
        var resolved = xs.reactive.Stream.fromPromise(promise);

        var logResolved = [];
        resolved.on(function (event) {
            logResolved.push(event.data);
        });
        resolved.on(function () {
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
        }, {
            target: xs.reactive.event.Destroy
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
        rejected.on(function (event) {
            logRejected.push(event.data);
        });
        rejected.on(function () {
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
        }, {
            target: xs.reactive.event.Destroy
        });

        //update one
        promise.update(35);

        //update two
        promise.update(70);

        //reject
        promise.reject('fail');

        return false;
    });

});