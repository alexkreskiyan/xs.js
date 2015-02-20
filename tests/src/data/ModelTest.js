/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Model', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.constant.attributes = {
                name: {
                    type: 'xs.data.attribute.String'
                },
                age: {
                    type: 'xs.data.attribute.Number',
                    default: 0
                }
            };
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model;

        //incorrect data causes error
        throws(function () {
            return new me.Class('alex');
        });

        //model can be created empty
        model = new me.Class();
        //no default is given in config, assigned undefined
        strictEqual(model.data.name.get(), undefined);
        //default assigned
        strictEqual(model.data.age.get(), 0);

        model.destroy();

        //although, initial data may be passed
        model = new me.Class({
            name: 'max',
            age: '5'
        });
        //no default is given in config, assigned undefined
        strictEqual(model.data.name.get(), 'max');
        //default assigned
        strictEqual(model.data.age.get(), 5);

        model.destroy();
    });

    test('data', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.constant.attributes = {
                name: {
                    type: 'xs.data.attribute.String'
                },
                age: {
                    type: 'xs.data.attribute.Number',
                    default: 0
                }
            };
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model;

        //attributes are processed when model is created
        //model can be created empty
        model = new me.Class();
        //no default is given in config, assigned undefined
        strictEqual(model.data.name.get(), undefined);
        //default assigned
        strictEqual(model.data.age.get(), 0);

        model.destroy();

        //although, initial data may be passed
        model = new me.Class({
            name: 'max',
            age: '5'
        });
        //no default is given in config, assigned undefined
        strictEqual(model.data.name.get(), 'max');
        //default assigned
        strictEqual(model.data.age.get(), 5);

        //when attribute is changed
        model.data.name.set(555);
        strictEqual(model.data.name.get(), '555');
        model.data.age.set('55');
        strictEqual(model.data.age.get(), 55);

        var state = '';
        //change:before is called before value is changed
        model.on('change:before', function (event) {
            state += event.attribute + ':' + event.old + ':' + event.new + ';';

            //no change if name is number
            if (event.attribute === 'name' && xs.isNumber(event.new)) {
                return false;
            }
        });

        model.data.name.set(5);
        strictEqual(state, 'name:555:5;');
        strictEqual(model.data.name.get(), '555');

        model.data.name.set('max');
        strictEqual(state, 'name:555:5;name:555:max;');
        strictEqual(model.data.name.get(), 'max');

        model.destroy();

    });

    test('destroy', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.constant.attributes = {
                name: {
                    type: 'xs.data.attribute.String'
                },
                age: {
                    type: 'xs.data.attribute.Number',
                    default: 0
                }
            };
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model = new me.Class();

        var value = 0;

        model.on('destroy', function () {
            value = 1;
        });

        model.destroy();

        strictEqual(model.isDestroyed, true);
        strictEqual(value, 1);
    });

});