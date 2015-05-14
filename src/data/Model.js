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
        },
        {
            Proxy: 'ns.Proxy'
        },
        {
            Format: 'ns.attribute.Format'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.abstract = true;

    Class.constant.source = true;

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

    Class.property.source = {
        set: xs.noop
    };

    Class.property.proxy = {
        set: function (proxy) {

            //assert, that given instance of imports.Proxy
            self.assert.ok(proxy instanceof imports.Proxy, 'proxy:set - given proxy candidate `$proxy` is not a proxy instance', {
                $proxy: proxy
            });

            //verify, that proxy implements all operations, implemented by model
            self.assert.ok(this.self.descriptor.implements.all(function (Interface) {

                //return true if Interface is not a IModelOperation child, or it is and proxy implements it too
                return !Interface.inherits(imports.IModelOperation) || proxy.self.implements(Interface);
            }), 'proxy:set - given proxy class `$Proxy` implements model operations `$OperationsProxy`, that does not cover required model operations `$OperationsModel`', {
                $Proxy: proxy.self,
                $OperationsProxy: proxy.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.IModelOperation);
                }, xs.core.Collection.All).values(),
                $OperationsModel: this.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.IModelOperation);
                }, xs.core.Collection.All).values()
            });

            this.private.proxy = proxy;
        }
    };

    Class.method.primary = function (format) {
        var me = this;

        //get primary attributes list reference
        var primary = me.self.descriptor.primaryAttributes;

        //return undefined, if model has no primary attributes
        if (!primary.length) {

            return;
        }

        //get model attributes reference
        var attributes = me.private.attributes;

        //single primary attribute
        if (primary.length === 1) {

            var primaryAttribute = attributes[ primary[ 0 ] ];

            //return primary attribute value
            return arguments.length ? primaryAttribute.get(format) : primaryAttribute.get();
        }

        var i, name;
        var key = {};

        //form hash for multi-fielded primary key
        if (arguments.length) {
            for (i = 0; i < primary.length; i++) {
                name = primary[ i ];
                key[ name ] = attributes[ name ].get(format);
            }
        } else {
            for (i = 0; i < primary.length; i++) {
                name = primary[ i ];
                key[ name ] = attributes[ name ].get();
            }
        }

        return key;
    };

    Class.method.get = function (format, attributes) {
        var me = this;

        var modelAttributes = me.self.descriptor.attributes;
        var instanceAttributes = me.private.attributes;

        if (!arguments.length) {

            return modelAttributes.map(function (attribute, name) {

                return instanceAttributes[ name ].get();
            }).toSource();
        }


        //verify format (if given)
        self.assert.ok(arguments.length > 1 || xs.isArray(arguments[ 0 ]) || imports.Format.has(format), 'get - given format `$format` is not defined in `$Format`', {
            $format: format,
            $Format: imports.Format
        });

        //use first argument as attributes, if needed
        if (arguments.length === 1 && xs.isArray(arguments[ 0 ])) {
            format = undefined;
            attributes = arguments[ 0 ];
        }

        //verify attributes (if given)
        self.assert.ok(arguments.length > 1 || !attributes || (function () {

            self.assert.array(attributes, 'get - given attributes list `$attributes` is not an array', {
                $attributes: attributes
            });

            self.assert.ok(attributes.length, 'get - given attributes list `$attributes` is empty', {
                $attributes: attributes
            });

            for (var i = 0; i < attributes.length; i++) {
                self.assert.ok(modelAttributes.hasKey(attributes[ i ]), 'get - given attribute `$attribute` is not defined in model `$Model`', {
                    $attribute: attributes[ i ],
                    $Model: me.self
                });
            }

            return true;
        })());


        //define response variable
        var data;

        //process 3 left scenarios
        if (format && attributes) {
            data = {};
            modelAttributes.each(function (attribute, name) {
                if (attributes.indexOf(name) >= 0) {
                    data[ name ] = instanceAttributes[ name ].get(format);
                }
            });
        } else if (format) {
            data = modelAttributes.map(function (attribute, name) {
                return instanceAttributes[ name ].get(format);
            }).toSource();
        } else {
            data = {};
            modelAttributes.each(function (attribute, name) {
                if (attributes.indexOf(name) >= 0) {
                    data[ name ] = instanceAttributes[ name ].get();
                }
            });
        }

        return data;
    };

    Class.method.set = function (data, silent) {
        var me = this;

        //assert, that data is an object
        self.assert.object(data, 'set - given data `$data` is not an object', {
            $data: data
        });

        var modelAttributes = me.self.descriptor.attributes;
        var instanceAttributes = me.private.attributes;

        //verify data
        self.assert.ok((function () {

            self.assert.ok(Object.keys(data).length, 'set - given data is empty');

            Object.keys(data).forEach(function (name) {
                self.assert.ok(modelAttributes.hasKey(name), 'set - given attribute `$attribute` is not defined in model `$Model`', {
                    $attribute: name,
                    $Model: me.self
                });
            });

            return true;
        })());

        //assert, that silent is a boolean (if given)
        self.assert.ok(arguments.length === 1 || xs.isBoolean(silent), 'set - given silent flag `$silent` is not a boolean value', {
            $silent: silent
        });

        //set values from data
        Object.keys(data).forEach(function (name) {
            instanceAttributes[ name ].set(data[ name ], silent);
        });

        return me;
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
     * @param {Number} [format] format, attribute value is fetched in
     * @param {Object} [options] additional format options
     *
     * @return {*}
     */
    Attribute.prototype.get = function (format, options) {
        if (!arguments.length) {

            return this.private.attribute.get(this.private.value, xs.data.attribute.Format.User);
        }

        //assert, that options, if given, are an object
        self.assert.ok(arguments.length === 1 || xs.isObject(options), 'attribute.get - given format options `$options` are not an object', {
            $options: options
        });

        //assert, that format is defined
        self.assert.ok(xs.data.attribute.Format.has(format), 'attribute.get - given unknown format `$format`', {
            $format: format
        });

        return options ? this.private.attribute.get(this.private.value, format, options) : this.private.attribute.get(this.private.value, format);
    };

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
        Class.descriptor.attributes = new xs.core.Collection();

        //define primary attributes storage
        Class.descriptor.primaryAttributes = [];

        //process attributes configuration
        (new xs.core.Collection(descriptor.attributes)).each(function (config, name) {

            processAttribute(Class, name, config);

        });

        //handle relations
        Class.descriptor.relations = {};

        if (descriptor.hasOwnProperty('relations')) {
            handleRelations(Class, descriptor);
        }

        //handle source/proxy
        handleSourceProxy(Class);

    }, xs.core.Collection.Before, 'defineElements');

    function processAttribute(Class, name, config) {

        //assert, that name is valid
        assert.shortName(name, 'given attribute name `$name` is incorrect', {
            $name: name
        });

        //assert, that config is either a string (simple class name) or a configuration object
        assert.ok(xs.isString(config) || xs.isObject(config), 'attribute `$name` has incorrect `$config`', {
            $name: name,
            $config: config
        });

        //convert string config to object
        config = xs.isString(config) ? {
            class: config
        } : config;

        //assert, that class given
        assert.ok(config.hasOwnProperty('class'), 'attribute `$name` has no class in it\'s config', {
            $name: name
        });

        //assert, that class is a string
        assert.string(config.class, 'attribute `$name` class `$class` is not a string', {
            $name: name,
            $class: config.class
        });

        //try to get attribute class
        var Attribute = xs.ContractsManager.get(Class.descriptor.resolveName(config.class));

        //assert, that Attribute is a class
        assert.class(Attribute, 'attribute `$name` class contract `$Attribute` is not a class', {
            $name: name,
            $Attribute: Attribute
        });

        //assert, that Attribute class is processed
        assert.processed(Attribute, 'attribute `$name` class contract `$Attribute` is not processed', {
            $name: name,
            $Attribute: Attribute
        });

        //assert, that Attribute implements xs.data.attribute.IAttribute
        assert.ok(Attribute.implements(xs.data.attribute.IAttribute), 'attribute `$name` class class `$Attribute` does not implement `$IAttribute` interface', {
            $name: name,
            $Attribute: Attribute,
            $IAttribute: xs.data.attribute.IAttribute
        });


        //add attribute to attributes list
        Class.descriptor.attributes.add(name, new Attribute(config));


        //prepare property descriptor
        var value = xs.property.prepare(name, {
            get: function () {
                return this.private.attributes[ name ];
            },
            set: function (value) {
                this.private.attributes[ name ].set(value);
            }
        });

        var properties = Class.descriptor.property;

        //add/set property in class descriptor
        if (properties.hasKey(name)) {
            properties.set(name, value);
        } else {
            properties.add(name, value);
        }

        //add primary attribute
        if (config.primary === true) {
            Class.descriptor.primaryAttributes.push(name);
        }
    }

    function handleRelations(Class, descriptor) {

        //assert, that relations are an object
        assert.object(descriptor.relations, 'given `$attributes` are not an object', {
            $attributes: descriptor.attributes
        });

        //handle each relation
        (new xs.core.Collection(descriptor.relations)).each(function (config, name) {
            handleRelation(Class, name, config);
        });
    }

    function handleRelation(Class, relation, config) {

        //assert, that name is valid
        assert.shortName(relation, 'given relation name `$relation` is incorrect', {
            $relation: relation
        });


        //assert, that config is an object
        assert.object(config, 'relation `$relation` config `$config` is not an object', {
            $relation: relation,
            $config: config
        });

        //assert, that config contains model and key
        assert.ok(config.hasOwnProperty('key'), 'relation `$relation` config `$config` has no key specified', {
            $relation: relation,
            $config: config
        });
        assert.ok(config.hasOwnProperty('model'), 'relation `$relation` config `$config` has no model specified', {
            $relation: relation,
            $config: config
        });


        //assert, that model is a string
        assert.string(config.model, 'relation `$relation` model `$model` is not a string', {
            $relation: relation,
            $model: config.model
        });

        //try to get model class
        var Model = xs.ContractsManager.get(Class.descriptor.resolveName(config.model));

        //assert, that Model is a class
        assert.class(Model, 'relation `$relation` model contract `$Model` is not a class', {
            $relation: relation,
            $Model: Model
        });

        //assert, that Model is processed
        assert.processed(Model, 'relation `$relation` model contract `$Model` is not processed', {
            $relation: relation,
            $Model: Model
        });

        //assert, that Model is a xs.data.Model ancestor
        assert.ok(Model.inherits(xs.data.Model), 'relation `$relation` class class `$Model` is not a xs.data.Model ancestor', {
            $relation: relation,
            $Model: Model
        });


        //assert, that key is an object
        assert.object(config.key, 'relation `$relation` key `$key` is not an object', {
            $relation: relation,
            $key: config.key
        });

        //check, that all key attributes match respective in foreign Model
        assert.ok((function () {

            //convert key to collection
            var key = new xs.core.Collection(config.key);

            //get foreign primary attributes names' list
            var foreignPrimary = new xs.core.Collection(Model.descriptor.primaryAttributes);

            //get foreign attributes collection
            var foreignAttributes = Model.descriptor.attributes;

            //assert, that length matches
            assert.equal(Object.keys(config.key).length, foreignPrimary.size, 'relation `$relation` key `$key` has incorrect number of fields `$result`, while expected `$expected`', {
                $name: name,
                $key: config.key,
                $result: Object.keys(config.key).length,
                $expected: foreignPrimary.length
            });

            //verify key match
            foreignPrimary.each(function (foreignName) {

                //assert, that attribute is presented in key
                assert.ok(key.has(foreignName), 'relation `$relation` key `$key` has no attribute bound to foreign key attribute `$name`', {
                    $relation: relation,
                    $key: config.key,
                    $foreignName: foreignName
                });

                //get bound attribute name
                var name = key.keyOf(foreignName);

                //get model attribute instance
                var attribute = Class.descriptor.attributes.at(name);

                //get foreign attribute instance
                var foreignAttribute = foreignAttributes.at(foreignName);

                //assert, that types match
                assert.equal(attribute.self, foreignAttribute.self, 'relation `$relation` key `$key` has types mismatch between attribute `$name` (`$type`) and `$foreignName` (`$foreignType`)', {
                    $relation: relation,
                    $key: config.key,
                    $name: name,
                    $type: attribute.self,
                    $foreignName: foreignName,
                    $foreignType: foreignAttribute.self
                });

            });

            return true;
        })(), 'key verification failed');

        //save relation
        Class.descriptor.relations[ relation ] = {
            key: config.key,
            model: Model
        };
    }

    function handleSourceProxy(Class) {

        //if model is source-focused - remove Class.property.proxy
        if (Class.descriptor.constant.at('source')) {

            Class.descriptor.property.removeAt('proxy');
            //else - remove Class.property.source
        } else {

            Class.descriptor.property.removeAt('source');
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