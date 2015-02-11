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
 * @class xs.dom.Element
 */
xs.define(xs.Class, 'ns.Element', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.dom';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.events = {
        click: {
            domType: 'click',
            type: 'xs.event.Event'
        },
        dblClick: {
            domType: 'dblclick',
            type: 'xs.event.Event'
        },
        destroy: {
            type: 'xs.event.Event'
        }
    };

    Class.constructor = function (element) {
        var me = this;

        self.assert.ok(element instanceof Element, 'Given element "$element" is not an instance of Element', {
            $element: element
        });

        //save element reference
        me.private.el = element;

        //call observable constructor
        me.mixins.observable.call(me);

        //create collection for dom handlers
        me.private.domHandlers = new xs.core.Collection();
    };

    Class.property.el = {
        set: xs.emptyFn
    };

    Class.method.on = function (event, handler, options) {
        var me = this;

        //call Observable.on
        me.mixins.observable.prototype.on.apply(me, arguments);


        //get eventConfig
        var eventConfig = me.self.events[event];
        var own = !eventConfig.hasOwnProperty('domType');

        //if own event - return
        if (own) {

            return me;
        }


        self.log.trace('on - DOM event, processing domHandlers');

        //get references
        var handlers = me.private.eventsHandlers[event];

        //return if there is more than one handler - domHandler was already added
        if (handlers.length > 1) {
            self.log.trace('on - DOM event, listener is already created');

            return me;
        }

        self.log.trace('on - DOM event, creating listener');


        //add single handler to DOM

        //get event domType
        var domType = eventConfig.domType;

        //define domHandler
        var domHandler = function (domEvent) {
            me.fire(event, domEvent);
        };

        //save handler to domHandlers collection
        me.private.domHandlers.add(event, domHandler);

        //add domHandler as event listener to el
        me.private.el.addEventListener(domType, domHandler);

        return me;
    };

    Class.method.off = function (event, selector, flags) {
        var me = this;

        //call Observable.on
        me.mixins.observable.prototype.off.apply(me, arguments);

        self.log.trace('on - DOM event, processing domHandlers');

        //get references
        var eventsHandlers = me.private.eventsHandlers;
        var domHandlers = me.private.domHandlers;
        var el = me.private.el;

        //remove useless domHandlers
        domHandlers.removeBy(function (domHandler, event) {

            //if eventsHandlers contains collection for event - all ok
            if (eventsHandlers.hasOwnProperty(event)) {

                return false;
            }

            //remove event domHandler from el
            el.removeEventListener(event, domHandler);

            return true;
        });

        return me;
    };

    Class.method.destroy = function () {
        var me = this;

        //fire destroy event
        me.fire('destroy');

        me.off();

        //call Observable.destroy
        me.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

});