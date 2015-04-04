/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.event.StaticObservable', function () {

    'use strict';

    test('on', function () {
        var me = this;

        var EventOne = me.EventOne = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        var EventTwo = me.EventTwo = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        me.Observable = xs.Class(function () {
            var Class = this;

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = xs.generator(function () {
                var send = null;

                //create event stream
                //save stream reference
                var stream = new xs.event.Stream(function () {

                    //save send reference
                    send = this.send;

                    //call generator
                    return generator.call(this);
                });

                //save send to stream
                stream.send = send;

                return stream;
            });

            var generator = function () {
                var me = this;

                var count = 10;
                var i = 1;
                var interval = 0;
                var intervalId;
                var generator = function () {
                    if (i % 2 === 0) {
                        me.send(new EventOne(i));
                    } else {
                        me.send(new EventTwo(i));
                    }

                    i++;

                    if (i === count) {
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

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var log = {
            simple: '',
            eventedOne: '',
            eventedTwo: '',
            suspended: '',
            scoped: '',
            positioned: ''
        };

        //method can be added with initially suspended state
        me.Observable.on(function (event) {
            log.suspended += event.data;
        }, {
            suspended: true
        });

        //this way stream is still inactive
        strictEqual(me.Observable.events.isActive, false);

        //simply method appends new handler, that has undefined scope, undefined event and is not suspended
        me.Observable.on(function (event) {
            log.simple += event.data;
        });

        //incorrect priority throws exception
        throws(function () {
            me.Observable.on(xs.noop, {
                priority: null
            });
        });

        //method can be evented directly, specifying event constructor(s)
        me.Observable.on(me.EventOne, function (event) {
            log.eventedOne += event.data;
        });
        me.Observable.on(me.EventTwo, function (event) {
            log.eventedTwo += event.data;
        });

        //method can be called within given scope
        me.Observable.on(function (event) {
            log.scoped += event.data + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.Observable.on(function (event) {
            log.positioned += event.data;

            if (event.data === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.Observable.on(xs.event.Destroy, function () {
            //check logs
            strictEqual(log.simple, '12346789'); //5 is missing - cancelled
            strictEqual(log.eventedOne, '2468');
            strictEqual(log.eventedTwo, '1379'); //5 is missing - cancelled
            strictEqual(log.scoped, '1!2!3!4!6!7!8!9!'); //5 is missing - cancelled
            strictEqual(log.suspended, '');
            strictEqual(log.positioned, '123456789'); //5 is presented
            me.done();
        });

        return false;
    });

    test('off', function () {
        var me = this;

        var EventOne = me.EventOne = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        var EventTwo = me.EventTwo = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        me.Observable = xs.Class(function () {
            var Class = this;

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = xs.generator(function () {
                var send = null;

                //create event stream
                //save stream reference
                var stream = new xs.event.Stream(function () {

                    //save send reference
                    send = this.send;

                    //call generator
                    return generator.call(this);
                });

                //save send to stream
                stream.send = send;

                return stream;
            });

            var generator = function () {
                var me = this;

                var count = 10;
                var i = 1;
                var interval = 0;
                var intervalId;
                var generator = function () {
                    if (i % 2 === 0) {
                        me.send(new EventOne(i));
                    } else {
                        me.send(new EventTwo(i));
                    }

                    i++;

                    if (i === count) {
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

        }, me.done);

        return false;
    }, function () {
        var me = this;

        me.Observable.on(xs.noop);

        //stream is active
        strictEqual(me.Observable.events.isActive, true);

        //empty argument - removes all handlers
        me.Observable.off();

        //stream is deactivated
        strictEqual(me.Observable.events.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.Observable.on(xs.noop);
        me.Observable.on(xs.noop);
        me.Observable.on(function () {

        });

        //remove first handler
        me.Observable.off(function () {

            return true;
        });

        //stream is active
        strictEqual(me.Observable.events.isActive, true);

        //remove all left handlers
        me.Observable.off(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.Observable.events.isActive, false);
    });

    test('suspend', function () {
        var me = this;

        var EventOne = me.EventOne = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        var EventTwo = me.EventTwo = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        me.Observable = xs.Class(function () {
            var Class = this;

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = xs.generator(function () {
                var send = null;

                //create event stream
                //save stream reference
                var stream = new xs.event.Stream(function () {

                    //save send reference
                    send = this.send;

                    //call generator
                    return generator.call(this);
                });

                //save send to stream
                stream.send = send;

                return stream;
            });

            var generator = function () {
                var me = this;

                var count = 10;
                var i = 1;
                var interval = 0;
                var intervalId;
                var generator = function () {
                    if (i % 2 === 0) {
                        me.send(new EventOne(i));
                    } else {
                        me.send(new EventTwo(i));
                    }

                    i++;

                    if (i === count) {
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

        }, me.done);

        return false;
    }, function () {
        var me = this;

        me.Observable.on(xs.noop);

        //stream is active
        strictEqual(me.Observable.events.isActive, true);

        //empty argument - suspends all handlers
        me.Observable.suspend();

        //stream is deactivated
        strictEqual(me.Observable.events.isActive, false);


        //with given arguments, handlers.find is called
        me.Observable.on(xs.noop);
        me.Observable.on(xs.noop);
        me.Observable.on(function () {

        });

        //suspend first handler
        me.Observable.suspend(function () {

            return true;
        });

        //stream is active
        strictEqual(me.Observable.events.isActive, true);

        //suspend all left handlers
        me.Observable.suspend(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.Observable.events.isActive, false);
    });

    test('resume', function () {
        var me = this;

        var EventOne = me.EventOne = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        var EventTwo = me.EventTwo = xs.Class(function () {

            var Class = this;

            Class.implements = [
                'xs.event.IEvent'
            ];

            Class.constructor = function (data) {
                this.data = data;
            };

        });

        me.Observable = xs.Class(function () {
            var Class = this;

            Class.mixins.observable = 'xs.event.StaticObservable';

            Class.constant.events = xs.generator(function () {
                var send = null;

                //create event stream
                //save stream reference
                var stream = new xs.event.Stream(function () {

                    //save send reference
                    send = this.send;

                    //call generator
                    return generator.call(this);
                });

                //save send to stream
                stream.send = send;

                return stream;
            });

            var generator = function () {
                var me = this;

                var count = 10;
                var i = 1;
                var interval = 0;
                var intervalId;
                var generator = function () {
                    if (i % 2 === 0) {
                        me.send(new EventOne(i));
                    } else {
                        me.send(new EventTwo(i));
                    }

                    i++;

                    if (i === count) {
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

        }, me.done);

        return false;
    }, function () {
        var me = this;

        me.Observable.on(xs.noop);

        me.Observable.suspend();

        //stream is inactive
        strictEqual(me.Observable.events.isActive, false);

        //empty argument - resumes all handlers
        me.Observable.resume();

        //stream is activated
        strictEqual(me.Observable.events.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.Observable.on(xs.noop);
        me.Observable.on(xs.noop);
        me.Observable.on(function () {

        });

        me.Observable.suspend();

        //resume first handler
        me.Observable.resume(function () {

            return true;
        });

        //stream is activated
        strictEqual(me.Observable.events.isActive, true);

        //resume all left handlers
        me.Observable.resume(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is active
        strictEqual(me.Observable.events.isActive, true);
    });

});