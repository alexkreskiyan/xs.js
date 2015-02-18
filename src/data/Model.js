/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Key data workflow element of xs.js.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.Model
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.Model', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {IAttribute: 'ns.attribute.IAttribute'}
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.abstract = true;

    /**
     * Model attributes list
     *
     * @static
     *
     * @readonly
     *
     * @property attributes
     *
     * @type {Object}
     */
    Class.constant.attributes = {
        name: {
            type: 'ns.attribute.String'
        }
    };

    Class.constant.events = {
        /**
         * load event. Is fired, when model's data is explicitly loaded via proxy
         *
         * @event load
         */
        'load': {
            type: 'xs.event.Event'
        },
        /**
         * save event. Is fired, when model's data is explicitly saved via proxy
         *
         * @event save
         */
        'save': {
            type: 'xs.event.Event'
        },
        /**
         * change:before event. Is fired before some model's attribute changes it's value.
         *
         * Stopping this event prevents value change. If new value is equal to current, nothing happens
         *
         * @event change:before
         */
        'change:before': {
            type: 'xs.event.Event'
        },
        /**
         * change event. Is fired, when some model's attribute changes it's value.
         *
         * If new value is equal to current, nothing happens
         *
         * @event change
         */
        'change': {
            type: 'xs.event.Event'
        }
    };

    /**
     * Model constructor
     *
     * @constructor
     *
     * @param {Object} [data] model raw data
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that uri is either undefined or string
        self.assert.ok(!arguments.length || xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //get class attributes collection
        var classAttributes = getAttributes(me.self);

        //init attributes storage
        var attributes = me.private.attributes = {};

        //setup model data
        classAttributes.each(function (attribute, name) {
            attributes[name] = data.hasOwnProperty(name) ? attribute.set(data[name]) : attribute.set();
        });
    };

    Class.method.get = function (name) {
        var me = this;

        //assert, that given attribute exists
        self.assert.ok(me.self.attributes.hasOwnProperty(name), 'get - attribute `$name` is not defined in model `$Model`', {
            $name: name,
            $Model: me.self
        });

        var attribute = me.self.private.attributes.at(name);

        return attribute.get(me.private.attributes[name]);
    };

    Class.method.set = function (name, value) {
        var me = this;

        //assert, that given attribute exists
        self.assert.ok(me.self.attributes.hasOwnProperty(name), 'get - attribute `$name` is not defined in model `$Model`', {
            $name: name,
            $Model: me.self
        });

        //prepare event data
        var old = me.private.attributes[name];
        var data = {
            attribute: name,
            old: old,
            new: value
        };

        //fire preventable `change:before` event, that can prevent changing attribute value
        if (!me.fire('change:before', data)) {

            return me;
        }

        //get model attribute reference
        var attribute = me.self.private.attributes.at(name);

        //set new value
        me.private.attributes[name] = attribute.set(value);

        //fire closing `change` event
        me.fire('change', data);

        return me;
    };


    var getAttributes = function (Class) {
        //return collection if defined
        if (Class.private.hasOwnProperty('attributes')) {
            return Class.private.attributes;
        }

        //define attributes collection
        var attributes = Class.private.attributes = new xs.core.Collection();

        //define attributes
        (new xs.core.Collection(Class.attributes)).each(function (config, name) {

            //assert that type is specified
            self.assert.ok(config.hasOwnProperty('type'), 'getAttributes - no type given for attribute `$attribute`. Add attribute type to Class.constant.attribute hash constant with property type, which value must be string, referencing name of imported Class', {
                $attribute: name
            });

            //assert that type is non-empty string
            self.assert.ok(config.type && xs.isString(config.type), 'getAttributes - given attribute `$attribute` type `$type` is not a string', {
                $attribute: name,
                $type: config.type
            });

            //get Attribute contract
            var Attribute = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

            //assert that Attribute is class
            self.assert.Class(Attribute, 'getAttribute - given attribute `$attribute` type `$Attribute` is not a class', {
                $attribute: name,
                $Attribute: Attribute
            });

            //assert that Attribute implements IAttribute interface
            self.assert.ok(Attribute.implements(imports.IAttribute), 'fire - given attribute `$attribute` type `$Attribute` does not implement base attribute interface `$Interface`', {
                $attribute: event,
                $Attribute: Attribute,
                $Interface: imports.IAttribute.label
            });

            //add attribute
            attributes.add(name, new Attribute(config));
        });

        return attributes;
    };

});