/**
 * xs.storage.WebStorage is private singleton, that provides access to browser's Storage mechanisms
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @singleton
 *
 * @class xs.storage.WebStorage
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.WebStorage', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    /**
     * Storage flag, meaning, that operation is reverse
     *
     * @property Reverse
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Reverse = 0x1;

    /**
     * Storage flag, meaning, that operation is made for all matches.
     *
     * @property All
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.All = 0x2;

    /**
     * Storage reference.
     *
     * @private
     *
     * @property storage
     *
     * @type {Storage}
     */
    Class.constant.storage = undefined;

    /**
     * Collection length
     *
     * @property size
     *
     * @readonly
     *
     * @type Number
     */
    Class.static.property.size = {
        get: function () {
            return this.storage.length;
        },
        set: xs.noop
    };

    /**
     * Returns all storage keys
     *
     * @method keys
     *
     * @return {Array} storage keys
     */
    Class.static.method.keys = function () {
        return Object.keys(this.storage);
    };

    /**
     * Returns all storage values
     *
     * @method values
     *
     * @return {Array} storage values
     */
    Class.static.method.values = function () {
        var storage = this.storage;
        var size = storage.length;
        var values = [];

        for (var i = 0; i < size; i++) {
            values.push(storage.getItem(storage.key(i)));
        }

        return values;
    };

    /**
     * Returns whether storage has given key. Keys' comparison is strict, differing numbers and strings
     *
     * @method hasKey
     *
     * @param {String|Number} key key to lookup for
     *
     * @return {Boolean} whether storage has key
     */
    Class.static.method.hasKey = function (key) {
        var me = this;

        me.assert.ok(xs.isString(key), 'hasKey - key `$key`, given for storage, is not a string', {
            $key: key
        });

        //if it is string - it's key
        return me.keys().indexOf(key) >= 0;
    };

    /**
     * Returns whether storage has value
     *
     * @method has
     *
     * @param {*} value value to lookup for
     *
     * @return {Boolean} whether storage has value
     */
    Class.static.method.has = function (value) {

        return this.values().indexOf(value) >= 0;
    };

    /**
     * Returns key of storage value, equal to given. Supports Reverse flag, that will perform lookup from the end of the storage
     *
     * @method keyOf
     *
     * @param {*} value value to lookup for
     * @param {Number} [flags] optional lookup flags:
     * - Reverse - to lookup for value from the end of the storage
     *
     * @return {String|Number|undefined} found key, or undefined if nothing found
     */
    Class.static.method.keyOf = function (value, flags) {
        var me = this;
        var index;

        //assert that value is string
        me.assert.string(value, 'keyOf - given value `$value` is not a string', {
            $value: value
        });

        var values = me.values();

        if (arguments.length === 1) {
            index = values.indexOf(value);
        } else {
            //assert that flags is number
            me.assert.number(flags, 'keyOf - given flags `$flags` list is not number', {
                $flags: flags
            });

            if (flags & self.Reverse) {
                index = values.lastIndexOf(value);
            } else {
                index = values.indexOf(value);
            }
        }

        return index >= 0 ? me.storage.key(index) : undefined;
    };

    /**
     * Returns storage value for specified key
     *
     * @method at
     *
     * @param {String|Number} key value to lookup for
     *
     * @return {*} value with specified key
     */
    Class.static.method.at = function (key) {
        var me = this;

        //assert that storage is not empty
        me.assert.ok(me.storage.length, 'at - storage is empty');

        me.assert.string(key, 'at - key `$key`, given for storage, is not a string', {
            $key: key
        });

        var index = me.keys().indexOf(key);

        //check, that key exists
        me.assert.ok(index >= 0, 'at - given key `$key` doesn\'t exist', {
            $key: key
        });

        return me.storage.getItem(key);
    };

    /**
     * Adds value to storage
     *
     * @method add
     *
     * @param {String} key for array storage - added value. for storage - key of added value
     * @param {*} [value] value, added to storage
     *
     * @chainable
     */
    Class.static.method.add = function (key, value) {
        var me = this;

        //assert that key is string
        me.assert.string(key, 'add - key `$key`, given for storage, is not a string', {
            $key: key
        });

        //assert that key is not taken
        me.assert.ok(me.keys().indexOf(key) < 0, 'add - storage already has key `$key`', {
            $key: key
        });

        //assert that value is string
        me.assert.string(value, 'add - value `$value`, given for storage, is not a string', {
            $value: value
        });


        //add item
        me.storage.setItem(key, value);

        return me;
    };

    /**
     * Sets value for item by specified key
     *
     * @method set
     *
     * @param {String|Number} key key of changed value
     * @param {*} value value new value for item with given key
     *
     * @chainable
     */
    Class.static.method.set = function (key, value) {
        var me = this;

        me.assert.string(key, 'set - key `$key`, given for storage, is not a string', {
            $key: key
        });

        //assert that value is string
        me.assert.string(value, 'add - value `$value`, given for storage, is not a string', {
            $value: value
        });


        //handle number key - it's index
        var index = me.keys().indexOf(key);

        //assert that key exists
        me.assert.ok(index >= 0, 'set - given key `$key` doesn\'t exist', {
            $key: key
        });

        me.storage.setItem(key, value);

        return me;
    };

    /**
     * Deletes value with given key
     *
     * @method removeAt
     *
     * @param {Number|String} key key of removed value
     *
     * @chainable
     */
    Class.static.method.removeAt = function (key) {
        var me = this;

        me.assert.string(key, 'removeAt - key `$key`, given for storage, is not a string', {
            $key: key
        });

        //get index
        var index = me.keys().indexOf(key);

        //assert that key exists
        me.assert.ok(index >= 0, 'removeAt - given key `$key` doesn\'t exist in storage', {
            $key: key
        });

        //remove item from storage
        me.storage.removeItem(key);

        return me;
    };

    /**
     * Deletes value from storage, truncates storage
     *
     * @method remove
     *
     * @param {*} [value] removed value. If not given - storage wil be truncated
     * @param {Number} [flags] optional remove flags:
     * - Reverse - to lookup for value from the end of the storage
     * - All - to remove all matches
     *
     * @chainable
     */
    Class.static.method.remove = function (value, flags) {
        var me = this;
        var values = me.values();

        //remove all if no value given
        if (!arguments.length) {
            me.storage.clear();

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
            me.assert.number(flags, 'remove - given flags `$flags` list is not number', {
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
        me.assert.ok(index >= 0, 'remove - given value doesn\'t exist in storage');

        var key;
        var storage = me.storage;

        //if all flag is given
        if (all) {
            var i = 0;
            var item;

            //remove all occurrences of value in storage
            while (i < storage.length) {
                key = storage.key(i);
                item = storage.getItem(key);

                //if item is not equal to value - continue with next item
                if (item !== value) {
                    i++;
                    continue;
                }

                //remove item from storage
                storage.removeItem(key);
            }

        } else {

            key = storage.key(index);

            //remove item from items
            storage.removeItem(key);
        }

        return me;
    };

    /**
     * Deletes value from storage, if it matches given fn function. Function's arguments are: value, key
     *
     * @method removeBy
     *
     * @param {Function} fn function, that returns whether to remove value or not
     * @param {Number} [flags] optional remove flags:
     * - Reverse - to lookup for value from the end of the storage
     * - All - to remove all matches
     *
     * @chainable
     */
    Class.static.method.removeBy = function (fn, flags) {
        var me = this;

        //assert that fn is function
        me.assert.fn(fn, 'removeBy - given fn `$fn` is not a function', {
            $fn: fn
        });

        var all = false;
        var reverse = false;

        //handle flags
        if (arguments.length > 1) {

            //assert that flags is number
            me.assert.number(flags, 'removeBy - given flags `$flags` list is not number', {
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
        var storage = me.storage;
        var i, key, item;

        if (all) {
            i = 0;
            //remove all matched occurrences from storage
            while (i < storage.length) {
                key = storage.key(i);
                item = storage.getItem(key);

                //if item does not match - continue with next item
                if (!fn(item, key)) {
                    //increment index
                    i++;

                    continue;
                }

                //remove item from storage
                storage.removeItem(key);
            }
        } else if (reverse) {
            i = storage.length - 1;
            //remove all matched occurrences from storage
            while (i >= 0) {
                key = storage.key(i);
                item = storage.getItem(key);

                //if item does not match - continue with next item
                if (!fn(item, key)) {
                    //decrement index
                    i--;

                    continue;
                }

                //remove item from storage
                storage.removeItem(key);

                break;
            }
        } else {
            i = 0;
            //remove first matched occurrence from storage
            while (i < storage.length) {
                key = storage.key(i);
                item = storage.getItem(key);

                //if item does not match - continue with next item
                if (!fn(item, key)) {
                    //increment index
                    i++;

                    continue;
                }

                //remove item from storage
                storage.removeItem(key);

                break;
            }
        }

        return me;
    };

    /**
     * Iterates over storage in direct or reverse order via calling given fn function
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
    Class.static.method.each = function (fn, flags, scope) {
        var me = this;

        //assert that fn is function
        me.assert.fn(fn, 'each - given fn `$fn` is not a function', {
            $fn: fn
        });

        //handle flags
        var reverse = false;

        if (arguments.length >= 2) {

            //assert that flags is number
            me.assert.number(flags, 'each - given flags `$flags` list is not number', {
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
        var storage = me.storage;
        var length = storage.length;
        var i, key, item;

        if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                key = storage.key(i);
                item = storage.getItem(key);
                fn.call(scope, item, key, me);
            }
        } else {
            for (i = 0; i < length; i++) {
                key = storage.key(i);
                item = storage.getItem(key);
                fn.call(scope, item, key, me);
            }
        }

        return me;
    };

    /**
     * Returns storage item|items, that passed given fn function
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
    Class.static.method.find = function (fn, flags, scope) {
        var me = this;

        //assert that fn is function
        me.assert.fn(fn, 'find - given fn `$fn` is not a function', {
            $fn: fn
        });

        //handle flags
        var all = false;
        var reverse = false;

        if (arguments.length >= 2) {

            //assert that flags is number
            me.assert.number(flags, 'find - given flags `$flags` list is not number', {
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
        var storage = me.storage;
        var length = storage.length;
        var i, key, item, found;

        if (all) {
            //copies of matched items
            var items = [];

            for (i = 0; i < length; i++) {
                key = storage.key(i);
                item = storage.getItem(key);

                if (fn.call(scope, item, key, me)) {
                    //add index
                    items.push({
                        key: key,
                        value: item
                    });
                }
            }

            found = new xs.core.Collection();
            found.private.items = items;
        } else if (reverse) {
            for (i = length - 1; i >= 0; i--) {
                key = storage.key(i);
                item = storage.getItem(key);

                if (fn.call(scope, item, key, me)) {
                    found = item;
                    break;
                }
            }
        } else {
            for (i = 0; i < length; i++) {
                key = storage.key(i);
                item = storage.getItem(key);

                if (fn.call(scope, item, key, me)) {
                    found = item;
                    break;
                }
            }
        }

        return found;
    };

    /**
     * Returns storage as hash of key=>value pairs
     *
     * @method toSource
     *
     * @return {Object} storage as hash
     */
    Class.static.method.toSource = function () {
        var me = this;

        var source = {};
        var storage = me.storage;
        var length = storage.length;
        var key, item;

        for (var i = 0; i < length; i++) {
            key = storage.key(i);
            item = storage.getItem(key);
            source[ key ] = item;
        }

        return source;
    };

});