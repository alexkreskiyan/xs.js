/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.reactive.Stream', function () {

    'use strict';

    xs.log.Router.routes.add(new xs.log.route.Console('reactive', [
        {
            category: 'xs.reactive',
            level: xs.log.Trace
        }
    ]));

    test('constructor', function () {
        var me = this;

        me.generator = function (send, end) {
            return {
                on: function () {
                    send(null);
                    end();
                },
                off: xs.emptyFn
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

        //generator must return object
        throws(function () {
            return new xs.reactive.Stream(xs.emptyFn);
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
                    on: xs.emptyFn
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

        me.generator = function (send, end) {
            return {
                on: function () {
                    send(null);
                    end();
                },
                off: xs.emptyFn
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
            target: xs.reactive.Data | xs.reactive.Destroy
        });

        //stream is not active and not destroyed
        strictEqual(me.stream.isDestroyed, true);

    });

    test('on', function () {
        var me = this;

        me.generator = function (send, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                send(i);
                i--;
                if (i === 0) {
                    end();
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
            me.stream.on(xs.emptyFn, null);
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

        //simply method appends new handler, that has undefined scope, xs.reactive.Data target and is not suspended
        me.stream.on(function (data) {
            log.simple += data;
        });

        //incorrect target throws exception
        throws(function () {
            me.stream.on(xs.emptyFn, {
                target: null
            });
        });

        //incorrect priority throws exception
        throws(function () {
            me.stream.on(xs.emptyFn, {
                priority: null
            });
        });

        //method can be targeted directly with target type flags
        me.stream.on(function (data) {
            log.targeted += data;
        }, {
            target: xs.reactive.Destroy
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

        me.stream.on(function () {
            //check logs
            strictEqual(log.simple, '1098764321'); //5 is missing - cancelled
            strictEqual(log.targeted, 'undefined');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            me.done();
        }, {
            target: xs.reactive.Destroy
        });

        return false;
    });

    test('off', function () {
        var me = this;

        me.generator = function (send, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                send(i);
                i--;
                if (i === 0) {
                    end();
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

        me.stream.on(xs.emptyFn);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //empty argument - removes all handlers
        me.stream.off();

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.stream.on(xs.emptyFn);
        me.stream.on(xs.emptyFn);
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

        me.generator = function (send, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                send(i);
                i--;
                if (i === 0) {
                    end();
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

        me.stream.on(xs.emptyFn);

        //stream is active
        strictEqual(me.stream.isActive, true);

        //empty argument - suspends all handlers
        me.stream.suspend();

        //stream is deactivated
        strictEqual(me.stream.isActive, false);


        //with given arguments, handlers.find is called
        me.stream.on(xs.emptyFn);
        me.stream.on(xs.emptyFn);
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

        me.generator = function (send, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                send(i);
                i--;
                if (i === 0) {
                    end();
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

        me.stream.on(xs.emptyFn);

        me.stream.suspend();

        //stream is inactive
        strictEqual(me.stream.isActive, false);

        //empty argument - resumes all handlers
        me.stream.resume();

        //stream is activated
        strictEqual(me.stream.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.stream.on(xs.emptyFn);
        me.stream.on(xs.emptyFn);
        me.stream.on(function () {

        });

        me.stream.suspend();

        //resume first handler
        me.stream.resume(function () {

            return true;
        });

        //stream is actived
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

    //
    //test('demo', function () {
    //    expect(0);
    //
    //    window.stream = new xs.reactive.Stream(function (send, end) {
    //        var i = 10;
    //        var interval = 100;
    //        var intervalId;
    //        var generator = function () {
    //            send(i);
    //            i--;
    //            if (i === 0) {
    //                end();
    //            }
    //        };
    //        return {
    //            on: function () {
    //                intervalId = setInterval(generator, interval);
    //            },
    //            off: function () {
    //                clearInterval(intervalId);
    //            }
    //        };
    //    });
    //    /*
    //     Common stream scheme:
    //     var result = new xs.reactive.Stream(function(emit, destroy, a, b, c) {
    //     },[a, b, c])
    //     Any stream is created that way - describing function, and optional other sources
    //
    //
    //
    //
    //     Streams combination:
    //     1. Simple combination stream.
    //     Combines any count of reactive objects, emitting them without any buffering
    //     a: --1--X
    //     b: -2-3--X
    //
    //     z: -213--X
    //
    //     2. parallel combination stream.
    //     Collects buffer with one event from each stream, synchronizing them. Is destroyed automatically, when can not emit any more events.
    //     (One of streams has no buffered values and was just ended - thus this test is done on end of one of sources)
    //     a: 123-X
    //     b: --4-8---X
    //     c: -5-6-7-X
    //
    //     z: --e-e---X
    //
    //     1 - [1,4,5]
    //     2 - [2,8,6]
    //
    //     Ends with `b`, because `a` and `c` have had buffered values
    //
    //     3. subsequent combination stream
    //
    //     return Board.EventLayer.eventChain()
    //     .once("mousedown", this._placeStartPoint, this)
    //     .any(function (chain) {
    //     return chain
    //     .any("mousemove", this.__drawTemporaryFigure, this)
    //     .once({"keydown": 32}, this._placePolygonePoint, this);
    //     }, this)
    //     .once("mouseup", this._placePolygonePoint, this)
    //     .cancel({"keydown": 27}, this.cancelDrawing, this)
    //     .atLast(this.__saveFigure, this)
    //     .init();
    //
    //     .after - creates synchronization stream
    //     the problem - do incorrect events break synchronization or are ignored?
    //     */
    //    //var stream = new xs.reactive.Stream(function (send, end) {
    //    //    debugger;
    //    //
    //    //    var i = 0;
    //    //    var emit = function () {
    //    //        send(i);
    //    //        i++;
    //    //        if (i > 10) {
    //    //            end(i);
    //    //        }
    //    //    };
    //    //    var interval = 100;
    //    //
    //    //    var intervalId;
    //    //
    //    //    return {
    //    //        on: function () {
    //    //            intervalId = setInterval(emit, interval);
    //    //        },
    //    //        off: function (data) {
    //    //            clearInterval(intervalId);
    //    //        }
    //    //    };
    //    //});
    //    //
    //    //stream.listen(function (data) {
    //    //    console.log('listener1', data);
    //    //});
    //    //
    //    //stream.listen(function (data) {
    //    //    console.log('listener2', data);
    //    //});
    //});
});