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
        {IAttribute: 'ns.attribute.IAttribute'},
        'ns.model.Event'
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.implements = ['ns.IModel'];

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
    Class.constant.attributes = {};

    /**
     * Model events list. See {@link xs.event.Observable#events}
     */
    Class.constant.events = {
        /**
         * load event. Is fired, when model's data is explicitly loaded via proxy. Fires with {@link xs.event.Event}
         *
         * @event load
         */
        'load': {
            type: 'xs.event.Event'
        },
        /**
         * save event. Is fired, when model's data is explicitly saved via proxy. Fires with {@link xs.event.Event}
         *
         * @event save
         */
        'save': {
            type: 'xs.event.Event'
        },
        /**
         * change:before event. Is fired before some model's attribute changes it's value.
         *
         * Stopping this event prevents value change. If new value is equal to current, nothing happens.
         * Fires with {@link xs.data.model.Event}
         *
         * @event change:before
         */
        'change:before': {
            type: 'xs.data.model.Event'
        },
        /**
         * change event. Is fired, when some model's attribute changes it's value.
         *
         * If new value is equal to current, nothing happens.
         * Fires with {@link xs.data.model.Event}
         *
         * @event change
         */
        'change': {
            type: 'xs.data.model.Event'
        },
        /**
         * destroy event. Is fired, when element is destroyed. Fires with {@link xs.event.Event}
         *
         * @event destroy
         */
        destroy: {
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

        //call observable constructor
        self.mixins.observable.call(me);

        //get internal Data class
        var Data = getData(me.self);

        //setup instance data storage
        me.private.data = data ? new Data(me, data) : new Data(me);
    };

    /**
     * Model data accessor
     *
     * @readonly
     *
     * @property data
     *
     * @type {Object}
     */
    Class.property.data = {
        get: function () {
            return this.private.data;
        },
        set: xs.emptyFn
    };

    /**
     * Model destroy method
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        var me = this;

        //fire destroy event
        me.fire('destroy');

        //toggle off all events
        me.off();

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //destroy data container
        me.private.data.destroy();

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    /**
     * Lazy initialization method for Model attributes
     *
     * @ignore
     *
     * @private
     *
     * @method getAttributes
     *
     * @param {xs.data.Model} Class class, being initialized
     *
     * @return {Function} Data function
     */
    var getData = function (Class) {
        //return collection if defined
        if (Class.private.hasOwnProperty('Data')) {
            return Class.private.Data;
        }

        //define attributes type
        var Data = Class.private.Data = getDataSample();

        Data.attributes = new xs.core.Collection();

        //define attributes
        (new xs.core.Collection(Class.attributes)).each(function (config, name) {
            defineAttribute(Class, Data, name, config);
        });

        return Data;
    };

    /**
     * Returns sample of Data internal class
     *
     * @ignore
     *
     * @private
     *
     * @method getDataSample
     *
     * @return {Function}
     */
    var getDataSample = function () {
        var Data = function (model, data) {
            var me = this;

            //init private storage
            me.private = {};

            if (!data) {

                data = {};
            }

            //set attributes
            me.constructor.attributes.each(function (attribute, name) {
                var attr = me.private[name] = new Attribute(model, attribute, name);
                attr.private.value = attribute.set(data[name]);
            });
        };

        //define destroy method
        Data.prototype.destroy = destroyData;

        return Data;
    };

    /**
     * Data destroy method
     *
     * @ignore
     *
     * @private
     *
     * @method destroyData
     */
    var destroyData = function () {
        var me = this;
        //destroy attributes
        me.constructor.attributes.each(function (attribute, name) {
            this[name].destroy();
        }, 0, me.private);

        //remove private reference
        delete me.private;
    };

    /**
     * Defines attribute into prototype of Data
     *
     * @ignore
     *
     * @private
     *
     * @method defineAttribute
     *
     * @param {Function} Class class
     * @param {Function} Data data internal class
     * @param {String} name name of defined attribute
     * @param {Object} config config of defined attribute
     */
    var defineAttribute = function (Class, Data, name, config) {

        //assert that type is specified
        self.assert.ok(config.hasOwnProperty('type'), 'defineAttribute - no type given for attribute `$attribute`. Add attribute type to Class.constant.attribute hash constant with property type, which value must be string, referencing name of imported Class', {
            $attribute: name
        });

        //assert that type is non-empty string
        self.assert.ok(config.type && xs.isString(config.type), 'defineAttribute - given attribute `$attribute` type `$type` is not a string', {
            $attribute: name,
            $type: config.type
        });

        //get Attribute contract
        var Attribute = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

        //assert that Attribute is class
        self.assert.Class(Attribute, 'defineAttribute - given attribute `$attribute` type `$Attribute` is not a class', {
            $attribute: name,
            $Attribute: Attribute
        });

        //assert that Attribute implements IAttribute interface
        self.assert.ok(Attribute.implements(imports.IAttribute), 'defineAttribute - given attribute `$attribute` type `$Attribute` does not implement base attribute interface `$Interface`', {
            $attribute: name,
            $Attribute: Attribute,
            $Interface: imports.IAttribute.label
        });

        var attribute = new Attribute(config);

        var descriptor = xs.property.prepare(name, {
            get: function () {
                return this.private[name];
            },
            set: xs.emptyFn
        });

        //add attribute
        xs.property.define(Data.prototype, name, descriptor);
        Data.attributes.add(name, attribute);
    };

    /**
     * Internal attribute class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class Attribute
     */

    /**
     * Attribute constructor
     *
     * @ignore
     *
     * @constructor
     *
     * @param {xs.data.Model} model
     * @param {xs.data.attribute.IAttribute} attribute
     * @param {String} name
     */
    var Attribute = function (model, attribute, name) {
        this.private = {
            model: model,
            attribute: attribute,
            name: name
        };
    };

    /**
     * Attribute get method
     *
     * @ignore
     *
     * @method get
     *
     * @param {Number} format
     *
     * @return {*}
     */
    Attribute.prototype.get = function (format) {
        return this.private.attribute.get(this.private.value, format);
    };

    /**
     * Attribute set method
     *
     * @ignore
     *
     * @method set
     *
     * @param {*} value
     */
    Attribute.prototype.set = function (value) {
        var me = this;

        //prepare event data
        var data = {
            attribute: me.private.name,
            old: me.private.value,
            new: value
        };

        //get model reference
        var model = me.private.model;

        //fire preventable `change:before` event, that can prevent changing attribute value
        if (!model.fire('change:before', data)) {

            return;
        }

        //set new value
        me.private.value = me.private.attribute.set(value);

        //fire closing `change` event
        model.fire('change', data);
    };

    /**
     * Destroys attribute
     *
     * @ignore
     *
     * @method destroy
     */
    Attribute.prototype.destroy = function () {
        delete this.private.model;
        delete this.private.attribute;
        delete this.private;
    };
});