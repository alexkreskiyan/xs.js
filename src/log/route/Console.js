/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Console log route. Is added by default to {@link xs.log.Router}
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.log.route.Console
 */
xs.define(xs.Class, 'ns.Console', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.log.route';

    Class.extends = 'ns.Route';

    /**
     * Route constructor. Achieves rules array as single argument. Rules specify, when this route handles log entry.
     *
     * For example:
     *
     *     var route = new xs.log.route.Console([
     *         {
     *             category: 'xs',
     *             level: xs.log.Info | xs.log.Warning
     *         },
     *         {
     *             category: 'xs.core',
     *             level: xs.log.Error
     *         }
     *     ]);
     *
     * @constructor
     *
     * @param {String} name route name
     * @param {Array} rules route processing rules
     */
    Class.constructor = function (name, rules) {
        var me = this;

        if (arguments.length > 1) {
            self.parent.call(me, name, rules);
        } else {
            self.parent.call(me, name);
        }
    };

    /**
     * Process method. Must not be called manually!
     *
     * @private
     *
     * @method process
     *
     * @param {String} category entry category string
     * @param {Number} level log entry level
     * @param {String} message log entry message
     * @param {Object} data log entry additional data
     */
    Class.method.process = function (category, level, message, data) {
        var me = this;

        if (!self.parent.prototype.process.call(me, category, level)) {

            return;
        }

        switch (level) {
            case xs.log.Error:
                console.info(category + ' ' + message, data);
                break;
            case xs.log.Warning:
                console.warn(category + ' ' + message, data);
                break;
            case xs.log.Info:
                console.log(category + ' ' + message, data);
                break;
            case xs.log.Trace:
                console.info(category + ' ' + message, data);
                break;
            case xs.log.Profile:
                console.info(category + ' ' + message, 'time: ' + data.time + 'ms');
                break;
        }
    };
}, function (Class) {

    'use strict';

    //add new empty console.route
    xs.log.Router.routes.add(new Class('console'));
});