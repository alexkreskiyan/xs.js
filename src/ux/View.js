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
        {
            Element: 'xs.dom.Element'
        },
        {
            Collection: 'xs.util.Collection'
        },
        {
            'resource.text.HTML': 'xs.resource.text.HTML'
        },
        {
            'event.AddBefore': 'xs.util.collection.event.AddBefore'
        },
        {
            'event.Add': 'xs.util.collection.event.Add'
        },
        {
            'event.SetBefore': 'xs.util.collection.event.SetBefore'
        },
        {
            'event.Set': 'xs.util.collection.event.Set'
        },
        {
            'event.RemoveBefore': 'xs.util.collection.event.RemoveBefore'
        },
        {
            'event.Remove': 'xs.util.collection.event.Remove'
        }
    ];

    Class.extends = 'xs.dom.Element';

    /**
     * View query flag, meaning, that element lookup starts from the end
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
     * View query flag, meaning, that operation selects all matching elements
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

    Class.constant.template = undefined;

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
        self.assert.ok(!arguments.length || element instanceof Element, 'constructor - given element `$element` is not an instance of Element', {
            $element: element
        });

        var el;

        //if element given
        if (element) {

            //verify element
            self.assert.ok(verifyElement(me.self.descriptor.positions, getElementPositions(element)));

            //use it as is
            el = element;
        } else {

            //set element as template clone
            el = me.self.template.data.cloneNode(true);
        }

        //call parent constructor
        self.parent.call(me, el);

        //fetch positions from template
        if (me.self.descriptor.positions) {

            me.private.positions = getPositions(me.self.descriptor.positions, getElementPositions(el));
        }

        //define selected elements collection
        me.private.selection = new xs.core.Collection();
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
     * @return {xs.core.Collection|xs.dom.Element|undefined}
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

        var i, node;
        var length = nodes.length;

        if (!all) {

            //handle reverse flag
            if (reverse) {
                for (i = length - 1; i >= 0; i--) {
                    node = nodes.item(i);

                    if (isOwnNode.call(me, node)) {

                        //return element
                        return getSelectionElement.call(me, node);
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    node = nodes.item(i);

                    if (isOwnNode.call(me, node)) {

                        //return element
                        return getSelectionElement.call(me, node);
                    }
                }
            }

            //return undefined - nothing found
            return;
        }

        //create selection collection
        var selection = new xs.core.Collection();

        for (i = 0; i < length; i++) {
            node = nodes.item(i);

            //if not own node - continue
            if (!isOwnNode.call(me, node)) {
                continue;
            }

            //add element to selection
            selection.add(getSelectionElement.call(me, node));
        }

        //return selection
        return selection;
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
        if (me.private.positions) {
            Object.keys(me.private.positions).forEach(function (name) {
                me.private.positions[ name ].destroy();

                delete me.private.positions[ name ];
            });
        }

        //clean up elements
        me.private.selection.each(function (element) {
            element.destroy();
        });

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    var verifyElement = function (declaredPositions, elementPositions) {

        //all ok if no positions declared
        if (!declaredPositions) {

            return true;
        }

        //assert, that all declared positions are presented
        declaredPositions.each(function (position) {

            //assert, that position is presented
            self.assert.ok(elementPositions.hasOwnProperty(position), 'verifyTtemplate - declared position `$position` is not presented');
        });

        return true;
    };

    /**
     * Returns collection of template's positions
     *
     * @ignore
     *
     * @private
     *
     * @method getPositionsCollection
     *
     * @param {xs.core.Collection} declaredPositions
     * @param {Object} elementPositions
     *
     * @return {Object} object with element position collections
     */
    var getPositions = function (declaredPositions, elementPositions) {

        //define positions collection
        var positions = {};

        //fill positions
        declaredPositions.each(function (name) {

            //get position element
            var element = elementPositions[ name ];

            //get element parent reference
            var parent = element.parentElement;

            //remove element from parent
            element.parentElement.removeChild(element);

            positions[ name ] = xs.lazy(function () {

                //position is a collection of views
                var position = new imports.Collection(self);

                //save reference to parent
                position.private.el = parent;

                //add events handlers for position
                var options = {
                    scope: position
                };
                position.on(imports.event.AddBefore, handleAddBefore, options);
                position.on(imports.event.Add, handleAdd, options);
                position.on(imports.event.SetBefore, handleSetBefore, options);
                position.on(imports.event.Set, handleSet, options);
                position.on(imports.event.RemoveBefore, handleRemoveBefore, options);
                position.on(imports.event.Remove, handleRemove, options);

                return position;
            });

        });

        return positions;
    };

    /**
     * Position tag template
     *
     * @ignore
     *
     * @type {String}
     */
    var positionSelector = 'xs-view-position[name]';

    var getElementPositions = function (element) {

        var elements = element.querySelectorAll(positionSelector);

        //define variables
        var i, item, name;
        var length = elements.length;
        var positions = {};

        for (i = 0; i < length; i++) {
            //get element
            item = elements.item(i);

            //get name
            name = item.getAttribute('name');

            //assert, that element name is unique
            self.assert.not(positions.hasOwnProperty(name), 'getElementPositions - given position name `$name` is already taken', {
                $name: name
            });

            //element.parentElement must be defined
            self.assert.ok(item.parentElement, 'getElementPositions - position `$item` does not have a parent element', {
                $item: item
            });

            //element.parentElement must contain only position
            self.assert.equal(item.parentElement.childNodes.length, 1, 'getElementPositions - position `$item` does not have a parent element', {
                $item: item
            });

            positions[ name ] = item;
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
        self.assert.not(view.isDestroyed, 'position.add - `$view` is destroyed', {
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
        var next = me.private.items[ event.index + 1 ].value;

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
        var view = event.new;

        self.log.trace('set:before', {
            event: event
        });

        //assert, that view is not destroyed
        self.assert.not(view.isDestroyed, 'position.set - `$view` is destroyed', {
            $view: view
        });


        //remove old item

        //get old item reference
        var old = event.old;

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
        var view = event.new;

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
        var next = me.private.items[ event.index + 1 ].value;

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
        self.assert.not(view.isDestroyed, 'position.set - `$view` is destroyed', {
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
     * @return {xs.dom.Element}
     */
    var getSelectionElement = function (el) {
        var me = this;

        var selection = me.private.selection;

        var element = selection.find(function (element) {
            return element.private.el === el;
        });

        //if element already selected - return it
        if (element) {

            return element;
        }

        //create element
        element = new imports.Element(el);

        //add element to elements collection
        selection.add(element);

        //return element
        return element;
    };

    /**
     * Returns whether given node is own node of view, verifying parentElement relation
     *
     * @ignore
     *
     * @private
     *
     * @method isOwnNode
     *
     * @param {Element} node
     *
     * @return {Boolean}
     */
    var isOwnNode = function (node) {
        var me = this;
        var positions = me.private.positions;
        var names = Object.keys(positions);
        var length = positions.length;
        var position;

        for (var i = 0; i < length; i++) {
            position = positions[ names[ i ] ];

            if (hasParentElement(me.private.el, position.private.el, node)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Returns whether given element has given parent as an ancestor
     *
     * @ignore
     *
     * @private
     *
     * @method hasParentElement
     *
     * @param {Element} root
     * @param {Element} parent
     * @param {Element} node
     *
     * @return {Boolean}
     */
    var hasParentElement = function (root, parent, node) {
        while (node.parentElement && node.parentElement !== root) {
            if (node.parentElement === parent) {
                return true;
            }

            node = node.parentElement;
        }

        return false;
    };

});

//define xs.ux.View-specific preprocessor
(function () {

    'use strict';

    var log = new xs.log.Logger('xs.class.preprocessors.xs.ux.View');

    var assert = new xs.core.Asserter(log, XsClassPreprocessorsXsUxViewError);

    xs.class.preprocessors.add('xs.ux.View', function (Class) {

        //use preprocessor only for view classes
        return Class.inherits(xs.ux.View);
    }, function (Class, descriptor) {

        //process positions
        processPositions(Class, descriptor);

        //process sequentially
        processTemplate(Class);
    }, 'before', 'defineElements');

    function processPositions(Class, descriptor) {

        //if no positions given
        if (!descriptor.hasOwnProperty('positions')) {

            return;
        }

        //assert, that positions is an array
        assert.array(descriptor.positions, 'processPositions - given positions `$positions` are not an array', {
            $positions: descriptor.positions
        });

        //define positions collection for a class
        var positions = Class.descriptor.positions = new xs.core.Collection(descriptor.positions);

        //verify positions
        assert.ok(positions.all(function (position) {

            //assert, that position is a short name
            assert.ok(xs.ContractsManager.isShortName(position), 'processPositions - given position `$position` is not a valid short name', {
                $position: position
            });

            return true;
        }));


        //save all positions as properties
        var properties = Class.descriptor.property;
        positions.each(function (position) {

            //prepare property descriptor
            var value = xs.property.prepare(position, {
                get: function () {
                    var positions = this.private.positions;

                    //lazy evaluate position
                    if (positions[ position ] instanceof xs.core.Lazy) {
                        positions[ position ] = positions[ position ].get();
                    }

                    return positions[ position ];
                },
                set: xs.noop
            });

            //add/set property in class descriptor
            if (properties.hasKey(position)) {
                properties.set(position, value);
            } else {
                properties.add(position, value);
            }
        });
    }

    function processTemplate(Class) {

        var template = Class.descriptor.constant.at('template');

        //assert, that template is an instance of xs.resource.text.HTML
        assert.ok(template instanceof xs.resource.text.HTML, 'processTemplate - given template `$template` is not an instance of xs.resource.text.HTML', {
            $template: template
        });

        //assert, that template is loaded
        assert.ok(template.isLoaded, 'processTemplate - given template `$template` is not loaded. Add it to resources section, if needed', {
            $template: template
        });


        //verify template element
        assert.ok(verifyElement(Class.descriptor.positions, getElementPositions(template.data)));
    }

    var verifyElement = function (declaredPositions, elementPositions) {

        //all ok if no positions declared
        if (!declaredPositions) {

            return true;
        }

        //assert, that all declared positions are presented
        declaredPositions.each(function (position) {

            //assert, that position is presented
            assert.ok(elementPositions.hasOwnProperty(position), 'verifyTtemplate - declared position `$position` is not presented');
        });

        return true;
    };

    var positionSelector = 'xs-view-position[name]';

    var getElementPositions = function (element) {

        var elements = element.querySelectorAll(positionSelector);

        //define variables
        var i, item, name;
        var length = elements.length;
        var positions = {};

        for (i = 0; i < length; i++) {
            //get element
            item = elements.item(i);

            //get name
            name = item.getAttribute('name');

            //assert, that element name is unique
            assert.not(positions.hasOwnProperty(name), 'getElementPositions - given position name `$name` is already taken', {
                $name: name
            });

            //element.parentElement must be defined
            assert.ok(item.parentElement, 'getElementPositions - position `$item` does not have a parent element', {
                $item: item
            });

            //element.parentElement must contain only position
            assert.equal(item.parentElement.childNodes.length, 1, 'getElementPositions - position `$item` does not have a parent element', {
                $item: item
            });

            positions[ name ] = item;
        }

        return positions;
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class XsClassPreprocessorsXsUxViewError
     */
    function XsClassPreprocessorsXsUxViewError(message) {
        this.message = 'xs.class.preprocessors.xs.ux.View::' + message;
    }

    XsClassPreprocessorsXsUxViewError.prototype = new Error();

})();