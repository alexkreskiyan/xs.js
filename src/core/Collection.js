/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    //define xs.core
    xs.core || (xs.core = {});

    // Create quick reference variables for speed access to core prototypes.
    var _slice = Function.prototype.call.bind(Array.prototype.slice);
    var _concatenate = Function.prototype.apply.bind(Array.prototype.concat);

    /**
     * xs.core.Collection is core framework class, that is used for internal collections
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.core.Collection
     */
    /**
     * xs.core.Collection constructor
     * 
     * @constructor
     * 
     * @param {Array|Object} items collection source. Is required. If empty collection created - specify empty list
     * @param {Boolean} copy specifies behavior of created collection relative to given source - whether to copy given source or use it as is
     */
    var collection = xs.core.Collection = function (items, copy) {
        var me = this;

        //check
        if (xs.isArray(items)) {
            me.isArray = true;
        } else if (xs.isObject(items)) {
            me.isArray = false;
        } else {
            throw new CollectionError('constructor - collection source missing');
        }

        //assign items
        if (!copy) {
            me.items = items;

            return;
        }

        //copy array source
        if (me.isArray) {
            me.items = _slice(items);

            return;
        }

        //copy object source
        me.items = {};

        var i, key, keys = Object.keys(items), keysLength = keys.length;
        for (i = 0; i < keysLength; i++) {
            key = keys[i];
            me.items[key] = items[key];
        }
    };

    /**
     * Collection length
     * 
     * @property length
     * 
     * @readonly
     * 
     * @type Number
     */
    xs.Attribute.property.define(collection.prototype, 'length', {
        get: function () {
            if (this.isArray) {

                return this.items.length;
            }

            return Object.keys(this.items).length;
        },
        set: xs.emptyFn
    });

    /**
     * Returns all collection keys
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.keys()); //[0, 1, 2]
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 3
     *     });
     *     console.log(collection.keys()); //['a', 'b', 'c']
     *
     * @method keys
     *
     * @return {Array} collection keys
     */
    collection.prototype.keys = function () {
        var me = this;

        //handle array collection
        if (me.isArray) {
            var keys = [], length = me.items.length;

            for (var i = 0; i < length; i++) {
                keys.push(i);
            }

            return keys;
        }

        //handle object list
        return Object.keys(me.items);
    };

    /**
     * Returns all collection values
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.values()); //[1, 2, 3] - returns copy of source array
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 3
     *     });
     *     console.log(collection.values()); //[1, 2, 3]
     *
     * @method values
     *
     * @return {Array} collection values
     */
    collection.prototype.values = function () {
        var me = this;

        //handle array collection
        if (me.isArray) {

            return _slice(me.items);
        }

        //handle object list
        var values = [], index, keys = Object.keys(me.items), len = keys.length;

        for (index = 0; index < len; index++) {
            values.push(me.items[keys[index]]);
        }

        return values;
    };

    /**
     * Returns shallow copy of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     var clone = collection.clone();
     *
     *     //for Object
     *     var collection = new xs.core.Collection([
     *         a: 1,
     *         c: 2,
     *         b: 3
     *     });
     *     var clone = collection.clone();
     * 
     * @method clone
     *
     * @return {Array|Object} collection shallow copy
     */
    collection.prototype.clone = function () {
        return new this.constructor(this.items, true);
    };

    collection.prototype.has = function (item) {

    };

    collection.prototype.hasKey = function (key) {

    };

    /**
     * Returns key of first collection value, equal to given
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         1,
     *         value,
     *         2,
     *         value
     *     ]);
     *     console.log(collection.keyOf(0)); //undefined - no value
     *     console.log(collection.keyOf({})); //undefined - another object in array
     *     console.log(collection.keyOf(1)); //0
     *     console.log(collection.keyOf(value)); //3
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 1,
     *         f: value,
     *         d: 2,
     *         e: value
     *     });
     *     console.log(collection.keyOf(0)); //undefined - no value
     *     console.log(collection.keyOf({})); //undefined - another object in array
     *     console.log(collection.keyOf(1)); //'a'
     *     console.log(collection.keyOf(value)); //'f'
     *
     * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.keyOf = function (item) {
        var me = this, key;

        //handle array list
        if (me.isArray) {
            key = me.items.indexOf(value);

            return key < 0 ? undefined : key;
        }

        //handle object list
        var index, keys = Object.keys(me.items), keysLength = keys.length;

        for (index = 0; index < keysLength; index++) {
            key = keys[index];

            if (list[key] === value) {

                return key;
            }
        }

        return undefined;
    };

    /**
     * Returns key of last list value, equal to given
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var list = [
     *         1,
     *         2,
     *         1,
     *         value,
     *         2,
     *         value
     *     ];
     *     console.log(xs.lastKeyOf(list, 0)); //undefined - no value
     *     console.log(xs.lastKeyOf(list, {})); //undefined - another object in array
     *     console.log(xs.lastKeyOf(list, 1)); //2
     *     console.log(xs.lastKeyOf(list, value)); //5
     *
     *     //for Object
     *     var list = {
     *         a: 1,
     *         b: 2,
     *         c: 1,
     *         f: value,
     *         d: 2,
     *         e: value
     *     };
     *     console.log(xs.lastKeyOf(list, 0)); //undefined - no value
     *     console.log(xs.lastKeyOf(list, {})); //undefined - another object in array
     *     console.log(xs.lastKeyOf(list, 1)); //'c'
     *     console.log(xs.lastKeyOf(list, value)); //'e'
     *
     * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
     *
     * @method lastKeyOf
     *
     * @param {Array|Object} list list to search within
     * @param {*} value value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.lastKeyOf = function (item) {

    };

    collection.prototype.at = function (key) {

    };

    collection.prototype.first = function () {

    };

    collection.prototype.last = function () {

    };

    collection.prototype.add = function (item) {

    };

    collection.prototype.insert = function (item) {

    };

    collection.prototype.set = function (key, item) {

    };

    collection.prototype.delete = function (item) {

    };

    collection.prototype.deleteLast = function (item) {

    };

    collection.prototype.shift = function () {

    };

    collection.prototype.pop = function () {

    };

    collection.prototype.each = function () {

    };

    collection.prototype.eachReverse = function () {

    };

    collection.prototype.find = function (finder) {

    };

    collection.prototype.findLast = function (finder) {

    };

    collection.prototype.findAll = function (finder) {

    };

    collection.prototype.map = function (mapper) {

    };

    collection.prototype.reduce = function () {

    };

    collection.prototype.reduceRight = function () {

    };

    collection.prototype.every = function () {

    };

    collection.prototype.some = function () {

    };

    collection.prototype.none = function () {

    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class CollectionError
     */
    function CollectionError(message) {
        this.message = 'xs.core.Collection :: ' + message;
    }

    CollectionError.prototype = new Error();
})(window, 'xs');