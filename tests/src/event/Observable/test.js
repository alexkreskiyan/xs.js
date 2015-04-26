/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.event.Observable', function () {

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

        me.Observable = xs.Class(function (self) {
            var Class = this;

            Class.mixins.observable = 'xs.event.Observable';

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me, generator);
            };

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

        me.observable = new me.Observable();

        var log = {
            simple: '',
            eventedOne: '',
            eventedTwo: '',
            suspended: '',
            scoped: '',
            positioned: ''
        };

        //method can be added with initially suspended state
        me.observable.on(function (event) {
            log.suspended += event.data;
        }, {
            suspended: true
        });

        //this way stream is still inactive
        strictEqual(me.observable.events.isActive, false);

        //simply method appends new handler, that has undefined scope, undefined event and is not suspended
        me.observable.on(function (event) {
            log.simple += event.data;
        });

        //incorrect priority throws exception
        throws(function () {
            me.observable.on(xs.noop, {
                priority: null
            });
        });

        //method can be evented directly, specifying event constructor(s)
        me.observable.on(me.EventOne, function (event) {
            log.eventedOne += event.data;
        });
        me.observable.on(me.EventTwo, function (event) {
            log.eventedTwo += event.data;
        });

        //method can be called within given scope
        me.observable.on(function (event) {
            log.scoped += event.data + this;
        }, {
            scope: '!'
        });

        //method can be positioned. returning false allows to stop event handling
        me.observable.on(function (event) {
            log.positioned += event.data;

            if (event.data === 5) {
                return false;
            }
        }, {
            priority: 0
        });

        me.observable.on(xs.event.Destroy, function () {
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

        me.Observable = xs.Class(function (self) {
            var Class = this;

            Class.mixins.observable = 'xs.event.Observable';

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me, generator);
            };

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

        me.observable = new me.Observable();

        me.observable.on(xs.noop);

        //stream is active
        strictEqual(me.observable.events.isActive, true);

        //empty argument - removes all handlers
        me.observable.off();

        //stream is deactivated
        strictEqual(me.observable.events.isActive, false);


        //with given arguments, handlers.removeBy is called
        me.observable.on(xs.noop);
        me.observable.on(xs.noop);
        me.observable.on(function () {

        });

        //remove first handler
        me.observable.off(function () {

            return true;
        });

        //stream is active
        strictEqual(me.observable.events.isActive, true);

        //remove all left handlers
        me.observable.off(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.observable.events.isActive, false);
    }, function () {
        var me = this;
        me.observable.destroy();
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

        me.Observable = xs.Class(function (self) {
            var Class = this;

            Class.mixins.observable = 'xs.event.Observable';

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me, generator);
            };

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

        me.observable = new me.Observable();

        me.observable.on(xs.noop);

        //stream is active
        strictEqual(me.observable.events.isActive, true);

        //empty argument - suspends all handlers
        me.observable.suspend();

        //stream is deactivated
        strictEqual(me.observable.events.isActive, false);


        //with given arguments, handlers.find is called
        me.observable.on(xs.noop);
        me.observable.on(xs.noop);
        me.observable.on(function () {

        });

        //suspend first handler
        me.observable.suspend(function () {

            return true;
        });

        //stream is active
        strictEqual(me.observable.events.isActive, true);

        //suspend all left handlers
        me.observable.suspend(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is deactivated
        strictEqual(me.observable.events.isActive, false);
    }, function () {
        var me = this;
        me.observable.destroy();
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

        me.Observable = xs.Class(function (self) {
            var Class = this;

            Class.mixins.observable = 'xs.event.Observable';

            Class.constructor = function () {
                var me = this;

                //call mixin constructor
                self.mixins.observable.call(me, generator);
            };

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

        me.observable = new me.Observable();

        me.observable.on(xs.noop);

        me.observable.suspend();

        //stream is inactive
        strictEqual(me.observable.events.isActive, false);

        //empty argument - resumes all handlers
        me.observable.resume();

        //stream is activated
        strictEqual(me.observable.events.isActive, true);


        //with given arguments, handlers.removeBy is called
        me.observable.on(xs.noop);
        me.observable.on(xs.noop);
        me.observable.on(function () {

        });

        me.observable.suspend();

        //resume first handler
        me.observable.resume(function () {

            return true;
        });

        //stream is activated
        strictEqual(me.observable.events.isActive, true);

        //resume all left handlers
        me.observable.resume(function () {

            return true;
        }, xs.core.Collection.All);

        //stream is active
        strictEqual(me.observable.events.isActive, true);
    }, function () {
        var me = this;
        me.observable.destroy();
    });

});