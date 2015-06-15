'use strict';

var log = new xs.log.Logger('xs.core.ProcessorsStack');

var assert = new xs.core.Asserter(log, XsCoreProcessorsStackError);

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
var ProcessorsStack = function () {
    var me = this;

    //items hash
    var items = new xs.core.Collection();

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
            position = xs.core.Collection.Last;
        }

        assert.not(items.hasKey(name), 'add - processor `$name` already in stack', {
            $name: name
        });

        items.add(name, {
            verifier: verifier,
            handler: handler
        });

        items.reorder(name, position, relativeTo);
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
        items.reorder(name, position, relativeTo);
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
        assert.ok(items.hasKey(name), 'remove - processor `$name` not found in stack', {
            $name: name
        });

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
        process(0, verifierArgs, handlerArgs, xs.isFunction(callback) ? callback : xs.noop);
    };

    /**
     * Internal process function
     *
     * @ignore
     *
     * @method process
     *
     * @param {Number} index processor index
     * @param {Array} verifierArgs arguments for items' verifiers
     * @param {Array} handlerArgs arguments for items' handlers
     * @param {Function} callback stack ready callback
     */
    var process = function (index, verifierArgs, handlerArgs, callback) {
        var me = this;

        //finish if index is out of bounds
        if (index >= items.size) {
            callback();

            return;
        }

        var item = items.at(index, xs.core.Collection.Index);

        //if item.verifier allows handler execution, process next
        if (item.verifier.apply(me, verifierArgs)) {

            var ready = function () {
                process(index + 1, verifierArgs, handlerArgs, callback);
            };

            //if item.handler returns false, processing is async, stop processing, awaiting ready call
            if (item.handler.apply(me, handlerArgs.concat(ready)) === false) {

                return;
            }
        }

        process(index + 1, verifierArgs, handlerArgs, callback);
    };
};

//save ProcessorsStack reference
module.ProcessorsStack = ProcessorsStack;

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreProcessorsStackError
 */
function XsCoreProcessorsStackError(message) {
    this.message = 'xs.core.ProcessorsStack::' + message;
}

XsCoreProcessorsStackError.prototype = new Error();