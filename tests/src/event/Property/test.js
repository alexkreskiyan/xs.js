/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.event.Property', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            return {
                on: function () {
                    me.set(null);
                    me.destroy();
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        //generator must be given
        throws(function () {
            return new xs.event.Property();
        });

        //sources must be an array
        throws(function () {
            return new xs.event.Property(me.generator, undefined, undefined);
        });

        //generator must return object or undefined
        me.property = new xs.event.Property(xs.noop);
        throws(function () {
            return new xs.event.Property(function () {
                return null;
            });
        });

        //return.on must be a function
        throws(function () {

            return new xs.event.Property(function () {

                return {};
            });
        });

        //return.off must be a function
        throws(function () {

            return new xs.event.Property(function () {

                return {
                    on: xs.noop
                };
            });
        });

        //correct generator given
        me.property = new xs.event.Property(me.generator);

        //check basics
        strictEqual(me.property.isActive, false);
        strictEqual(me.property.value, undefined);

    }, function () {
        var me = this;
        me.property.destroy();
    });

    test('basics', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            return {
                on: function () {
                    me.set(null);
                    me.destroy();
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        me.property = new xs.event.Property(me.generator);

        //stream is not active and not destroyed
        strictEqual(me.property.isActive, false);
        strictEqual(me.property.isDestroyed, false);

        var log = '';
        me.property.on(function (data) {
            log += arguments.length + data;
        });

        //stream is not active and destroyed
        strictEqual(me.property.isDestroyed, true);

    });

    test('set', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            var emitter = function () {
                //set initial value silently
                me.set(null, true);

                var i = 0;

                while (i < 10) {
                    //if set ok, continue
                    if (me.set(i)) {
                        i++;

                        //if set cancelled, set null and end
                    } else {
                        me.set(null);
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

        me.property = new xs.event.Property(me.generator);

        //stream is not active and not destroyed
        strictEqual(me.property.isActive, false);
        strictEqual(me.property.isDestroyed, false);

        var log = '';
        var value = '';

        me.property.on(function (data) {
            if (data === 5) {
                return false;
            }
        });

        me.property.on(function (data) {
            log += data;
            value += me.property.value;
            value += data;
        });

        me.property.on(xs.event.Destroy, function () {
            //stream is not active and destroyed
            strictEqual(me.property.isDestroyed, true);

            //check log and value
            strictEqual(log, '01234null');
            strictEqual(value, 'null0011223344null');

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
                me.set(i);
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
        me.property = new xs.event.Property(me.generator);

        //no handler throws
        throws(function () {
            me.property.on();
        });

        //not a function handler throws
        throws(function () {
            me.property.on(null);
        });

        //incorrect event throws
        throws(function () {
            me.property.on(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.property.on(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.property.on(MouseEvent, xs.noop, null);
        });


        var log = {
            simple: '',
            evented: '',
            suspended: '',
            scoped: '',
            positioned: ''
        };

        var value = '';

        //method can be added with initially suspended state
        me.property.on(function (data) {
            log.suspended += data;
        }, {
            suspended: true
        });

        //this way stream is still inactive
        strictEqual(me.property.isActive, false);

        //simply method appends new handler, that has undefined scope, undefined event and is not suspended
        me.property.on(function (data) {
            log.simple += data;
            value += me.property.value;
            value += data;
        });

        //incorrect priority throws exception
        throws(function () {
            me.property.on(xs.noop, {
                priority: null
            });
        });

        //method can be evented directly, specifying event constructor(s)
        me.property.on(xs.event.Destroy, function () {
            log.evented += 'destroyed';
        });

        //method can be called within given scope
        me.property.on(function (data) {
            log.scoped += data + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.property.on(function (data) {
            log.positioned += data;

            if (data === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.property.on(xs.event.Destroy, function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.evented, 'destroyed');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            //check value
            strictEqual(value.toString(), 'undefined1010998877664433221'); //5 is missing - cancelled
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
                me.set(i);
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
        me.property = new xs.event.Property(me.generator);

        //not a function handler throws
        throws(function () {
            me.property.off(null);
        });

        //incorrect event throws
        throws(function () {
            me.property.off(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.property.off(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.property.off(MouseEvent, xs.noop, null);
        });

        me.property.on(xs.noop);

        //stream is active
        strictEqual(me.property.isActive, true);

        //empty argument - removes all handlers
        me.property.off();

        //stream is deactivated
        strictEqual(me.property.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.property.on(xs.noop);
        me.property.on(xs.noop);
        me.property.on(function () {

        });

        //remove first handler
        me.property.off(function () {

            return true;
        });

        //stream is active
        strictEqual(me.property.isActive, true);

        //remove all left handlers
        me.property.off(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.property.isActive, false);
    }, function () {
        var me = this;
        me.property.destroy();
    });

    test('suspend', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.set(i);
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
        me.property = new xs.event.Property(me.generator);

        //not a function handler throws
        throws(function () {
            me.property.suspend(null);
        });

        //incorrect event throws
        throws(function () {
            me.property.suspend(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.property.suspend(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.property.suspend(MouseEvent, xs.noop, null);
        });

        me.property.on(xs.noop);

        //stream is active
        strictEqual(me.property.isActive, true);

        //empty argument - suspends all handlers
        me.property.suspend();

        //stream is deactivated
        strictEqual(me.property.isActive, false);


        //with given arguments, handlers.find is called
        me.property.on(xs.noop);
        me.property.on(xs.noop);
        me.property.on(function () {

        });

        //suspend first handler
        me.property.suspend(function () {

            return true;
        });

        //stream is active
        strictEqual(me.property.isActive, true);

        //suspend all left handlers
        me.property.suspend(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.property.isActive, false);
    }, function () {
        var me = this;
        me.property.destroy();
    });

    test('resume', function () {
        var me = this;

        me.generator = function () {
            var me = this;

            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                me.set(i);
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
        me.property = new xs.event.Property(me.generator);

        //not a function handler throws
        throws(function () {
            me.property.resume(null);
        });

        //incorrect event throws
        throws(function () {
            me.property.resume(null, xs.noop);
        });

        //incorrect options throws
        throws(function () {
            me.property.resume(xs.noop, null);
        });

        //incorrect options throws
        throws(function () {
            me.property.resume(MouseEvent, xs.noop, null);
        });

        me.property.on(xs.noop);

        me.property.suspend();

        //stream is inactive
        strictEqual(me.property.isActive, false);

        //empty argument - resumes all handlers
        me.property.resume();

        //stream is activated
        strictEqual(me.property.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.property.on(xs.noop);
        me.property.on(xs.noop);
        me.property.on(function () {

        });

        me.property.suspend();

        //resume first handler
        me.property.resume(function () {

            return true;
        });

        //stream is activated
        strictEqual(me.property.isActive, true);

        //resume all left handlers
        me.property.resume(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is active
        strictEqual(me.property.isActive, true);
    }, function () {
        var me = this;
        me.property.destroy();
    });

    test('fromPromise', function () {
        var me = this;

        var promise;

        //resolved promise
        promise = new xs.core.Promise();
        var resolved = xs.event.Property.fromPromise(promise);

        var logResolved = [];
        var valueResolved = [];
        resolved.on(function (data) {
            logResolved.push(data);
            valueResolved.push(resolved.value);
        });
        resolved.on(xs.event.Destroy, function () {
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
            strictEqual(JSON.stringify(valueResolved), JSON.stringify([
                {
                    state: xs.core.Promise.Pending,
                    progress: undefined
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 35
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 70
                }
            ]));
        });

        //check initial state
        strictEqual(JSON.stringify(resolved.value), '{"state":' + xs.core.Promise.Pending + '}');

        //update one
        promise.update(35);

        //update two
        promise.update(70);

        //resolve
        promise.resolve(100);

        //rejected promise
        promise = new xs.core.Promise();
        var rejected = xs.event.Property.fromPromise(promise);

        var logRejected = [];
        var valueRejected = [];
        rejected.on(function (data) {
            logRejected.push(data);
            valueRejected.push(rejected.value);
        });
        rejected.on(xs.event.Destroy, function () {
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
            strictEqual(JSON.stringify(valueRejected), JSON.stringify([
                {
                    state: xs.core.Promise.Pending,
                    progress: undefined
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 35
                },
                {
                    state: xs.core.Promise.Pending,
                    progress: 70
                }
            ]));
            me.done();
        });

        //check initial state
        strictEqual(JSON.stringify(rejected.value), '{"state":' + xs.core.Promise.Pending + '}');

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

        var property = xs.event.Property.fromEvent(document.body, 'click');

        var log = [];
        property.on(function (data) {
            log.push(data);
        });

        document.body.click();

        property.on(xs.event.Destroy, function () {
            strictEqual(log.length, 1);
            strictEqual(log[ 0 ].constructor, MouseEvent);

            me.done();
        });

        property.destroy();

        return false;
    });

    test('toStream', function () {
        var me = this;

        var log = [];
        (new xs.event.Property(function () {
            var me = this;

            return {
                on: function () {
                    xs.nextTick(function () {
                        me.set(null);
                        xs.nextTick(function () {
                            me.destroy();
                        });
                    });
                },
                off: xs.noop
            };
        }, 5))
            .toStream(true)
            .on(function (data) {
                log.push({
                    data: data
                });
            })
            .on(xs.event.Destroy, function () {
                strictEqual(JSON.stringify(log), JSON.stringify([
                    {
                        data: 5
                    },
                    {
                        data: null
                    }
                ]));
                me.done();
            });

        return false;
    });

    test('map', function () {
        var me = this;

        var property = new xs.event.Property(function () {
            var me = this;

            xs.nextTick(function () {
                me.set(5);
                me.destroy();
            });
        });

        var log = [];
        property
            .map(function (value) {

                return value * 2;
            })
            .on(function (data) {
                log.push(data);
            })
            .on(xs.event.Destroy, function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            });

        return false;
    });

    test('filter', function () {
        var me = this;

        var property = new xs.event.Property(function () {
            var me = this;

            xs.nextTick(function () {
                me.set(5);
                me.set(10);
                me.destroy();
            });
        });

        var log = [];
        property
            .filter(function (value) {

                return value > 7;
            })
            .on(function (data) {
                log.push(data);
            })
            .on(xs.event.Destroy, function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            });

        return false;
    });

    test('throttle', function () {
        var me = this;

        var property = new xs.event.Property(function () {
            var me = this;

            var interval = setInterval(function () {
                me.set((new Date()).valueOf());
            }, 0);
            setTimeout(function () {
                clearInterval(interval);
                me.destroy();
            }, 100);
        });

        var log = [];
        var diff = -Infinity;
        property
            .throttle(15)
            .on(function (data) {
                log.push(data - diff);
                diff = data;
            })
            .on(xs.event.Destroy, function () {
                strictEqual((new xs.core.Collection(log)).all(function (value) {
                    return value >= 10;
                }), true);

                me.done();
            });

        return false;
    });

    test('debounce', function () {
        var me = this;

        var property = new xs.event.Property(function () {
            var me = this;

            var i = 0;
            var interval = setInterval(function () {
                me.set(++i);

                if (i === 10) {
                    clearInterval(interval);
                    me.destroy();
                }
            }, 5);
        });

        var log = [];
        property
            .debounce(10)
            .on(function (data) {
                log.push(data);
            })
            .on(xs.event.Destroy, function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            });

        return false;
    });

});