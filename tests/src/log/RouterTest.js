/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.log.Router', function () {

    'use strict';

    test('isCategory', function () {
        //category should be string
        throws(function () {
            xs.log.Router.isCategory();
        });
        throws(function () {
            xs.log.Router.isCategory(1);
        });

        //incorrect category returns false
        strictEqual(xs.log.Router.isCategory('A_b'), false);
        //correct name returns true
        strictEqual(xs.log.Router.isCategory('A5b'), true);
    });

    test('routes.length', function () {
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
        }, function () {
            me.done();
        });

        return false;
    }, function () {
        var me = this;

        var routes = xs.log.Router.routes;

        //save length
        var length = routes.length;

        //add new route
        var route = new me.Class('memory');
        routes.add(route);

        //length must be increased by 1
        strictEqual(routes.length, length + 1);

        //remove route
        routes.remove(route);

        //length must return to it's initial value
        strictEqual(routes.length, length);
    });

    test('routes.add', function () {
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
        }, function () {
            me.done();
        });

        return false;
    }, function () {
        var me = this;

        var routes = xs.log.Router.routes;

        //route must be instance of xs.log.Route
        throws(function () {
            routes.add(new xs.class.Base());
        });

        //save length
        var length = routes.length;

        //add new route
        var route = new me.Class('memory');
        routes.add(route);

        //length must be increased by 1
        strictEqual(routes.length, length + 1);

        //remove route
        routes.remove(route);
    });

    test('routes.remove', function () {
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
        }, function () {
            me.done();
        });

        return false;
    }, function () {
        var me = this;

        var routes = xs.log.Router.routes;

        //save length
        var length = routes.length;

        //add new route
        var route = new me.Class('memory');
        routes.add(route);

        //length must be increased by 1
        strictEqual(routes.length, length + 1);

        //route must be instance of xs.log.Route
        throws(function () {
            routes.remove(new xs.class.Base());
        });

        //remove route
        routes.remove(route);
    });

});