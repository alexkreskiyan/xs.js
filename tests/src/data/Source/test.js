/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Source', function () {

    'use strict';

    test('model. not a class', function () {
        var me = this;

        me.Source = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Source';

            Class.constant.model = null;

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //model is not a class
        throws(function () {
            return new me.Source();
        });
    });

    test('model. not a model ancestor', function () {
        var me = this;

        me.Source = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Source';

            Class.constant.model = xs.util.Collection;

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //model is not a xs.data.Model ancestor
        throws(function () {
            return new me.Source();
        });
    });

    test('constructor', function () {
        var me = this;

        me.Model = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    class: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    class: 'xs.data.attribute.String',
                    primary: true
                },
                age: {
                    class: 'xs.data.attribute.Number'
                }
            };

        }, function () {

            me.Source = xs.Class(function () {

                var Class = this;

                Class.extends = 'xs.data.Source';

                Class.constant.model = me.Model;

            }, me.done);

        });

        return false;
    }, function () {
        var me = this;
        var source;

        //source can be created without config
        source = new me.Source();

        //config must be an object if given
        throws(function () {
            return new me.Source(null);
        });

        //object config is ok
        source = new me.Source({});

        //source mixes xs.event.Observable
        strictEqual(source.self.mixins(xs.event.Observable), true);
    });

    test('proxy', function () {
        var me = this;

        me.Model = xs.define(xs.Class, 'tests.data.Source.proxy.Model', function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    class: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    class: 'xs.data.attribute.String',
                    primary: true
                },
                age: {
                    class: 'xs.data.attribute.Number'
                }
            };

        });

        me.RelevantProxy = xs.define(xs.Class, 'tests.data.Source.proxy.RelevantProxy', function () {

            var Class = this;

            Class.extends = 'xs.data.Proxy';

            Class.implements = [
                'xs.data.operation.source.IRead',
                'xs.data.operation.source.IUpdate'
            ];

            Class.method.read = function (key) {

            };

            Class.method.update = function (model) {

            };

        });

        me.IrrelevantProxy = xs.define(xs.Class, 'tests.data.Source.proxy.IrrelevantProxy', function () {

            var Class = this;

            Class.extends = 'xs.data.Proxy';

            Class.implements = [
                'xs.data.operation.source.IRead'
            ];

            Class.method.read = function (key) {

            };

        });

        me.Source = xs.define(xs.Class, 'tests.data.Source.proxy.Source', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.proxy';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.Model'
                },
                {
                    RelevantProxy: 'ns.RelevantProxy'
                },
                {
                    IrrelevantProxy: 'ns.IrrelevantProxy'
                }
            ];

            Class.implements = [
                'xs.data.operation.source.IRead',
                'xs.data.operation.source.IUpdate'
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

            Class.method.read = function (key) {

            };

            Class.method.update = function (model) {

            };

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var source, irrelevantProxy, relevantProxy;

        source = new me.Source();
        irrelevantProxy = new me.IrrelevantProxy({
            reader: new xs.data.reader.JSON(),
            writer: new xs.data.writer.JSON()
        });
        relevantProxy = new me.RelevantProxy({
            reader: new xs.data.reader.JSON(),
            writer: new xs.data.writer.JSON()
        });

        //by default source is undefined (if not set from config)
        strictEqual(source.proxy, undefined);

        //not a proxy fails
        throws(function () {
            source.proxy = new xs.util.Promise();
        });

        //if proxy is not relevant (does not implement all source operations) - fails
        throws(function () {
            source.proxy = irrelevantProxy;
        });

        //relevant proxy goes ok
        source.proxy = relevantProxy;

        strictEqual(source.proxy, relevantProxy);

        //proxy can be set via config
        source = new me.Source({
            proxy: relevantProxy
        });

        strictEqual(source.proxy, relevantProxy);

    }, function () {
        xs.ContractsManager.remove('tests.data.Source.proxy.Model');
        xs.ContractsManager.remove('tests.data.Source.proxy.RelevantProxy');
        xs.ContractsManager.remove('tests.data.Source.proxy.IrrelevantProxy');
        xs.ContractsManager.remove('tests.data.Source.proxy.Source');
    });

    test('preprocessor. relations', function () {
        var me = this;

        xs.define(xs.Class, 'tests.data.Model.User', function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    class: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    class: 'xs.data.attribute.String',
                    primary: true
                },
                age: {
                    class: 'xs.data.attribute.Number'
                }
            };

        });

        xs.define(xs.Class, 'tests.data.Model.Post', function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    class: 'xs.data.attribute.Number',
                    default: 0,
                    primary: true
                },
                name: {
                    class: 'xs.data.attribute.String',
                    primary: true
                },
                text: {
                    class: 'xs.data.attribute.Number'
                },
                userId: {
                    class: 'xs.data.attribute.Number'
                },
                userName: {
                    class: 'xs.data.attribute.String'
                }
            };

            Class.relations = {
                user: {
                    key: {
                        userId: 'id',
                        userName: 'name'
                    },
                    model: 'tests.data.Model.User'
                }
            };

        });

        xs.onReady([
            'tests.data.Model.User',
            'tests.data.Model.Post'
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.data.Model;

        strictEqual(xs.isObject(ns.Post.descriptor.relations), true);
        strictEqual(JSON.stringify(ns.Post.descriptor.relations.user.key), '{"userId":"id","userName":"name"}');
        strictEqual(ns.Post.descriptor.relations.user.model, ns.User);

    }, function () {
        xs.ContractsManager.remove('tests.data.Model.User');
        xs.ContractsManager.remove('tests.data.Model.Post');
    });

});