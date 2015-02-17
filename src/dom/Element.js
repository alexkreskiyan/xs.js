/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Internal core view object. Represents a wrapper around native DOM Element.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.dom.Element
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.Element', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.dom';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.events = {
        /**
         * click event. Is a proxy to DOM `click` event. Fires with {@link xs.event.Event}
         *
         * @event click
         */
        click: {
            domType: 'click',
            type: 'xs.event.Event'
        },
        /**
         * double click event. Is a proxy to DOM `dblclick` event. Fires with {@link xs.event.Event}
         *
         * @event dblClick
         */
        dblClick: {
            domType: 'dblclick',
            type: 'xs.event.Event'
        },
        /**
         * destroy event. Is fired, when element is destroyed. Fires with {@link xs.event.Event}
         *
         * @event destroy
         */
        destroy: {
            type: 'xs.event.Event'
        }
    };

    /**
     * xs.dom.Element constructor
     *
     * @param {Element} element wrapped element
     */
    Class.constructor = function (element) {
        var me = this;

        self.assert.ok(element instanceof Element, 'Given element `$element` is not an instance of Element', {
            $element: element
        });

        //save element reference
        me.private.el = element;

        //call observable constructor
        self.mixins.observable.call(me);

        //create collection for dom handlers
        me.private.domHandlers = new xs.core.Collection();

        //create access gate to element's attributes
        me.private.attributes = new Attributes(element);

        //create access gate to element's classList
        me.private.classes = new Classes(element);
    };

    /**
     * Attributes access gate
     *
     * @property attributes
     *
     * @type {Object}
     */
    Class.property.attributes = {
        set: xs.emptyFn
    };

    /**
     * Classes access gate
     *
     * @property classes
     *
     * @type {Object}
     */
    Class.property.classes = {
        set: xs.emptyFn
    };

    /**
     * Access gate to element's style property
     *
     * @property style
     *
     * @type {CSSStyleDeclaration}
     */
    Class.property.style = {
        get: function () {
            return this.private.el.style;
        },
        set: xs.emptyFn
    };

    Class.method.on = function (event, handler, options) {
        var me = this;

        //call Observable.on
        self.mixins.observable.prototype.on.apply(me, arguments);


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
        self.mixins.observable.prototype.off.apply(me, arguments);

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
        }, xs.core.Collection.All);

        return me;
    };

    Class.method.destroy = function () {
        var me = this;

        //fire destroy event
        me.fire('destroy');

        //toggle off all events
        me.off();

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //destroy attributes gate
        delete me.private.attributes.el;

        //destroy classes gate
        delete me.private.classes.el;

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };


    /**
     * Internal class, used in Element. Provides handy access to element's attributes
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class Attributes
     */

    /**
     * Creates attributes object
     *
     * @constructor
     *
     * @param {Element} el Element instance
     */
    var Attributes = function (el) {
        this.el = el;
    };

    /**
     * Returns whether element has attribute with given name
     *
     * @method has
     *
     * @param {String} name attribute name
     *
     * @returns {Boolean} verification result
     */
    Attributes.prototype.has = function (name) {

        return this.el.hasAttribute(name);
    };

    /**
     * Returns value of attribute with given name
     *
     * @method get
     *
     * @param {String} name attribute name
     *
     * @returns {String} attribute value
     */
    Attributes.prototype.get = function (name) {

        return this.el.getAttribute(name);
    };

    /**
     * Sets new value for attribute with given name
     *
     * @method set
     *
     * @param {String} name attribute name
     * @param {String} value new attribute value
     */
    Attributes.prototype.set = function (name, value) {

        return this.el.setAttribute(name, value);
    };

    /**
     * Removes attribute with given name from element
     *
     * @method remove
     *
     * @param {String} name attribute name
     */
    Attributes.prototype.remove = function (name) {

        return this.el.removeAttribute(name);
    };


    /**
     * Internal class, used in Element. Provides handy access to element's classes list
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class Classes
     */

    /**
     * Creates attributes object
     *
     * @constructor
     *
     * @param {Element} el Element instance
     */
    var Classes = function (el) {
        this.el = el;
    };

    /**
     * Returns whether element has class with given name
     *
     * @method has
     *
     * @param {String} name class name
     *
     * @returns {Boolean} verification result
     */
    Classes.prototype.has = function (name) {

        return this.el.classList.contains(name);
    };

    /**
     * Adds class with given name to element
     *
     * @method add
     *
     * @param {String} name class name
     */
    Classes.prototype.add = function (name) {

        return this.el.classList.add(name);
    };

    /**
     * Removes class with given name from element
     *
     * @method remove
     *
     * @param {String} name class name
     */
    Classes.prototype.remove = function (name) {

        return this.el.classList.remove(name);
    };

});