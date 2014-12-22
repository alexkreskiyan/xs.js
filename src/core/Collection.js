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
     * @static
     *
     * @property REVERSE
     *
     * @readonly
     *
     * @type {Number}
     */
    collection.REVERSE = 0x1;

    /**
     * Collection flag, meaning, that operation is made for all matches.
     *
     * @static
     *
     * @property ALL
     *
     * @readonly
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
     * Returns whether collection has given key. Keys' comparison is strict, differing numbers and strings
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
     * @return {Boolean} whether collection has key
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
     * @return {Boolean} whether collection has value
     */
    collection.prototype.has = function (value) {
        return this.values().indexOf(value) >= 0;
    };

    /**
     * Returns key of collection value, equal to given. Supports REVERSE flag, that will perform lookup from the end of the collection
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
     *     console.log(collection.keyOf(value, xs.core.Collection.REVERSE)); //5
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
     *     console.log(collection.keyOf(value, xs.core.Collection.REVERSE)); //'e'
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     * @param {Number} [flags] optional lookup flags:
     * - REVERSE - to lookup for value from the end of the collection
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

            if (flags & xs.core.Collection.REVERSE) {
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
     *     // {x: 1, y: 2}, reference to collection[0] respectively
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
     *     // {x: 1, y: 2}, reference to collection.a respectively
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
     *     // {x: 1, y: 1}, reference to collection[0] respectively
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
     *     // {x: 1, y: 1}, reference to collection.a respectively
     *
     * @method last
     *
     * @return {*} last value, undefined if collection is empty
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
     * Deletes value from collection, truncates collection
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         value,
     *         2,
     *         value,
     *         2,
     *         value,
     *         1,
     *         value
     *     ]);
     *     collection.delete(value);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1,
     *     //    value
     *     //]
     *     collection.delete(value, xs.core.Collection.REVERSE);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1
     *     //]
     *     collection.delete(value, xs.core.Collection.ALL);
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
     *         b: value,
     *         c: 2,
     *         d: value,
     *         e: 2,
     *         f: value,
     *         g: 1,
     *         h: value
     *     });
     *     collection.delete(value);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1,
     *     //    value
     *     //]
     *     collection.delete(value, xs.core.Collection.REVERSE);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1
     *     //]
     *     collection.delete(value, xs.core.Collection.ALL);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     * @method delete
     *
     * @param {*} value deleted value
     * @param {Number} [flags] optional delete flags:
     * - REVERSE - to lookup for value from the end of the collection
     * - ALL - to delete all matches
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if given flags list is not number
     * - if nothing to delete in collection
     */
    collection.prototype.delete = function (value, flags) {
        var me = this, values = me.values();

        //delete all if no value given
        if (!arguments.length) {
            me.items.splice(0, me.items.length);

            return me;
        }

        var index, all = false;
        //if no flags - delete first occurrence of value
        if (arguments.length == 1) {
            index = values.indexOf(value);

            //handle flags
        } else {
            //check, that flags list is a number
            if (!xs.isNumber(flags)) {
                throw new CollectionError('keyOf - given flags "' + flags + '" list is not number');
            }

            //if ALL flag given - no index is needed
            if (flags & xs.core.Collection.ALL) {
                index = values.indexOf(value);
                all = true;
                //if REVERSE flag given - last value occurrence is looked up for
            } else if (flags & xs.core.Collection.REVERSE) {
                index = values.lastIndexOf(value);
                //else - first value occurrence is looked up for
            } else {
                index = values.indexOf(value);
            }
        }

        //check, that item exists
        if (index < 0) {
            throw new CollectionError('delete - given value doesn\'t exist in collection');
        }

        //if all flag is given
        if (all) {
            var i = 0, valuesLength = values.length;

            //delete all occurrences of value in collection
            while (i < valuesLength) {

                //if item.value is not equal to value - continue with next item
                if (values[i] !== value) {
                    i++;
                    continue;
                }

                //delete item from values
                values.splice(i, 1);

                //delete item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                valuesLength--;
            }
        } else {

            //delete item from items
            me.items.splice(index, 1);
        }

        //update indexes
        _updateIndexes.call(me, index);

        return me;
    };

    /**
     * Deletes value from collection, if it matches given function. Function's arguments are: value, key
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.core.Collection([
     *         1,
     *         value,
     *         2,
     *         value,
     *         2,
     *         value,
     *         1,
     *         value
     *     ]);
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     });
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1,
     *     //    value
     *     //]
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     }, xs.core.Collection.REVERSE);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1
     *     //]
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     }, xs.core.Collection.ALL);
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
     *         b: value,
     *         c: 2,
     *         d: value,
     *         e: 2,
     *         f: value,
     *         g: 1,
     *         h: value
     *     });
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     });
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1,
     *     //    value
     *     //]
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     }, xs.core.Collection.REVERSE);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    value
     *     //    2,
     *     //    value
     *     //    1
     *     //]
     *     collection.deleteBy(function(val){
     *         return val === value;
     *     }, xs.core.Collection.ALL);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     * @method deleteBy
     *
     * @param {Function} finder function, that returns whether to delete value or not
     * @param {Number} [flags] optional delete flags:
     * - REVERSE - to lookup for value from the end of the collection
     * - ALL - to delete all matches
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if finder is not a function
     * - if given flags list is not number
     */
    collection.prototype.deleteBy = function (finder, flags) {
        var me = this;

        //check that finder is function
        if (!xs.isFunction(finder)) {
            throw new CollectionError('deleteBy - given finder "' + finder + '" is not a function');
        }

        var all = false, reverse = false;
        //handle flags
        if (arguments.length > 1) {
            //check, that flags list is a number
            if (!xs.isNumber(flags)) {
                throw new CollectionError('keyOf - given flags "' + flags + '" list is not number');
            }

            //if ALL flag given - order does not matter
            if (flags & xs.core.Collection.ALL) {
                all = true;
                //if REVERSE flag given - last value occurrence is looked up for
            } else if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //init variables
        var values = me.values(), i, item, length = me.items.length;

        if (all) {
            i = 0;
            //delete all matched occurrences from collection
            while (i < length) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                //delete item from values
                values.splice(i, 1);

                //delete item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                length--;
            }
        } else if (reverse) {
            i = length - 1;
            //delete all matched occurrences from collection
            while (i >= 0) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //decrement index
                    i--;

                    continue;
                }

                //delete item from values
                values.splice(i, 1);

                //delete item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                length--;

                //decrement index
                i--;

                break;
            }
        } else {
            i = 0;
            //delete first matched occurrence from collection
            while (i < length) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                //delete item from values
                values.splice(i, 1);

                //delete item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                length--;

                break;
            }
        }

        //update indexes
        _updateIndexes.call(me, 0);

        return me;
    };

    /**
     * Shifts and returns first value from collection
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
     *     console.log(collection.shift());
     *     //outputs:
     *     // {x: 1, y: 2, reference to collection[0] respectively
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    {
     *     //        x: 2,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 1
     *     //    },
     *     //    {
     *     //        x: 1,
     *     //        y: 1
     *     //    }
     *     //];
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
     *     console.log(collection.shift());
     *     //outputs:
     *     // {x: 1, y: 2}, reference to collection.a respectively
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    {
     *     //        x: 2,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 1
     *     //    },
     *     //    {
     *     //        x: 1,
     *     //        y: 1
     *     //    }
     *     //];
     *
     * @method shift
     *
     * @return {*} First value of collection
     *
     * @throws {Error} Error is thrown:
     *
     * - if collection is empty
     */
    collection.prototype.shift = function () {
        var me = this;

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('shift - collection is empty');
        }

        //get returned value
        var value = me.items[0].value;

        //delete first item from collection
        me.items.splice(0, 1);

        _updateIndexes.call(me, 0);

        //return value
        return value;
    };

    /**
     * Pops and returns last value from collection
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
     *     console.log(collection.pop());
     *     //outputs:
     *     // {x: 1, y: 1}, reference to collection[3] respectively
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    {
     *     //        x: 1,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 1
     *     //    }
     *     //];
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
     *     console.log(collection.pop());
     *     //outputs:
     *     // {x: 1, y: 1}, reference to collection.a respectively
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    {
     *     //        x: 1,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 2
     *     //    },
     *     //    {
     *     //        x: 2,
     *     //        y: 1
     *     //    }
     *     //];
     *
     * @method pop
     *
     * @return {*} First value of collection
     *
     * @throws {Error} Error is thrown:
     *
     * - if collection is empty
     */
    collection.prototype.pop = function () {
        var me = this;

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('pop - collection is empty');
        }

        var index = me.items.length - 1;

        //get returned value
        var value = me.items[index].value;

        //delete last item from collection
        me.items.splice(-1, 1);

        //return value
        return value;
    };

    /**
     * Iterates over collection in direct or reverse order
     *
     * For example:
     *
     *     var scope = {
     *         x: 1
     *     };
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         {}
     *     ]);
     *     collection.each(function(value, key, collection) {
     *         console.log(this, value, key, collection);
     *     }, scope);
     *     //outputs:
     *     // {x:1}, 1, 0, collection
     *     // {x:1}, 2, 1, collection
     *     // {x:1}, {}, 2, collection
     *     collection.each(function(value, key, collection) {
     *         console.log(this, value, key, collection);
     *     }, scope, xs.core.Collection.REVERSE);
     *     //outputs:
     *     // {x:1}, {}, 2, collection
     *     // {x:1}, 2, 1, collection
     *     // {x:1}, 1, 0, collection
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: {}
     *     });
     *     collection.each(function(value, key, collection) {
     *         console.log(this, value, key, collection);
     *     }, scope);
     *     //outputs:
     *     // {x:1}, 1, a, collection
     *     // {x:1}, 2, c, collection
     *     // {x:1}, {}, b, collection
     *     collection.each(function(value, key, collection) {
     *         console.log(this, value, key, collection);
     *     }, scope, xs.core.Collection.REVERSE);
     *     //outputs:
     *     // {x:1}, {}, b, collection
     *     // {x:1}, 2, c, collection
     *     // {x:1}, 1, a, collection
     *
     * @method each
     *
     * @param {Function} iterator list iterator
     * @param {Object} [scope] optional scope
     * @param {Number} [flags] additional iterating flags:
     * - REVERSE - to iterate in reverse order
     *
     * @chainable
     *
     * @throws {Error} Error is thrown:
     *
     * - if iterator is not a function
     * - if given flags list is not a number
     */
    collection.prototype.each = function (iterator, scope, flags) {
        var me = this;

        //check that iterator is function
        if (!xs.isFunction(iterator)) {
            throw new CollectionError('each - given iterator "' + iterator + '" is not a function');
        }

        //default scope to me
        arguments.length >= 2 || (scope = me);

        //handle flags
        var reverse = false;
        if (arguments.length >= 3) {
            //check, that flags list is a number
            if (!xs.isNumber(flags)) {
                throw new CollectionError('each - given flags "' + flags + '" list is not number');
            }

            //if REVERSE flag given - last value occurrence is looked up for
            if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //iterate
        var i, item, length = me.items.length;
        if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                item = me.items[i];
                iterator.call(scope, item.value, item.key, me);
            }
        } else {
            for (i = 0; i < length; i++) {
                item = me.items[i];
                iterator.call(scope, item.value, item.key, me);
            }
        }

        return me;
    };

    /**
     * Returns collection item|items, that passed given test function
     *
     * For example:
     *
     *     var scope = {
     *         sum: function(x, y) {
     *             return x + y;
     *         },
     *         first: function(x) {
     *             return x[0];
     *         }
     *     };
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         {x: 2},
     *         {x: 2},
     *         {x: 0}
     *     ]);
     *     console.log(collection.find(function(value, key) {
     *         return this.sum(key, value.x) === 2;
     *     }, scope));
     *     //outputs:
     *     // {x: 2}, reference to collection[0], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.sum(key, value.x) === 2;
     *     }, scope, xs.core.Collection.REVERSE));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.sum(key, value.x) >= 2;
     *     }, scope, xs.core.Collection.ALL));
     *     //outputs:
     *     //[
     *     //    {x: 2},
     *     //    {x: 2},
     *     //    {x: 0}
     *     //]
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         aa: {x: 1},
     *         c: {x: 2},
     *         ab: {x: 3}
     *     });
     *     console.log(collection.find(function(value, key) {
     *         return this.first(key) === 'a';
     *     }, scope));
     *     //outputs:
     *     // {x: 2}, reference to collection[0], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.first(key) === 'a';
     *     }, scope, xs.core.Collection.REVERSE));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.first(key) === 'a';
     *     }, scope, xs.core.Collection.ALL));
     *     //outputs:
     *     //{
     *     //    aa: {x: 2},
     *     //    ab: {x: 0}
     *     //}
     *
     * @method find
     *
     * @param {Function} finder function, returning true if value matches given conditions
     * @param {Object} [scope] optional scope
     * @param {Number} [flags] additional iterating flags:
     *
     * @return {*} found value, undefined if nothing found
     *
     * @throws {Error} Error is thrown:
     *
     * - if finder is not a function
     */
    collection.prototype.find = function (finder, scope, flags) {
        var me = this;

        //check that finder is function
        if (!xs.isFunction(finder)) {
            throw new CollectionError('find - given finder "' + finder + '" is not a function');
        }

        //default scope to me
        arguments.length >= 2 || (scope = me);

        //handle flags
        var all = false, reverse = false;
        if (arguments.length >= 3) {
            //check, that flags list is a number
            if (!xs.isNumber(flags)) {
                throw new CollectionError('each - given flags "' + flags + '" list is not number');
            }

            //if ALL flag given
            if (flags & xs.core.Collection.ALL) {
                all = true;
                //else - if REVERSE flag given
            } else if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //init variables
        var i, item, length = me.items.length, found;

        if (all) {
            //indexes of matched items
            var indexes = [];
            var isArray = true;

            for (i = 0; i < length; i++) {
                item = me.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    //add index
                    indexes.push(i);

                    //if isArray flag on and key is not number - turn it off
                    isArray && !xs.isNumber(item.key) && (isArray = false);
                }
            }

            //collect result data set
            length = indexes.length;
            found = isArray ? [] : {};
            for (i = 0; i < length; i++) {
                item = me.items[indexes[i]];
                found[item.key] = item.value;
            }
        } else if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                item = me.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    found = item.value;
                    break;
                }
            }
        } else {
            for (i = 0; i < length; i++) {
                item = me.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    found = item.value;
                    break;
                }
            }
        }

        return found;
    };

    /**
     * Produces a new list with values, returned by iterator function
     * if source was array - array is created
     * if source was object - object is created
     *
     * For example:
     *
     *     var scope = {
     *         twice: function(x) {
     *             return x * 2;
     *         }
     *     };
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         4
     *     ]);
     *     console.log(collection.map(function(value, key) {
     *         return key + this.twice(value);
     *     }, scope).values());
     *     //outputs:
     *     // [ 2, 5, 10 ]
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: 4
     *     });
     *     console.log(collection.map(function(value, key) {
     *         return key + this.twice(value);
     *     }, scope).values());
     *     //outputs:
     *     // ['a2', 'c4', 'b8' ]
     *
     * @method map
     *
     * @param {Function} mapper mapping function
     * @param {Object} [scope] optional scope
     *
     * @return {Array|Object} Mapping result
     *
     * @throws {Error} Error is thrown:
     *
     * - if mapper is not a function
     */
    collection.prototype.map = function (mapper, scope) {
        var me = this;

        //check that finder is function
        if (!xs.isFunction(mapper)) {
            throw new CollectionError('map - given mapper "' + mapper + '" is not a function');
        }

        //default scope to me
        arguments.length >= 2 || (scope = me);

        //init variables
        var i, item, length = me.items.length;

        //mapped items
        var items = [];
        for (i = 0; i < length; i++) {
            item = me.items[i];
            items.push({
                key: item.key,
                value: mapper.call(scope, item.value, item.key, me)
            });
        }

        var collection = new me.constructor();
        collection.items = items;

        return collection;
    };

    /**
     * Reduces collection values by reducer function
     *
     * For example:
     *
     *     var scope = {
     *         twice: function(x) {
     *             return x * 2;
     *         }
     *     };
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         4
     *     ]);
     *
     *     //direct
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + this.twice(value);
     *     }, scope, 0, 5));
     *     //outputs:
     *     // 22, evaluated as 5 + (0 + 1 * 2) + (1 + 2 * 2) + (2 + 2 * 4)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }));
     *     //outputs:
     *     // 16, evaluated as 1 + (1 + 2 * 2) + (2 + 4 * 2)
     *
     *     //reverse
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + this.twice(value);
     *     }, scope, xs.core.Collection.REVERSE, 5));
     *     //outputs:
     *     // 22, evaluated as 5 + (2 + 4 * 2) + (1 + 2 * 2) + (0 + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.core.Collection.REVERSE));
     *     //outputs:
     *     // 11, evaluated as 4 + (1 + 2 * 2) + (0 + 1 * 2)
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         b: 4
     *     });
     *
     *     //direct
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + this.twice(value);
     *     }, scope, 0, 5));
     *     //outputs:
     *     // '5a2c4b8', evaluated as 5 + ('a' + 1 * 2) + ('c' + 2 * 2) + ('b' + 2 * 4)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }));
     *     //outputs:
     *     // '1c4b8', evaluated as 1 + ('c' + 2 * 2) + ('b' + 4 * 2)
     *
     *     //direct
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + this.twice(value);
     *     }, scope, xs.core.Collection.REVERSE, 5));
     *     //outputs:
     *     // '5b8c4a2', evaluated as 5 + ('b' + 2 * 4) + ('c' + 2 * 2) + ('a' + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.core.Collection.REVERSE));
     *     //outputs:
     *     // '4c4a2', evaluated as 4 + ('c' + 2 * 2) + ('a' + 1 * 2)
     *
     * @method reduce
     *
     * @param {Function} reducer reducing function
     * @param {Object} [scope] optional scope
     * @param {Number} [flags] additional iterating flags:
     * @param {*} [memo] initial value. Is optional. If omitted, first value's value is shifted from list and used as memo
     *
     * @return {*} Reducing result
     *
     * @throws {Error} Error is thrown:
     *
     * - if finder is not a function
     * - if collection is empty
     */
    collection.prototype.reduce = function (reducer, scope, flags, memo) {
        var me = this;

        //check that finder is function
        if (!xs.isFunction(reducer)) {
            throw new CollectionError('reduce - given reducer "' + reducer + '" is not a function');
        }

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('reduce - collection is empty');
        }

        //default scope to me
        arguments.length >= 2 || (scope = me);

        //handle flags
        var reverse = false;
        if (arguments.length >= 3) {
            //check, that flags list is a number
            if (!xs.isNumber(flags)) {
                throw new CollectionError('reduce - given flags "' + flags + '" list is not number');
            }

            //if REVERSE flag given
            if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //check memo
        var hasMemo = false;
        if (arguments.length >= 4) {
            hasMemo = true;
        }

        //init variables
        var result, i, item, length = me.items.length;

        //reduce
        if (reverse) {
            if (hasMemo) {
                i = length - 1;
                result = memo;
            } else {
                i = length - 2;
                result = me.items[length - 1].value;
            }

            for (; i >= 0; i--) {
                item = me.items[i];
                result = reducer.call(scope, result, item.value, item.key, me);
            }
        } else {
            if (hasMemo) {
                i = 0;
                result = memo;
            } else {
                i = 1;
                result = me.items[0].value;
            }

            for (; i < length; i++) {
                item = me.items[i];
                result = reducer.call(scope, result, item.value, item.key, me);
            }
        }

        return result;
    };

    /**
     * Returns whether count of list values pass tester function
     *
     * For example:
     *
     *     var scope = {
     *        one: function(value) {
     *            return value === 1;
     *        },
     *     }
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         1,
     *         2,
     *         2,
     *     ]);
     *     console.log(collection.some(function(value) {
     *         return this.one(value);
     *     }, 3, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.some(function(value) {
     *         return this.one(value);
     *     }, 1, scope));
     *     //outputs:
     *     // true
     *     console.log(collection.some(function(value) {
     *         return value === 1;
     *     }));
     *     //outputs:
     *     // true
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         c: 1,
     *         b: 2,
     *         d: 2
     *     });
     *     console.log(collection.some(function(value) {
     *         return this.one(value);
     *     }, 3, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.some(function(value) {
     *         return this.one(value);
     *     }, 1, scope));
     *     //outputs:
     *     // true
     *     console.log(collection.some(function(value) {
     *         return value === 1;
     *     }));
     *     //outputs:
     *     // true
     *
     * @method some
     *
     * @param {Function} tester tester function
     * @param {Number} [count] count of values needed to resolve as true
     * @param {Object} [scope] optional scope
     *
     * @return {Boolean} whether some values pass tester function
     * 
     * @throws {Error} Error is thrown:
     *
     * - if tester is not a function
     * - if collection is empty
     */
    collection.prototype.some = function (tester, count, scope) {
        var me = this, length = me.items.length;

        //check that finder is function
        if (!xs.isFunction(tester)) {
            throw new CollectionError('some - given tester "' + tester + '" is not a function');
        }

        //default count to 1, if not given
        arguments.length == 1 && (count = 1);

        //check, that count is number and is in bounds
        if (!xs.isNumber(count)) {
            throw new CollectionError('some - given count "' + count + '" is not number');
        }
        if (count < 0 || count > length) {
            throw new CollectionError('some - given count "' + count + '" is out of bounds [0,' + length + ']');
        }

        //check that collection is not empty
        if (!me.items.length) {
            throw new CollectionError('some - collection is empty');
        }

        //default scope to me
        arguments.length >= 3 || (scope = me);

        var i, item, found = 0;

        //handle negative scenario
        if (count === 0) {
            //iterae over me.items to find matches
            for (i = 0; i < length; i++) {
                item = me.items[i];

                //increment found if tester returns true
                tester.call(scope, item.value, item.key, me) && found++;

                //return false if found at least one item
                if (found) {

                    return false;
                }
            }

            return true;
        }

        //handle positive scenario
        //iterare over me.items to find matches
        for (i = 0; i < length; i++) {
            item = me.items[i];

            //increment found if tester returns true
            tester.call(scope, item.value, item.key, me) && found++;

            //return true if found became equal to count
            if (found === count) {

                return true;
            }
        }

        return false;
    };

    /**
     * Removes all duplicates from collection
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.core.Collection([
     *         1,
     *         0,
     *         1,
     *         2,
     *         {},
     *         {},
     *         3,
     *         3,
     *         1,
     *         4
     *     ]).unique().values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    0,
     *     //    2,
     *     //    {},
     *     //    {},
     *     //    3,
     *     //    4
     *     //]
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         g: 0,
     *         b: 1,
     *         f: 2,
     *         i: {},
     *         m: {},
     *         d: 3,
     *         e: 3,
     *         c: 1,
     *         h: 4
     *     }).unique();
     *     console.log(collection.keys());
     *     //outputs:
     *     //[
     *     //    'a',
     *     //    'g',
     *     //    'f',
     *     //    'i',
     *     //    'm',
     *     //    'd',
     *     //    'h'
     *     //]
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    0,
     *     //    2,
     *     //    {},
     *     //    {},
     *     //    3,
     *     //    4
     *     //]
     *
     * @method unique
     *
     * @chainable
     */
    collection.prototype.unique = function () {
        var me = this, values = [], i = 0, item, length = me.items.length;

        while (i < length) {
            item = me.items[i];

            //continue to next if no match
            if (values.indexOf(item.value) < 0) {

                //add value to values
                values.push(item.value);

                //increment index
                i++;

                continue;
            }

            //delete item from me.items
            me.items.splice(i, 1);

            //decrement length
            length--;
        }

        //update indexes
        _updateIndexes.call(me, 0);

        return me;
    };

    collection.prototype.pick = function () {

    };

    collection.prototype.omit = function () {

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