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

    //define xs.core
    if (!xs.core) {
        xs.core = {};
    }

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
     * @param {Array|Object|Function} [values] collection source
     */
    var collection = xs.core.Collection = function (values) {
        var me = this;

        //init items array
        me.items = [];

        if (!arguments.length) {

            return;
        }

        xs.assert.ok(xs.isArray(values) || xs.isObject(values) || xs.isFunction(values), 'constructor - source "$values" is nor array, nor object neither function', {
            $values: values
        }, CollectionError);

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

            return;
        }


        //handle hash source
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
     */
    collection.prototype.hasKey = function (key) {
        var me = this;

        xs.assert.ok(xs.isNumber(key) || xs.isString(key), 'hasKey - key "$key", given for collection, is neither number nor string', {
            $key: key
        }, CollectionError);

        //if key is number - it's index
        if (xs.isNumber(key)) {

            //check, that key exists
            return 0 <= key && key < me.items.length;
        }

        //if it is string - it's key
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
     */
    collection.prototype.keyOf = function (value, flags) {
        var me = this, key, values = me.values();

        if (arguments.length === 1) {
            key = values.indexOf(value);
        } else {
            //assert that flags is number
            xs.assert.number(flags, 'keyOf - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

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
     */
    collection.prototype.at = function (key) {
        var me = this, index;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'at - collection is empty', CollectionError);

        xs.assert.ok(xs.isNumber(key) || xs.isString(key), 'at - key "$key", given for collection, is neither number nor string', {
            $key: key
        }, CollectionError);


        //handle number - it's index
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            xs.assert.ok(min <= key && key <= max, 'at - index "$key" is out of bounds [$min,$max]', {
                $key: key,
                $min: min,
                $max: max
            }, CollectionError);

            //convert negative index
            if (key < 0) {
                key += max;
            }

            return me.items[key].value;
        }


        //handle string - it's key
        index = me.keys().indexOf(key);

        //check, that key exists
        xs.assert.ok(index >= 0, 'at - given key "$key" doesn\'t exist', {
            $key: key
        }, CollectionError);

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
     */
    collection.prototype.first = function () {
        var me = this;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'first - collection is empty', CollectionError);

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
     */
    collection.prototype.last = function () {
        var me = this;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'last - collection is empty', CollectionError);

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
     */
    collection.prototype.add = function (key, value) {
        var me = this;

        //assert that arguments given
        xs.assert.ok(arguments.length, 'add - empty arguments', CollectionError);

        if (arguments.length === 1) {
            //handle autoincrement index
            value = key;
            key = me.items.length;
        } else {

            //assert that key is string
            xs.assert.string(key, 'add - key "$key", given for collection, is not a string', {
                $key: key
            }, CollectionError);

            //assert that key is not taken
            xs.assert.ok(me.keys().indexOf(key) < 0, 'add - collection already has key "$key"', {
                $key: key
            }, CollectionError);
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
     */
    collection.prototype.insert = function (index, key, value) {
        var me = this;

        //assert that arguments enough
        xs.assert.ok(arguments.length >= 2, 'insert - no enough arguments', CollectionError);

        //assert that index is number
        xs.assert.number(index, 'insert - given index "$index" is not number', {
            $index: index
        }, CollectionError);

        var max = me.items.length;
        //if max is 0, then min is 0
        var min = max > 0 ? -max : 0;

        //check that index is in bounds
        xs.assert.ok(min <= index && index <= max, 'insert - index "$index" is out of bounds [$min, $max]', {
            $index: index,
            $min: min,
            $max: max
        }, CollectionError);


        //check if key given
        if (arguments.length === 2) {
            //handle autoincrement index
            value = key;
            key = index;
        } else {
            //assert that key is string
            xs.assert.string(key, 'insert - key "$key", given for collection, is not a string', {
                $key: key
            }, CollectionError);

            //assert that key is not taken
            xs.assert.ok(me.keys().indexOf(key) < 0, 'insert - collection already has key "$key"', {
                $key: key
            }, CollectionError);
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
     */
    collection.prototype.set = function (key, value) {
        var me = this;

        //assert that arguments enough
        xs.assert.ok(arguments.length >= 2, 'set - no enough arguments', CollectionError);

        xs.assert.ok(xs.isNumber(key) || xs.isString(key), 'set - key "$key", given for collection, is neither number nor string', {
            $key: key
        }, CollectionError);


        //handle number key - it's index
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            xs.assert.ok(min <= key && key <= max, 'set - index "$index" is out of bounds [$min, $max]', {
                $index: key,
                $min: min,
                $max: max
            }, CollectionError);

            //convert negative index
            if (key < 0) {
                key += max;
            }

            me.items[key].value = value;

            return me;
        }


        //handle string key  - it's key
        var index = me.keys().indexOf(key);

        //assert that key exists
        xs.assert.ok(index >= 0, 'set - given key "$key" doesn\'t exist', {
            $key: key
        }, CollectionError);

        me.items[index].value = value;


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
     *     collection.removeAt(0);
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
     *     collection.removeAt(0);
     *     console.log(collection.values());
     *     //outputs:
     *     //{
     *     //    c: 2,
     *     //    b: value
     *     //}
     *
     * @method removeAt
     *
     * @param {Number|String} key key of removed value
     *
     * @chainable
     */
    collection.prototype.removeAt = function (key) {
        var me = this;

        xs.assert.ok(xs.isNumber(key) || xs.isString(key), 'removeAt - key "$key", given for collection, is neither number nor string', {
            $key: key
        }, CollectionError);


        //handle number key - index given
        if (xs.isNumber(key)) {
            //check that index is in bounds
            var max = me.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            xs.assert.ok(min <= key && key <= max, 'removeAt - index "$index" is out of bounds [$min, $max]', {
                $index: key,
                $min: min,
                $max: max
            }, CollectionError);

            //remove item by key
            me.items.splice(key, 1);

            return me;
        }


        //handle string key - key given
        //get index
        var index = me.keys().indexOf(key);

        //assert that key exists
        xs.assert.ok(index >= 0, 'removeAt - given key "$key" doesn\'t exist in collection', {
            $key: key
        }, CollectionError);

        //remove item by key
        me.items.splice(index, 1);

        //else - it's error

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
     *     collection.remove(value);
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
     *     collection.remove(value, xs.core.Collection.REVERSE);
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
     *     collection.remove(value, xs.core.Collection.ALL);
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
     *     collection.remove(value);
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
     *     collection.remove(value, xs.core.Collection.REVERSE);
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
     *     collection.remove(value, xs.core.Collection.ALL);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     * @method remove
     *
     * @param {*} value removed value
     * @param {Number} [flags] optional remove flags:
     * - REVERSE - to lookup for value from the end of the collection
     * - ALL - to remove all matches
     *
     * @chainable
     */
    collection.prototype.remove = function (value, flags) {
        var me = this, values = me.values();

        //remove all if no value given
        if (!arguments.length) {
            me.items.splice(0, me.items.length);

            return me;
        }


        var index, all = false;
        //if no flags - remove first occurrence of value
        if (arguments.length === 1) {
            index = values.indexOf(value);

            //handle flags
        } else {
            //assert that flags is number
            xs.assert.number(flags, 'remove - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

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


        //assert, that item exists
        xs.assert.ok(index >= 0, 'remove - given value doesn\'t exist in collection', CollectionError);

        //if all flag is given
        if (all) {
            var i = 0, valuesLength = values.length;

            //remove all occurrences of value in collection
            while (i < valuesLength) {

                //if item.value is not equal to value - continue with next item
                if (values[i] !== value) {
                    i++;
                    continue;
                }

                //remove item from values
                values.splice(i, 1);

                //remove item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                valuesLength--;
            }
        } else {

            //remove item from items
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
     *     collection.removeBy(function(val){
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
     *     collection.removeBy(function(val){
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
     *     collection.removeBy(function(val){
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
     *     collection.removeBy(function(val){
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
     *     collection.removeBy(function(val){
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
     *     collection.removeBy(function(val){
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
     * @method removeBy
     *
     * @param {Function} finder function, that returns whether to remove value or not
     * @param {Number} [flags] optional remove flags:
     * - REVERSE - to lookup for value from the end of the collection
     * - ALL - to remove all matches
     *
     * @chainable
     */
    collection.prototype.removeBy = function (finder, flags) {
        var me = this;

        //assert that finder is function
        xs.assert.fn(finder, 'removeBy - given finder "$finder" is not a function', {
            $finder: finder
        }, CollectionError);

        var all = false, reverse = false;
        //handle flags
        if (arguments.length > 1) {

            //assert that flags is number
            xs.assert.number(flags, 'removeBy - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

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
            //remove all matched occurrences from collection
            while (i < length) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                //remove item from values
                values.splice(i, 1);

                //remove item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                length--;
            }
        } else if (reverse) {
            i = length - 1;
            //remove all matched occurrences from collection
            while (i >= 0) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //decrement index
                    i--;

                    continue;
                }

                //remove item from values
                values.splice(i, 1);

                //remove item from collection
                me.items.splice(i, 1);

                //decrement valuesLength
                length--;

                //decrement index
                i--;

                break;
            }
        } else {
            i = 0;
            //remove first matched occurrence from collection
            while (i < length) {
                item = me.items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                //remove item from values
                values.splice(i, 1);

                //remove item from collection
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
     */
    collection.prototype.shift = function () {
        var me = this;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'shift - collection is empty', CollectionError);


        //get returned value
        var value = me.items[0].value;

        //remove first item from collection
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
     */
    collection.prototype.pop = function () {
        var me = this;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'pop - collection is empty', CollectionError);


        var index = me.items.length - 1;

        //get returned value
        var value = me.items[index].value;

        //remove last item from collection
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
     * @param {Number} [flags] additional iterating flags:
     * @param {Object} [scope] optional scope
     * - REVERSE - to iterate in reverse order
     *
     * @chainable
     */
    collection.prototype.each = function (iterator, flags, scope) {
        var me = this;

        //assert that iterator is function
        xs.assert.fn(iterator, 'each - given iterator "$iterator" is not a function', {
            $iterator: iterator
        }, CollectionError);

        //handle flags
        var reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            xs.assert.number(flags, 'each - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

            //if REVERSE flag given - last value occurrence is looked up for
            if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
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
     * @param {Number} [flags] additional search flags:
     * - ALL - to find all matches
     * @param {Object} [scope] optional scope
     *
     * @return {*|xs.core.Collection} found value, undefined if nothing found, or xs.core.Collection with results if ALL flag was given
     */
    collection.prototype.find = function (finder, flags, scope) {
        var me = this;

        //assert that finder is function
        xs.assert.fn(finder, 'find - given finder "$finder" is not a function', {
            $finder: finder
        }, CollectionError);

        //handle flags
        var all = false, reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            xs.assert.number(flags, 'find - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

            //if ALL flag given
            if (flags & xs.core.Collection.ALL) {
                all = true;
                //else - if REVERSE flag given
            } else if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
        }

        //init variables
        var i, item, length = me.items.length, found;

        if (all) {
            //copies of matched items
            var items = [];

            for (i = 0; i < length; i++) {
                item = me.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    //add index
                    items.push({
                        key: item.key,
                        value: item.value
                    });
                }
            }

            found = new me.constructor();
            found.items = items;
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
     */
    collection.prototype.map = function (mapper, scope) {
        var me = this;

        //assert that mapper is function
        xs.assert.fn(mapper, 'map - given mapper "$mapper" is not a function', {
            $mapper: mapper
        }, CollectionError);


        //default scope to me
        if (arguments.length < 2) {
            scope = me;
        }

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
     * @param {Number} [flags] additional iterating flags:
     * - REVERSE - to reduce in reverse order
     * @param {Object} [scope] optional scope
     * @param {*} [memo] initial value. Is optional. If omitted, first value's value is shifted from list and used as memo
     *
     * @return {*} Reducing result
     */
    collection.prototype.reduce = function (reducer, flags, scope, memo) {
        var me = this;

        //assert that reducer is function
        xs.assert.fn(reducer, 'reduce - given reducer "$reducer" is not a function', {
            $reducer: reducer
        }, CollectionError);

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'reduce - collection is empty', CollectionError);

        //handle flags
        var reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            xs.assert.number(flags, 'reduce - given flags "$flags" list is not number', {
                $flags: flags
            }, CollectionError);

            //if REVERSE flag given
            if (flags & xs.core.Collection.REVERSE) {
                reverse = true;
            }
        }

        //default scope to me
        if (arguments.length <= 2) {
            scope = me;
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
     */
    collection.prototype.some = function (tester, count, scope) {
        var me = this, length = me.items.length;

        //assert that collection is not empty
        xs.assert.ok(me.items.length, 'some - collection is empty', CollectionError);

        //assert that tester is function
        xs.assert.fn(tester, 'some - given tester "$tester" is not a function', {
            $tester: tester
        }, CollectionError);

        //default count to 1, if not given
        if (arguments.length < 2) {
            count = 1;
        }

        //check, that count is number and is in bounds
        xs.assert.number(count, 'some - given count "$count" is not number', {
            $count: count
        }, CollectionError);

        xs.assert.ok(0 <= count && count <= length, 'some - given count "$count" is out of bounds [$min, $max]', {
            $count: count,
            $min: 0,
            $max: length
        }, CollectionError);

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
        }

        var i, item, found = 0;

        //handle negative scenario
        if (count === 0) {
            //iterate over me.items to find matches
            for (i = 0; i < length; i++) {
                item = me.items[i];

                //increment found if tester returns true
                if (tester.call(scope, item.value, item.key, me)) {
                    found++;
                }

                //return false if found at least one item
                if (found) {

                    return false;
                }
            }

            return true;
        }

        //handle positive scenario
        //iterate over me.items to find matches
        for (i = 0; i < length; i++) {
            item = me.items[i];

            //increment found if tester returns true
            if (tester.call(scope, item.value, item.key, me)) {
                found++;
            }

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

            //remove item from me.items
            me.items.splice(i, 1);

            //decrement length
            length--;
        }

        //update indexes
        _updateIndexes.call(me, 0);

        return me;
    };

    /**
     * Returns collection's subset with only white-listed keys, passed in array
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.core.Collection([
     *         1,
     *         2,
     *         3,
     *         4,
     *         5,
     *         6
     *     ]).pick([1, 3, 2, 5]).values());
     *     //outputs:
     *     //[
     *     //    2,
     *     //    4,
     *     //    3,
     *     //    6
     *     //]
     *
     *     //for Object
     *     var pick = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         d: 3,
     *         b: 4,
     *         f: 5,
     *         e: 6
     *     }).pick([1, 3, 2, 5]);
     *     console.log(pick.keys());
     *     //outputs:
     *     //[
     *     //    'c',
     *     //    'b',
     *     //    'd',
     *     //    'e'
     *     //]
     *     console.log(pick.values());
     *     //outputs:
     *     //[
     *     //    2,
     *     //    4,
     *     //    3,
     *     //    6
     *     //]
     *
     * @method pick
     *
     * @param {String[]|Number[]} keys list with keys of picked items
     *
     * @return {xs.core.Collection} collection of picked items
     */
    collection.prototype.pick = function (keys) {
        var me = this;

        //assert that keys is array
        xs.assert.array(keys, 'pick - given keys list "$keys" is not array', {
            $keys: keys
        }, CollectionError);


        var length = keys.length, key, i, ownKeys = me.keys(), index, item, items = [];
        for (i = 0; i < length; i++) {
            key = keys[i];

            //assert that key is string or number
            xs.assert.ok(xs.isString(key) || xs.isNumber(key), 'pick - key "$key", given for collection, is neither number nor string', {
                $key: key
            }, CollectionError);


            //handle key string - it's key
            if (xs.isString(key)) {
                index = ownKeys.indexOf(key);

                //assert that key exists
                xs.assert.ok(index >= 0, 'pick - given key "$key" doesn\'t exist', {
                    $key: key
                }, CollectionError);


                //handle number key - it's index
            } else {
                //check that index is in bounds
                var max = me.items.length - 1;
                //if max is 0, then min is 0
                var min = max > 0 ? -max : 0;

                //assert that index is in bounds
                xs.assert.ok(min <= key && key <= max, 'pick - given index "$index" is out of bounds [$min, $max]', {
                    $index: key,
                    $min: min,
                    $max: max
                }, CollectionError);

                //convert negative index
                if (key < 0) {
                    key += max;
                }

                index = key;
            }

            //get picked item
            item = me.items[index];

            //copy it to items
            items.push({
                key: item.key,
                value: item.value
            });
        }


        //set picked items as items of picked collection
        var picked = new xs.core.Collection;
        picked.items = items;

        //update indexes
        _updateIndexes.call(picked, 0);

        return picked;
    };

    /**
     * Returns collection's subset without black-listed keys, passed in array
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.core.Collection([
     *         1,
     *         2,
     *         3,
     *         4,
     *         5,
     *         6
     *     ]).omit([1, 3, 2, 5]).values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    5
     *     //]
     *
     *     //for Object
     *     var omit = new xs.core.Collection({
     *         a: 1,
     *         c: 2,
     *         d: 3,
     *         b: 4,
     *         f: 5,
     *         e: 6
     *     }).omit([1, 3, 2, 5]);
     *     console.log(omit.keys());
     *     //outputs:
     *     //[
     *     //    'a',
     *     //    'f'
     *     //]
     *     console.log(omit.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    5
     *     //]
     *
     * @method omit
     *
     * @param {String[]|Number[]} keys list with keys of omitted items
     *
     * @return {xs.core.Collection} collection of without omitted items
     */
    collection.prototype.omit = function (keys) {
        var me = this;

        //assert that keys is array
        xs.assert.array(keys, 'omit - given keys list "$keys" is not array', {
            $keys: keys
        }, CollectionError);


        var length = keys.length, key, i, ownKeys = me.keys(), maxIndex = ownKeys.length - 1, index, item, items = [];

        var omittedIndexes = [];
        //remove blacklisted items
        for (i = 0; i < length; i++) {
            key = keys[i];

            //assert that key is string or number
            xs.assert.ok(xs.isString(key) || xs.isNumber(key), 'omit - key "$key", given for collection, is neither number nor string', {
                $key: key
            }, CollectionError);


            //handle key string - it's key
            if (xs.isString(key)) {
                index = ownKeys.indexOf(key);

                //assert, that key exists
                xs.assert.ok(index >= 0, 'omit - given key "$key" doesn\'t exist', {
                    $key: key
                }, CollectionError);


                //handle number key - it's index
            } else {
                //check that index is in bounds
                var max = me.items.length - 1;
                //if max is 0, then min is 0
                var min = max > 0 ? -max : 0;

                //assert that index is in bounds
                xs.assert.ok(min <= key && key <= max, 'omit - given index "$index" is out of bounds [$min, $max]', {
                    $index: key,
                    $min: min,
                    $max: max
                }, CollectionError);

                //convert negative index
                if (key < 0) {
                    key += max;
                }

                index = key;
            }

            //add omitted index
            omittedIndexes.push(index);
        }

        //fill items from me.items without omitted indexes
        for (i = 0; i <= maxIndex; i++) {
            if (omittedIndexes.indexOf(i) >= 0) {
                continue;
            }

            item = me.items[i];
            items.push({
                key: item.key,
                value: item.value
            });
        }

        //set picked items as items of omitted collection
        var omitted = new xs.core.Collection;
        omitted.items = items;

        //update indexes
        _updateIndexes.call(omitted, 0);

        return omitted;
    };

    /**
     * Returns collection as hash of key=>value pairs
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.core.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.toSource()); //{0: 1, 1: 2, 2: 3}
     *
     *     //for Object
     *     var collection = new xs.core.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 3
     *     });
     *     console.log(collection.toSource()); //{a: 1, b: 2, c: 3}
     *
     * @method asHash
     *
     * @return {Object} collection as hash
     */
    collection.prototype.toSource = function () {
        var me = this;

        var source = {}, length = me.items.length, item;

        for (var i = 0; i < length; i++) {
            item = me.items[i];
            source[item.key] = item.value;
        }

        return source;
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
            if (xs.isNumber(item.key)) {
                item.key = i;
            }
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
        this.message = 'xs.core.Collection::' + message;
    }

    CollectionError.prototype = new Error();
})(window, 'xs');