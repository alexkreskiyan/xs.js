/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.log.route.Route', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        //define Memory route
        me.Class = xs.Class(function (self) {

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
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var instance;

        //name must be non-empty string
        throws(function () {
            instance = new me.Class();
        });
        throws(function () {
            instance = new me.Class(1);
        });
        throws(function () {
            instance = new me.Class('');
        });

        //rules must be an array
        throws(function () {
            instance = new me.Class('route', null);
        });

        //each rule must be an object
        throws(function () {
            instance = new me.Class('route', [ null ]);
        });

        //each rule must be informative - contain category or level
        throws(function () {
            instance = new me.Class('route', [ {} ]);
        });

        //rule.category must be valid category
        throws(function () {
            instance = new me.Class('route', [
                {
                    category: ''
                }
            ]);
        });

        //rule.level must be number
        throws(function () {
            instance = new me.Class('route', [
                {
                    level: 'aaa'
                }
            ]);
        });

        //constructs ok if no rules
        instance = new me.Class('route');

        //constructs ok if rules are empty
        instance = new me.Class('route', []);

        //constructs ok if rule has only category
        instance = new me.Class('route', [
            {
                category: 'data'
            }
        ]);

        //constructs ok if rule has only level
        instance = new me.Class('route', [
            {
                level: xs.log.Error | xs.log.Info
            }
        ]);

        //constructs ok if rule has both category and level
        instance = new me.Class('route', [
            {
                category: 'data',
                level: xs.log.Error | xs.log.Info
            }
        ]);
    });

    test('needsProcessing', function () {
        var me = this;

        //define Memory route
        me.Class = xs.Class(function (self) {

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
        }, me.done);

        return false;
    }, function () {
        var me = this;

        //route, that processes everything
        me.routeAll = new me.Class('route');
        xs.log.Router.routes.add(me.routeAll);

        //route, that processes some category only
        me.routeCategory = new me.Class('route', [
            {
                category: 'data'
            }
        ]);
        xs.log.Router.routes.add(me.routeCategory);

        //route, that processes some level only
        me.routeLevel = new me.Class('route', [
            {
                level: xs.log.Warning
            }
        ]);
        xs.log.Router.routes.add(me.routeLevel);

        //route, that processes everything some category only at some level
        me.routeCategoryLevel = new me.Class('route', [
            {
                category: 'data',
                level: xs.log.Warning
            }
        ]);
        xs.log.Router.routes.add(me.routeCategoryLevel);


        //clean up logs
        me.routeAll.logs.remove();
        me.routeCategory.logs.remove();
        me.routeLevel.logs.remove();
        me.routeCategoryLevel.logs.remove();


        //add some log entries
        (new xs.log.Logger('data')).info('message1');
        (new xs.log.Logger('data')).warn('message2');
        (new xs.log.Logger('time')).info('message3');
        (new xs.log.Logger('time')).warn('message4');


        //verify logs in routes
        //routeAll
        strictEqual(me.routeAll.logs.size, 4);
        strictEqual(me.routeAll.logs.at(0).message, 'message1');
        strictEqual(me.routeAll.logs.at(1).message, 'message2');
        strictEqual(me.routeAll.logs.at(2).message, 'message3');
        strictEqual(me.routeAll.logs.at(3).message, 'message4');

        //routeCategory
        strictEqual(me.routeCategory.logs.size, 2);
        strictEqual(me.routeCategory.logs.at(0).message, 'message1');
        strictEqual(me.routeCategory.logs.at(1).message, 'message2');

        //routeLevel
        strictEqual(me.routeLevel.logs.size, 2);
        strictEqual(me.routeLevel.logs.at(0).message, 'message2');
        strictEqual(me.routeLevel.logs.at(1).message, 'message4');

        //routeCategoryLevel
        strictEqual(me.routeCategoryLevel.logs.size, 1);
        strictEqual(me.routeCategoryLevel.logs.at(0).message, 'message2');
    }, function () {
        var me = this;

        xs.log.Router.routes.remove(me.routeAll);
        xs.log.Router.routes.remove(me.routeCategory);
        xs.log.Router.routes.remove(me.routeLevel);
        xs.log.Router.routes.remove(me.routeCategoryLevel);
    });

});