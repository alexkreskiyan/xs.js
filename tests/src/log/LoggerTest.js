/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.log.Logger', function () {

    'use strict';

    test('logger.error', function () {
        var me = this;

        //define Memory route
        xs.Class(function (self) {

            var Class = this;

            Class.extends = 'xs.log.route.Route';

            Class.constructor = function (name, rules) {
                var me = this;

                if (arguments.length > 1) {
                    self.parent.call(me, name, rules);
                } else {
                    self.parent.call(me, name);
                }

                //create logs storage
                me.logs = new xs.core.Collection();
            };

            Class.method.process = function (category, level, message, data) {
                var me = this;

                if (!self.parent.prototype.process.call(me, category, level)) {

                    return;
                }

                me.logs.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            };
        }, function (Class) {

            //add new route to router
            me.route = new Class('memory');
            xs.log.Router.routes.add(me.route);

            me.done();
        });

        return false;
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var category = 'some.category';
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(category);

        //reset logs collection
        me.route.logs.remove();


        //run test

        //assert, that logs storage is empty
        strictEqual(me.route.logs.size, 0);

        //process message
        logger.error(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.route.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.route.logs.at(0);
        strictEqual(entry.category, category);
        strictEqual(entry.level, xs.log.Error);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.route);
    });

    test('logger.warn', function () {
        var me = this;

        //define Memory route
        xs.Class(function (self) {

            var Class = this;

            Class.extends = 'xs.log.route.Route';

            Class.constructor = function (name, rules) {
                var me = this;

                if (arguments.length > 1) {
                    self.parent.call(me, name, rules);
                } else {
                    self.parent.call(me, name);
                }

                //create logs storage
                me.logs = new xs.core.Collection();
            };

            Class.method.process = function (category, level, message, data) {
                var me = this;

                if (!self.parent.prototype.process.call(me, category, level)) {

                    return;
                }

                me.logs.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            };
        }, function (Class) {

            //add new route to router
            me.route = new Class('memory');
            xs.log.Router.routes.add(me.route);

            me.done();
        });

        return false;
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var category = 'some.category';
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(category);

        //reset logs collection
        me.route.logs.remove();


        //run test

        //assert, that logs storage is empty
        strictEqual(me.route.logs.size, 0);

        //process message
        logger.warn(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.route.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.route.logs.at(0);
        strictEqual(entry.category, category);
        strictEqual(entry.level, xs.log.Warning);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.route);
    });

    test('logger.info', function () {
        var me = this;

        //define Memory route
        xs.Class(function (self) {

            var Class = this;

            Class.extends = 'xs.log.route.Route';

            Class.constructor = function (name, rules) {
                var me = this;

                if (arguments.length > 1) {
                    self.parent.call(me, name, rules);
                } else {
                    self.parent.call(me, name);
                }

                //create logs storage
                me.logs = new xs.core.Collection();
            };

            Class.method.process = function (category, level, message, data) {
                var me = this;

                if (!self.parent.prototype.process.call(me, category, level)) {

                    return;
                }

                me.logs.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            };
        }, function (Class) {

            //add new route to router
            me.route = new Class('memory');
            xs.log.Router.routes.add(me.route);

            me.done();
        });

        return false;
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var category = 'some.category';
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(category);

        //reset logs collection
        me.route.logs.remove();


        //run test

        //assert, that logs storage is empty
        strictEqual(me.route.logs.size, 0);

        //process message
        logger.info(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.route.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.route.logs.at(0);
        strictEqual(entry.category, category);
        strictEqual(entry.level, xs.log.Info);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.route);
    });

    test('logger.trace', function () {
        var me = this;

        //define Memory route
        xs.Class(function (self) {

            var Class = this;

            Class.extends = 'xs.log.route.Route';

            Class.constructor = function (name, rules) {
                var me = this;

                if (arguments.length > 1) {
                    self.parent.call(me, name, rules);
                } else {
                    self.parent.call(me, name);
                }

                //create logs storage
                me.logs = new xs.core.Collection();
            };

            Class.method.process = function (category, level, message, data) {
                var me = this;

                if (!self.parent.prototype.process.call(me, category, level)) {

                    return;
                }

                me.logs.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            };
        }, function (Class) {

            //add new route to router
            me.route = new Class('memory');
            xs.log.Router.routes.add(me.route);

            me.done();
        });

        return false;
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var category = 'some.category';
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(category);

        //reset logs collection
        me.route.logs.remove();


        //run test

        //assert, that logs storage is empty
        strictEqual(me.route.logs.size, 0);

        //process message
        logger.trace(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.route.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.route.logs.at(0);
        strictEqual(entry.category, category);
        strictEqual(entry.level, xs.log.Trace);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.route);
    });

    test('logger.profile', function () {
        var me = this;

        //define Memory route
        xs.Class(function (self) {

            var Class = this;

            Class.extends = 'xs.log.route.Route';

            Class.constructor = function (name, rules) {
                var me = this;

                if (arguments.length > 1) {
                    self.parent.call(me, name, rules);
                } else {
                    self.parent.call(me, name);
                }

                //create logs storage
                me.logs = new xs.core.Collection();
            };

            Class.method.process = function (category, level, message, data) {
                var me = this;

                if (!self.parent.prototype.process.call(me, category, level)) {

                    return;
                }

                me.logs.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            };
        }, function (Class) {

            //add new route to router
            me.route = new Class('memory');
            xs.log.Router.routes.add(me.route);

            me.done();
        });

        return false;
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var category = 'some.category';
        var mark = 'Profile mark';

        //create logger
        var logger = new xs.log.Logger(category);


        //run test

        //start profile
        logger.profile.start(mark);

        setTimeout(function () {

            //reset logs collection
            me.route.logs.remove();

            //assert, that logs storage is empty
            strictEqual(me.route.logs.size, 0);

            //end profile
            logger.profile.end(mark);

            //assert, that logs storage has new entry
            strictEqual(me.route.logs.size, 1);

            //assert, that message is related to demo data
            var entry = me.route.logs.at(0);
            strictEqual(entry.category, category);
            strictEqual(entry.level, xs.log.Profile);
            strictEqual(entry.message, mark);
            strictEqual(Object.keys(entry.data).toString(), 'time');
            strictEqual(xs.isNumber(entry.data.time), true);

            me.done();
        }, 10);

        return false;
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.route);
    });

});