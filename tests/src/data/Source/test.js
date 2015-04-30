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

        source = new me.Source();
        expect(0);
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