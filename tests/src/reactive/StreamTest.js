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
                    me.destroy();
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
        me.stream.on(xs.reactive.event.Destroy, function (data) {
            log += arguments.length + data;
        });

        //stream is not active and destroyed
        strictEqual(me.stream.isDestroyed, true);

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

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.send(i);
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

        //incorrect target throws
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
            targeted: '',
            suspended: '',
            scoped: '',
            positioned: ''
        };

        //method can be added with initially suspended state
        me.stream.on(function (data) {
            log.suspended += data;
        }, {
            suspended: true
        });

        //this way stream is still inactive
        strictEqual(me.stream.isActive, false);

        //simply method appends new handler, that has undefined scope, undefined target and is not suspended
        me.stream.on(function (data) {
            log.simple += data;
        });

        //incorrect priority throws exception
        throws(function () {
            me.stream.on(xs.noop, {
                priority: null
            });
        });

        //method can be targeted directly, specifying event constructor(s)
        me.stream.on(xs.reactive.event.Destroy, function () {
            log.targeted += 'destroyed';
        });

        //method can be called within given scope
        me.stream.on(function (data) {
            log.scoped += data + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.stream.on(function (data) {
            log.positioned += data;

            if (data === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.stream.on(xs.reactive.event.Destroy, function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.targeted, 'destroyed');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            me.done();
        });

        return false;
    });

    test('off', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.send(i);
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

        //not a function handler throws
        throws(function () {
            me.stream.off(null);
        });

        //incorrect target throws
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

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.send(i);
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

        //not a function handler throws
        throws(function () {
            me.stream.suspend(null);
        });

        //incorrect target throws
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

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.send(i);
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

        //not a function handler throws
        throws(function () {
            me.stream.resume(null);
        });

        //incorrect target throws
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
            strictEqual(log[ 0 ].constructor, MouseEvent);

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
            .debounce(10)
            .on(function (data) {
                log.push(data);
            })
            .on(xs.reactive.event.Destroy, function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            });

        return false;
    });

});