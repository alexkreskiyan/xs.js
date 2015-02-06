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

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.events = {};

    /**
     * xs.util.Collection constructor
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
        xs.assert.ok(xs.isArray(values) || xs.isObject(values), 'constructor - values "$values" is nor array neither object', {
            $values: values
        }, CollectionError);

        //assert, that type is function (if given as second argument)
        xs.assert.ok(arguments.length === 1 || xs.isFunction(type), 'constructor - type "$type" is not a function', {
            $type: type
        }, CollectionError);

        //save type if given
        if (type) {
            me.private.kind = getTypeKind(type);
            me.private.type = getType(me.private.kind, type);
        }

        //verify values (if type given)
        xs.assert.ok(!type || verifySourceValues.call(me, xs.isArray(values) ? values : (new xs.core.Collection(values)).values()));

        var i, valuesLength;

        //handle array source
        if (xs.isArray(values)) {

            //get valuesLength
            valuesLength = values.length;

            for (i = 0; i < valuesLength; i++) {

                //add item
                me.private.items.push({
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

    var getTypeKind = function (type) {
        if (type.contractor === xs.Class) {

            return 'class';
        } else if (type.contractor === xs.Interface) {

            return 'interface';
        }

        var primitiveHandler = getPrimitiveHandler(type);

        return primitiveHandler ? 'primitive' : 'constructor';
    };

    var getType = function (kind, type) {
        if (kind === 'primitive') {

            return getPrimitiveHandler(type);
        }

        return type;
    };

    var getPrimitiveHandler = function (type) {
        switch (type) {
            case String:
                return xs.isString;
            case Number:
                return xs.isNumber;
            case Boolean:
                return xs.isBoolean;
        }
    };

    var verifySourceValues = function (values) {
        var me = this;

        var type = me.private.type, kind = me.private.kind, i, valuesLength = values.length;

        //if class
        if (kind === 'class') {

            for (i = 0; i < valuesLength; i++) {

                //assert, that value is instance of type or Class, that mixes type
                xs.assert.ok(isClassInstance.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class" of instance of class, that mixins "$Class"', {
                    $value: values[i],
                    $Class: type.label
                });
            }

            //if interface
        } else if (kind === 'interface') {

            for (i = 0; i < valuesLength; i++) {

                //assert, that value is instance of Class that implements type
                xs.assert.ok(isImplementation.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of class, that implements interface "$Interface"', {
                    $value: values[i],
                    $Interface: type.label
                });
            }

            //if constructor
        } else if (kind === 'constructor') {

            for (i = 0; i < valuesLength; i++) {

                //assert, that value is instance of given constructor
                xs.assert.ok(isInstance.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                    $value: values[i],
                    $Class: type
                });
            }

            //if primitive
        } else {

            for (i = 0; i < valuesLength; i++) {

                //assert, that value passes given primitive verifier
                xs.assert.ok(isType.call(me, values[i]), 'verifySourceValues - given value "$value" is not an instance of "$Class"', {
                    $value: values[i],
                    $Class: type.name
                });
            }

        }

        return true;
    };

    var isClassInstance = function (value) {
        var me = this;

        var type = me.private.type;

        //assert, that value is object
        xs.assert.object(value, 'isClassInstance - given value "$value" is not an object', {
            $value: value
        }, CollectionError);

        //assert, that value is instance of some class
        xs.assert.ok(xs.isFunction(value.self) && value.self.contractor === xs.Class, 'isClassInstance - given value "$value" is not an instance of any xs.Class', {
            $value: value
        }, CollectionError);

        //get Class reference
        Class = value.self;

        return (Class === type) || Class.mixins(type);
    };

    var isImplementation = function (value) {
        var me = this;

        var type = me.private.type;

        //assert, that value is object
        xs.assert.object(value, 'isImplementation - given value "$value" is not an object', {
            $value: value
        }, CollectionError);

        //assert, that value is instance of some class
        xs.assert.ok(xs.isFunction(value.self) && value.self.contractor === xs.Class, 'isImplementation - given value "$value" is not an instance of any xs.Class', {
            $value: value
        }, CollectionError);

        //get Class reference
        Class = value.self;

        return Class.implements(type);
    };

    var isInstance = function (value) {
        var me = this;

        var type = me.private.type;

        return value instanceof type;
    };

    var isType = function (value) {
        var me = this;

        var type = me.private.type;

        return type(value);
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