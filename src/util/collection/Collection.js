/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * xs.util.collection.Collection is framework class, that is widely used for internal classes' collections
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.util.collection.Collection
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.Collection', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util.collection';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.events = {
        /**
         * add:before event. Is fired before new value added/inserted into collection. Stopping that event prevents adding item to collection
         *
         * @event add:before
         */
        'add:before': {
            type: 'ns.Event'
        },
        /**
         * add event. Is fired after new value added/inserted into collection
         *
         * @event add
         */
        'add': {
            type: 'ns.Event'
        },
        /**
         * set:before event. Is fired before new value set to collection item. Stopping that event prevents changing value of collection item
         *
         * @event set:before
         */
        'set:before': {
            type: 'ns.Event'
        },
        /**
         * set event. Is fired after new value set to collection item
         *
         * @event set
         */
        'set': {
            type: 'ns.Event'
        },
        /**
         * remove:before event. Is fired before item is removed from collection. Stopping that event prevents removing item from collection
         *
         * @event remove:before
         */
        'remove:before': {
            type: 'ns.Event'
        },
        /**
         * remove event. Is fired after item is removed from collection
         *
         * @event remove
         */
        'remove': {
            type: 'ns.Event'
        },
        /**
         * clear event. Is fired after all items are removed from collection
         *
         * @event clear
         */
        'clear': {
            type: 'ns.Event'
        }
    };

    /**
     * xs.util.collection.Collection constructor
     *
     * @constructor
     *
     * @param {Array|Object} [values] collection source
     * @param {Function} [type] for typed collection, constructor, mixin or interface, each value must match.
     * Type can be xs.Interface, xs.Class or any other function:
     *
     * - if given xs.Interface, all values are verified to be instances of classes, that implement given interface
     * - if given xs.Class, all values are verified to be instances of that class
     * - otherwise, all values are verified to be instances of given function
     *
     * If no type given, collection may contain any value
     */
    Class.constructor = function (values, type) {
        var me = this;

        me.mixins.observable.call(me);

        //init items array
        me.private.items = [];

        //return if no arguments
        if (!arguments.length) {

            return;
        }

        //swap type and values if given type only
        if (arguments.length === 1 && xs.isFunction(values)) {

            type = values;
            values = [];
        }

        //assert, that values are either an array or object
        self.assert.ok(xs.isArray(values) || xs.isObject(values), 'constructor - values "$values" is nor array neither object', {
            $values: values
        });

        //assert, that type is function (if given as second argument)
        self.assert.ok(arguments.length === 1 || xs.isFunction(type), 'constructor - type "$type" is not a function', {
            $type: type
        });

        //save type if given
        if (type) {
            me.private.kind = getTypeKind(type);
            me.private.type = type;
        }

        //verify values (if type given)
        self.assert.ok(!type || verifySourceValues.call(me, xs.isArray(values) ? values : (new xs.core.Collection(values)).values()));

        var i, length;

        //handle array source
        if (xs.isArray(values)) {

            //get length
            length = values.length;

            for (i = 0; i < length; i++) {

                //add item
                me.private.items.push({
                    key: i,
                    value: values[i]
                });
            }

            return;
        }


        //handle hash source

        //get keys and length
        var keys = Object.keys(values), key;
        length = keys.length;

        for (i = 0; i < length; i++) {
            key = keys[i];

            //add item
            me.private.items.push({
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
     *     var collection = new xs.util.collection.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.keys()); //[0, 1, 2]
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.keys = function () {
        var me = this;

        var keys = [], length = me.private.items.length;

        for (var i = 0; i < length; i++) {
            keys.push(me.private.items[i].key);
        }

        return keys;
    };

    /**
     * Returns all collection values
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.values()); //[1, 2, 3] - returns copy of source array
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.values = function () {
        var me = this;

        var values = [], length = me.private.items.length;

        for (var i = 0; i < length; i++) {
            values.push(me.private.items[i].value);
        }

        return values;
    };

    /**
     * Returns whether collection has given key. Keys' comparison is strict, differing numbers and strings
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.hasKey = function (key) {
        var me = this;

        self.assert.ok(xs.isNumber(key) || xs.isString(key), 'hasKey - key "$key", given for collection, is neither number nor string', {
            $key: key
        });

        //if key is number - it's index
        if (xs.isNumber(key)) {

            //check, that key exists
            return 0 <= key && key < me.private.items.length;
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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.has = function (value) {
        var me = this;

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        return this.values().indexOf(value) >= 0;
    };

    /**
     * Returns key of collection value, equal to given. Supports Reverse flag, that will perform lookup from the end of the collection
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
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
     *     console.log(collection.keyOf(value, xs.util.collection.Collection.Reverse)); //5
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
     *     console.log(collection.keyOf(value, xs.util.collection.Collection.Reverse)); //'e'
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     * @param {Number} [flags] optional lookup flags:
     * - Reverse - to lookup for value from the end of the collection
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    Class.method.keyOf = function (value, flags) {
        var me = this, index, values = me.values();

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        if (arguments.length === 1) {
            index = values.indexOf(value);
        } else {
            //assert that flags is number
            self.assert.number(flags, 'keyOf - given flags "$flags" list is not number', {
                $flags: flags
            });

            if (flags & self.Reverse) {
                index = values.lastIndexOf(value);
            } else {
                index = values.indexOf(value);
            }
        }

        return index >= 0 ? me.private.items[index].key : undefined;
    };

    /**
     * Returns collection value for specified key
     *
     * For example:
     *
     *     var value = {};
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.at = function (key) {
        var me = this;

        //assert that collection is not empty
        self.assert.ok(me.private.items.length, 'at - collection is empty');

        self.assert.ok(xs.isNumber(key) || xs.isString(key), 'at - key "$key", given for collection, is neither number nor string', {
            $key: key
        });


        var index;
        //handle number - it's index
        if (xs.isNumber(key)) {
            index = key;

            //check that index is in bounds
            var max = me.private.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            self.assert.ok(min <= index && index <= max, 'at - index "$index" is out of bounds [$min,$max]', {
                $index: index,
                $min: min,
                $max: max
            });

            //convert negative index
            if (index < 0) {
                index += max + 1;
            }

            //handle string - it's key
        } else {

            index = me.keys().indexOf(key);

            //check, that key exists
            self.assert.ok(index >= 0, 'at - given key "$key" doesn\'t exist', {
                $key: key
            });
        }

        return me.private.items[index].value;
    };

    /**
     * Returns first value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.first = function () {
        var me = this;

        //assert that collection is not empty
        self.assert.ok(me.private.items.length, 'first - collection is empty');

        return me.private.items[0].value;
    };

    /**
     * Returns last value of collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.last = function () {
        var me = this;

        //assert that collection is not empty
        self.assert.ok(me.private.items.length, 'last - collection is empty');

        return me.private.items[me.private.items.length - 1].value;
    };

    /**
     * Adds value to collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([]);
     *     collection.add({x: 1});
     *     console.log(collection.last());
     *     //outputs:
     *     // {x: 1}
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({});
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
        self.assert.ok(arguments.length, 'add - empty arguments');

        if (arguments.length === 1) {
            //handle autoincrement index
            value = key;
            key = me.private.items.length;
        } else {

            //assert that key is string
            self.assert.string(key, 'add - key "$key", given for collection, is not a string', {
                $key: key
            });

            //assert that key is not taken
            self.assert.ok(me.keys().indexOf(key) < 0, 'add - collection already has key "$key"', {
                $key: key
            });
        }

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        var data = {
            key: key,
            value: value,
            index: me.private.items.length
        };

        //call preventable "add:before" event, that can prevent adding value to collection
        if (!me.fire('add:before', data)) {

            return me;
        }

        //add item
        me.private.items.push({
            key: key,
            value: value
        });

        //call closing "add" event
        me.fire('add', data);

        return me;
    };

    /**
     * Inserts value into collection
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([]);
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
     *     var collection = new xs.util.collection.Collection({});
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
        self.assert.ok(arguments.length >= 2, 'insert - no enough arguments');

        //assert that index is number
        self.assert.number(index, 'insert - given index "$index" is not number', {
            $index: index
        });

        var max = me.private.items.length;
        //if max is 0, then min is 0
        var min = max > 0 ? -max : 0;

        //check that index is in bounds
        self.assert.ok(min <= index && index <= max, 'insert - index "$index" is out of bounds [$min, $max]', {
            $index: index,
            $min: min,
            $max: max
        });

        //convert negative index
        if (index < 0) {
            index += max;
        }


        //check if key given
        if (arguments.length === 2) {
            //handle autoincrement index
            value = key;
            key = index;
        } else {
            //assert that key is string
            self.assert.string(key, 'insert - key "$key", given for collection, is not a string', {
                $key: key
            });

            //assert that key is not taken
            self.assert.ok(me.keys().indexOf(key) < 0, 'insert - collection already has key "$key"', {
                $key: key
            });
        }

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        var data = {
            key: key,
            value: value,
            index: index
        };

        //call preventable "add:before" event, that can prevent insert value into collection
        if (!me.fire('add:before', data)) {

            return me;
        }

        //insert
        //insert new item
        me.private.items.splice(index, 0, {
            key: key,
            value: value
        });

        //updated indexes
        updateIndexes.call(me, index + 1);

        //call closing "add" event
        me.fire('add', data);

        return me;
    };

    /**
     * Sets value for item by specified key
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([1,2]);
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
     *     var collection = new xs.util.collection.Collection({a: 2, b: 1});
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
        self.assert.ok(arguments.length >= 2, 'set - no enough arguments');

        self.assert.ok(xs.isNumber(key) || xs.isString(key), 'set - key "$key", given for collection, is neither number nor string', {
            $key: key
        });


        //handle number key - it's index
        var index;
        if (xs.isNumber(key)) {
            index = key;

            //check that index is in bounds
            var max = me.private.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            self.assert.ok(min <= index && index <= max, 'set - index "$index" is out of bounds [$min, $max]', {
                $index: index,
                $min: min,
                $max: max
            });

            //convert negative index
            if (index < 0) {
                index += max + 1;
            }

            //handle string key  - it's key
        } else {

            index = me.keys().indexOf(key);

            //assert that key exists
            self.assert.ok(index >= 0, 'set - given key "$key" doesn\'t exist', {
                $key: key
            });
        }

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        var data = {
            key: key,
            value: value,
            index: index
        };

        //call preventable "set:before" event, that can prevent setting value for collection item
        if (!me.fire('set:before', data)) {

            return me;
        }

        me.private.items[index].value = value;

        //call closing "set" event
        me.fire('set', data);

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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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

        self.assert.ok(xs.isNumber(key) || xs.isString(key), 'removeAt - key "$key", given for collection, is neither number nor string', {
            $key: key
        });

        var index;

        //handle number key - index given
        if (xs.isNumber(key)) {
            index = key;

            //check that index is in bounds
            var max = me.private.items.length - 1;

            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            self.assert.ok(min <= index && index <= max, 'removeAt - index "$index" is out of bounds [$min, $max]', {
                $index: index,
                $min: min,
                $max: max
            });

            //convert negative index
            if (index < 0) {
                index += max + 1;
            }

            //handle string key - key given
        } else {

            //get index
            index = me.keys().indexOf(key);

            //assert that key exists
            self.assert.ok(index >= 0, 'removeAt - given key "$key" doesn\'t exist in collection', {
                $key: key
            });
        }

        var item = me.private.items[index];

        var data = {
            key: item.key,
            value: item.value,
            index: index
        };

        //call preventable "remove:before" event, that can prevent removing value for collection
        if (!me.fire('remove:before', data)) {

            return me;
        }

        //remove item from items
        me.private.items.splice(index, 1);

        //update indexes
        updateIndexes.call(me, index);

        //call closing "remove" event
        me.fire('remove', data);

        //if no items left - fire clear event
        if (!me.private.items.length) {
            me.fire('clear');
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
     *     var collection = new xs.util.collection.Collection([
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
     *     collection.remove(value, xs.util.collection.Collection.Reverse);
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
     *     collection.remove(value, xs.util.collection.Collection.All);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.util.collection.Collection({
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
     *     collection.remove(value, xs.util.collection.Collection.Reverse);
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
     *     collection.remove(value, xs.util.collection.Collection.All);
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
            me.private.items.splice(0, me.private.items.length);

            //fire clear event
            me.fire('clear');

            return me;
        }

        //assert, that value is valid
        self.assert.ok(isValid.call(me, value), 'Not valid');

        var index, all = false;
        //if no flags - remove first occurrence of value
        if (arguments.length === 1) {
            index = values.indexOf(value);

            //handle flags
        } else {
            //assert that flags is number
            self.assert.number(flags, 'remove - given flags "$flags" list is not number', {
                $flags: flags
            });

            //if All flag given - no index is needed
            if (flags & self.All) {
                index = values.indexOf(value);
                all = true;
                //if Reverse flag given - last value occurrence is looked up for
            } else if (flags & self.Reverse) {
                index = values.lastIndexOf(value);
                //else - first value occurrence is looked up for
            } else {
                index = values.indexOf(value);
            }
        }


        //assert, that item exists
        self.assert.ok(index >= 0, 'remove - given value doesn\'t exist in collection');

        var data, item;
        //if all flag is given
        if (all) {
            var i = 0, items = me.private.items;

            //remove all occurrences of value in collection
            while (i < items.length) {
                item = items[i];

                //if item.value is not equal to value - continue with next item
                if (item.value !== value) {
                    i++;
                    continue;
                }

                data = {
                    key: item.key,
                    value: value,
                    index: i
                };

                //call preventable "remove:before" event, that can prevent removing value for collection. if happens - continue with next item
                if (!me.fire('remove:before', data)) {
                    i++;
                    continue;
                }

                //remove item from collection
                me.private.items.splice(i, 1);

                //call closing "remove" event
                me.fire('remove', data);
            }

            //update indexes if anything removed
            if (me.private.items.length < values.length) {
                updateIndexes.call(me, index);
            }
        } else {

            item = me.private.items[index];

            data = {
                key: item.key,
                value: value,
                index: index
            };

            //call preventable "remove:before" event, that can prevent removing value for collection
            if (!me.fire('remove:before', data)) {

                return me;
            }

            //remove item from items
            me.private.items.splice(index, 1);

            //call closing "remove" event
            me.fire('remove', data);

            //update indexes
            updateIndexes.call(me, index);
        }


        //if no items left - fire clear event
        if (!me.private.items.length) {
            me.fire('clear');
        }

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
     *     var collection = new xs.util.collection.Collection([
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
     *     }, xs.util.collection.Collection.Reverse);
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
     *     }, xs.util.collection.Collection.All);
     *     console.log(collection.values());
     *     //outputs:
     *     //[
     *     //    1,
     *     //    2,
     *     //    2,
     *     //    1
     *     //]
     *
     *     var collection = new xs.util.collection.Collection({
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
     *     }, xs.util.collection.Collection.Reverse);
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
     *     }, xs.util.collection.Collection.All);
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
        self.assert.fn(finder, 'removeBy - given finder "$finder" is not a function', {
            $finder: finder
        });

        var all = false, reverse = false;
        //handle flags
        if (arguments.length > 1) {

            //assert that flags is number
            self.assert.number(flags, 'removeBy - given flags "$flags" list is not number', {
                $flags: flags
            });

            //if All flag given - order does not matter
            if (flags & self.All) {
                all = true;
                //if Reverse flag given - last value occurrence is looked up for
            } else if (flags & self.Reverse) {
                reverse = true;
            }
        }

        //init variables
        var items = me.private.items, i, item, data, length = items.length;

        if (all) {
            i = 0;
            //remove all matched occurrences from collection
            while (i < items.length) {
                item = items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                data = {
                    key: item.key,
                    value: item.value,
                    index: i
                };

                //call preventable "remove:before" event, that can prevent removing value for collection. if happens - continue with next item
                if (!me.fire('remove:before', data)) {
                    i++;

                    continue;
                }

                //remove item from collection
                items.splice(i, 1);

                //call closing "remove" event
                me.fire('remove', data);
            }
        } else if (reverse) {
            i = items.length - 1;
            //remove all matched occurrences from collection
            while (i >= 0) {
                item = items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //decrement index
                    i--;

                    continue;
                }

                data = {
                    key: item.key,
                    value: item.value,
                    index: i
                };

                //call preventable "remove:before" event, that can prevent removing value for collection. if happens - continue with next item
                if (!me.fire('remove:before', data)) {
                    i--;

                    continue;
                }

                //remove item from collection
                items.splice(i, 1);

                //call closing "remove" event
                me.fire('remove', data);

                break;
            }
        } else {
            i = 0;
            //remove first matched occurrence from collection
            while (i < items.length) {
                item = items[i];

                //if item does not match - continue with next item
                if (!finder(item.value, item.key)) {
                    //increment index
                    i++;

                    continue;
                }

                data = {
                    key: item.key,
                    value: item.value,
                    index: i
                };

                //call preventable "remove:before" event, that can prevent removing value for collection. if happens - continue with next item
                if (!me.fire('remove:before', data)) {
                    i++;

                    continue;
                }

                //remove item from collection
                items.splice(i, 1);

                //call closing "remove" event
                me.fire('remove', data);

                break;
            }
        }

        //update indexes if anything removed
        if (items.length < length) {
            updateIndexes.call(me, 0);
        }

        //fire clear event if no items left
        if (!items.length) {
            me.fire('clear');
        }

        return me;
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
     *     var collection = new xs.util.collection.Collection([
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
     *     }, scope, xs.util.collection.Collection.Reverse);
     *     //outputs:
     *     // {x:1}, {}, 2, collection
     *     // {x:1}, 2, 1, collection
     *     // {x:1}, 1, 0, collection
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
     *     }, scope, xs.util.collection.Collection.Reverse);
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
    Class.method.each = function (iterator, flags, scope) {
        var me = this;

        //assert that iterator is function
        self.assert.fn(iterator, 'each - given iterator "$iterator" is not a function', {
            $iterator: iterator
        });

        //handle flags
        var reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            self.assert.number(flags, 'each - given flags "$flags" list is not number', {
                $flags: flags
            });

            //if Reverse flag given - last value occurrence is looked up for
            if (flags & self.Reverse) {
                reverse = true;
            }
        }

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
        }

        //iterate
        var i, item, length = me.private.items.length;
        if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                item = me.private.items[i];
                iterator.call(scope, item.value, item.key, me);
            }
        } else {
            for (i = 0; i < length; i++) {
                item = me.private.items[i];
                iterator.call(scope, item.value, item.key, me);
            }
        }

        return me;
    };

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
     *     var collection = new xs.util.collection.Collection([
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
     *     }, scope, xs.util.collection.Collection.Reverse));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.sum(key, value.x) >= 2;
     *     }, scope, xs.util.collection.Collection.All));
     *     //outputs:
     *     //[
     *     //    {x: 2},
     *     //    {x: 2},
     *     //    {x: 0}
     *     //]
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
     *     }, scope, xs.util.collection.Collection.Reverse));
     *     //outputs:
     *     // {x: 0}, reference to collection[2], first value, passed finder function
     *     console.log(collection.find(function(value, key) {
     *         return this.first(key) === 'a';
     *     }, scope, xs.util.collection.Collection.All));
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
     * @return {*|xs.util.collection.Collection} found value, undefined if nothing found, or xs.util.collection.Collection with results if All flag was given
     */
    Class.method.find = function (finder, flags, scope) {
        var me = this;

        //assert that finder is function
        self.assert.fn(finder, 'find - given finder "$finder" is not a function', {
            $finder: finder
        });

        //handle flags
        var all = false, reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            self.assert.number(flags, 'find - given flags "$flags" list is not number', {
                $flags: flags
            });

            //if All flag given
            if (flags & self.All) {
                all = true;
                //else - if Reverse flag given
            } else if (flags & self.Reverse) {
                reverse = true;
            }
        }

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
        }

        //init variables
        var i, item, length = me.private.items.length, found;

        if (all) {
            //copies of matched items
            var items = [];

            for (i = 0; i < length; i++) {
                item = me.private.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    //add index
                    items.push({
                        key: item.key,
                        value: item.value
                    });
                }
            }

            found = me.clone();
            found.private.items = items;
        } else if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                item = me.private.items[i];
                if (finder.call(scope, item.value, item.key, me)) {
                    found = item.value;
                    break;
                }
            }
        } else {
            for (i = 0; i < length; i++) {
                item = me.private.items[i];
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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.map = function (mapper, scope) {
        var me = this;

        //assert that mapper is function
        self.assert.fn(mapper, 'map - given mapper "$mapper" is not a function', {
            $mapper: mapper
        });


        //default scope to me
        if (arguments.length < 2) {
            scope = me;
        }

        //init variables
        var i, item, length = me.private.items.length;

        //mapped items
        var items = [];
        for (i = 0; i < length; i++) {
            item = me.private.items[i];
            items.push({
                key: item.key,
                value: mapper.call(scope, item.value, item.key, me)
            });
        }

        var collection = me.clone();
        collection.private.items = items;

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
     *     var collection = new xs.util.collection.Collection([
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
     *     }, scope, xs.util.collection.Collection.Reverse, 5));
     *     //outputs:
     *     // 22, evaluated as 5 + (2 + 4 * 2) + (1 + 2 * 2) + (0 + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.util.collection.Collection.Reverse));
     *     //outputs:
     *     // 11, evaluated as 4 + (1 + 2 * 2) + (0 + 1 * 2)
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
     *     }, scope, xs.util.collection.Collection.Reverse, 5));
     *     //outputs:
     *     // '5b8c4a2', evaluated as 5 + ('b' + 2 * 4) + ('c' + 2 * 2) + ('a' + 1 * 2)
     *     console.log(collection.reduce(function(memo, value, key) {
     *         return memo + key + 2 * value;
     *     }, scope, xs.util.collection.Collection.Reverse));
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
    Class.method.reduce = function (reducer, flags, scope, memo) {
        var me = this;

        //assert that reducer is function
        self.assert.fn(reducer, 'reduce - given reducer "$reducer" is not a function', {
            $reducer: reducer
        });

        //assert that collection is not empty
        self.assert.ok(me.private.items.length, 'reduce - collection is empty');

        //handle flags
        var reverse = false;
        if (arguments.length >= 2) {

            //assert that flags is number
            self.assert.number(flags, 'reduce - given flags "$flags" list is not number', {
                $flags: flags
            });

            //if Reverse flag given
            if (flags & self.Reverse) {
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
        var result, i, item, length = me.private.items.length;

        //reduce
        if (reverse) {
            if (hasMemo) {
                i = length - 1;
                result = memo;
            } else {
                i = length - 2;
                result = me.private.items[length - 1].value;
            }

            for (; i >= 0; i--) {
                item = me.private.items[i];
                result = reducer.call(scope, result, item.value, item.key, me);
            }
        } else {
            if (hasMemo) {
                i = 0;
                result = memo;
            } else {
                i = 1;
                result = me.private.items[0].value;
            }

            for (; i < length; i++) {
                item = me.private.items[i];
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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.some = function (tester, count, scope) {
        var me = this, length = me.private.items.length;

        //assert that collection is not empty
        self.assert.ok(me.private.items.length, 'some - collection is empty');

        //assert that tester is function
        self.assert.fn(tester, 'some - given tester "$tester" is not a function', {
            $tester: tester
        });

        //default count to 1, if not given
        if (arguments.length < 2) {
            count = 1;
        }

        //check, that count is number and is in bounds
        self.assert.number(count, 'some - given count "$count" is not number', {
            $count: count
        });

        self.assert.ok(0 <= count && count <= length, 'some - given count "$count" is out of bounds [$min, $max]', {
            $count: count,
            $min: 0,
            $max: length
        });

        //default scope to me
        if (arguments.length < 3) {
            scope = me;
        }

        var i, item, found = 0;

        //handle negative scenario
        if (count === 0) {
            //iterate over me.private.items to find matches
            for (i = 0; i < length; i++) {
                item = me.private.items[i];

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
        //iterate over me.private.items to find matches
        for (i = 0; i < length; i++) {
            item = me.private.items[i];

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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.all = function (tester, scope) {
        var me = this;

        if (arguments.length >= 2) {

            return me.some(tester, me.private.items.length, scope);
        }

        return me.some(tester, me.private.items.length);
    };

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
     *     var collection = new xs.util.collection.Collection([
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
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.none = function (tester, scope) {
        var me = this;

        if (arguments.length >= 2) {

            return me.some(tester, 0, scope);
        }

        return me.some(tester, 0);
    };

    /**
     * Returns collection's subset with only white-listed keys, passed in array
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.util.collection.Collection([
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
     *     var pick = new xs.util.collection.Collection({
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
     * @return {xs.util.collection.Collection} collection of picked items
     */
    Class.method.pick = function (keys) {
        var me = this;

        //assert that keys is array
        self.assert.array(keys, 'pick - given keys list "$keys" is not array', {
            $keys: keys
        });


        var length = keys.length, key, i, ownKeys = me.keys(), index, item, items = [];
        for (i = 0; i < length; i++) {
            key = keys[i];

            //assert that key is string or number
            self.assert.ok(xs.isString(key) || xs.isNumber(key), 'pick - key "$key", given for collection, is neither number nor string', {
                $key: key
            });


            //handle key string - it's key
            if (xs.isString(key)) {
                index = ownKeys.indexOf(key);

                //assert that key exists
                self.assert.ok(index >= 0, 'pick - given key "$key" doesn\'t exist', {
                    $key: key
                });


                //handle number key - it's index
            } else {
                //check that index is in bounds
                var max = me.private.items.length - 1;
                //if max is 0, then min is 0
                var min = max > 0 ? -max : 0;

                //assert that index is in bounds
                self.assert.ok(min <= key && key <= max, 'pick - given index "$index" is out of bounds [$min, $max]', {
                    $index: key,
                    $min: min,
                    $max: max
                });

                //convert negative index
                if (key < 0) {
                    key += max + 1;
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
        var picked = me.clone();
        picked.private.items = items;

        //update indexes
        updateIndexes.call(picked, 0);

        return picked;
    };

    /**
     * Returns collection's subset without black-listed keys, passed in array
     *
     * For example:
     *
     *     //for Array
     *     console.log(new xs.util.collection.Collection([
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
     *     var omit = new xs.util.collection.Collection({
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
     * @return {xs.util.collection.Collection} collection of without omitted items
     */
    Class.method.omit = function (keys) {
        var me = this;

        //assert that keys is array
        self.assert.array(keys, 'omit - given keys list "$keys" is not array', {
            $keys: keys
        });


        var length = keys.length, key, i, ownKeys = me.keys(), maxIndex = ownKeys.length - 1, index, item, items = [];

        var omittedIndexes = [];
        //remove blacklisted items
        for (i = 0; i < length; i++) {
            key = keys[i];

            //assert that key is string or number
            self.assert.ok(xs.isString(key) || xs.isNumber(key), 'omit - key "$key", given for collection, is neither number nor string', {
                $key: key
            });


            //handle key string - it's key
            if (xs.isString(key)) {
                index = ownKeys.indexOf(key);

                //assert, that key exists
                self.assert.ok(index >= 0, 'omit - given key "$key" doesn\'t exist', {
                    $key: key
                });


                //handle number key - it's index
            } else {
                //check that index is in bounds
                var max = me.private.items.length - 1;
                //if max is 0, then min is 0
                var min = max > 0 ? -max : 0;

                //assert that index is in bounds
                self.assert.ok(min <= key && key <= max, 'omit - given index "$index" is out of bounds [$min, $max]', {
                    $index: key,
                    $min: min,
                    $max: max
                });

                //convert negative index
                if (key < 0) {
                    key += max + 1;
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
        var omitted = me.clone();
        omitted.private.items = items;

        //update indexes
        updateIndexes.call(omitted, 0);

        return omitted;
    };

    /**
     * Returns collection as hash of key=>value pairs
     *
     * For example:
     *
     *     //for Array
     *     var collection = new xs.util.collection.Collection([
     *         1,
     *         2,
     *         3
     *     ]);
     *     console.log(collection.toSource()); //{0: 1, 1: 2, 2: 3}
     *
     *     //for Object
     *     var collection = new xs.util.collection.Collection({
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
    Class.method.toSource = function () {
        var me = this;

        var source = {}, length = me.private.items.length, item;

        for (var i = 0; i < length; i++) {
            item = me.private.items[i];
            source[item.key] = item.value;
        }

        return source;
    };

    var getTypeKind = function (type) {
        if (xs.isClass(type)) {

            return 'class';
        } else if (xs.isInterface(type)) {

            return 'interface';
        }

        return isPrimitive(type) ? 'primitive' : 'constructor';
    };

    var isPrimitive = function (type) {
        return [
                String,
                Number,
                Boolean
            ].indexOf(type) >= 0;
    };

    var verifySourceValues = function (values) {
        var me = this;

        var type = me.private.type, kind = me.private.kind, i, length = values.length;

        //if class
        if (kind === 'class') {

            for (i = 0; i < length; i++) {

                //assert, that value is instance of type or Class, that mixes type
                self.assert.ok(isClassInstance.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class" of instance of class, that mixins "$Class"', {
                    $value: values[i],
                    $Class: type.label
                });
            }

            //if interface
        } else if (kind === 'interface') {

            for (i = 0; i < length; i++) {

                //assert, that value is instance of Class that implements type
                self.assert.ok(isImplementation.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of class, that implements interface "$Interface"', {
                    $value: values[i],
                    $Interface: type.label
                });
            }

            //if constructor
        } else if (kind === 'constructor') {

            for (i = 0; i < length; i++) {

                //assert, that value is instance of given constructor
                self.assert.ok(isInstance.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                    $value: values[i],
                    $Class: type
                });
            }

            //if primitive
        } else {

            for (i = 0; i < length; i++) {

                //assert, that value passes given primitive verifier
                self.assert.ok(isType.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                    $value: values[i],
                    $Class: type.name
                });
            }

        }

        return true;
    };

    var isValid = function (value) {
        var me = this;

        var type = me.private.type, kind = me.private.kind;

        //return true if not typed collection
        if (!type) {

            return true;
        }

        //if class
        if (kind === 'class') {

            //assert, that value is instance of type or Class, that mixes type
            self.assert.ok(isClassInstance.call(me, value), 'verifySourceValues - given value "$value" is not an instance of "$Class" of instance of class, that mixins "$Class"', {
                $value: value,
                $Class: type.label
            });

            //if interface
        } else if (kind === 'interface') {

            //assert, that value is instance of Class that implements type
            self.assert.ok(isImplementation.call(me, value), 'verifySourceValues - given value "$value" is not an instance of class, that implements interface "$Interface"', {
                $value: value,
                $Interface: type.label
            });

            //if constructor
        } else if (kind === 'constructor') {

            //assert, that value is instance of given constructor
            self.assert.ok(isInstance.call(me, value), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                $value: value,
                $Class: type
            });

            //if primitive
        } else {

            //assert, that value passes given primitive verifier
            self.assert.ok(isType.call(me, value), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                $value: value,
                $Class: type.name
            });

        }

        return true;
    };

    var isClassInstance = function (value) {
        var me = this;

        var type = me.private.type;

        self.assert.instance(value, type, 'isClassInstance - given value "$value" is not an instance of class "$Class"', {
            $value: value,
            $Class: type
        });

        return true;
    };

    var isImplementation = function (value) {
        var me = this;

        var type = me.private.type;

        //assert, that value is instance of some class
        self.assert.implements(value, type, 'isImplementation - given value "$value" is not an instance of class, that implements interface "$Interface"', {
            $value: value,
            $Interface: type
        });

        //get Class reference
        Class = value.self;

        return Class.implements(type);
    };

    var isInstance = function (value) {
        return value instanceof this.private.type;
    };

    var isType = function (value) {
        return value.constructor === this.private.type;
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
    var updateIndexes = function (index) {
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
});