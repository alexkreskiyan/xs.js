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
        {IProxy: 'ns.proxy.IProxy'},
        'ns.model.Event',
        {'operation.Create': 'ns.operation.Create'},
        {'operation.Read': 'ns.operation.Read'},
        {'operation.Update': 'ns.operation.Update'},
        {'operation.Delete': 'ns.operation.Delete'}
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
     * Model proxy declaration
     *
     * @static
     *
     * @readonly
     *
     * @property proxy
     *
     * @type {Object}
     */
    Class.constant.proxy = {};

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
    };//TODO add operation events: create, create:before, etc

    Class.static.property.primaryAttributes = {
        get: function () {
            var me = this;
            if (me.private.hasOwnProperty('primaryAttributes')) {
                return me.private.primaryAttributes;
            }

            //assert, that attributes list is a xs.core.Collection
            self.assert.instance(me.attributes, xs.core.Collection, 'primaryAttributes - model `$Model` attributes list `$attributes` is not an xs.core.Collection instance', {
                $Model: me,
                $attributes: me.attributes
            });

            //define attributes collection
            var attributes = me.private.primaryAttributes = new xs.core.Collection();

            //internal items
            var items = [];

            //fill items
            me.attributes.find(function (config, name) {
                //primary config property marks property as primary
                if (config.primary === true) {
                    items.push({
                        key: items.length,
                        value: name
                    });
                }
            }, xs.core.Collection.All);

            //at least one primary attribute must exist
            self.assert.ok(items.length, 'primaryAttributes - model `$Model` has no primary attributes', {
                $Model: me
            });

            //set items
            attributes.private.items = items;

            //return attributes
            return attributes;
        },
        set: xs.emptyFn
    };

    /**
     * Model constructor
     *
     * @constructor
     *
     * @param {Object} [data] model raw data
     * @param {xs.data.proxy.IProxy} [proxy] model proxy
     */
    Class.constructor = function (data, proxy) {
        var me = this;

        //assert, that data is either undefined or an object
        self.assert.ok(!arguments.length || xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that proxy is xs.data.proxy.IProxy, if given
        self.assert.ok(arguments.length < 2 || (xs.isInstance(proxy) && proxy.self.implements(imports.IProxy)), 'constructor - given object `$object` is not an instance of Class, that implements interface `$Interface`', {
            $object: proxy,
            $Interface: imports.IProxy
        });

        //call observable constructor
        self.mixins.observable.call(me);

        //get internal Data class
        var Data = getData(me.self);

        //setup instance data storage
        me.private.data = data ? new Data(me, data) : new Data(me);

        //setup proxy
        me.private.proxy = proxy ? proxy : getProxy(me.self);
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

    Class.method.create = function () {
        var me = this;

        //get proxy reference
        var proxy = me.private.proxy;

        //create operation
        var operation = new imports.operation.Create(me);

        //run operation with proxy
        proxy.create(operation);

        //return operation (to use it like a promise)
        return operation;
    };

    Class.method.read = function () {
        var me = this;

        //get proxy reference
        var proxy = me.private.proxy;

        //create operation
        var operation = new imports.operation.Read(me);

        //run operation with proxy
        proxy.read(operation);

        //return operation (to use it like a promise)
        return operation;
    };

    Class.method.update = function () {
        var me = this;

        //get proxy reference
        var proxy = me.private.proxy;

        //create operation
        var operation = new imports.operation.Update(me);

        //run operation with proxy
        proxy.update(operation);

        //return operation (to use it like a promise)
        return operation;
    };

    Class.method.delete = function () {
        var me = this;

        //get proxy reference
        var proxy = me.private.proxy;

        //create operation
        var operation = new imports.operation.Delete(me);

        //run operation with proxy
        proxy.delete(operation);

        //return operation (to use it like a promise)
        return operation;
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

        //remove proxy reference
        delete me.private.proxy;

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

        //assert that attributes are an xs.core.Collection instance
        self.assert.instance(Class.attributes, xs.core.Collection, 'getData - given class `$Class` attributes `$attributes` are not an instance of xs.core.Collection', {
            $attributes: Class.attributes,
            $Class: Class
        });

        //define attributes type
        var Data = Class.private.Data = getDataSample();

        //create Model private attributes' collection
        Class.private.attributes = new xs.core.Collection();

        //define attributes
        Class.attributes.each(function (config, name) {
            defineAttribute(Class, Data, name, config);
        });

        return Data;
    };

    /**
     * Lazy initialization method for Model proxy
     *
     * @ignore
     *
     * @private
     *
     * @method getProxy
     *
     * @param {xs.data.Model} Class class, being initialized
     *
     * @return {xs.data.proxy.IProxy} Proxy instance
     */
    var getProxy = function (Class) {
        //return collection if defined
        if (Class.private.hasOwnProperty('proxy')) {
            return Class.private.proxy;
        }

        var config = Class.proxy;

        //assert that proxy definition is an object
        self.assert.object(config, 'getProxy - given class `$Class` proxy definition `$proxy` is not an object', {
            $proxy: config,
            $Class: Class
        });

        //assert that type is specified
        self.assert.ok(config.hasOwnProperty('type'), 'getProxy - no type given for proxy in config `$config`. Add attribute type to Class.constant.proxy hash constant with property type, which value must be string, referencing name of imported Class', {
            $config: config
        });

        //assert that type is non-empty string
        self.assert.ok(config.type && xs.isString(config.type), 'getProxy - given proxy type `$type` is not a string', {
            $type: config.type
        });

        //get Proxy contract
        var Proxy = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

        //assert that Proxy is class
        self.assert.Class(Proxy, 'getProxy - given proxy type `$Proxy` is not a class', {
            $Proxy: Proxy
        });

        //assert that Proxy implements IProxy interface
        self.assert.ok(Proxy.implements(imports.IProxy), 'getProxy - given proxy type `$Proxy` does not implement base proxy interface `$Proxy`', {
            $Proxy: Proxy,
            $Interface: imports.IProxy
        });

        var proxy = Class.private.proxy = new Proxy(config);

        return proxy;
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
            me.private = {
                model: model
            };

            if (!data) {

                data = {};
            }

            //set attributes
            model.self.private.attributes.each(function (attribute, name) {
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
        me.private.model.self.private.attributes.each(function (attribute, name) {
            this[name].destroy();
        }, 0, me.private);

        //remove model reference
        delete me.private.model;

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
            $Interface: imports.IAttribute
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
        Class.private.attributes.add(name, attribute);
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
     * @param {Boolean} [silent] Is used, when no events must be fired
     */
    Attribute.prototype.set = function (value, silent) {
        var me = this;

        if (silent) {
            me.private.value = me.private.attribute.set(value);

            return;
        }

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