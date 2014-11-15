/*!
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Private internal stack class
     *
     * Stack is used to store ordered list of processors
     *
     * @class xs.Class.Stack
     *
     * @singleton
     *
     * @private
     */
    var Stack = function () {
        var me = this;

        //items hash
        var items = {};

        /**
         * Applies item in stack relative to item with given name
         *
         * @ignore
         *
         * @param {string} name name of repositioned item
         * @param {string} position new item position
         * @param {*} relativeTo name of relativeTo positioned item
         */
        var apply = function (name, position, relativeTo) {
            if (!xs.has([
                'first',
                'last',
                'before',
                'after'
            ], position)) {
                throw new Error('Incorrect position given');
            }

            //get current keys
            var keys = xs.keys(items);

            //remove name from keys
            xs.delete(keys, name);

            //insert to specified position
            if (position == 'first' || position == 'last') {
                position == 'first' ? keys.unshift(name) : keys.push(name);
            } else {
                var relativeKey = xs.keyOf(keys, relativeTo);
                if (!xs.isDefined(relativeKey)) {
                    throw new Error('Relative item missing in stack');
                }
                position == 'after' && relativeKey++;
                keys.splice(relativeKey, 0, name);
            }

            //pick items in new order
            items = xs.pick(items, keys);
        };

        /**
         * Returns stack items copy
         *
         * @method get
         *
         * @returns {Object} stack items copy
         */
        me.get = function () {
            return xs.clone(items);
        };

        /**
         * Adds new processor to stack
         *
         * For example:
         *
         *     stack.add('addY', function() {
         *         return true;
         *     }, function() {
         *        this.x = 0;
         *     }, 'after', 'addY')
         *
         * @method add
         *
         * @param {string} name processor name
         * @param {Function} verifier processor verifier.
         * Returns boolean whether processor should be applied to Class. Accepts class descriptor as param
         * @param {Function} handler processor body
         * @param {string} [position] position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * By default, last is used
         * @param {string} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         */
        me.add = function (name, verifier, handler, position, relativeTo) {
            //position defaults to last
            position || (position = 'last');
            if (xs.hasKey(items, name)) {
                throw new Error('processor "' + name + '" already in stack');
            }
            items[name] = {
                verifier: verifier,
                handler:  handler
            };
            apply(name, position, relativeTo);
        };

        /**
         * Reorders processor at stack
         *
         * For example:
         *
         *     stack.reorder('addY','before','addX');
         *
         * @method reorder
         *
         * @param {string} name processor name
         * @param {string} position position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * @param {string} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         */
        me.reorder = function (name, position, relativeTo) {
            apply(name, position, relativeTo);
        };

        /**
         * Deletes processor from stack. If processor not found, error is thrown
         *
         * For example:
         *
         *     stack.delete('addY');
         *
         * @method delete
         *
         * @param {string} name processor name
         */
        me.delete = function (name) {
            if (xs.hasKey(items, name)) {
                xs.deleteAt(items, name);
            } else {
                throw new Error('processor "' + name + '" not found in stack');
            }
        };

        /**
         * Starts stack processing chain with given arguments
         *
         * For example:
         *
         *     stack.process([1, 2], [2, 3], function() {
         *         console.log('ready');
         *     });
         *
         * @method process
         *
         * @param {Array} verifierArgs arguments, passed to each stack item's verifier
         * @param {Array} handlerArgs arguments, passed to each stack item's handler
         * @param {Function} [callback] optional executed callback
         */
        me.process = function (verifierArgs, handlerArgs, callback) {
            process(xs.values(items), verifierArgs, handlerArgs, xs.isFunction(callback) ? callback : xs.emptyFn);
        };

        /**
         * Internal process function
         *
         * @ignore
         *
         * @param {Array} items items stack
         * @param {Array} verifierArgs arguments for items' verifiers
         * @param {Array} handlerArgs arguments for items' handlers
         * @param {Function} callback stack ready callback
         */
        var process = function (items, verifierArgs, handlerArgs, callback) {
            if (!items.length) {
                callback();
                return;
            }
            var item = xs.shift(items);

            //if item.verifier allows handler execution, process next
            if (item.verifier.apply(this, verifierArgs)) {

                var ready = function () {
                    process(items, verifierArgs, handlerArgs, callback);
                };
                //if item.handler returns false, processing is async, stop processing, awaiting ready call
                if (item.handler.apply(this, xs.union(handlerArgs, ready)) === false) {
                    return;
                }
            }

            process(items, verifierArgs, handlerArgs, callback);
        };
    };

    /**
     * xs.Class is core class, that is used internally for class generation.
     *
     * xs.Class provides 3 stacks to register processors:
     *
     * - {@link xs.Class#preProcessors preProcessors}
     * - {@link xs.Class#postProcessors postProcessors}
     * - {@link xs.Class#constructors constructors}
     *
     * Usage example:
     *
     *     //create simple Class
     *     var Class = xs.Class.create(function (Class) {
     *         //here is Class descriptor returned
     *         return {
     *         };
     *     });
     *
     * @class xs.Class
     *
     * @singleton
     */
    xs.Class = (function () {

        /**
         * Stack of processors, processing class before it's considered to be created (before createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * For handler:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * @property preProcessors
         *
         * @type {xs.Class.Stack}
         */
        var preProcessors = new Stack();

        /**
         * Stack of processors, processing class after it's considered to be created (after createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * For handler:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * @property postProcessors
         *
         * @type {xs.Class.Stack}
         */
        var postProcessors = new Stack();

        /**
         * Stack of processors, processing object instance before object constructor is called
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Class
         *  - instance
         *
         * For handler:
         *
         *  - Class
         *  - instance
         *
         * @property constructors
         *
         * @type {xs.Class.Stack}
         */
        var constructors = new Stack();

        /**
         * Returns new xClass sample
         *
         * @ignore
         *
         * @returns {Function} new xClass
         */
        var createClass = function () {
            var Class = function xClass() {
                var me = this;

                //define class constructor
                var descriptor = Class.descriptor;

                //get constructor shortcut
                var constructor = xs.isFunction(descriptor.constructor) ? descriptor.constructor : undefined;

                //if parent constructor - just call it
                if (me.self && me.self !== Class) {
                    constructor && constructor.apply(me, arguments);
                    return;
                }

                //save class reference
                me.self = Class;

                //process constructors
                constructors.process([
                    Class,
                    me
                ], [
                    Class,
                    me
                ]);

                //apply constructor
                constructor && constructor.apply(me, arguments);
            };
            return Class;
        };

        /**
         * Creates class sample and starts processors applying
         *
         * For example:
         *
         *     //create simple Class
         *     var Class = xs.Class.create(function (self, ns) {
         *         //here is Class descriptor returned
         *         return {
         *         };
         *     }, function(Class) {
         *         console.log('class', Class, 'created');
         *     );
         *
         * @param {Function} descFn descriptor function. Is called with 2 params:
         *
         * - self. Created class instance
         * - ns. namespace object, where namespace references are placed
         *
         * @param {Function} createdFn class creation callback. Is called after
         * {@link xs.Class#preProcessors preProcessors} stack is processed. When called, created class is passed as param
         *
         * @returns {Function} created Class
         */
        var create = function (descFn, createdFn) {

            //descFn must be function
            if (!xs.isFunction(descFn)) {
                throw new Error('Class descriptor must be evaluated function');
            }

            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create class
            var Class = createClass();

            //get descriptor
            var namespace = {};
            var descriptor = descFn(Class, namespace);

            //check descriptor is object
            if (!xs.isObject(descriptor)) {
                throw new Error('Evaluated class descriptor must be object');
            }

            //save Class descriptor
            xs.const(Class, 'descriptor', descriptor);

            //process preProcessors stack before createdFn called
            preProcessors.process([
                Class,
                descriptor,
                namespace
            ], [
                Class,
                descriptor,
                namespace
            ], function () {
                createdFn(Class);
                //process postProcessors stack before createdFn called
                postProcessors.process([
                    Class,
                    descriptor,
                    namespace
                ], [
                    Class,
                    descriptor,
                    namespace
                ]);
            });

            return Class;
        };

        return {
            create:         create,
            preProcessors:  preProcessors,
            postProcessors: postProcessors,
            constructors:   constructors
        };
    })();
})(window, 'xs');