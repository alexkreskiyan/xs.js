'use strict';

//define xs.core
if (!xs.core) {
    xs.core = {};
}

var assert;


/**
 * xs.core.Collection is core framework class, that is used for internal collections
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.core.Collection
 *
 *
 *
 * @constructor
 *
 * xs.core.Collection constructor
 *
 * @param {Array|Object} [values] collection source
 */
var Collection = xs.core.Collection = function (values) {
    var me = this;

    //init items array
    me.private = {
        items: []
    };

    if (!arguments.length) {

        return;
    }

    assert.ok(xs.isArray(values) || xs.isObject(values), 'constructor - type `$values` is nor array neither object', {
        $values: values
    });

    var i, valuesLength;


    //handle array source
    if (xs.isArray(values)) {
        //get valuesLength
        valuesLength = values.length;

        for (i = 0; i < valuesLength; i++) {
            //add item
            me.private.items.push({
                key: i,
                value: values[ i ]
            });
        }

        return;
    }


    //handle hash source
    //get keys and valuesLength
    var keys = Object.keys(values);
    var key;
    valuesLength = keys.length;

    for (i = 0; i < valuesLength; i++) {
        key = keys[ i ];
        //add item
        me.private.items.push({
            key: key,
            value: values[ key ]
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
Collection.Reverse = 0x1;

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
Collection.All = 0x2;

/**
 * Collection size
 *
 * @property size
 *
 * @readonly
 *
 * @type Number
 */
Object.defineProperty(Collection.prototype, 'size', {
    get: function () {
        return this.private.items.length;
    },
    set: xs.noop
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
Collection.prototype.keys = function () {
    var me = this;

    var keys = [];
    var length = me.private.items.length;

    for (var i = 0; i < length; i++) {
        keys.push(me.private.items[ i ].key);
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
Collection.prototype.values = function () {
    var me = this;

    var values = [];
    var length = me.private.items.length;

    for (var i = 0; i < length; i++) {
        values.push(me.private.items[ i ].value);
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
Collection.prototype.clone = function () {
    var me = this;
    var source = [];
    var length = me.private.items.length;
    var item;

    for (var i = 0; i < length; i++) {
        item = me.private.items[ i ];
        source.push({
            key: item.key,
            value: item.value
        });
    }


    var clone = new me.constructor();
    clone.private.items = source;

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
Collection.prototype.hasKey = function (key) {
    var me = this;

    assert.ok(xs.isNumber(key) || xs.isString(key), 'hasKey - key `$key`, given for collection, is neither number nor string', {
        $key: key
    });

    //if key is number - it's index
    if (xs.isNumber(key)) {

        //check, that key exists
        return key >= 0 && key < me.private.items.length;
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
Collection.prototype.has = function (value) {

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
 *     console.log(collection.keyOf(value, xs.core.Collection.Reverse)); //5
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
 *     console.log(collection.keyOf(value, xs.core.Collection.Reverse)); //'e'
 *
 * @method keyOf
 *
 * @param {*} value value to lookup for
 * @param {Number} [flags] optional lookup flags:
 * - Reverse - to lookup for value from the end of the collection
 *
 * @return {String|Number|undefined} found key, or undefined if nothing found
 */
Collection.prototype.keyOf = function (value, flags) {
    var me = this;
    var index;
    var values = me.values();

    if (arguments.length === 1) {
        index = values.indexOf(value);
    } else {
        //assert that flags is number
        assert.number(flags, 'keyOf - given flags `$flags` list is not number', {
            $flags: flags
        });

        if (flags & xs.core.Collection.Reverse) {
            index = values.lastIndexOf(value);
        } else {
            index = values.indexOf(value);
        }
    }

    return index >= 0 ? me.private.items[ index ].key : undefined;
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
Collection.prototype.at = function (key) {
    var me = this;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'at - collection is empty');

    assert.ok(xs.isNumber(key) || xs.isString(key), 'at - key `$key`, given for collection, is neither number nor string', {
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

        assert.ok(min <= index && index <= max, 'at - index `$index` is out of bounds [$min,$max]', {
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
        assert.ok(index >= 0, 'at - given key `$key` doesn\'t exist', {
            $key: key
        });
    }

    return me.private.items[ index ].value;
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
Collection.prototype.first = function () {
    var me = this;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'first - collection is empty');

    return me.private.items[ 0 ].value;
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
Collection.prototype.last = function () {
    var me = this;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'last - collection is empty');

    return me.private.items[ me.private.items.length - 1 ].value;
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
Collection.prototype.add = function (key, value) {
    var me = this;

    //assert that arguments given
    assert.ok(arguments.length, 'add - empty arguments');

    if (arguments.length === 1) {
        //handle autoincrement index
        value = key;
        key = me.private.items.length;
    } else {

        //assert that key is string
        assert.string(key, 'add - key `$key`, given for collection, is not a string', {
            $key: key
        });

        //assert that key is not taken
        assert.ok(me.keys().indexOf(key) < 0, 'add - collection already has key `$key`', {
            $key: key
        });
    }


    //add item
    me.private.items.push({
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
Collection.prototype.insert = function (index, key, value) {
    var me = this;

    //assert that arguments enough
    assert.ok(arguments.length >= 2, 'insert - no enough arguments');

    //assert that index is number
    assert.number(index, 'insert - given index `$index` is not number', {
        $index: index
    });

    var max = me.private.items.length;
    //if max is 0, then min is 0
    var min = max > 0 ? -max : 0;

    //check that index is in bounds
    assert.ok(min <= index && index <= max, 'insert - index `$index` is out of bounds [$min, $max]', {
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
        assert.string(key, 'insert - key `$key`, given for collection, is not a string', {
            $key: key
        });

        //assert that key is not taken
        assert.ok(me.keys().indexOf(key) < 0, 'insert - collection already has key `$key`', {
            $key: key
        });
    }


    //insert
    //insert new item
    me.private.items.splice(index, 0, {
        key: key,
        value: value
    });

    //updated indexes
    updateIndexes.call(me, index + 1);

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
Collection.prototype.set = function (key, value) {
    var me = this;

    //assert that arguments enough
    assert.ok(arguments.length >= 2, 'set - no enough arguments');

    assert.ok(xs.isNumber(key) || xs.isString(key), 'set - key `$key`, given for collection, is neither number nor string', {
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
        assert.ok(min <= index && index <= max, 'set - index `$index` is out of bounds [$min, $max]', {
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
        assert.ok(index >= 0, 'set - given key `$key` doesn\'t exist', {
            $key: key
        });
    }


    me.private.items[ index ].value = value;

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
Collection.prototype.removeAt = function (key) {
    var me = this;

    assert.ok(xs.isNumber(key) || xs.isString(key), 'removeAt - key `$key`, given for collection, is neither number nor string', {
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
        assert.ok(min <= index && index <= max, 'removeAt - index `$index` is out of bounds [$min, $max]', {
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
        assert.ok(index >= 0, 'removeAt - given key `$key` doesn\'t exist in collection', {
            $key: key
        });
    }

    //remove item from items
    me.private.items.splice(index, 1);

    //update indexes
    updateIndexes.call(me, index);

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
 *     collection.remove(value, xs.core.Collection.Reverse);
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
 *     collection.remove(value, xs.core.Collection.All);
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
 *     collection.remove(value, xs.core.Collection.Reverse);
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
 *     collection.remove(value, xs.core.Collection.All);
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
Collection.prototype.remove = function (value, flags) {
    var me = this;
    var values = me.values();

    //remove all if no value given
    if (!arguments.length) {
        me.private.items.splice(0, me.private.items.length);

        return me;
    }

    var index;
    var all = false;
    //if no flags - remove first occurrence of value
    if (arguments.length === 1) {
        index = values.indexOf(value);

        //handle flags
    } else {
        //assert that flags is number
        assert.number(flags, 'remove - given flags `$flags` list is not number', {
            $flags: flags
        });

        //if All flag given - no index is needed
        if (flags & xs.core.Collection.All) {
            index = values.indexOf(value);
            all = true;
            //if Reverse flag given - last value occurrence is looked up for
        } else if (flags & xs.core.Collection.Reverse) {
            index = values.lastIndexOf(value);
            //else - first value occurrence is looked up for
        } else {
            index = values.indexOf(value);
        }
    }


    //assert, that item exists
    assert.ok(index >= 0, 'remove - given value doesn\'t exist in collection');

    var item;
    //if all flag is given
    if (all) {
        var i = 0;
        var items = me.private.items;

        //remove all occurrences of value in collection
        while (i < items.length) {
            item = items[ i ];

            //if item.value is not equal to value - continue with next item
            if (item.value !== value) {
                i++;
                continue;
            }

            //remove item from collection
            me.private.items.splice(i, 1);
        }

        //update indexes if anything removed
        if (me.private.items.length < values.length) {
            updateIndexes.call(me, index);
        }
    } else {

        //remove item from items
        me.private.items.splice(index, 1);

        //update indexes
        updateIndexes.call(me, index);
    }

    return me;
};

/**
 * Deletes value from collection, if it matches given fn function. Function's arguments are: value, key
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
 *     }, xs.core.Collection.Reverse);
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
 *     }, xs.core.Collection.All);
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
 *     }, xs.core.Collection.Reverse);
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
 *     }, xs.core.Collection.All);
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
 * @param {Function} fn function, that returns whether to remove value or not
 * @param {Number} [flags] optional remove flags:
 * - Reverse - to lookup for value from the end of the collection
 * - All - to remove all matches
 *
 * @chainable
 */
Collection.prototype.removeBy = function (fn, flags) {
    var me = this;

    //assert that fn is function
    assert.fn(fn, 'removeBy - given fn `$fn` is not a function', {
        $fn: fn
    });

    var all = false;
    var reverse = false;
    //handle flags
    if (arguments.length > 1) {

        //assert that flags is number
        assert.number(flags, 'removeBy - given flags `$flags` list is not number', {
            $flags: flags
        });

        //if All flag given - order does not matter
        if (flags & xs.core.Collection.All) {
            all = true;
            //if Reverse flag given - last value occurrence is looked up for
        } else if (flags & xs.core.Collection.Reverse) {
            reverse = true;
        }
    }

    //init variables
    var items = me.private.items;
    var i, item;
    var length = items.length;

    if (all) {
        i = 0;
        //remove all matched occurrences from collection
        while (i < items.length) {
            item = items[ i ];

            //if item does not match - continue with next item
            if (!fn(item.value, item.key)) {
                //increment index
                i++;

                continue;
            }

            //remove item from collection
            items.splice(i, 1);
        }
    } else if (reverse) {
        i = items.length - 1;
        //remove all matched occurrences from collection
        while (i >= 0) {
            item = items[ i ];

            //if item does not match - continue with next item
            if (!fn(item.value, item.key)) {
                //decrement index
                i--;

                continue;
            }

            //remove item from collection
            items.splice(i, 1);

            break;
        }
    } else {
        i = 0;
        //remove first matched occurrence from collection
        while (i < items.length) {
            item = items[ i ];

            //if item does not match - continue with next item
            if (!fn(item.value, item.key)) {
                //increment index
                i++;

                continue;
            }

            //remove item from collection
            items.splice(i, 1);

            break;
        }
    }

    //update indexes if anything removed
    if (items.length < length) {
        updateIndexes.call(me, 0);
    }

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
Collection.prototype.shift = function () {
    var me = this;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'shift - collection is empty');


    //get returned value
    var value = me.private.items[ 0 ].value;

    //remove first item from collection
    me.private.items.splice(0, 1);

    updateIndexes.call(me, 0);

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
Collection.prototype.pop = function () {
    var me = this;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'pop - collection is empty');


    var index = me.private.items.length - 1;

    //get returned value
    var value = me.private.items[ index ].value;

    //remove last item from collection
    me.private.items.splice(-1, 1);

    //return value
    return value;
};

/**
 * Iterates over collection in direct or reverse order via calling given fn function
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
 *     }, scope, xs.core.Collection.Reverse);
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
 *     }, scope, xs.core.Collection.Reverse);
 *     //outputs:
 *     // {x:1}, {}, b, collection
 *     // {x:1}, 2, c, collection
 *     // {x:1}, 1, a, collection
 *
 * @method each
 *
 * @param {Function} fn list fn
 * @param {Number} [flags] additional iterating flags:
 * - Reverse - to iterate in reverse order
 * @param {Object} [scope] optional scope
 *
 * @chainable
 */
Collection.prototype.each = function (fn, flags, scope) {
    var me = this;

    //assert that fn is function
    assert.fn(fn, 'each - given fn `$fn` is not a function', {
        $fn: fn
    });

    //handle flags
    var reverse = false;

    if (arguments.length >= 2) {

        //assert that flags is number
        assert.number(flags, 'each - given flags `$flags` list is not number', {
            $flags: flags
        });

        //if Reverse flag given - last value occurrence is looked up for
        if (flags & xs.core.Collection.Reverse) {
            reverse = true;
        }
    }

    //default scope to me
    if (arguments.length < 3) {
        scope = me;
    }

    //iterate
    var i, item;
    var length = me.private.items.length;

    if (reverse) {
        for (i = length - 1; i >= 0; i--) {
            item = me.private.items[ i ];
            fn.call(scope, item.value, item.key, me);
        }
    } else {
        for (i = 0; i < length; i++) {
            item = me.private.items[ i ];
            fn.call(scope, item.value, item.key, me);
        }
    }

    return me;
};

/**
 * Returns collection item|items, that passed given fn function
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
 *     // {x: 2}, reference to collection[0], first value, passed fn function
 *     console.log(collection.find(function(value, key) {
 *         return this.sum(key, value.x) === 2;
 *     }, scope, xs.core.Collection.Reverse));
 *     //outputs:
 *     // {x: 0}, reference to collection[2], first value, passed fn function
 *     console.log(collection.find(function(value, key) {
 *         return this.sum(key, value.x) >= 2;
 *     }, scope, xs.core.Collection.All));
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
 *     // {x: 2}, reference to collection[0], first value, passed fn function
 *     console.log(collection.find(function(value, key) {
 *         return this.first(key) === 'a';
 *     }, scope, xs.core.Collection.Reverse));
 *     //outputs:
 *     // {x: 0}, reference to collection[2], first value, passed fn function
 *     console.log(collection.find(function(value, key) {
 *         return this.first(key) === 'a';
 *     }, scope, xs.core.Collection.All));
 *     //outputs:
 *     //{
 *     //    aa: {x: 2},
 *     //    ab: {x: 0}
 *     //}
 *
 * @method find
 *
 * @param {Function} fn function, returning true if value matches given conditions
 * @param {Number} [flags] additional search flags:
 * - All - to find all matches
 * @param {Object} [scope] optional scope
 *
 * @return {*|xs.core.Collection} found value, undefined if nothing found, or xs.core.Collection with results if All flag was given
 */
Collection.prototype.find = function (fn, flags, scope) {
    var me = this;

    //assert that fn is function
    assert.fn(fn, 'find - given fn `$fn` is not a function', {
        $fn: fn
    });

    //handle flags
    var all = false;
    var reverse = false;

    if (arguments.length >= 2) {

        //assert that flags is number
        assert.number(flags, 'find - given flags `$flags` list is not number', {
            $flags: flags
        });

        //if All flag given
        if (flags & xs.core.Collection.All) {
            all = true;
            //else - if Reverse flag given
        } else if (flags & xs.core.Collection.Reverse) {
            reverse = true;
        }
    }

    //default scope to me
    if (arguments.length < 3) {
        scope = me;
    }

    //init variables
    var i, item, found;
    var length = me.private.items.length;

    if (all) {
        //copies of matched items
        var items = [];

        for (i = 0; i < length; i++) {
            item = me.private.items[ i ];

            if (fn.call(scope, item.value, item.key, me)) {
                //add index
                items.push({
                    key: item.key,
                    value: item.value
                });
            }
        }

        found = new me.constructor();
        found.private.items = items;
    } else if (reverse) {
        for (i = length - 1; i >= 0; i--) {
            item = me.private.items[ i ];

            if (fn.call(scope, item.value, item.key, me)) {
                found = item.value;
                break;
            }
        }
    } else {
        for (i = 0; i < length; i++) {
            item = me.private.items[ i ];

            if (fn.call(scope, item.value, item.key, me)) {
                found = item.value;
                break;
            }
        }
    }

    return found;
};

/**
 * Produces a new list with values, returned by fn function
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
 * @param {Function} fn mapping function
 * @param {Object} [scope] optional scope
 *
 * @return {Array|Object} Mapping result
 */
Collection.prototype.map = function (fn, scope) {
    var me = this;

    //assert that fn is function
    assert.fn(fn, 'map - given fn `$fn` is not a function', {
        $fn: fn
    });


    //default scope to me
    if (arguments.length < 2) {
        scope = me;
    }

    //init variables
    var i, item;
    var length = me.private.items.length;

    //mapped items
    var items = [];

    for (i = 0; i < length; i++) {
        item = me.private.items[ i ];
        items.push({
            key: item.key,
            value: fn.call(scope, item.value, item.key, me)
        });
    }

    var collection = me.clone();
    collection.private.items = items;

    return collection;
};

/**
 * Reduces collection values by fn function
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
 *     }, scope, xs.core.Collection.Reverse, 5));
 *     //outputs:
 *     // 22, evaluated as 5 + (2 + 4 * 2) + (1 + 2 * 2) + (0 + 1 * 2)
 *     console.log(collection.reduce(function(memo, value, key) {
 *         return memo + key + 2 * value;
 *     }, scope, xs.core.Collection.Reverse));
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
 *     }, scope, xs.core.Collection.Reverse, 5));
 *     //outputs:
 *     // '5b8c4a2', evaluated as 5 + ('b' + 2 * 4) + ('c' + 2 * 2) + ('a' + 1 * 2)
 *     console.log(collection.reduce(function(memo, value, key) {
 *         return memo + key + 2 * value;
 *     }, scope, xs.core.Collection.Reverse));
 *     //outputs:
 *     // '4c4a2', evaluated as 4 + ('c' + 2 * 2) + ('a' + 1 * 2)
 *
 * @method reduce
 *
 * @param {Function} fn reducing function
 * @param {Number} [flags] additional iterating flags:
 * - Reverse - to reduce in reverse order
 * @param {Object} [scope] optional scope
 * @param {*} [memo] initial value. Is optional. If omitted, first value's value is shifted from list and used as memo
 *
 * @return {*} Reducing result
 */
Collection.prototype.reduce = function (fn, flags, scope, memo) {
    var me = this;

    //assert that fn is function
    assert.fn(fn, 'reduce - given fn `$fn` is not a function', {
        $fn: fn
    });

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'reduce - collection is empty');

    //handle flags
    var reverse = false;

    if (arguments.length >= 2) {

        //assert that flags is number
        assert.number(flags, 'reduce - given flags `$flags` list is not number', {
            $flags: flags
        });

        //if Reverse flag given
        if (flags & xs.core.Collection.Reverse) {
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
    var result, i, item;
    var length = me.private.items.length;

    //reduce
    if (reverse) {
        if (hasMemo) {
            i = length - 1;
            result = memo;
        } else {
            i = length - 2;
            result = me.private.items[ length - 1 ].value;
        }

        for (; i >= 0; i--) {
            item = me.private.items[ i ];
            result = fn.call(scope, result, item.value, item.key, me);
        }
    } else {
        if (hasMemo) {
            i = 0;
            result = memo;
        } else {
            i = 1;
            result = me.private.items[ 0 ].value;
        }

        for (; i < length; i++) {
            item = me.private.items[ i ];
            result = fn.call(scope, result, item.value, item.key, me);
        }
    }

    return result;
};

/**
 * Returns whether count of list values pass fn function
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
 * @param {Function} fn fn function
 * @param {Number} [count] count of values needed to resolve as true
 * @param {Object} [scope] optional scope
 *
 * @return {Boolean} whether some values pass fn function
 */
Collection.prototype.some = function (fn, count, scope) {
    var me = this;
    var length = me.private.items.length;

    //assert that collection is not empty
    assert.ok(me.private.items.length, 'some - collection is empty');

    //assert that fn is function
    assert.fn(fn, 'some - given fn `$fn` is not a function', {
        $fn: fn
    });

    //default count to 1, if not given
    if (arguments.length < 2) {
        count = 1;
    }

    //check, that count is number and is in bounds
    assert.number(count, 'some - given count `$count` is not number', {
        $count: count
    });

    assert.ok(count >= 0 && count <= length, 'some - given count `$count` is out of bounds [$min, $max]', {
        $count: count,
        $min: 0,
        $max: length
    });

    //default scope to me
    if (arguments.length < 3) {
        scope = me;
    }

    var i, item;
    var found = 0;

    //handle negative scenario
    if (count === 0) {
        //iterate over me.private.items to find matches
        for (i = 0; i < length; i++) {
            item = me.private.items[ i ];

            //increment found if fn returns true
            if (fn.call(scope, item.value, item.key, me)) {
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
        item = me.private.items[ i ];

        //increment found if fn returns true
        if (fn.call(scope, item.value, item.key, me)) {
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
 * Returns whether all of list values pass fn function
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
 *     var collection = new xs.core.Collection({
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
 * @param {Function} fn fn function
 * @param {Object} [scope] optional scope
 *
 * @return {Boolean} whether all values pass fn function
 */
Collection.prototype.all = function (fn, scope) {
    var me = this;

    if (arguments.length >= 2) {

        return me.some(fn, me.private.items.length, scope);
    }

    return me.some(fn, me.private.items.length);
};

/**
 * Returns whether none of list values pass fn function
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
 *     var collection = new xs.core.Collection({
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
 * @param {Function} fn fn function
 * @param {Object} [scope] optional scope
 *
 * @return {Boolean} whether none values pass fn function
 */
Collection.prototype.none = function (fn, scope) {
    var me = this;

    if (arguments.length >= 2) {

        return me.some(fn, 0, scope);
    }

    return me.some(fn, 0);
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
Collection.prototype.unique = function () {
    var me = this;
    var values = [];
    var i = 0;
    var item;
    var length = me.private.items.length;

    while (i < length) {
        item = me.private.items[ i ];

        //continue to next if no match
        if (values.indexOf(item.value) < 0) {

            //add value to values
            values.push(item.value);

            //increment index
            i++;

            continue;
        }

        //remove item from me.private.items
        me.private.items.splice(i, 1);

        //decrement length
        length--;
    }

    //update indexes
    updateIndexes.call(me, 0);

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
Collection.prototype.pick = function (keys) {
    var me = this;

    //assert that keys is array
    assert.array(keys, 'pick - given keys list `$keys` is not array', {
        $keys: keys
    });


    var length = keys.length;
    var key, i, index, item;
    var ownKeys = me.keys();
    var items = [];

    for (i = 0; i < length; i++) {
        key = keys[ i ];

        //assert that key is string or number
        assert.ok(xs.isString(key) || xs.isNumber(key), 'pick - key `$key`, given for collection, is neither number nor string', {
            $key: key
        });


        //handle key string - it's key
        if (xs.isString(key)) {
            index = ownKeys.indexOf(key);

            //assert that key exists
            assert.ok(index >= 0, 'pick - given key `$key` doesn\'t exist', {
                $key: key
            });


            //handle number key - it's index
        } else {
            //check that index is in bounds
            var max = me.private.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            assert.ok(min <= key && key <= max, 'pick - given index `$index` is out of bounds [$min, $max]', {
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
        item = me.private.items[ index ];

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
Collection.prototype.omit = function (keys) {
    var me = this;

    //assert that keys is array
    assert.array(keys, 'omit - given keys list `$keys` is not array', {
        $keys: keys
    });


    var length = keys.length;
    var key, i, index, item;
    var ownKeys = me.keys();
    var maxIndex = ownKeys.length - 1;
    var items = [];

    var omittedIndexes = [];

    //remove blacklisted items
    for (i = 0; i < length; i++) {
        key = keys[ i ];

        //assert that key is string or number
        assert.ok(xs.isString(key) || xs.isNumber(key), 'omit - key `$key`, given for collection, is neither number nor string', {
            $key: key
        });


        //handle key string - it's key
        if (xs.isString(key)) {
            index = ownKeys.indexOf(key);

            //assert, that key exists
            assert.ok(index >= 0, 'omit - given key `$key` doesn\'t exist', {
                $key: key
            });


            //handle number key - it's index
        } else {
            //check that index is in bounds
            var max = me.private.items.length - 1;
            //if max is 0, then min is 0
            var min = max > 0 ? -max : 0;

            //assert that index is in bounds
            assert.ok(min <= key && key <= max, 'omit - given index `$index` is out of bounds [$min, $max]', {
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

        item = me.private.items[ i ];
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
 * @method toSource
 *
 * @return {Object} collection as hash
 */
Collection.prototype.toSource = function () {
    var me = this;

    var source = {};
    var length = me.private.items.length;
    var item;

    for (var i = 0; i < length; i++) {
        item = me.private.items[ i ];
        source[ item.key ] = item.value;
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
function updateIndexes(index) {
    var me = this;
    var length = me.private.items.length;

    //updated indexes for all items, starting from given index
    for (var i = index; i < length; i++) {
        var item = me.private.items[ i ];

        //update if is number
        if (xs.isNumber(item.key)) {
            item.key = i;
        }
    }
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreCollectionError
 */
function XsCoreCollectionError(message) {
    this.message = 'xs.core.Collection::' + message;
}

XsCoreCollectionError.prototype = new Error();

//hook method to create asserter
Collection.hookReady = function () {
    assert = new xs.core.Asserter(new xs.log.Logger('xs.core.Collection'), XsCoreCollectionError);
    delete Collection.hookReady;
};