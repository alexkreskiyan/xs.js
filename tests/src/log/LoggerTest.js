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

        //create logs storage
        me.logs = new xs.core.Collection();

        //test category
        me.category = 'tests.xs.log.Logger.error';

        //stream to logs
        me.stream = xs.log.Router
            .filter(function (event) {
                return event.category === me.category;
            })
            .on(function (event) {
                me.logs.add(event.data);
            });
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(me.category);


        //run test

        //process message
        logger.error(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.logs.at(0);
        strictEqual(entry.category, me.category);
        strictEqual(entry.level, xs.log.Error);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        me.stream.destroy();
    });

    test('logger.warn', function () {
        var me = this;

        //create logs storage
        me.logs = new xs.core.Collection();

        //test category
        me.category = 'tests.xs.log.Logger.warn';

        //stream to logs
        me.stream = xs.log.Router
            .filter(function (event) {
                return event.category === me.category;
            })
            .on(function (event) {
                me.logs.add(event.data);
            });
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(me.category);


        //run test

        //process message
        logger.warn(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.logs.at(0);
        strictEqual(entry.category, me.category);
        strictEqual(entry.level, xs.log.Warning);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        me.stream.destroy();
    });

    test('logger.info', function () {
        var me = this;

        //create logs storage
        me.logs = new xs.core.Collection();

        //test category
        me.category = 'tests.xs.log.Logger.info';

        //stream to logs
        me.stream = xs.log.Router
            .filter(function (event) {
                return event.category === me.category;
            })
            .on(function (event) {
                me.logs.add(event.data);
            });
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(me.category);


        //run test

        //process message
        logger.info(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.logs.at(0);
        strictEqual(entry.category, me.category);
        strictEqual(entry.level, xs.log.Info);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        me.stream.destroy();
    });

    test('logger.trace', function () {
        var me = this;

        //create logs storage
        me.logs = new xs.core.Collection();

        //test category
        me.category = 'tests.xs.log.Logger.trace';

        //stream to logs
        me.stream = xs.log.Router
            .filter(function (event) {
                return event.category === me.category;
            })
            .on(function (event) {
                me.logs.add(event.data);
            });
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var message = 'Message text';
        var data = {
            x: 1
        };

        //create logger
        var logger = new xs.log.Logger(me.category);


        //run test

        //process message
        logger.trace(message, data);

        //assert, that logs storage has new entry
        strictEqual(me.logs.size, 1);

        //assert, that message is related to demo data
        var entry = me.logs.at(0);
        strictEqual(entry.category, me.category);
        strictEqual(entry.level, xs.log.Trace);
        strictEqual(entry.message, message);
        strictEqual(entry.data, data);
    }, function () {
        var me = this;

        me.stream.destroy();
    });

    test('logger.profile', function () {
        var me = this;

        //create logs storage
        me.logs = new xs.core.Collection();

        //test category
        me.category = 'tests.xs.log.Logger.profile';

        //stream to logs
        me.stream = xs.log.Router
            .filter(function (event) {
                return event.category === me.category;
            })
            .on(function (event) {
                me.logs.add(event.data);
            });
    }, function () {
        var me = this;


        //init test variables

        //demo category, message and data
        var mark = 'Profile mark';

        //create logger
        var logger = new xs.log.Logger(me.category);


        //run test

        //start profile
        logger.profile.start(mark);

        setTimeout(function () {

            //end profile
            logger.profile.end(mark);

            //assert, that logs storage has new entry
            strictEqual(me.logs.size, 1);

            //assert, that message is related to demo data
            var entry = me.logs.at(0);
            strictEqual(entry.category, me.category);
            strictEqual(entry.level, xs.log.Profile);
            strictEqual(entry.message, mark);
            strictEqual(Object.keys(entry.data).toString(), 'time');
            strictEqual(xs.isNumber(entry.data.time), true);

            me.done();
        }, 10);

        return false;
    }, function () {
        var me = this;

        me.stream.destroy();
    });

});