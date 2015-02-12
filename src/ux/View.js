/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Core xs.js view object
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.ux.View
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.View', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    Class.extends = 'xs.dom.Element';

    //Class.constant.events = {};

    /**
     * 1. View it self
     *  - GetNodesCollection. Parses template into list of nodes
     *  - Mixins xs.event.Observable. Own event class is declared for events, rethrown from DOM??? (It is necessary for Observable)
     *  - Events are registered as always. Nested classes will have to extend registered events list via xs.extend call in createdFn
     * 2. Events selection
     * Adding event handlers for DOM events both via query and simply on:
     * view.query('ul').on('mouseOver', function(event) {
     * });
     * view.on('mouseOver', function(event) {
     * });
     * view.query('ul').off('mouseOver')
     * view.off('mouseOver')
     *
     * Global calls affect on view direct children.
     *
     * Problems:
     * - To pass DOM events as-is or to wrap them (Wrapped)
     * - To save events target, given in query (query method returns lightweight wrapper, that proxies some methods to main object)
     *
     */

    Class.constructor = function (template) {
        var me = this;

        self.log.trace('constructor - creating new view from template "' + template + '"');

        //assert, that template is string
        self.assert.ok(template && xs.isString(template), 'constructor - given template "$template" is not a non-empty string', {
            $template: template
        });

        //parse view template into node
        var el = parseTemplate(template);

        //call parent constructor
        self.parent.call(me, el);
    };

    /**
     * Adding event handlers for DOM events both via query and simply on:
     * view.query('ul').on('mouseOver', function(event) {
     * });
     * view.on('mouseOver', function(event) {
     * });
     * view.query('ul').off('mouseOver')
     * view.off('mouseOver')
     */
    Class.method.query = function (selector) {

    };

    Class.method.destroy = function () {
        var me = this;

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    /**
     * Returns template parsed into nodes collection
     *
     * @ignore
     *
     * @private
     *
     * @method parseTemplate
     *
     * @param {String} template
     *
     * @return {xs.core.Collection} collection of nodes in parsed template
     */
    var parseTemplate = function (template) {

        self.log.trace('parseTemplate - fetching nodes from template "' + template + '"');

        //create container div element to parse html into
        var container = document.createElement('div');

        //set template as div innerHTML
        container.innerHTML = template;

        //assert, that template has single root
        self.assert.equal(container.childNodes.length, 1, 'parseTemplate - template must contain single root element');

        //get root
        var root = container.lastChild;

        //remove root from container
        container.removeChild(root);

        //return root
        return root;
    };
});