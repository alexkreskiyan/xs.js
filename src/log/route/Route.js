/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Log route base class. Is required to be inherited by routes, added to {@link xs.log.Router.routes}
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.log.route.Route
 */
xs.define(xs.Class, 'ns.Route', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.log.route';

    Class.implements = ['ns.IRoute'];

    /**
     * Route constructor. Achieves rules array as single argument. Rules specify, when this route handles log entry.
     *
     * For example:
     *
     *     var route = new MyRoute([
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
     * @param {Array} [rules] processing rules. If no given, all log entries are processed
     */
    Class.constructor = function (rules) {
        var me = this;

        //assert, that rules are ok (if given)
        xs.assert.ok(!arguments.length || _verifyRules(rules));

        //save rules, wrapping them into xs.core.Collection
        me.rules = arguments.length ? new xs.core.Collection(rules) : new xs.core.Collection();
    };

    /**
     * Core route method. Is called from {@link xs.log.Router}, when new log entry appears. Must not be called manually!
     *
     * @method process
     *
     * @param {String} category entry category string
     * @param {Number} level log entry level
     * @param {String} message log entry message
     * @param {Object} data log entry additional data
     *
     * @return {Boolean} returns whether processing is needed
     */
    Class.method.process = function (category, level, message, data) {
        //return whether processing is needed
        return _needsProcessing.call(this, category, level);
    };

    /**
     * Verifies given rules to be correct ones
     *
     * @ignore
     *
     * @private
     *
     * @method verifyRules
     *
     * @param {Array} rules
     *
     * @return {Boolean} true is returned if rules are correct
     */
    var _verifyRules = function (rules) {

        //assert, that rules are an array
        xs.assert.array(rules, 'verifyRules - given rules "$rules" are not an array');

        //verify each rule individually
        rules.forEach(function (rule) {

            //assert, that rule is an object
            xs.assert.object(rule, 'verifyRules - given rule "$rule" is not an object', {
                $rule: rule
            }, RouteError);

            //assert that category or level given
            xs.assert.ok(rule.hasOwnProperty('category') || rule.hasOwnProperty('level'), 'verifyRules - given rule "$rule" is not informative: nor category neither level given', {
                $rule: rule
            }, RouteError);

            //verify category if given
            if (rule.hasOwnProperty('category')) {

                //assert, that category has correct format
                xs.assert.ok(xs.log.Router.isCategory(rule.category), 'verifyRules - given category "$category" is not correct', {
                    $category: rule.category
                }, RouteError);
            }

            //verify level if given
            if (rule.hasOwnProperty('level')) {

                //assert, that level is number
                xs.assert.number(rule.level, 'verifyRules - given level "$level" list is not a number', {
                    $level: rule.level
                }, RouteError);
            }
        });

        return true;
    };

    /**
     * Returns whether given log entry needs processing by this route.
     * Decision is based on comparison of given category and level with rules, given in route constructor
     *
     * @ignore
     *
     * @private
     *
     * @method needsProcessing
     *
     * @param {String} category
     * @param {Number} level
     *
     * @return {Boolean} whether to process this log entry or not
     */
    var _needsProcessing = function (category, level) {
        var me = this;

        //rule needs processing if there are no rules, or at least one rule, that matches category and level
        return !me.rules.length || me.rules.some(function (rule) {

                //to match, category must start with rule.category and level must match rule.level
                return (level & rule.level) && (category.indexOf(rule.category) === 0);
            });
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class RouteError
     */
    function RouteError(message) {
        this.message = 'xs.log.Router::' + message;
    }

    RouteError.prototype = new Error();
});