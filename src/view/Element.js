/**
 * Internal core view object. Represents a wrapper around native DOM Element.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.view.Element
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.Element', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view';

    Class.imports = {
        IEvent: 'ns.event.IEvent'
    };

    Class.mixins.observable = 'xs.event.Observable';

    /**
     * Element query flag, meaning, that element lookup starts from the end
     *
     * @static
     *
     * @property Reverse
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Reverse = 0x1;

    /**
     * Element query flag, meaning, that operation selects all matching elements
     *
     * @static
     *
     * @property All
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.All = 0x2;

    /**
     * xs.view.Element constructor
     *
     * @param {Element} element wrapped element
     * @param {Function} [generator] generator for underlying observable
     * @param {Array} [sources] additional sources for generator
     */
    Class.constructor = function (element, generator, sources) {
        var me = this;

        self.assert.ok(element instanceof Element, 'Given element `$element` is not an instance of Element', {
            $element: element
        });

        //save element reference
        me.private.el = element;

        //call observable constructor

        //without events generator
        if (arguments.length === 1) {
            self.mixins.observable.call(me, xs.noop);

            //with events generator only
        } else if (arguments.length === 2) {
            self.mixins.observable.call(me, generator);

            //with events generator and sources
        } else {
            self.mixins.observable.call(me, generator, sources);
        }

        //define event captures collection
        var captures = me.private.captures = new xs.core.Collection();

        //handle stream Resume and Suspend events
        me.private.stream.on(xs.reactive.event.Resume, function (event) {
            event = event.event;

            if (xs.isClass(event) && event.implements(imports.IEvent)) {
                //save capture
                captures.add(event, event.forward(me));
            }
        });
        me.private.stream.on(xs.reactive.event.Suspend, function (event) {
            event = event.event;

            if (xs.isClass(event) && event.implements(imports.IEvent)) {
                //get saved capture
                var capture = captures.at(event);

                //remove from captures
                captures.removeAt(event);

                //release capture
                event.release(me, capture);
            }
        });

        //create access gate to element's attributes
        me.private.attributes = new Attributes(element);

        //create access gate to element's classList
        me.private.classes = new Classes(element);

        //define selected elements collection
        me.private.selection = new xs.core.Collection();
    };

    /**
     * Attributes access gate
     *
     * @property attributes
     *
     * @type {Object}
     */
    Class.property.attributes = {
        set: xs.noop
    };

    /**
     * Classes access gate
     *
     * @property classes
     *
     * @type {Object}
     */
    Class.property.classes = {
        set: xs.noop
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
        set: xs.noop
    };

    /**
     * Queries elements by selector from view. Optionally, query flags may be specified
     *
     * @method query
     *
     * @param {String} selector query selector string
     * @param {Number} [flags] optional query flags. Allowed flags are:
     *
     * - Reverse - to find last matched element
     * - All - to fetch all matched elements
     *
     * @return {xs.core.Collection|xs.view.Element|undefined}
     */
    Class.method.query = function (selector, flags) {
        var me = this;

        //assert, that selector is a string
        self.assert.string(selector, 'query - given selector `$selector` is not a string', {
            $selector: selector
        });

        var all, reverse;

        //if no flags - single element is selected
        if (arguments.length === 1) {
            all = false;
            reverse = false;

            //handle flags
        } else {

            //assert that flags is number
            self.assert.number(flags, 'query - given flags `$flags` list is not number', {
                $flags: flags
            });

            //if All flag given
            if (flags & self.All) {
                all = true;
                reverse = false;

                //if Reverse flag given
            } else if (flags & self.Reverse) {
                all = false;
                reverse = true;

                //else - no changes compared with no flags scenario
            } else {
                all = false;
                reverse = false;
            }
        }

        //get nodes list
        var nodes = me.private.el.querySelectorAll(selector);

        var i;
        var length = nodes.length;

        if (!all) {

            //return undefined - nothing found
            if (!length) {
                return;
            }

            //handle reverse flag
            if (reverse) {

                //return element
                return getSelectionElement.call(me, nodes.item(length - 1));
            } else {

                //return element
                return getSelectionElement.call(me, nodes.item(0));
            }
        }

        //create selection collection
        var selection = new xs.core.Collection();

        for (i = 0; i < length; i++) {

            //add element to selection
            selection.add(getSelectionElement.call(me, nodes.item(i)));
        }

        //return selection
        return selection;
    };

    /**
     * Destroys element
     *
     * If element is added to some container, it is removed from that container
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        var me = this;

        //if view has container - use container.remove instead of direct destroying
        if (me.private.hasOwnProperty('container')) {
            me.private.container.remove(me);

            return;
        }

        //remove element from parent container
        var el = me.private.el;

        if (el.parentElement) {
            el.parentElement.removeChild(el);
        }

        //clean up selection
        me.private.selection.each(function (element) {
            element.destroy();
        });

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
     * Returns selection element (or caches one)
     *
     * @ignore
     *
     * @private
     *
     * @method getSelectionElement
     *
     * @param {Element} el
     *
     * @return {xs.view.Element}
     */
    var getSelectionElement = function (el) {
        var me = this;
        var Element = self;

        var selection = me.private.selection;

        var element = selection.find(function (element) {
            return element.private.el === el;
        });

        //if element already selected - return it
        if (element) {

            return element;
        }

        //create element
        element = new Element(el);

        //add element to elements collection
        selection.add(element);

        //return element
        return element;
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