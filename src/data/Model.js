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
        {
            IAttribute: 'ns.attribute.IAttribute'
        },
        {
            'event.SetBefore': 'ns.attribute.event.SetBefore'
        },
        {
            'event.Set': 'ns.attribute.event.Set'
        },
        {
            IModelOperation: 'ns.operation.IModelOperation'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.abstract = true;

    /**
     * Model constructor
     *
     * @constructor
     *
     * @param {Object} [data] model raw data
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that data is either undefined or an object
        self.assert.ok(!arguments.length || xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });


        //call observable constructor
        self.mixins.observable.call(me, xs.noop);


        //define empty data as empty object
        if (!data) {
            data = {};
        }

        //define attributes storage
        var attributes = me.private.attributes = {};

        //set attributes
        me.self.descriptor.attributes.each(function (attribute, name) {
            attributes[ name ] = new Attribute(me, name, attribute);
            attributes[ name ].set(data[ name ], true);
        });
    };

    /**
     * Model destroy method
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        var me = this;

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        (new xs.core.Collection(me.private.attributes)).each(function (attribute) {
            attribute.destroy();
        });

        //call parent destroy
        self.parent.prototype.destroy.call(me);
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
     * @param {String} name
     * @param {xs.data.attribute.IAttribute} attribute
     */
    var Attribute = function (model, name, attribute) {
        this.private = {
            model: model,
            name: name,
            attribute: attribute,
            value: undefined
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
        if (!arguments.length) {

            return this.private.attribute.get(this.private.value, xs.data.attribute.Format.User);
        }

        self.assert.ok(xs.data.attribute.Format.has(format), 'attribute.get - given unknown `$format`', {
            $format: format
        });

        return this.private.attribute.get(this.private.value, format);
    };

    /**
     * Attribute valueOf method
     *
     * @ignore
     *
     * @method valueOf
     *
     * @return {*}
     */
    Attribute.prototype.valueOf = function () {
        return this.private.attribute.get(this.private.value, xs.data.attribute.Format.User);
    };


    /**
     * Attribute valueOf method
     *
     * @ignore
     *
     * @method valueOf
     *
     * @return {*}
     */
    Attribute.prototype.toString = Attribute.prototype.valueOf;

    /**
     * Attribute set method
     *
     * @ignore
     *
     * @method set
     *
     * @param {*} value
     * @param {Boolean} [silent] Is used, when no events must be sent
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

        //send preventable event.SetBefore event, that can prevent changing attribute value
        if (!model.events.send(new imports.event.SetBefore(data))) {

            return;
        }

        //set new value
        me.private.value = me.private.attribute.set(value);

        //send closing event.Set event
        model.events.send(new imports.event.Set(data));
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

//define xs.data.Model-specific preprocessor
(function () {

    'use strict';

    var log = new xs.log.Logger('xs.class.preprocessors.xs.data.Model');

    var assert = new xs.core.Asserter(log, XsClassPreprocessorsXsDataModelError);

    xs.class.preprocessors.add('xs.data.Model', function (Class) {

        //use preprocessor only for model classes
        return Class.inherits(xs.data.Model);
    }, function (Class, descriptor) {

        //assert, that attributes given
        assert.ok(descriptor.hasOwnProperty('attributes'), 'no attributes given for `$Model`', {
            $Model: Class
        });

        //assert, that attributes are an object
        assert.object(descriptor.attributes, 'given `$attributes` are not an object', {
            $attributes: descriptor.attributes
        });


        //define attributes collection for a class
        var attributes = Class.descriptor.attributes = new xs.core.Collection();

        //get reference to descriptor
        var properties = Class.descriptor.property;


        //process attributes configuration
        (new xs.core.Collection(descriptor.attributes)).each(function (config, name) {
            processAttribute(Class, attributes, properties, name, config);
        });

    }, 'before', 'defineElements');

    function processAttribute(Class, attributes, properties, name, config) {

        //assert, that name is valid
        assert.ok(xs.ContractsManager.isShortName(name), 'given attribute name `$name` is incorrect', {
            $name: name
        });

        //assert, that config is either a string (simple type name) or a configuration object
        assert.ok(xs.isString(config) || xs.isObject(config), 'attribute `$name` has incorrect `$config`', {
            $name: name,
            $config: config
        });

        //convert string config to object
        config = xs.isString(config) ? {
            type: config
        } : config;

        //assert, that type given
        assert.ok(config.hasOwnProperty('type'), 'attribute `$name` has no type in it\'s config', {
            $name: name
        });

        //assert, that type is a string
        assert.string(config.type, 'attribute `$name` type `$type` is not a string', {
            $name: name,
            $type: config.type
        });

        //try to get attribute class
        var Attribute = xs.ContractsManager.get(Class.descriptor.resolveName(config.type));

        //assert, that Attribute is a class
        assert.Class(Attribute, 'attribute `$name` type contract `$Attribute` is not a class', {
            $name: name,
            $Attribute: Attribute
        });

        //assert, that Attribute implements xs.data.attribute.IAttribute
        assert.ok(Attribute.implements(xs.data.attribute.IAttribute), 'attribute `$name` type class `$Attribute` does not implement `$IAttribute` interface', {
            $name: name,
            $Attribute: Attribute,
            $IAttribute: xs.data.attribute.IAttribute
        });


        //add attribute to attributes list
        attributes.add(name, new Attribute(config));


        //prepare property descriptor
        var value = xs.property.prepare(name, {
            get: function () {
                return this.private.attributes[ name ];
            },
            set: function (value) {
                this.private.attributes[ name ].set(value);
            }
        });

        //add/set property in class descriptor
        if (properties.hasKey(name)) {
            properties.set(name, value);
        } else {
            properties.add(name, value);
        }
    }

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class XsClassPreprocessorsXsDataModelError
     */
    function XsClassPreprocessorsXsDataModelError(message) {
        this.message = 'xs.class.preprocessors.xs.data.Model::' + message;
    }

    XsClassPreprocessorsXsDataModelError.prototype = new Error();

})();