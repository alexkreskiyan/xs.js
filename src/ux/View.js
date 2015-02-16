/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Core xs.js view object. View class is a base class, all other concrete views are to be extended from.
 *
 * Key concept of view is a concept of 3-way initialization:
 *
 * - via imported resource template. Imported resource must be named `Template` TODO upgrade with a link
 * This is a base scheme for complex scenarios, when there is a complex multiline template
 *
 * - via template instantiation (from Class.constant.template)
 * This is a base scheme for most simple scenarios, when there is no need in external template definition
 *
 * - via wrapping given DOM Element
 * This way is required at least for initial view creation - like for a body element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.ux.View
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.View', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    Class.imports = [
        {Collection: 'xs.util.collection.Collection'}
    ];

    Class.extends = 'xs.dom.Element';

    /**
     * View constructor
     *
     * If element given - it is wrapped by view. If no element given - priority is given to Template resource
     *
     * @constructor
     *
     * @param {Element} [element] optional wrapped element
     */
    Class.constructor = function (element) {
        var me = this;

        //assert, that element is instance of Element, if given
        self.assert.ok(!arguments.length || element instanceof Element, 'constructor - given element "$element" is not an instance of Element', {
            $element: element
        });

        var el;

        if (element) {
            self.log.trace('constructor - creating new view from given element "$element"', {
                $element: element
            });

            el = element;
        } else {

            //assert, that constant.template is a non-empty string
            self.assert.ok(me.self.template && xs.isString(me.self.template), 'constructor - given template "$template" is not a non-empty string', {
                $template: me.self.template
            });

            //parse view template into node
            el = parseTemplate(me.self.template);
        }

        //call parent constructor
        self.parent.call(me, el);

        //fetch positions from template
        me.private.positions = getPositionsCollection(el);

        //define picked elements collection
        //me.private.elements = new xs.core.Collection();
    };

    /**
     * Returns reference to one of view's positions
     *
     * @method at
     *
     * @param {String|Number} key
     *
     * @return {xs.util.collection.Collection}
     */
    Class.method.at = function (key) {

        return this.private.positions.at(key);
    };

    /**
     * Destroys view.
     *
     * If view is added to some container, it is removed from that container
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

        //clean up positions
        me.private.positions.destroy();

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    /*
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

    /*
     * Adding event handlers for DOM events both via query and simply on:
     * view.query('ul').on('mouseOver', function(event) {
     * });
     * view.on('mouseOver', function(event) {
     * });
     * view.query('ul').off('mouseOver')
     * view.off('mouseOver')
     */
    //Class.method.query = function (selector) {
    //
    //};

    /**
     * Returns template parsed into an element
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

        //assert, that template root is element
        self.assert.instance(container.firstChild, Element, 'parseTemplate - template root must be an Element');

        //get root
        var root = container.lastChild;

        //remove root from container
        container.removeChild(root);

        //return root
        return root;
    };

    /**
     * Position tag template
     *
     * @ignore
     *
     * @type {String}
     */
    var positionSelector = 'xs-view-position[name]';

    /**
     * Returns collection of template's positions
     *
     * @ignore
     *
     * @private
     *
     * @method getPositionsCollection
     *
     * @param {Element} el
     *
     * @return {PositionsCollection} collection of positions elements
     */
    var getPositionsCollection = function (el) {

        //define positions collection
        var positions = new PositionsCollection();

        var elements = el.querySelectorAll(positionSelector);

        //return undefined if no positions found
        if (!elements.length) {

            return positions;
        }

        //assert positions are ok
        self.assert.ok(verifyPositions(elements));

        //fill positions collection
        var i, length = elements.length, items = positions.private.items, element, position;

        for (i = 0; i < length; i++) {
            //get element
            element = elements.item(i);

            //collection of views
            position = new imports.Collection(self);

            //save reference to element's parentElement
            position.private.el = element.parentElement;

            //add position to items
            items.push({
                key: element.getAttribute('name'),
                value: position
            });

            //remove element from parent
            element.parentElement.removeChild(element);

            var options = {
                scope: position
            };
            //add events handlers for position
            position.on('add:before', handleAddBefore, options);
            position.on('add', handleAdd, options);
            position.on('set:before', handleSetBefore, options);
            position.on('set', handleSet, options);
            position.on('remove:before', handleRemoveBefore, options);
            position.on('remove', handleRemove, options);

        }

        return positions;
    };

    /**
     * Handler for position add:before event
     *
     * @ignore
     *
     * @private
     *
     * @method handleAddBefore
     *
     * @param {xs.util.collection.Event} event
     */
    var handleAddBefore = function (event) {
        //get view reference;
        var view = event.value;

        self.log.trace('add:before', {
            event: event
        });

        //assert, that view is not destroyed
        self.assert.not(view.isDestroyed, 'position.add - "$view" is destroyed', {
            $view: view
        });

        //if view has no parent collection finish
        if (!view.private.container) {

            return;
        }

        //view has old container - remove it from there
        //assign temporary `isUsed` flag
        view.private.isUsed = true;

        //remove view from old container
        view.private.container.remove(view);

        //delete temporary `isUsed` flag
        delete view.private.isUsed;
    };

    /**
     * Handler for position add event
     *
     * @ignore
     *
     * @private
     *
     * @method handleAdd
     *
     * @param {xs.util.collection.Event} event
     */
    var handleAdd = function (event) {
        var me = this;

        //get view reference;
        var view = event.value;

        self.log.trace('add', {
            event: event
        });

        //update container reference
        view.private.container = me;

        //insert view to it's place in position
        var parent = me.private.el;

        //if view is last item - simply append it
        if (me.private.items.length - event.index === 1) {
            parent.appendChild(view.private.el);

            return;
        }

        //get next view relative to inserted
        var next = me.private.items[event.index + 1].value;

        //insert view before next.element
        parent.insertBefore(view.private.el, next.private.el);
    };

    /**
     * Handler for position set:before event
     *
     * @ignore
     *
     * @private
     *
     * @method handleSetBefore
     *
     * @param {xs.util.collection.Event} event
     */
    var handleSetBefore = function (event) {
        var me = this;

        //get view reference;
        var view = event.value;

        self.log.trace('set:before', {
            event: event
        });

        //assert, that view is not destroyed
        self.assert.not(view.isDestroyed, 'position.set - "$view" is destroyed', {
            $view: view
        });


        //remove old item

        //get old item reference
        var old = me.private.items[event.index].value;

        //remove it from position manually
        me.private.el.removeChild(old.private.el);
        delete old.private.container;

        //destroy old (it is safe now)
        old.destroy();

        //if view has no parent collection finish
        if (!view.private.container) {

            return;
        }

        //view has old container - remove it from there
        //assign temporary `isUsed` flag
        view.private.isUsed = true;

        //remove view from old container
        view.private.container.remove(view);

        //delete temporary `isUsed` flag
        delete view.private.isUsed;
    };

    /**
     * Handler for position set event
     *
     * @ignore
     *
     * @private
     *
     * @method handleSet
     *
     * @param {xs.util.collection.Event} event
     */
    var handleSet = function (event) {
        var me = this;

        //get view reference;
        var view = event.value;

        self.log.trace('set', {
            event: event
        });

        //update container reference
        view.private.container = me;

        //insert view to it's place in position
        var parent = me.private.el;

        //if view is last item - simply append it
        if (me.private.items.length - event.index === 1) {
            parent.appendChild(view.private.el);

            return;
        }

        //get next view relative to inserted
        var next = me.private.items[event.index + 1].value;

        //insert view before next.element
        parent.insertBefore(view.private.el, next.private.el);
    };

    /**
     * Handler for position remove:before event
     *
     * @ignore
     *
     * @private
     *
     * @method handleRemoveBefore
     *
     * @param {xs.util.collection.Event} event
     */
    var handleRemoveBefore = function (event) {

        //get view reference;
        var view = event.value;

        self.log.trace('remove:before', {
            event: event
        });

        //assert, that view is not destroyed
        self.assert.not(view.isDestroyed, 'position.set - "$view" is destroyed', {
            $view: view
        });
    };

    /**
     * Handler for position remove event
     *
     * @ignore
     *
     * @private
     *
     * @method handleRemove
     *
     * @param {xs.util.collection.Event} event
     */
    var handleRemove = function (event) {
        var me = this;

        //get view reference;
        var view = event.value;

        self.log.trace('remove', {
            event: event
        });

        //remove view from it's container
        me.private.el.removeChild(view.private.el);

        //remove container reference
        delete view.private.container;

        //destroy view, if `isUsed` flag is not set
        if (!view.private.isUsed) {
            view.destroy();
        }
    };

    /**
     * Verifies list of positions to be correct one
     *
     * @ignore
     *
     * @private
     *
     * @method verifyPositions
     *
     * @param {NodeList} elements
     *
     * @return {Boolean} whether positions are correct
     */
    var verifyPositions = function (elements) {

        //define variables
        var i, length = elements.length, element, name, names = [];

        for (i = 0; i < length; i++) {
            //get element
            element = elements.item(i);

            //get name
            name = element.getAttribute('name');

            //assert, that element name is unique
            self.assert.ok(names.indexOf(name) < 0, 'Given position name "$name" is already taken', {
                $name: name
            });

            names.push(name);

            //element.parentElement must be defined
            self.assert.ok(element.parentElement, 'Position "$element" does not have a parent element', {
                $element: element
            });

            //element.parentElement must contain only position
            self.assert.equal(element.parentElement.childNodes.length, 1, 'Position "$element" does not have a parent element', {
                $element: element
            });
        }

        return true;
    };


    /**
     * Internal class, used in View. Provides handy access to collection of positions in view
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PositionsCollection
     */

    /**
     * Creates positions collection
     *
     * @constructor
     */
    var PositionsCollection = function () {
        this.private = {};
        this.private.items = [];
    };

    /**
     * Returns list of positions name
     *
     * @method keys
     *
     * @return {String[]}
     */
    PositionsCollection.prototype.keys = xs.core.Collection.prototype.keys;

    /**
     * Returns position with specified name
     *
     * @method at
     *
     * @return {xs.util.collection.Collection} position for given index/key
     */
    PositionsCollection.prototype.at = xs.core.Collection.prototype.at;

    /**
     * Destroys positions collection
     *
     * @method destroy
     */
    PositionsCollection.prototype.destroy = function () {
        var me = this;

        //destroy all items
        me.private.items.forEach(function (item) {
            item.value.destroy();
        });

        //remove references to them
        me.private.items.splice(0, me.private.items.length);

        //remove private
        delete me.private;
    };
});