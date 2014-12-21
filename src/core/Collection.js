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
     * Collection flag, meaning, that operation is reverse
     *
     * @constant LAST
     *
     * @type {Number}
     */
    collection.LAST = 0x1;

    /**
     * Collection flag, meaning, that operation is made for all matches.
     *
     * @constant ALL
     *
     * @type {Number}
     */
    collection.ALL = 0x2;

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

        //if key is number - it's index
        if (xs.isNumber(key)) {
            //check, that key exists
            return 0 <= key && key < me.items.length;
            //if it is string - it's key
        } else if (xs.isString(key)) {
            return me.keys().indexOf(key) >= 0;
            //else - it's error
        } else {
            throw new CollectionError('hasKey - key "' + key + '", given for collection, is nor number neither string');
        }
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
     * Returns key of collection value, equal to given. Supports LAST flag, that will perform lookup from the end of the collection
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
     *     console.log(collection.keyOf(value, xs.core.Collection.LAST)); //5
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
     *     console.log(collection.keyOf(value, xs.core.Collection.LAST)); //'e'
     *
     * ATTENTION: Try to avoid using integer indexes in objects, because their order in V8 is not guaranteed!
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     * @param {Number} [flags] optional lookup flags
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     *
     * @throws {Error} Error is thrown:
     *
     * - if given flags list is not number
     */
    collection.prototype.keyOf = function (value, flags) {
        var me = this, key, values = me.values();

        if (arguments.length == 1) {
            key = values.indexOf(value);
        } else {
            if (!xs.isNumber(flags)) {
                throw new CollectionError('keyOf - given flags "' + flags + '" list is not number');
            }

            if (flags & xs.core.Collection.LAST) {
                key = values.lastIndexOf(value);
            } else {
                key = values.indexOf(value);
            }
        }

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

        //if key is number - it's index
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length;
            //if max is 0, then min is 0
            var min = max > 0 ? -max + 1 : 0;

            if (key < min || key > max) {
                throw new CollectionError('at - index "' + key + '" is out of bounds [' + min + ',' + max + ']');
            }

            //convert negative index
            key < 0 && (key += max);

            return me.items[key].value;
            //if it is string - it's key
        } else if (xs.isString(key)) {
            index = me.keys().indexOf(key);

            //check, that key exists
            if (index < 0) {
                throw new CollectionError('at - given key "' + key + '" doesn\'t exist');
            }

            return me.items[index].value;
            //else - it's error
        } else {
            throw new CollectionError('at - key "' + key + '", given for collection, is nor number neither string');
        }
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
     * @param {String} key for array collection - added value. for collection - key of added value
     * @param {*} [value] value, added to collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if collection already has an element with given key
     */
    collection.prototype.add = function (key, value) {
        var me = this;
        //check arguments enough
        if (!arguments.length) {
            throw new CollectionError('add - empty arguments');
        }

        if (arguments.length > 1) {
            //key must be string
            if (!xs.isString(key)) {
                throw new CollectionError('add - key "' + key + '", given for collection, is not a string');
            }

            //check key is not taken yet
            if (me.keys().indexOf(key) >= 0) {
                throw new CollectionError('add - collection already has key "' + key + '"');
            }
            //handle autoincrement index
        } else {
            value = key;
            key = me.items.length;
        }

        //add item
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
     * @param {String} key for array collection - inserted value. for collection - key of inserted value
     * @param {*} [value] value, inserted to collection
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if not enough arguments - index and key are required
     * - if given index is not a number
     * - if given index is out of bounds: -collection.length < index <= collection.length
     * - if given key is nor a number, neither a string
     * - if collection already has an element with given key
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
        var max = me.items.length;
        //if max is 0, then min is 0
        var min = max > 0 ? -max + 1 : 0;

        if (index < min || index > max) {
            throw new CollectionError('insert - index "' + index + '" is out of bounds [' + min + ',' + max + ']');
        }


        //check key if value given
        if (arguments.length > 2) {
            //key must be string
            if (!xs.isString(key)) {
                throw new CollectionError('insert - key "' + key + '", given for collection, is not a string');
            }

            //check key is not taken yet
            if (me.keys().indexOf(key) >= 0) {
                throw new CollectionError('insert - collection already has key "' + key + '"');
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

        //updated indexes
        _updateIndexes.call(me, index + 1);

        return me;
    };

    /**
     * Sets value for item by specified key
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([1,2]);
     *     collection.set(1, {x: 2});
     *     collection.set(0, {x: 1});
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
     *     var collection = new xs.core.Collection({a: 2, b: 1});
     *     collection.set('b', {x: 2});
     *     collection.set('a', {x: 1});
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
     * @method set
     *
     * @param {String|Number} key key of changed value
     * @param {*} value value new value for item with given key
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if not enough arguments - key and value are required
     * - if given key is nor a number, neither a string
     * - if collection does not have item with given key
     */
    collection.prototype.set = function (key, value) {
        var me = this;

        //check arguments enough
        if (arguments.length <= 1) {
            throw new CollectionError('set - no enough arguments');
        }

        //if key is number - it's index
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length;
            //if max is 0, then min is 0
            var min = max > 0 ? -max + 1 : 0;

            if (key < min || key > max) {
                throw new CollectionError('set - index "' + key + '" is out of bounds [' + min + ',' + max + ']');
            }

            //convert negative index
            key < 0 && (key += max);

            me.items[key].value = value;
            //if it is string - it's key
        } else if (xs.isString(key)) {
            var index = me.keys().indexOf(key);

            //check, that key exists
            if (index < 0) {
                throw new CollectionError('set - given key "' + key + '" doesn\'t exist');
            }

            me.items[index].value = value;
            //else - it's error
        } else {
            throw new CollectionError('at - key "' + key + '", given for collection, is nor number neither string');
        }

        return me;
    };

    /**
     * Deletes value with given key
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         value,
     *     ]);
     *     collection.deleteAt(0);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    2,
     *     //    value
     *     //]
     *
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: value,
     *     });
     *     collection.deleteAt(0);
     *     console.log(collection.values());
     *     //outputs:
     *     //{
     *     //    c: 2,
     *     //    b: value
     *     //}
     *
     * @method deleteAt
     *
     * @param {Number|String} key key of deleted value
     *
     * @chainable
     */
    collection.prototype.deleteAt = function (key) {
        var me = this;

        //if index given
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length;
            //if max is 0, then min is 0
            var min = max > 0 ? -max + 1 : 0;

            if (key < min || key > max) {
                throw new CollectionError('set - index "' + key + '" is out of bounds [' + min + ',' + max + ']');
            }

            //delete item by key
            me.items.splice(key, 1);

            //if key given
        } else if (xs.isString(key)) {
            //get index
            var index = me.keys().indexOf(key);

            //check, that key exists
            if (index < 0) {
                throw new CollectionError('deleteAt - given key doesn\'t exist in collection');
            }


            //delete item by key
            me.items.splice(index, 1);

            //else - it's error
        } else {
            throw new CollectionError('hasKey - key "' + key + '", given for collection, is nor number neither string');
        }

        return me;
    };

    /**
     * Deletes first value from list, that matches given value
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         value,
     *         2,
     *         1,
     *         value
     *     ]);
     *     collection.delete(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    0,
     *     //    1,
     *     //    2,
     *     //    3,
     *     //    4
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1,
     *     //    value
     *     //]
     *
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: value,
     *         f: 2,
     *         e: 1,
     *         d: value
     *     });
     *     collection.delete(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    'a',
     *     //    'c',
     *     //    'f',
     *     //    'e',
     *     //    'd'
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1,
     *     //    value
     *     //]
     *
     * @method delete
     *
     * @param {*} value deleted value
     *
     * @chainable
     */
    collection.prototype.delete = function (value) {
        var me = this;

        var index = me.values().indexOf(value);

        //check, that item exists
        if (index < 0) {
            throw new CollectionError('delete - given value doesn\'t exist in collection');
        }

        //delete item from items
        me.items.splice(index, 1);

        //update indexes
        _updateIndexes.call(me, index);

        return me;
    };

    /**
     * Deletes last value from list, that matches given value
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         value,
     *         2,
     *         1,
     *         value
     *     ]);
     *     collection.deleteLast(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    0,
     *     //    1,
     *     //    2,
     *     //    3,
     *     //    4
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: value,
     *         f: 2,
     *         e: 1,
     *         d: value
     *     });
     *     collection.deleteLast(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    'a',
     *     //    'c',
     *     //    'b',
     *     //    'f',
     *     //    'e'
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value,
     *     //    2,
     *     //    1
     *     //]
     *
     * @method deleteLast
     *
     * @param {*} value deleted value
     *
     * @chainable
     */
    collection.prototype.deleteLast = function (value) {
        var me = this;

        var index = me.values().lastIndexOf(value);

        //check, that item exists
        if (index < 0) {
            throw new CollectionError('delete - given value doesn\'t exist in collection');
        }

        //delete item from items
        me.items.splice(index, 1);

        //update indexes
        _updateIndexes.call(me, index);

        return me;
    };

    /**
     * Deletes all values from list, passed as array/plain arguments
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         value,
     *         2,
     *         1,
     *         value
     *     ]);
     *     collection.deleteAll(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    0,
     *     //    1,
     *     //    2,
     *     //    3
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: value,
     *         f: 2,
     *         e: 1,
     *         d: value
     *     };
     *     collection.deleteAll(value);
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    'a',
     *     //    'c',
     *     //    'f',
     *     //    'e'
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     * @method deleteAll
     *
     * @param {*} [value] optional deleted value. If specified all value entries will be removed from collection. If not - collection is truncated
     *
     * @chainable
     */
    collection.prototype.deleteAll = function (value) {
        var me = this;

        var index = me.values().lastIndexOf(value);

        //check, that item exists
        if (index < 0) {
            throw new CollectionError('delete - given value doesn\'t exist in collection');
        }

        //delete item from items
        me.items.splice(index, 1);

        //update indexes
        _updateIndexes.call(me, index);

        return me;
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
     * Updates indexes starting from item with given index
     * @ignore
     *
     * @private
     *
     * @method updateIndexes
     *
     * @param {Number} index index, update starts from
     */
    var _updateIndexes = function (index) {
        var me = this, length = me.items.length;

        //updated indexes for all items, starting from given index
        for (var i = index; i < length; i++) {
            var item = me.items[i];

            //update if is number
            xs.isNumber(item.key) && (item.key = i);
        }
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