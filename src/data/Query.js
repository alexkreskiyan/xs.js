/**
 * Query is a key element in xs.js data workflow. It's aim is data aggregation from several sources
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

    Class.abstract = true;

    Class.constant.model = null;

    Class.constructor = function (config) {
        var me = this;

        //assert, that model is a class
        self.assert.class(me.self.model, 'constructor - model `$model` is not a class', {
            $model: me.self.model
        });

        //assert, that model class is not processing
        self.assert.not(me.self.model.isProcessing, 'constructor - model `$model` is being processed. Add it to imports, to be sure that it will be loaded', {
            $model: me.self.model
        });

        //assert, that model is a xs.data.Model
        self.assert.ok(me.self.model.inherits(imports.Model), 'constructor - model `$model` is not a `$Model` ancestor', {
            $model: me.self.model,
            $Model: imports.Model
        });

        //define source bindings
        me.private.bindings = {};

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

    Class.method.destroy = function () {
        var me = this;

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //unbind
        me.unbind();

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };
});