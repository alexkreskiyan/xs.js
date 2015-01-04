/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * Private internal stack class
     *
     * Stack is used to store ordered list of processors
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.core.ProcessorsStack
     */
    var ProcessorsStack = function ProcessorsStack() {
        var me = this;

        //items hash
        var items = new xs.core.Collection;

        /**
         * Returns stack items copy
         *
         * @method get
         *
         * @return {xs.core.Collection} stack items clone
         */
        me.get = function () {

            return items.clone();
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
         * @param {String} name processor name
         * @param {Function} verifier processor verifier.
         * Returns boolean whether processor should be applied to Class. Accepts class descriptor as param
         * @param {Function} handler processor body
         * @param {String} [position] position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * By default, last is used
         * @param {String} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         */
        me.add = function (name, verifier, handler, position, relativeTo) {
            //position defaults to last
            if (!position) {
                position = 'last';
            }

            xs.assert.not(items.hasKey(name), 'add - processor "$name" already in stack', {
                $name: name
            }, ProcessorsStackError);

            items.add(name, {
                verifier: verifier,
                handler: handler
            });

            _apply(name, position, relativeTo);
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
         * @param {String} name processor name
         * @param {String} position position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * @param {String} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         */
        me.reorder = function (name, position, relativeTo) {
            _apply(name, position, relativeTo);
        };

        /**
         * Deletes processor from stack. If processor not found, error is thrown
         *
         * For example:
         *
         *     stack.remove('addY');
         *
         * @method remove
         *
         * @param {String} name processor name
         * - processor with given name is not found in stack
         */
        me.remove = function (name) {
            xs.assert.ok(items.hasKey(name), 'remove - processor "$name" not found in stack', {
                $name: name
            }, ProcessorsStackError);

            items.removeAt(name);
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
            _process(items.clone(), verifierArgs, handlerArgs, xs.isFunction(callback) ? callback : xs.emptyFn);
        };

        /**
         * Internal process function
         *
         * @ignore
         *
         * @method process
         *
         * @param {xs.core.Collection} items items stack
         * @param {Array} verifierArgs arguments for items' verifiers
         * @param {Array} handlerArgs arguments for items' handlers
         * @param {Function} callback stack ready callback
         */
        var _process = function (items, verifierArgs, handlerArgs, callback) {
            var me = this;
            if (!items.length) {
                callback();

                return;
            }
            var item = items.shift();

            //if item.verifier allows handler execution, process next
            if (item.verifier.apply(me, verifierArgs)) {

                var ready = function () {
                    _process(items, verifierArgs, handlerArgs, callback);
                };

                //if item.handler returns false, processing is async, stop processing, awaiting ready call
                if (item.handler.apply(me, handlerArgs.concat(ready)) === false) {

                    return;
                }
            }

            _process(items, verifierArgs, handlerArgs, callback);
        };


        /**
         * Applies item in stack relative to item with given name
         *
         * @ignore
         *
         * @param {String} name name of repositioned item
         * @param {String} position new item position
         * @param {*} relativeTo name of relativeTo positioned item
         */
        var _apply = function (name, position, relativeTo) {
            xs.assert.ok([
                'first',
                'last',
                'before',
                'after'
            ].indexOf(position) >= 0, 'apply - incorrect position "$position" given', {
                $position: position
            }, ProcessorsStackError);

            //get item from items
            var item = items.at(name);

            //remove item from items
            items.removeAt(name);

            //insert to specified position
            if (position === 'first' || position === 'last') {
                if (position === 'first') {
                    items.insert(0, name, item);
                } else {
                    items.add(name, item);
                }
            } else {
                var relativeKey = new xs.core.Collection(items.keys()).keyOf(relativeTo);

                xs.assert.defined(relativeKey, 'apply - relative key "$relativeTo" missing in stack', {
                    $name: name
                }, ProcessorsStackError);

                if (position === 'after') {
                    relativeKey++;
                }
                items.insert(relativeKey, name, item);
            }
        };
    };

    /**
     * @ignore
     *
     * Create ProcessorsStack references hash for all contracts implemented.
     * When contract is implemented it fetches and removes it's reference from hash. If hash is empty - it is removed
     */
    xs.ProcessorsStack = {
        Class: ProcessorsStack,
        Interface: ProcessorsStack
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ProcessorsStackError
     */
    function ProcessorsStackError(message) {
        this.message = 'xs.core.ProcessorsStack::' + message;
    }

    ProcessorsStackError.prototype = new Error();
})(window, 'xs');