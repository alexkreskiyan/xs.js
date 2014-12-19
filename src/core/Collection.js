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
     * @param {Array|Object} [items] collection source
     *
     * @throws {Error} Error is thrown:
     *
     * - if given source is nor array neither object
     */
    var collection = xs.core.Collection = function (items) {
        var me = this;

        //init items array
        me.items = [];

        if (!xs.isDefined(items)) {

            return;
        }

        var i, itemsLength;

        //handle array source
        if (xs.isArray(items)) {
            //get itemsLength
            itemsLength = items.length;

            for (i = 0; i < itemsLength; i++) {
                //add item
                me.items.push({
                    key: i,
                    value: items[i]
                });
            }

            //handle hash source
        } else if (xs.isObject(items)) {
            //get keys and itemsLength
            var keys = Object.keys(items), key;
            itemsLength = keys.length;

            for (i = 0; i < itemsLength; i++) {
                key = keys[i];
                //add item
                me.items.push({
                    key: key,
                    value: items[key]
                });
            }

            //otherwise - it's error
        } else {
            throw new CollectionError('constructor - source "' + items + '" is nor array neither object');
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
            return this.items.length;
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

        var keys = [], length = me.items.length;

        for (var i = 0; i < length; i++) {
            keys.push(me.items[i].key);
        }

        return keys;
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

        var values = [], length = me.items.length;

        for (var i = 0; i < length; i++) {
            values.push(me.items[i].value);
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
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: 3
     *     });
     *     var clone = collection.clone();
     *
     * @method clone
     *
     * @return {xs.core.Collection} collection shallow copy
     */
    collection.prototype.clone = function () {
        var me = this;
        var source = [], length = me.items.length, item;

        for (var i = 0; i < length; i++) {
            item = me.items[i];
            source.push({
                key: item.key,
                value: item.value
            });
        }

        var clone = new me.constructor();
        clone.items = source;
        return clone;
    };

    /**
     * Returns whether list has given key. Keys' comparison is strict, differing numbers and strings
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.hasKey(-1)); //false - out of bounds
     *     console.log(collection.hasKey(3)); //false - out of bounds
     *     console.log(collection.hasKey('1')); //false - string given
     *     console.log(collection.hasKey(1)); //true - key exists
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 3,
     *         1: 4
     *     });
     *     console.log(collection.hasKey('d')); //false
     *     console.log(collection.hasKey('a')); //true
     *     console.log(collection.hasKey(1)); //false - number given
     *     console.log(collection.hasKey('1')); //true - string given
     *
     * @method hasKey
     *
     * @param {String|Number} key key to lookup for
     *
     * @return {Boolean} whether list has key
     *
     * @throws {Error} Error is thrown:
     *
     * - if given key is nor a string neither a number
     */
    collection.prototype.hasKey = function (key) {
        var me = this;

        //check that key is number or string
        if (!xs.isNumber(key) && !xs.isString(key)) {
            throw new CollectionError('hasKey - key "' + key + '", given for array collection, is nor number neither string');
        }

        return me.keys().indexOf(key) >= 0;
    };

    /**
     * Returns whether collection has value
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         value
     *     ]);
     *     console.log(collection.has(0)); //false - no value
     *     console.log(collection.has({})); //false - another object in array
     *     console.log(collection.has(1)); //true - value exists
     *     console.log(collection.has(value)); //true - value exists
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: value
     *     });
     *     console.log(collection.has(0)); //false - no value
     *     console.log(collection.has({})); //false - another object in array
     *     console.log(collection.has(1)); //true - value exists
     *     console.log(collection.has(value)); //true - value exists
     *
     * @method has
     *
     * @param {*} item value to lookup for
     *
     * @return {Boolean} whether list has value
     */
    collection.prototype.has = function (item) {
        return this.values().indexOf(item) >= 0;
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
     * @param {*} item value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.keyOf = function (item) {
        var me = this, key;

        key = me.values().indexOf(item);

        return key >= 0 ? me.items[key].key : undefined;
    };

    /**
     * Returns key of last list value, equal to given
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
     *     console.log(collection.lastKeyOf(0)); //undefined - no value
     *     console.log(collection.lastKeyOf({})); //undefined - another object in array
     *     console.log(collection.lastKeyOf(1)); //2
     *     console.log(collection.lastKeyOf(value)); //5
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
     *     console.log(collection.lastKeyOf(0)); //undefined - no value
     *     console.log(collection.lastKeyOf({})); //undefined - another object in array
     *     console.log(collection.lastKeyOf(1)); //'c'
     *     console.log(collection.lastKeyOf(value)); //'e'
     *
     * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
     *
     * @method lastKeyOf
     *
     * @param {*} item value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.lastKeyOf = function (item) {
        var me = this, key;

        key = me.values().lastIndexOf(item);

        return key >= 0 ? me.items[key].key : undefined;
    };

    /**
     * Returns collection item for specified key
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
     *     console.log(collection.at(0)); //1
     *     console.log(collection.at(3)); //value
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
     *     console.log(collection.at('a')); //1 - no value
     *     console.log(collection.at('f')); //value
     *
     * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
     *
     * @method at
     *
     * @param {String|Number} key value to lookup for
     *
     * @return {*} item with specified key
     *
     * @throws {Error} Error is thrown:
     *
     * - if given key is not correct or doesn't exist
     */
    collection.prototype.at = function (key) {
        var me = this, index;

        //check that key is number or string
        if (!xs.isNumber(key) && !xs.isString(key)) {
            throw new CollectionError('at - key "' + key + '", given for array collection, is nor number neither string');
        }

        index = me.keys().indexOf(key);

        //check, that key exists
        if (index < 0) {
            throw new CollectionError('at - given key "' + key + '" doesn\'t exist');
        }

        return me.items[index].value;
    };

    /**
     * Returns first value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         {
     *             x: 1,
     *             y: 2
     *         },
     *         {
     *             x: 2,
     *             y: 2
     *         },
     *         {
     *             x: 2,
     *             y: 1
     *         },
     *         {
     *             x: 1,
     *             y: 1
     *         }
     *     ]);
     *     console.log(collection.first());
     *     //outputs:
     *     // {x: 1, y: 2}, reference to list[0] respectively
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: {
     *             x: 1,
     *             y: 2
     *         },
     *         c: {
     *             x: 2,
     *             y: 2
     *         },
     *         b: {
     *             x: 2,
     *             y: 1
     *         },
     *         d: {
     *             x: 1,
     *             y: 1
     *         }
     *     });
     *     console.log(collection.first());
     *     //outputs:
     *     // {x: 1, y: 2}, reference to list.a respectively
     *
     * @method first
     *
     * @return {*} first value, undefined if collection is empty
     *
     * @throws {Error} Error is thrown:
     *
     * - if collection is empty
     */
    collection.prototype.first = function () {
        var me = this;

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('first - collection is empty');
        }

        return me.items[0].value;
    };

    /**
     * Returns last value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         {
     *             x: 1,
     *             y: 2
     *         },
     *         {
     *             x: 2,
     *             y: 2
     *         },
     *         {
     *             x: 2,
     *             y: 1
     *         },
     *         {
     *             x: 1,
     *             y: 1
     *         }
     *     ]);
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1, y: 1}, reference to list[0] respectively
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: {
     *             x: 1,
     *             y: 2
     *         },
     *         c: {
     *             x: 2,
     *             y: 2
     *         },
     *         b: {
     *             x: 2,
     *             y: 1
     *         },
     *         d: {
     *             x: 1,
     *             y: 1
     *         }
     *     });
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1, y: 1}, reference to list.a respectively
     *
     * @method last
     *
     * @return {*} last value, undefined if list is empty
     *
     * @throws {Error} Error is thrown:
     *
     * - if collection is empty
     */
    collection.prototype.last = function () {
        var me = this;

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('last - collection is empty');
        }

        return me.items[me.items.length - 1].value;
    };

    /**
     * Adds item to collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([]);
     *     collection.add({x: 1});
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1}
     *
     *     //for Object
     *     var collection = new xs.core.Collection({});
     *     collection.add('a', {x: 1});
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1}
     *
     * @method add
     *
     * @param {String} key for array collection - added item. for hash collection - key of added item
     * @param {*} [item] item, added to hash collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if hash collection already has an element with given key
     */
    collection.prototype.add = function (key, item) {
        var me = this;

        //handle array collection
        if (me.isArray) {
            me.items.push(key);

            return me;
        }

        //handle hash collection
        //check that key does not exist
        if (me.hasKey(key)) {
            throw new CollectionError('add - hash collection already has key "' + key + '"');
        }

        me.items[key] = item;

        return me;
    };

    /**
     * Inserts item into collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([]);
     *     collection.insert(0, {x: 2});
     *     collection.insert(0, {x: 1});
     *     console.log(collection.items);
     *     //outputs:
     *     //[
     *     //    {x: 1}
     *     //    {x: 2}
     *     //]
     *
     *     //for Object
     *     var collection = new xs.core.Collection({});
     *     collection.insert(0, 'b', {x: 2});
     *     collection.insert(0, 'a', {x: 1});
     *     console.log(collection.items);
     *     //outputs:
     *     //{
     *     //    a: {x: 1}
     *     //    b: {x: 2}
     *     //}
     *
     * @method insert
     *
     * @param {Number} index index, that will be assigned to inserted item
     * @param {String} key for array collection - inserted item. for hash collection - key of inserted item
     * @param {*} [item] item, inserted to hash collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if given index is not a number
     * - if given index is out of bounds: -collection.length < index <= collection.length
     * - if hash collection already has an element with given key
     */
    collection.prototype.insert = function (index, key, item) {
        var me = this;

        //check, that index is number
        if (!xs.isNumber(index)) {
            throw new CollectionError('insert - given index "' + index + '" is not number');
        }


        //check that index is in bounds
        if (me.isArray) {
            //get bounds
            var min = -me.items.length + 1, max = me.items.length;
        } else {
            //get keys
            var keys = me.keys(), keysLength;
            //get bounds
            var min = -keysLength + 1, max = keysLength;
        }

        if (index < min || index > max) {
            throw new CollectionError('insert - index "' + index + '" is out of bounds [' + min + ',' + max + ']');
        }


        //handle array collection
        if (me.isArray) {
            me.items.splice(index, 0, key);

            return me;
        }


        //handle hash collection
        //check that key does not exist
        if (me.hasKey(key)) {
            throw new CollectionError('add - hash collection already has key "' + key + '"');
        }

        //create copy
        var i, copy = {};
        for (i = 0; i < keysLength; i++) {

        }
        //remove all existing items
        var reference = me.items;

        //insert key
        keys.splice(index, 0, key);


        me.items[key] = item;

        return me;
    };

    collection.prototype.set = function (key, item) {

    };

    collection.prototype.delete = function (item) {

    };

    collection.prototype.deleteLast = function (item) {

    };

    collection.prototype.deleteAll = function (item) {

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