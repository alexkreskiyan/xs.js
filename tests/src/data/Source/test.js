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

            Class.constant.model = xs.data.Collection;

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

        //source mixes xs.event.Observable
        strictEqual(source.self.mixins(xs.event.Observable), true);

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

    test('isBound', function () {
        var me = this;

        me.UserModel = xs.define(xs.Class, 'tests.data.Source.isBound.UserModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.isBound';

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

        me.PostModel = xs.define(xs.Class, 'tests.data.Source.isBound.PostModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.isBound';

            Class.imports = [ 'ns.UserModel' ];

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
                    model: 'ns.UserModel'
                }
            };

        });

        me.UserSource = xs.define(xs.Class, 'tests.data.Source.isBound.UserSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.isBound';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.UserModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        me.PostSource = xs.define(xs.Class, 'tests.data.Source.isBound.PostSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.isBound';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.PostModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        xs.onReady([
            'tests.data.Source.isBound.UserSource',
            'tests.data.Source.isBound.PostSource'
        ], me.done);

        return false;
    }, function () {
        var me = this;
        var userSource, postSource;

        userSource = new me.UserSource();
        postSource = new me.PostSource();

        //relation must be a valid short name
        throws(function () {
            return postSource.isBound('a.b');
        });

        //relation must be defined in source's model relations
        throws(function () {
            return postSource.isBound('users');
        });

        //by default source has no bindings
        strictEqual(postSource.isBound('user'), false);

        //bind posts to users
        postSource.bind('user', userSource);

        //when bound, returns true
        strictEqual(postSource.isBound('user'), true);

        //unbind
        postSource.unbind('user');

    }, function () {
        xs.ContractsManager.remove('tests.data.Source.isBound.UserModel');
        xs.ContractsManager.remove('tests.data.Source.isBound.PostModel');
        xs.ContractsManager.remove('tests.data.Source.isBound.UserSource');
        xs.ContractsManager.remove('tests.data.Source.isBound.PostSource');
    });

    test('bind', function () {
        var me = this;

        me.UserModel = xs.define(xs.Class, 'tests.data.Source.bind.UserModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.bind';

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

        me.PostModel = xs.define(xs.Class, 'tests.data.Source.bind.PostModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.bind';

            Class.imports = [ 'ns.UserModel' ];

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
                    model: 'ns.UserModel'
                }
            };

        });

        me.UserSource = xs.define(xs.Class, 'tests.data.Source.bind.UserSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.bind';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.UserModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        me.PostSource = xs.define(xs.Class, 'tests.data.Source.bind.PostSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.bind';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.PostModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        xs.onReady([
            'tests.data.Source.bind.UserSource',
            'tests.data.Source.bind.PostSource'
        ], me.done);

        return false;
    }, function () {
        var me = this;
        var userSource, postSource;

        userSource = new me.UserSource();
        postSource = new me.PostSource();

        //relation must be a valid short name
        throws(function () {
            return postSource.bind('a.b');
        });

        //relation must be defined in source's model relations
        throws(function () {
            return postSource.bind('users');
        });

        //relation must be unbound
        postSource.bind('user', userSource);
        throws(function () {
            return postSource.bind('user');
        });
        postSource.unbind('user');

        //source must be a xs.data.Source ancestor
        throws(function () {
            return postSource.bind('user', new xs.util.Promise());
        });

        //source model must match relation model
        throws(function () {
            return postSource.bind('user', new me.PostSource());
        });

        //all ok for correct relation and source
        postSource.bind('user', userSource);
        strictEqual(postSource.isBound('user'), true);
        postSource.unbind('user');

        //source can be bound when created
        postSource = new me.PostSource({
            bind: {
                user: userSource
            }
        });
        strictEqual(postSource.isBound('user'), true);

        //when bound, operation events are rethrown
        var data = '';
        postSource.on(xs.data.operation.Event, function (event) {
            data += event.operation += event.data;
        });

        userSource.private.stream.send(new xs.data.operation.Event({
            operation: xs.data.operation.source.IRead,
            data: 1
        }));
        userSource.private.stream.send(5);

        strictEqual(data, '[xs.Interface xs.data.operation.source.IRead]1');

    }, function () {
        xs.ContractsManager.remove('tests.data.Source.bind.UserModel');
        xs.ContractsManager.remove('tests.data.Source.bind.PostModel');
        xs.ContractsManager.remove('tests.data.Source.bind.UserSource');
        xs.ContractsManager.remove('tests.data.Source.bind.PostSource');
    });

    test('unbind', function () {
        var me = this;

        me.UserModel = xs.define(xs.Class, 'tests.data.Source.unbind.UserModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.unbind';

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

        me.PostModel = xs.define(xs.Class, 'tests.data.Source.unbind.PostModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.unbind';

            Class.imports = [ 'ns.UserModel' ];

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
                    model: 'ns.UserModel'
                }
            };

        });

        me.UserSource = xs.define(xs.Class, 'tests.data.Source.unbind.UserSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.unbind';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.UserModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        me.PostSource = xs.define(xs.Class, 'tests.data.Source.unbind.PostSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.unbind';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.PostModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        xs.onReady([
            'tests.data.Source.unbind.UserSource',
            'tests.data.Source.unbind.PostSource'
        ], me.done);

        return false;
    }, function () {
        var me = this;
        var userSource, postSource;

        userSource = new me.UserSource();
        postSource = new me.PostSource();

        //relation must be a valid short name
        throws(function () {
            return postSource.unbind('a.b');
        });

        //relation must be defined in source's model relations
        throws(function () {
            return postSource.unbind('users');
        });

        //relation must be bound
        throws(function () {
            return postSource.unbind('user');
        });
        postSource.bind('user', userSource);
        strictEqual(postSource.isBound('user'), true);
        postSource.unbind('user');
        strictEqual(postSource.isBound('user'), false);

        //source can unbind all relations at once
        postSource.bind('user', userSource);
        strictEqual(postSource.isBound('user'), true);
        postSource.unbind();
        strictEqual(postSource.isBound('user'), false);


        //when unbound, operation events are ignored
        var data = '';
        postSource.on(xs.data.operation.Event, function (event) {
            data += event.operation += event.data;
        });

        //bind first
        postSource.bind('user', userSource);

        userSource.private.stream.send(new xs.data.operation.Event({
            operation: xs.data.operation.source.IRead,
            data: 1
        }));
        userSource.private.stream.send(5);

        strictEqual(data, '[xs.Interface xs.data.operation.source.IRead]1');

        //unbind
        postSource.unbind('user');

        userSource.private.stream.send(new xs.data.operation.Event({
            operation: xs.data.operation.source.IRead,
            data: 1
        }));
        userSource.private.stream.send(5);

        strictEqual(data, '[xs.Interface xs.data.operation.source.IRead]1');

    }, function () {
        xs.ContractsManager.remove('tests.data.Source.unbind.UserModel');
        xs.ContractsManager.remove('tests.data.Source.unbind.PostModel');
        xs.ContractsManager.remove('tests.data.Source.unbind.UserSource');
        xs.ContractsManager.remove('tests.data.Source.unbind.PostSource');
    });

    test('destroy', function () {
        var me = this;

        me.UserModel = xs.define(xs.Class, 'tests.data.Source.destroy.UserModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.destroy';

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

        me.PostModel = xs.define(xs.Class, 'tests.data.Source.destroy.PostModel', function () {

            var Class = this;

            Class.namespace = 'tests.data.Source.destroy';

            Class.imports = [ 'ns.UserModel' ];

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
                    model: 'ns.UserModel'
                }
            };

        });

        me.UserSource = xs.define(xs.Class, 'tests.data.Source.destroy.UserSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.destroy';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.UserModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        me.PostSource = xs.define(xs.Class, 'tests.data.Source.destroy.PostSource', function (self, imports) {

            var Class = this;

            Class.namespace = 'tests.data.Source.destroy';

            Class.extends = 'xs.data.Source';

            Class.imports = [
                {
                    Model: 'ns.PostModel'
                }
            ];

            Class.constant.model = xs.lazy(function () {
                return imports.Model;
            });

        });

        xs.onReady([
            'tests.data.Source.destroy.UserSource',
            'tests.data.Source.destroy.PostSource'
        ], me.done);

        return false;
    }, function () {
        var me = this;
        var userSource, postSource;

        userSource = new me.UserSource();
        postSource = new me.PostSource();

        postSource.bind('user', userSource);

        //postSource is bound
        strictEqual(postSource.isBound('user'), true);

        //destroy bound userSource
        userSource.destroy();

        //verify isDestroyed flag
        strictEqual(userSource.isDestroyed, true);

        //postSource is not bound - xs.event.Destroy was caught
        strictEqual(postSource.isBound('user'), false);

        //destroy postSource
        postSource.destroy();

        //verify isDestroyed flag
        strictEqual(postSource.isDestroyed, true);

    }, function () {
        xs.ContractsManager.remove('tests.data.Source.destroy.UserModel');
        xs.ContractsManager.remove('tests.data.Source.destroy.PostModel');
        xs.ContractsManager.remove('tests.data.Source.destroy.UserSource');
        xs.ContractsManager.remove('tests.data.Source.destroy.PostSource');
    });

});