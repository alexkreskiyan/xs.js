/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.reactive.Property', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        me.generator = function (property) {
            return {
                on: function () {
                    property.set(null);
                    property.destroy();
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        //generator must be given
        throws(function () {
            return new xs.reactive.Property();
        });

        //sources must be an array
        throws(function () {
            return new xs.reactive.Property(me.generator, undefined, undefined);
        });

        //generator must return object or undefined
        me.property = new xs.reactive.Property(xs.noop);
        throws(function () {
            return new xs.reactive.Property(function () {
                return null;
            });
        });

        //return.on must be a function
        throws(function () {

            return new xs.reactive.Property(function () {

                return {};
            });
        });

        //return.off must be a function
        throws(function () {

            return new xs.reactive.Property(function () {

                return {
                    on: xs.noop
                };
            });
        });

        //correct generator given
        me.property = new xs.reactive.Property(me.generator);

        //check basics
        strictEqual(me.property.isActive, false);
        strictEqual(me.property.value, undefined);

    }, function () {
        var me = this;
        me.property.destroy();
    });

    test('basics', function () {
        var me = this;

        me.generator = function (property) {
            return {
                on: function () {
                    property.set(null);
                    property.destroy();
                },
                off: xs.noop
            };
        };
    }, function () {
        var me = this;

        me.property = new xs.reactive.Property(me.generator);

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

        me.generator = function (property) {
            var emitter = function () {
                //set initial value silently
                property.set(null, true);

                var i = 0;

                while (i < 10) {
                    //if set ok, continue
                    if (property.set(i)) {
                        i++;

                        //if set cancelled, set null and end
                    } else {
                        property.set(null);
                        property.destroy();

                        return;
                    }
                }
                property.destroy();
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

        me.property = new xs.reactive.Property(me.generator);

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

        me.property.on(function () {
            //stream is not active and destroyed
            strictEqual(me.property.isDestroyed, true);

            //check log and value
            strictEqual(log, '01234null');
            strictEqual(value, 'null0011223344null');

            me.done();
        }, {
            target: xs.reactive.event.Destroy
        });

        return false;
    });

    test('on', function () {
        var me = this;

        me.generator = function (property) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                property.set(i);
                i--;

                if (i === 0) {
                    property.destroy();
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
        me.property = new xs.reactive.Property(me.generator);

        //not a function handler throws
        throws(function () {
            me.property.on(null);
        });

        //not an object second argument throws
        throws(function () {
            me.property.on(xs.noop, null);
        });


        var log = {
            simple: '',
            targeted: '',
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

        //simply method appends new handler, that has undefined scope, undefined target and is not suspended
        me.property.on(function (data) {
            log.simple += data;
            value += me.property.value;
            value += data;
        });

        //incorrect target throws exception
        throws(function () {
            me.property.on(xs.noop, {
                target: null
            });
        });

        //incorrect priority throws exception
        throws(function () {
            me.property.on(xs.noop, {
                priority: null
            });
        });

        //method can be targeted directly with target type flags
        me.property.on(function () {
            log.targeted += 'destroyed';
        }, {
            target: xs.reactive.event.Destroy
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

        me.property.on(function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.targeted, 'destroyed');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            //check value
            strictEqual(value.toString(), 'undefined1010998877664433221'); //5 is missing - cancelled
            me.done();
        }, {
            target: xs.reactive.event.Destroy
        });

        return false;
    });

    test('off', function () {
        var me = this;

        me.generator = function (property) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                property.set(i);
                i--;

                if (i === 0) {
                    property.destroy();
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

        me.property = new xs.reactive.Property(me.generator);

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

        me.generator = function (property) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                property.set(i);
                i--;

                if (i === 0) {
                    property.destroy();
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

        me.property = new xs.reactive.Property(me.generator);

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

        me.generator = function (property) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                property.set(i);
                i--;

                if (i === 0) {
                    property.destroy();
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

        me.property = new xs.reactive.Property(me.generator);

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
        var resolved = xs.reactive.Property.fromPromise(promise);

        var logResolved = [];
        var valueResolved = [];
        resolved.on(function (data) {
            logResolved.push(data);
            valueResolved.push(resolved.value);
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
        }, {
            target: xs.reactive.event.Destroy
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
        var rejected = xs.reactive.Property.fromPromise(promise);

        var logRejected = [];
        var valueRejected = [];
        rejected.on(function (data) {
            logRejected.push(data);
            valueRejected.push(rejected.value);
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
        }, {
            target: xs.reactive.event.Destroy
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

        var property = xs.reactive.Property.fromEvent(document.body, 'click');

        var log = [];
        property.on(function (data) {
            log.push(data);
        });

        document.body.click();

        property.on(function () {
            strictEqual(log.length, 1);
            strictEqual(log[ 0 ].constructor, MouseEvent);

            me.done();
        }, {
            target: xs.reactive.event.Destroy
        });

        property.destroy();

        return false;
    });

    test('toStream', function () {
        var me = this;

        var log = [];
        (new xs.reactive.Property(function (property) {
            return {
                on: function () {
                    xs.nextTick(function () {
                        property.set(null);
                        xs.nextTick(function () {
                            property.destroy();
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
            .on(function () {
                strictEqual(JSON.stringify(log), JSON.stringify([
                    {
                        data: 5
                    },
                    {
                        data: null
                    }
                ]));
                me.done();
            }, {
                target: xs.reactive.event.Destroy
            });

        return false;
    });

    test('map', function () {
        var me = this;

        var property = new xs.reactive.Property(function (property) {
            xs.nextTick(function () {
                property.set(5);
                property.destroy();
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
            .on(function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            }, {
                target: xs.reactive.event.Destroy
            });

        return false;
    });

    test('filter', function () {
        var me = this;

        var property = new xs.reactive.Property(function (property) {
            xs.nextTick(function () {
                property.set(5);
                property.set(10);
                property.destroy();
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
            .on(function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            }, {
                target: xs.reactive.event.Destroy
            });

        return false;
    });

    test('throttle', function () {
        var me = this;

        var property = new xs.reactive.Property(function (property) {
            var interval = setInterval(function () {
                property.set((new Date()).valueOf());
            }, 0);
            setTimeout(function () {
                clearInterval(interval);
                property.destroy();
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
            .on(function () {
                strictEqual((new xs.core.Collection(log)).all(function (value) {
                    return value >= 10;
                }), true);

                me.done();
            }, {
                target: xs.reactive.event.Destroy
            });

        return false;
    });

    test('debounce', function () {
        var me = this;

        var property = new xs.reactive.Property(function (property) {
            var i = 0;
            var interval = setInterval(function () {
                property.set(++i);

                if (i === 10) {
                    clearInterval(interval);
                    property.destroy();
                }
            }, 5);
        });

        var log = [];
        property
            .debounce(10)
            .on(function (data) {
                log.push(data);
            })
            .on(function () {
                strictEqual(JSON.stringify(log), '[10]');

                me.done();
            }, {
                target: xs.reactive.event.Destroy
            });

        return false;
    });

});