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
/**
 * @class xs.Class
 * @singleton
 * xs.Class is core class, that is used internally for class generation.
 *
 * xs.Class defines 2 static methods:
 * {@link xs.Class#registerPreprocessor registerPreprocessor}
 * {@link xs.Class#registerPostprocessor registerPostprocessor}
 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Private internal stack class
     *
     * @ignore
     */
    var Stack = function () {
        var me = this;

        //items hash
        var items = {};

        /**
         * Reorders item in stack relative to item with given name
         *
         * @param {string} name name of repositioned item
         * @param {string} position new item position
         * @param {*} relativeTo name of relativeTo positioned item
         */
        var reorder = function (name, position, relativeTo) {
            if (!xs.has([
                'first',
                'last',
                'before',
                'after'
            ], position)) {
                throw new Exception('Incorrect position given');
            }

            //get current keys
            var keys = xs.keys(items);

            //remove name from keys
            xs.delete(name);

            //insert to specified position
            if (position == 'first' || position == 'last') {
                position == 'first' ? xs.unshift(keys, name) : xs.push(keys, name);
            } else {
                var relativeKey = xs.keyOf(keys, relativeTo);
                if (!xs.isDefined(relativeKey)) {
                    throw new Exception('Relative item missing in stack');
                }
                position == 'after' && relativeKey++;
                keys.splice(relativeKey, 0, name);
            }

            //pick items in new order
            items = xs.pick(keys);
        };

        /**
         * Adds new processor to stack
         *
         * @param {string} name processor name
         * @param {Function} verifier processor verifier.
         * @param {Function} handler processor body
         * Returns boolean whether processor should be applied to Class. Accepts class descriptor as param
         * @param {string} position position, class processor is inserted at
         * @param {string} relativeTo name of processor, relative to position is evaluated
         */
        me.add = function (name, verifier, handler, position, relativeTo) {
            //position defaults to last
            position || (position = 'last');
            items[name] = {
                verifier: verifier,
                handler:  handler
            };
            reorder(name, position, relativeTo);
        };

        /**
         * Returns items by name or ordered items
         *
         * @param {string} [name] name processor name
         * @returns {*}
         */
        me.get = function (name) {
            if (name) {
                return items[name];
            }
            return xs.clone(items);
        };

        /**
         * Starts stack processing chain with given arguments
         *
         * @param {Array} verifierArgs
         * @param {Array} handlerArgs
         * @param {Function} callback
         */
        me.process = function (verifierArgs, handlerArgs, callback) {
            process(xs.values(items), verifierArgs, handlerArgs, callback);
        };

        /**
         * Internal process function
         *
         * @param {Array} items items stack
         * @param {Array} verifierArgs arguments for items' verifiers
         * @param {Array} handlerArgs arguments for items' handlers
         * @param {Function} callback stack ready callback
         */
        var process = function (items, verifierArgs, handlerArgs, callback) {
            if (!items.length) {
                xs.isFunction(callback) && callback();
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
     * @ignore
     *
     * Class constructor method. Use is simple:
     *
     *     var Class = xs.Class(function (Class) {
     *         //here is Class descriptor returned
     *         return {
     *         };
     *     });
     *
     */
    xs.Class = (function () {

        //Stack of processors, processing class before it's considered to be created
        var preProcessors = new Stack();

        //Stack of processors, processing class after it's considered to be created
        var postProcessors = new Stack();

        //Stack of processors, called before object constructor is called
        var preConstructors = new Stack();

        //Stack of processors, called before object constructor is called
        var postConstructors = new Stack();

        /**
         * Returns new xClass sample
         *
         * @returns {Function} new xClass
         */
        var create = function () {
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
                xs.const(me, 'self', Class);

                //process preConstructors
                preConstructors.process([Class], [Class]);

                //apply constructor
                constructor && constructor.apply(me, arguments);

                //process postConstructors
                postConstructors.process([Class], [Class]);
            };
            return Class;
        };

        /**
         * Class creator. Creates class sample and starts processors applying
         * @param descFn
         * @param createdFn
         * @returns {Function}
         */
        var creator = function (descFn, createdFn) {
            if (!xs.isFunction(descFn)) {
                throw new Exception('Class descriptor must be function');
            }
            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create class
            var Class = create();

            //get Class descriptor
            var descriptor = descFn(Class);

            //process preProcessors stack before createdFn called
            preProcessors.process([descriptor], [
                Class,
                descriptor
            ], function () {
                createdFn();
                //process postProcessors stack before createdFn called
                postProcessors.process([descriptor], [
                    Class,
                    descriptor
                ]);
            });

            return Class;
        };

        xs.extend(creator, {
            preProcessors:    preProcessors,
            postProcessors:   postProcessors,
            preConstructors:  preConstructors,
            postConstructors: postConstructors
        });
        return creator;
    })();
})(window, 'xs');