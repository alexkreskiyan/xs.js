/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    //define xs.log
    if (!xs.log) {

        xs.log = {};
    }

    /**
     * Log levels enum
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.log
     *
     * @singleton
     */

    /**
     * Error level. Is used to log application errors
     *
     * @readonly
     *
     * @property Error
     *
     * @type {Number}
     */
    xs.log.Error = 0x1;

    /**
     * Warning level. Is used to log application warnings
     *
     * @readonly
     *
     * @property Warning
     *
     * @type {Number}
     */
    xs.log.Warning = 0x2;

    /**
     * Info level. Is used for application status logging
     *
     * @readonly
     *
     * @property Info
     *
     * @type {Number}
     */
    xs.log.Info = 0x4;

    /**
     * Trace level. Is used for development stage logging
     *
     * @readonly
     *
     * @property Trace
     *
     * @type {Number}
     */
    xs.log.Trace = 0x8;

    /**
     * Profile level. Is used for application profiling messages
     *
     * @readonly
     *
     * @property Profile
     *
     * @type {Number}
     */
    xs.log.Profile = 0x10;

    /**
     * xs.log.Router is key system element, that performs logging operations
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.log.Router
     *
     * @singleton
     */
    var router = xs.log.Router = (function () {
        var me = {};

        /**
         * Processes log entry
         *
         * @ignore
         *
         * @method process
         *
         * @param {String} category
         * @param {Number} level
         * @param {String} message
         * @param {Object} data
         */
        me.process = function (category, level, message, data) {
            //if not ready yet - add new entry to buffer
            if (!ready) {
                buffer.add({
                    category: category,
                    level: level,
                    message: message,
                    data: data
                });
            }

            //process each route with log entry
            me.routes.each(function (route) {
                route.process(category, level, message, data);
            });
        };

        /**
         * Incoming logs buffer. Is used until ready method called
         *
         * @ignore
         *
         * @private
         *
         * @property storage
         *
         * @type {xs.core.Collection}
         */
        var buffer = new xs.core.Collection();

        /**
         * Internal router ready state. When router is not ready yet, all logs are buffered, so when some route is added to router,
         * all buffered logs are passed to it. When ready, all buffered logs are removed
         *
         * @readonly
         *
         * @property isReady
         *
         * @type {Boolean}
         */
        var ready = false;

        Object.defineProperty(me, 'isReady', {
            get: function () {
                return ready;
            },
            set: xs.emptyFn
        });

        /**
         * Method, that marks router as ready, changing {@link #isReady isReady} state
         */
        me.ready = function () {
            //mark router as ready
            ready = true;

            //remove all messages from buffer
            buffer.remove();
        };

        /**
         * Category name testing regular expression
         *
         * @ignore
         *
         * @type {RegExp}
         */
        var categoryRe = /^[A-Za-z]{1}[A-Za-z0-9]*(?:\.{1}[A-Za-z]{1}[A-Za-z0-9]*)*$/;

        /**
         * Returns whether given string is correct router category name
         *
         * For example:
         *
         *     xs.log.router.isCategory('xs.module.my.Class'); //true
         *
         * @private
         *
         * @method isCategory
         *
         * @param {String} category verified category name
         *
         * @return {String} whether category name is correct
         */
        me.isCategory = function (category) {

            //assert that category is a string
            assert.string(category, 'isCategory - given category "$category" is not a string', {
                $category: category
            });

            return categoryRe.test(category);
        };

        /**
         * Routes collection.
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.log.Router.routes
         *
         * @singleton
         */
        me.routes = (function () {
            var me = {};

            var storage = new xs.core.Collection();

            /**
             * Routes collection length
             *
             * @property length
             *
             * @readonly
             *
             * @type Number
             */
            Object.defineProperty(me, 'length', {
                get: function () {
                    return storage.private.items.length;
                },
                set: xs.emptyFn
            });

            /**
             * Adds route to routes collection.
             *
             * For example:
             *
             *     xs.log.Router.routes.add(new xs.log.route.Console('console'));
             *
             * @method add
             *
             * @param {xs.log.route.Route} route instance of class, derived from xs.log.route.Route
             *
             * @chainable
             */
            me.add = function (route) {

                //assert, that route is instance of xs.log.route.Route base route class
                assert.instance(route, xs.log.route.Route, 'routes.add - given route "$route" is not instance of xs.log.route.Route', {
                    $route: route
                });

                //add route to storage
                storage.add(route);

                //if not ready - process route with all buffered log entries
                buffer.each(function (entry) {
                    route.process(entry.category, entry.level, entry.message, entry.data);
                });

                return me;
            };

            /**
             * Iterates over routes collection in direct or reverse order via calling given iterator function.
             * See {@link xs.core.Collection#each} for docs and usage samples
             *
             * @method each
             *
             * @param {Function} iterator list iterator
             * @param {Number} [flags] additional iterating flags:
             * - Reverse - to iterate in reverse order
             * @param {Object} [scope] optional scope
             *
             * @chainable
             */
            me.each = function (iterator, flags, scope) {
                storage.each.apply(storage, arguments);

                return me;
            };

            /**
             * Returns route|routes, that passed given finder function
             * See {@link xs.core.Collection#find} for docs and usage samples
             *
             * @method find
             *
             * @param {Function} finder function, returning true if route matches given conditions
             * @param {Number} [flags] additional search flags:
             * - All - to find all matches
             * @param {Object} [scope] optional scope
             *
             * @return {undefined|xs.log.route.IRoute|xs.core.Collection} found route, undefined if nothing found, or xs.core.Collection with results if All flag was given
             */
            me.find = function (finder, flags, scope) {
                storage.find.apply(storage, arguments);

                return me;
            };

            /**
             * Deletes route from routes collection, truncates routes collection
             * See {@link xs.core.Collection#remove} for docs and usage samples
             *
             * @method remove
             *
             * @param {*} [route] removed route. If not given - collection wil be truncated
             * @param {Number} [flags] optional remove flags:
             * - Reverse - to lookup for value from the end of the collection
             * - All - to remove all matches
             *
             * @chainable
             */
            me.remove = function (route, flags) {

                //if route given
                if (arguments.length) {

                    //assert, that route is instance of xs.log.route.Route base route class
                    assert.instance(route, xs.log.route.Route, 'routes.remove - given route "$route" is not instance of xs.log.route.Route', {
                        $route: route
                    });

                }

                storage.remove.apply(storage, arguments);

                return me;
            };

            return me;
        })();

        return me;
    })();

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class RouterError
     */
    function RouterError(message) {
        this.message = 'xs.log.Router::' + message;
    }

    RouterError.prototype = new Error();

    //hook method to create asserter. here fake assert is needed for first call
    var assert = {
        string: function () {

        }
    };
    router.ready = function () {
        assert = new xs.core.Asserter(new xs.log.Logger('xs.log.Router'), RouterError);
        delete router.ready;
    };
})(window, 'xs');