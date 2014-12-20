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
     * @param {Array|Object} [values] collection source
     *
     * @throws {Error} Error is thrown:
     *
     * - if given source is nor array neither object
     */
    var collection = xs.core.Collection = function (values) {
        var me = this;

        //init items array
        me.items = [];

        if (!arguments.length) {

            return;
        }

        var i, valuesLength;

        //handle array source
        if (xs.isArray(values)) {
            //get valuesLength
            valuesLength = values.length;

            for (i = 0; i < valuesLength; i++) {
                //add item
                me.items.push({
                    key: i,
                    value: values[i]
                });
            }

            //handle hash source
        } else if (xs.isObject(values)) {
            //get keys and valuesLength
            var keys = Object.keys(values), key;
            valuesLength = keys.length;

            for (i = 0; i < valuesLength; i++) {
                key = keys[i];
                //add item
                me.items.push({
                    key: key,
                    value: values[key]
                });
            }

            //otherwise - it's error
        } else {
            throw new CollectionError('constructor - source "' + values + '" is nor array neither object');
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
     * @param {*} value value to lookup for
     *
     * @return {Boolean} whether list has value
     */
    collection.prototype.has = function (value) {
        return this.values().indexOf(value) >= 0;
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
     * ATTENTION: Try to avoid using integer indexes in objects, because their order in V8 is not guaranteed!
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.keyOf = function (value) {
        var me = this, key;

        key = me.values().indexOf(value);

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
     * ATTENTION: Try to avoid using integer indexes in objects, because their order in V8 is not guaranteed!
     *
     * @method lastKeyOf
     *
     * @param {*} value value to lookup for
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    collection.prototype.lastKeyOf = function (value) {
        var me = this, key;

        key = me.values().lastIndexOf(value);

        return key >= 0 ? me.items[key].key : undefined;
    };

    /**
     * Returns collection value for specified key
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
     * ATTENTION: Try to avoid using integer indexes in objects, because their order in V8 is not guaranteed!
     *
     * @method at
     *
     * @param {String|Number} key value to lookup for
     *
     * @return {*} value with specified key
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
     * Adds value to collection
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
     * @param {String} key for array collection - added value. for hash collection - key of added value
     * @param {*} [value] value, added to hash collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if hash collection already has an element with given key
     */
    collection.prototype.add = function (key, value) {
        var me = this;
        //check arguments enough
        if (!arguments.length) {
            throw new CollectionError('add - empty arguments');
        }

        if (arguments.length > 1) {
            if (me.hasKey(key)) {
                throw new CollectionError('add - hash collection already has key "' + key + '"');
            }
            //handle autoincrement index
        } else {
            value = key;
            key = me.items.length;
        }

        //handle hash collection
        //check that key does not exist

        me.items.push({
            key: key,
            value: value
        });

        return me;
    };

    /**
     * Inserts value into collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([]);
     *     collection.insert(0, {x: 2});
     *     collection.insert(0, {x: 1});
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    0
     *     //    1
     *     //]
     *     console.log(collection.values());
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
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    'a'
     *     //    'b'
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    {x: 1}
     *     //    {x: 2}
     *     //]
     *
     * @method insert
     *
     * @param {Number} index index, that will be assigned to inserted value
     * @param {String} key for array collection - inserted value. for hash collection - key of inserted value
     * @param {*} [value] value, inserted to hash collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if given index is not a number
     * - if given index is out of bounds: -collection.length < index <= collection.length
     * - if hash collection already has an element with given key
     */
    collection.prototype.insert = function (index, key, value) {
        var me = this;

        //check arguments enough
        if (arguments.length <= 1) {
            throw new CollectionError('insert - no enough arguments');
        }

        //check, that index is number
        if (!xs.isNumber(index)) {
            throw new CollectionError('insert - given index "' + index + '" is not number');
        }


        //check that index is in bounds
        var min, max, keys = me.keys(), keysLength = keys.length;
        //get bounds
        max = me.items.length;
        //if max is 0, then min is 0
        min = max > 0 ? -max + 1 : 0;

        if (index < min || index > max) {
            throw new CollectionError('insert - index "' + index + '" is out of bounds [' + min + ',' + max + ']');
        }


        //check key if value given
        if (arguments.length > 2) {
            //check that key is number or string
            if (!xs.isNumber(key) && !xs.isString(key)) {
                throw new CollectionError('hasKey - key "' + key + '", given for array collection, is nor number neither string');
            }

            //check that key does not exist
            if (keys.indexOf(key) >= 0) {
                throw new CollectionError('add - hash collection already has key "' + key + '"');
            }
            //handle autoincrement index
        } else {
            value = key;
            key = index;
        }


        //insert
        //insert new item
        me.items.splice(index, 0, {
            key: key,
            value: value
        });

        //update indexes
        //<= - because 1 item is already inserted
        for (var i = index + 1; i <= keysLength; i++) {
            var item = me.items[i];

            //update if is number
            xs.isNumber(item.key) && (item.key = i);
        }

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