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
 */
xs.define(xs.Class, 'ns.View', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    Class.mixins.observable = 'xs.event.Observable';

    Class.implements = ['xs.event.IObservable'];

    Class.constant.events = {
        mouseOver: {
            type: 'xs.event.Event',
            domEvent: 'mouseover'
        },
        click: {
            type: 'xs.event.Event',
            domEvent: 'click'
        },
        mouseOut: {
            type: 'xs.event.Event',
            domEvent: 'mouseout'
        }
    };

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
        xs.assert.string(template, 'constructor - given template "$template" is not a string', {
            $template: template
        }, ViewError);

        //call observable constructor
        me.mixins.observable.call(me);

        //create collection for dom handlers
        me.private.domHandlers = new xs.core.Collection();

        //parse view template into nodes collection
        me.private.nodes = _getNodesCollection(template);
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

    Class.method.on = function (event, handler, options) {
        var me = this;

        self.log.trace('on - ' + arguments.length + ' arguments given', {
            event: event,
            handler: handler,
            options: options
        });

        //check event
        //assert event name is non-empty string
        xs.assert.ok(event && xs.isString(event), 'on - given event name "$event" is not a string', {
            $event: event
        }, ViewError);

        //assert that given event is registered
        xs.assert.ok(me.self.events.hasOwnProperty(event), 'on - given event "$event" is not registered within Class.const.events hash constant. Add event "$event" configuration there', {
            $event: event
        }, ViewError);

        //assert that given event config is an object
        var eventConfig = me.self.events[event];
        xs.assert.object(eventConfig, 'on - given event "$event" config "$config" is not an object', {
            $event: event,
            $config: eventConfig
        }, ViewError);

        //check event domEvent
        //assert that domEvent is not given, or is non-empty string
        xs.assert.ok(!eventConfig.hasOwnProperty('domEvent') || (eventConfig.domEvent && xs.isString(eventConfig.domEvent)), 'on - given event "$event" domEvent "$domEvent" is incorrect. Valid value is non-empty event name string', {
            $event: event
        }, ViewError);

        //if not domEvent - simply call observable.on and return
        if (!eventConfig.domEvent) {
            self.log.trace('on - not DOM event, calling Observable.on');
            me.mixins.observable.prototype.on.apply(me, arguments);

            return me;
        }

        self.log.trace('on - DOM event, calling Observable.on');


        //init

        //set up hasListener flag
        var hasListener = me.private.eventsHandlers[event].length > 0;


        //observable processing

        //call Observable.on
        me.mixins.observable.prototype.on.apply(me, arguments);


        //return if no dom listener needed
        if (hasListener) {
            self.log.trace('on - DOM event, listener is already created');

            return me;
        }

        self.log.trace('on - DOM event, creating listener');


        //add single handler to DOM

        //get event domEvent
        var domEvent = eventConfig.domEvent;

        //define domHandler
        var domHandler = function (domEvent) {
            me.fire(event, domEvent);
        };

        //save handler to domHandlers collection
        me.private.domHandlers.add(domEvent, domHandler);

        //add domHandler as event listener for each node in nodes list
        me.private.nodes.each(function (node) {
            node.addEventListener(domEvent, domHandler);
        });

        return me;
    };

    Class.method.destroy = function () {
        var me = this;

        self.log.trace('destroy - destroying view');

        //remove domHandlers
        var nodes = me.private.nodes;
        var domHandlers = me.private.domHandlers;
        nodes.each(function (node) {
            domHandlers.each(function (domHandler, domEvent) {
                node.removeEventListener(domEvent, domHandler);
            });
        });

        //call Observable.destroy
        me.mixins.observable.prototype.destroy.call(me);

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
     * @method getNodesCollection
     *
     * @param {String} template
     *
     * @return {xs.core.Collection} collection of nodes in parsed template
     */
    var _getNodesCollection = function (template) {

        self.log.trace('getNodesCollection - fetching nodes from template "' + template + '"');

        //create container div element to parse html into
        var container = document.createElement('div');

        //set template as div innerHTML
        container.innerHTML = template;


        //init list of template nodes and reference to container.childNodes
        var nodes = new xs.core.Collection();
        var children = container.childNodes;

        //get children count
        var count = container.childElementCount;

        //fill nodes collection with children
        for (var i = 0; i < count; i++) {
            nodes.add(children.item(i));
        }

        //return nodes collection
        return nodes;
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ViewError
     */
    function ViewError(message) {
        this.message = self.label + '::' + message;
    }

    ViewError.prototype = new Error();
});