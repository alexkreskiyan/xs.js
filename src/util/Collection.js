/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * xs.util.Collection is framework class, that is widely used for internal classes' collections
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.util.Collection
 */
xs.define(xs.Class, 'ns.Collection', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util';

    Class.constant.events = {
    };

    //get xs.core.Collection reference
    var Collection = xs.core.Collection;

    /**
     * xs.util.Collection constructor
     *
     * @constructor
     *
     * @param {Array|Object} [values] collection source
     */
    Class.constructor = function (values) {
        var me = this;

        //init items array
        me.items = [];

        if (!arguments.length) {

            return;
        }

        xs.assert.ok(xs.isArray(values) || xs.isObject(values), 'constructor - source "$values" is nor array neither object', {
            $values: values
        }, CollectionError);

        //call collection constructor
        Collection.apply(me, arguments);
    };

    /**
     * Collection flag, meaning, that operation is reverse
     *
     * @static
     *
     * @property Reverse
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Reverse = 0x1;

    /**
     * Collection flag, meaning, that operation is made for all matches.
     *
     * @static
     *
     * @property All
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.All = 0x2;

    /**
     * Collection length
     *
     * @property length
     *
     * @readonly
     *
     * @type Number
     */
    Class.property.length = {
        get: function () {
            return this.private.items.length;
        },
        set: xs.emptyFn
    };

    /**
     * Returns all collection keys
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.keys()); //[0, 1, 2]
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
    Class.method.keys = Collection.prototype.keys;

    /**
     * Returns all collection values
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.values()); //[1, 2, 3] - returns copy of source array
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
    Class.method.values = Collection.prototype.keys;

    /**
     * Returns shallow copy of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     var clone = collection.clone();
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
     *         a: 1,
     *         c: 2,
     *         b: 3
     *     });
     *     var clone = collection.clone();
     *
     * @method clone
     *
     * @return {xs.util.Collection} collection shallow copy
     */
    Class.method.clone = Collection.prototype.keys;

    /**
     * Returns whether collection has given key. Keys' comparison is strict, differing numbers and strings
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.hasKey = Collection.prototype.keys;

    /**
     * Returns whether collection has value
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.has = Collection.prototype.keys;

    /**
     * Returns key of collection value, equal to given. Supports Reverse flag, that will perform lookup from the end of the collection
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     console.log(collection.keyOf(value, xs.util.Collection.Reverse)); //5
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
     *     console.log(collection.keyOf(value, xs.util.Collection.Reverse)); //'e'
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     * @param {Number} [flags] optional lookup flags:
     * - Reverse - to lookup for value from the end of the collection
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    Class.method.keyOf = Collection.prototype.keys;

    /**
     * Returns collection value for specified key
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.at = Collection.prototype.keys;

    /**
     * Returns first value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.first = Collection.prototype.keys;

    /**
     * Returns last value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.last = Collection.prototype.keys;

    /**
     * Adds value to collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.Collection([]);
     *     collection.add({x: 1});
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1}
     *
     *     //for Object
     *     var collection = new xs.util.Collection({});
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
    Class.method.add = function (key, value) {
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
     *     var collection = new xs.util.Collection([]);
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
     *     var collection = new xs.util.Collection({});
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
    Class.method.insert = function (index, key, value) {
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
     *     var collection = new xs.util.Collection([1,2]);
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
     *     var collection = new xs.util.Collection({a: 2, b: 1});
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
    Class.method.set = function (key, value) {
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
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.removeAt = function (key) {
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
     *     var collection = new xs.util.Collection([
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
     *     collection.remove(value, xs.util.Collection.Reverse);
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
     *     collection.remove(value, xs.util.Collection.All);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.util.Collection({
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
     *     collection.remove(value, xs.util.Collection.Reverse);
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
     *     collection.remove(value, xs.util.Collection.All);
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
     * @param {*} [value] removed value. If not given - collection wil be truncated
     * @param {Number} [flags] optional remove flags:
     * - Reverse - to lookup for value from the end of the collection
     * - All - to remove all matches
     *
     * @chainable
     */
    Class.method.remove = function (value, flags) {
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

            //if All flag given - no index is needed
            if (flags & xs.util.Collection.All) {
                index = values.indexOf(value);
                all = true;
                //if Reverse flag given - last value occurrence is looked up for
            } else if (flags & xs.util.Collection.Reverse) {
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
     * Deletes value from collection, if it matches given finder function. Function's arguments are: value, key
     *
     * For example:
     *
     *     var value = {
     *         x: 1
     *     };
     *
     *     var collection = new xs.util.Collection([
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
     *     }, xs.util.Collection.Reverse);
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
     *     }, xs.util.Collection.All);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.util.Collection({
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
     *     }, xs.util.Collection.Reverse);
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
     *     }, xs.util.Collection.All);
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
     * - Reverse - to lookup for value from the end of the collection
     * - All - to remove all matches
     *
     * @chainable
     */
    Class.method.removeBy = function (finder, flags) {
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

            //if All flag given - order does not matter
            if (flags & xs.util.Collection.All) {
                all = true;
                //if Reverse flag given - last value occurrence is looked up for
            } else if (flags & xs.util.Collection.Reverse) {
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
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.shift = function () {
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
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.pop = function () {
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
     * Iterates over collection in direct or reverse order via calling given iterator function
     *
     * For example:
     *
     *     var scope = {
     *         x: 1
     *     };
     *
     *     //for Array
     *     var collection = new xs.util.Collection([
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
     *     }, scope, xs.util.Collection.Reverse);
     *     //outputs:
     *     // {x:1}, {}, 2, collection
     *     // {x:1}, 2, 1, collection
     *     // {x:1}, 1, 0, collection
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
     *     }, scope, xs.util.Collection.Reverse);
     *     //outputs:
     *     // {x:1}, {}, b, collection
     *     // {x:1}, 2, c, collection
     *     // {x:1}, 1, a, collection
     *
     * @method each
     *
     * @param {Function} iterator list iterator
     * @param {Number} [flags] additional iterating flags:
     * - Reverse - to iterate in reverse order
     * @param {Object} [scope] optional scope
     *
     * @chainable
     */
    Class.method.each = Collection.prototype.keys;

    /**
     * Returns collection item|items, that passed given finder function
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
     *     var collection = new xs.util.Collection([
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
     *     }, scope, xs.util.Collection.Reverse));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.sum(key, value.x) >= 2;
     *     }, scope, xs.util.Collection.All));
     *     //outputs:
     *     //[
     *     //    {x: 2},
     *     //    {x: 2},
     *     //    {x: 0}
     *     //]
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
     *     }, scope, xs.util.Collection.Reverse));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.first(key) === 'a';
     *     }, scope, xs.util.Collection.All));
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
     * - All - to find all matches
     * @param {Object} [scope] optional scope
     *
     * @return {*|xs.util.Collection} found value, undefined if nothing found, or xs.util.Collection with results if All flag was given
     */
    Class.method.find = Collection.prototype.keys;

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
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.map = Collection.prototype.keys;

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
     *     var collection = new xs.util.Collection([
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
     *     }, scope, xs.util.Collection.Reverse, 5));
     *     //outputs:
     *     // 22, evaluated as 5 + (2 + 4 * 2) + (1 + 2 * 2) + (0 + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.util.Collection.Reverse));
     *     //outputs:
     *     // 11, evaluated as 4 + (1 + 2 * 2) + (0 + 1 * 2)
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
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
     *     }, scope, xs.util.Collection.Reverse, 5));
     *     //outputs:
     *     // '5b8c4a2', evaluated as 5 + ('b' + 2 * 4) + ('c' + 2 * 2) + ('a' + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.util.Collection.Reverse));
     *     //outputs:
     *     // '4c4a2', evaluated as 4 + ('c' + 2 * 2) + ('a' + 1 * 2)
     *
     * @method reduce
     *
     * @param {Function} reducer reducing function
     * @param {Number} [flags] additional iterating flags:
     * - Reverse - to reduce in reverse order
     * @param {Object} [scope] optional scope
     * @param {*} [memo] initial value. Is optional. If omitted, first value's value is shifted from list and used as memo
     *
     * @return {*} Reducing result
     */
    Class.method.reduce = Collection.prototype.keys;

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
     *     var collection = new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.some = Collection.prototype.keys;

    /**
     * Returns whether all of list values pass tester function
     *
     * For example:
     *
     *     var scope = {
     *        one: function(value) {
     *            return value === 1;
     *        },
     *     }
     *     //for Array
     *     var collection = new xs.util.Collection([
     *         1,
     *         1,
     *         2,
     *         2,
     *     ]);
     *     console.log(collection.all(function(value) {
     *         return this.one(value);
     *     }, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.all(function(value) {
     *         return value > 0;
     *     }));
     *     //outputs:
     *     // true
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
     *         a: 1,
     *         c: 1,
     *         b: 2,
     *         d: 2
     *     });
     *     console.log(collection.all(function(value) {
     *         return this.one(value);
     *     }, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.all(function(value) {
     *         return value > 0;
     *     }));
     *     //outputs:
     *     // true
     *
     * @method all
     *
     * @param {Function} tester tester function
     * @param {Object} [scope] optional scope
     *
     * @return {Boolean} whether all values pass tester function
     */
    Class.method.all = Collection.prototype.keys;

    /**
     * Returns whether none of list values pass tester function
     *
     * For example:
     *
     *     var scope = {
     *        one: function(value) {
     *            return value === 1;
     *        },
     *     }
     *     //for Array
     *     var collection = new xs.util.Collection([
     *         1,
     *         1,
     *         2,
     *         2,
     *     ]);
     *     console.log(collection.none(function(value) {
     *         return this.one(value);
     *     }, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.none(function(value) {
     *         return value > 2;
     *     }));
     *     //outputs:
     *     // true
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
     *         a: 1,
     *         c: 1,
     *         b: 2,
     *         d: 2
     *     });
     *     console.log(collection.none(function(value) {
     *         return this.one(value);
     *     }, scope));
     *     //outputs:
     *     // false
     *     console.log(collection.none(function(value) {
     *         return value > 2;
     *     }));
     *     //outputs:
     *     // true
     *
     * @method none
     *
     * @param {Function} tester tester function
     * @param {Object} [scope] optional scope
     *
     * @return {Boolean} whether none values pass tester function
     */
    Class.method.none = Collection.prototype.keys;

    /**
     * Removes all duplicates from collection
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.util.Collection([
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
     *     var collection = new xs.util.Collection({
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
    Class.method.unique = Collection.prototype.keys;

    /**
     * Returns collection's subset with only white-listed keys, passed in array
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.util.Collection([
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
     *     var pick = new xs.util.Collection({
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
     * @return {xs.util.Collection} collection of picked items
     */
    Class.method.pick = function (keys) {
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
                var max = me.private.items.length - 1;
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
            item = me.private.items[index];

            //copy it to items
            items.push({
                key: item.key,
                value: item.value
            });
        }


        //set picked items as items of picked collection
        var picked = new xs.core.Collection();
        picked.private.items = items;

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
     *     console.log(new xs.util.Collection([
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
     *     var omit = new xs.util.Collection({
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
     * @return {xs.util.Collection} collection of without omitted items
     */
    Class.method.omit = function (keys) {
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
                var max = me.private.items.length - 1;
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

        //fill items from me.private.items without omitted indexes
        for (i = 0; i <= maxIndex; i++) {
            if (omittedIndexes.indexOf(i) >= 0) {
                continue;
            }

            item = me.private.items[i];
            items.push({
                key: item.key,
                value: item.value
            });
        }

        //set picked items as items of omitted collection
        var omitted = new xs.core.Collection();
        omitted.private.items = items;

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
     *     var collection = new xs.util.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.toSource()); //{0: 1, 1: 2, 2: 3}
     *
     *     //for Object
     *     var collection = new xs.util.Collection({
     *         a: 1,
     *         b: 2,
     *         c: 3
     *     });
     *     console.log(collection.toSource()); //{a: 1, b: 2, c: 3}
     *
     * @method toSource
     *
     * @return {Object} collection as hash
     */
    Class.method.toSource = Collection.prototype.keys;

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
        var me = this, length = me.private.items.length;

        //updated indexes for all items, starting from given index
        for (var i = index; i < length; i++) {
            var item = me.private.items[i];

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
        this.message = 'xs.util.Collection::' + message;
    }

    CollectionError.prototype = new Error();
});