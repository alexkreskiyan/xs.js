/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.reactive.Property', function () {

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
            return new xs.reactive.Property(me.generator, undefined);
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

        me.generator = function (set, end) {
            return {
                on: function () {
                    set(null);
                    end();
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
        }, {
            target: xs.reactive.Data | xs.reactive.Destroy
        });

        //stream is not active and destroyed
        strictEqual(me.property.isDestroyed, true);

    });

    test('on', function () {
        var me = this;

        me.generator = function (set, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                set(i);
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

        //simply method appends new handler, that has undefined scope, xs.reactive.Data target and is not suspended
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
        me.property.on(function (data) {
            log.targeted += data;
        }, {
            target: xs.reactive.Destroy
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
            strictEqual(log.targeted, 'undefined');
            strictEqual(log.scoped, '10!9!8!7!6!4!3!2!1!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '10987654321'); //5 is presented
            //check value
            strictEqual(value.toString(), 'undefined1010998877664433221'); //5 is missing - cancelled
            me.done();
        }, {
            target: xs.reactive.Destroy
        });

        return false;
    });

    test('off', function () {
        var me = this;

        me.generator = function (set, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                set(i);
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

        me.generator = function (set, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                set(i);
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

        me.generator = function (set, end) {
            var i = 10;
            var interval = 0;
            var intervalId;
            var generator = function () {
                set(i);
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

        //stream is actived
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

});