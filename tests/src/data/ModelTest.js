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

        window.Model = me.Class = xs.Class(function () {

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
        strictEqual(model.data.name, undefined);
        //default assigned
        strictEqual(model.data.age, 0);

        //although, initial data may be passed
        model = new me.Class({
            name: 'max',
            age: '5'
        });
        //no default is given in config, assigned undefined
        strictEqual(model.data.name, 'max');
        //default assigned
        strictEqual(model.data.age, 5);
    });

});