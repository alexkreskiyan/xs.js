/**
 * Source is a key element in xs.js data workflow. It's aim is containing and operating models via proxies and providing information for queries
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.Source
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Source', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = {
        event: {
            Add: 'ns.enumerable.event.Add',
            Remove: 'ns.enumerable.event.Remove',
            Set: 'ns.enumerable.event.Set'
        },
        operation: {
            ISourceOperation: 'ns.operation.ISourceOperation',
            Event: 'ns.operation.Event'
        },
        Model: 'ns.Model',
        Proxy: 'ns.Proxy'
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.mixins.enumerable = 'xs.data.Enumerable';

    Class.abstract = true;

    Class.constant.model = null;

    Class.constructor = function (config) {
        var me = this;

        //assert, that model is a class
        self.assert.class(me.self.model, 'constructor - model `$model` is not a class', {
            $model: me.self.model
        });

        //assert, that model class is not processing
        self.assert.processed(me.self.model, 'constructor - model `$model` is being processed. Add it to imports, to be sure that it will be loaded', {
            $model: me.self.model
        });

        //assert, that model is a xs.data.Model
        self.assert.ok(me.self.model.inherits(imports.Model), 'constructor - model `$model` is not a `$Model` ancestor', {
            $model: me.self.model,
            $Model: imports.Model
        });

        //define source bindings
        me.private.bindings = {};

        //call enumerable constructor
        self.mixins.enumerable.call(me, me.self.model);

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);

        if (!arguments.length) {
            return;
        }

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //handle proxy, if given
        if (config.hasOwnProperty('proxy')) {
            me.proxy = config.proxy;
        }

        //handle bindings, if given
        if (config.hasOwnProperty('bind')) {

            //assert, that config is an object
            self.assert.object(config.bind, 'constructor - given config.bind `$bind` is not an object', {
                $bind: config.bind
            });

            (new xs.core.Collection(config.bind)).each(function (source, relation) {
                me.bind(relation, source);
            });
        }

        //bind events to sync model source reference
        var options = {
            scope: me
        };

        me.on(imports.event.Add, handleAdd, options);
        me.on(imports.event.Set, handleSet, options);
        me.on(imports.event.Remove, handleRemove, options);
    };

    Class.property.proxy = {
        set: function (proxy) {

            //assert, that given instance of imports.Proxy
            self.assert.ok(proxy instanceof imports.Proxy, 'proxy:set - given proxy candidate `$proxy` is not a proxy instance', {
                $proxy: proxy
            });

            //verify, that proxy implements all operations, implemented by model
            self.assert.ok(this.self.descriptor.implements.all(function (Interface) {

                //return true if Interface is not a operation.ISourceOperation child, or it is and proxy implements it too
                return !Interface.inherits(imports.operation.ISourceOperation) || proxy.self.implements(Interface);
            }), 'proxy:set - given proxy class `$Proxy` implements model operations `$OperationsProxy`, that does not cover required model operations `$OperationsModel`', {
                $Proxy: proxy.self,
                $OperationsProxy: proxy.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.operation.ISourceOperation);
                }, xs.core.Collection.All).values(),
                $OperationsModel: this.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.operation.ISourceOperation);
                }, xs.core.Collection.All).values()
            });

            this.private.proxy = proxy;
        }
    };

    Class.method.hasKey = function (key) {
        var me = this;

        return self.mixins.enumerable.prototype.hasKey.call(me, serializePrimary(key));
    };

    Class.method.at = function (key, flags) {
        var me = this;

        if (arguments.length > 1) {

            return self.mixins.enumerable.prototype.at.call(me, serializePrimary(key), flags);
        } else {

            return self.mixins.enumerable.prototype.at.call(me, serializePrimary(key));
        }
    };

    Class.method.add = function (key, value) {
        var me = this;

        if (arguments.length > 1) {

            return self.mixins.enumerable.prototype.add.call(me, serializePrimary(key), value);
        } else {

            return self.mixins.enumerable.prototype.add.call(me, key);
        }
    };

    Class.method.insert = function (index, key, value) {
        var me = this;

        if (arguments.length > 2) {

            return self.mixins.enumerable.prototype.insert.call(me, index, serializePrimary(key), value);
        } else {

            return self.mixins.enumerable.prototype.insert.call(me, index, key);
        }
    };

    Class.method.set = function (key, value, flags) {
        var me = this;

        if (arguments.length > 2) {

            return self.mixins.enumerable.prototype.set.call(me, serializePrimary(key), value, flags);
        } else {

            return self.mixins.enumerable.prototype.set.call(me, serializePrimary(key), value);
        }
    };

    Class.method.removeAt = function (key, flags) {
        var me = this;

        if (arguments.length > 1) {

            return self.mixins.enumerable.prototype.removeAt.call(me, serializePrimary(key), flags);
        } else {

            return self.mixins.enumerable.prototype.removeAt.call(me, serializePrimary(key));
        }
    };

    Class.method.pick = function (keys) {
        var me = this;

        //assert that keys is array
        self.assert.array(keys, 'pick - given keys list `$keys` is not array', {
            $keys: keys
        });

        var usedKeys = [];

        for (var i = 0; i < keys.length; i++) {
            usedKeys[ i ] = serializePrimary(keys[ i ]);
        }

        return self.mixins.enumerable.prototype.pick.call(me, usedKeys);
    };

    Class.method.omit = function (keys) {
        var me = this;

        //assert that keys is array
        self.assert.array(keys, 'omit - given keys list `$keys` is not array', {
            $keys: keys
        });

        var usedKeys = [];

        for (var i = 0; i < keys.length; i++) {
            usedKeys[ i ] = serializePrimary(keys[ i ]);
        }

        return self.mixins.enumerable.prototype.omit.call(me, usedKeys);
    };

    Class.method.isBound = function (relation) {
        var me = this;

        //assert, that relation is valid
        self.assert.ok(validateRelation.call(me, me.self.model.descriptor.relations, relation), 'bind - relation `$relation` validation failed', {
            $relation: relation
        });

        return me.private.bindings.hasOwnProperty(relation);
    };

    Class.method.bind = function (relation, source) {
        var me = this;

        //assert, that relation is not bound
        self.assert.not(me.isBound(relation), 'bind - relation `$relation` is already bound', {
            $relation: relation
        });

        //assert, that source is a xs.data.Source instance
        self.assert.ok(source instanceof self, 'bind - given source `$source` is not an instance of `$Source`', {
            $source: source,
            $Source: self
        });

        //get relation config
        var config = me.self.model.descriptor.relations[ relation ];

        //assert, that source model matches relation ones
        self.assert.equal(source.self.model, config.model, 'bind - given source `$source` is bound to model `$sourceModel`, while config model is `$configModel`', {
            $source: source,
            $sourceModel: source.self.model,
            $configModel: config.model
        });

        //set relation binding
        var binding = me.private.bindings[ relation ] = {
            source: source,
            handlers: {
                operation: function (event) {
                    var me = this;
                    event.relation = relation;
                    me.events.emitter.send(event);
                },
                destroy: function () {
                    var me = this;
                    delete me.private.bindings[ relation ];
                }
            }
        };

        //add binding handlers
        binding.source.on(imports.operation.Event, binding.handlers.operation, {
            scope: me
        });
        binding.source.on(xs.reactive.event.Destroy, binding.handlers.destroy, {
            scope: me
        });
    };

    Class.method.unbind = function (relation) {
        var me = this;

        if (!arguments.length) {

            //remove all bindings
            (new xs.core.Collection(me.private.bindings)).each(function (binding) {

                //remove relation handlers
                binding.source.off(imports.operation.Event, function (item) {
                    return item.handler === binding.handlers.operation;
                });
                binding.source.off(xs.reactive.event.Destroy, function (item) {
                    return item.handler === binding.handlers.destroy;
                });
            });

            me.private.bindings = {};

            return;
        }


        //assert, that relation is bound
        self.assert.ok(me.isBound(relation), 'bind - relation `$relation` is already bound', {
            $relation: relation
        });


        //get binding
        var binding = me.private.bindings[ relation ];
        delete me.private.bindings[ relation ];


        //remove relation binding handler
        binding.source.off(imports.operation.Event, function (item) {
            return item.handler === binding.handlers.operation;
        });
        binding.source.off(xs.reactive.event.Destroy, function (item) {
            return item.handler === binding.handlers.destroy;
        });
    };

    Class.method.destroy = function () {
        var me = this;

        //call Enumerable.destroy
        self.mixins.enumerable.prototype.destroy.call(me);

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //unbind
        me.unbind();

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    var handleAdd = function (event) {
        var model = event.value;

        //assert, that model has no source
        self.assert.not(model.private.source, 'handleAdd - model `$model` is already attached to source `$source`', {
            $model: model,
            $source: model.private.source
        });

        //set model source to me
        model.private.source = this;
    };

    var handleSet = function (event) {
        var oldModel = event.old;
        var newModel = event.new;

        //assert, that newModel has no source
        self.assert.not(newModel.private.source, 'handleAdd - model `$model` is already attached to source `$source`', {
            $model: newModel,
            $source: newModel.private.source
        });

        //delete source from old model
        delete oldModel.private.source;

        //set source for new model to me
        newModel.private.source = this;
    };

    var handleRemove = function (event) {
        //delete model source
        delete event.value.private.source;
    };

    var serializePrimary = function (primary) {
        if (xs.isPrimitive(primary)) {
            return primary;
        }

        return JSON.stringify(primary);
    };

    var validateRelation = function (relations, relation) {
        var me = this;

        //assert, that relation is a valid short name
        self.assert.shortName(relation, 'bind - given relation `$relation` is not a valid short name', {
            $relation: relation
        });

        //assert, that relation is defined in model's relations
        self.assert.ok(relations.hasOwnProperty(relation), 'bind - given relation `$relation` is not defined for a model `$Model`', {
            $relation: relation,
            $Model: me.self.model
        });

        return true;
    };

});