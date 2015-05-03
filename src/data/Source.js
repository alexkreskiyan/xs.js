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

    Class.imports = [
        {
            ISourceOperation: 'ns.operation.ISourceOperation'
        },
        {
            OperationEvent: 'ns.operation.Event'
        },
        {
            Model: 'ns.Model'
        },
        {
            Proxy: 'ns.Proxy'
        }
    ];

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
    };

    Class.property.proxy = {
        set: function (proxy) {

            //assert, that given instance of imports.Proxy
            self.assert.ok(proxy instanceof imports.Proxy, 'proxy:set - given proxy candidate `$proxy` is not a proxy instance', {
                $proxy: proxy
            });

            //verify, that proxy implements all operations, implemented by model
            self.assert.ok(this.self.descriptor.implements.all(function (Interface) {

                //return true if Interface is not a ISourceOperation child, or it is and proxy implements it too
                return !Interface.inherits(imports.ISourceOperation) || proxy.self.implements(Interface);
            }), 'proxy:set - given proxy class `$Proxy` implements model operations `$OperationsProxy`, that does not cover required model operations `$OperationsModel`', {
                $Proxy: proxy.self,
                $OperationsProxy: proxy.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.ISourceOperation);
                }, xs.core.Collection.All).values(),
                $OperationsModel: this.self.descriptor.implements.find(function (Interface) {
                    return Interface.inherits(imports.ISourceOperation);
                }, xs.core.Collection.All).values()
            });

            this.private.proxy = proxy;
        }
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
        self.assert.not(me.isBound(relation), 'bind - relation `$relation` is already binded', {
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
                    me.private.stream.send(event);
                },
                destroy: function () {
                    var me = this;
                    delete me.private.bindings[ relation ];
                }
            }
        };

        //add binding handlers
        binding.source.on(imports.OperationEvent, binding.handlers.operation, {
            scope: me
        });
        binding.source.on(xs.event.Destroy, binding.handlers.destroy, {
            scope: me
        });
    };

    Class.method.unbind = function (relation) {
        var me = this;

        if (!arguments.length) {

            //remove all bindings
            (new xs.core.Collection(me.private.bindings)).each(function (binding) {

                //remove relation handlers
                binding.source.off(imports.OperationEvent, function (item) {
                    return item.handler === binding.handlers.operation;
                });
                binding.source.off(xs.event.Destroy, function (item) {
                    return item.handler === binding.handlers.destroy;
                });
            });

            me.private.bindings = {};

            return;
        }


        //assert, that relation is bound
        self.assert.ok(me.isBound(relation), 'bind - relation `$relation` is already binded', {
            $relation: relation
        });


        //get binding
        var binding = me.private.bindings[ relation ];
        delete me.private.bindings[ relation ];


        //remove relation binding handler
        binding.source.off(imports.OperationEvent, function (item) {
            return item.handler === binding.handlers.operation;
        });
        binding.source.off(xs.event.Destroy, function (item) {
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