/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Model', function () {

    'use strict';

    test('preprocessor. no primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: 'xs.data.attribute.Number',
                name: 'xs.data.attribute.String',
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //assert, that attributes formed
        strictEqual(me.Class.descriptor.hasOwnProperty('attributes'), true);

        //assert, that all attributes processed
        strictEqual(me.Class.descriptor.attributes.size, 3);

        //verify attributes
        strictEqual(me.Class.descriptor.attributes.at('id') instanceof xs.data.attribute.Number, true);
        strictEqual(me.Class.descriptor.attributes.at('name') instanceof xs.data.attribute.String, true);
        strictEqual(me.Class.descriptor.attributes.at('age') instanceof xs.data.attribute.Number, true);

        //check primary attributes
        strictEqual(me.Class.descriptor.primaryAttributes.length, 0);
    });

    test('preprocessor. single primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    default: 0,
                    primary: true
                },
                name: 'xs.data.attribute.String',
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //assert, that attributes formed
        strictEqual(me.Class.descriptor.hasOwnProperty('attributes'), true);

        //assert, that all attributes processed
        strictEqual(me.Class.descriptor.attributes.size, 3);

        //verify attributes
        strictEqual(me.Class.descriptor.attributes.at('id') instanceof xs.data.attribute.Number, true);
        strictEqual(me.Class.descriptor.attributes.at('name') instanceof xs.data.attribute.String, true);
        strictEqual(me.Class.descriptor.attributes.at('age') instanceof xs.data.attribute.Number, true);

        //check primary attributes
        strictEqual(me.Class.descriptor.primaryAttributes.toString(), 'id');
    });

    test('preprocessor. multiple primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    default: 0,
                    primary: true
                },
                name: {
                    type: 'xs.data.attribute.String',
                    primary: true
                },
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //assert, that attributes formed
        strictEqual(me.Class.descriptor.hasOwnProperty('attributes'), true);

        //assert, that all attributes processed
        strictEqual(me.Class.descriptor.attributes.size, 3);

        //verify attributes
        strictEqual(me.Class.descriptor.attributes.at('id') instanceof xs.data.attribute.Number, true);
        strictEqual(me.Class.descriptor.attributes.at('name') instanceof xs.data.attribute.String, true);
        strictEqual(me.Class.descriptor.attributes.at('age') instanceof xs.data.attribute.Number, true);

        //check primary attributes
        strictEqual(me.Class.descriptor.primaryAttributes.toString(), 'id,name');
    });

    test('constructor', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    type: 'xs.data.attribute.String',
                    default: 'John'
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

        //verufy attributes' values
        strictEqual(model.id.get(), undefined);
        strictEqual(model.name.get(), 'John');
        strictEqual(model.age.get(), 0);

        model.destroy();

        //although, initial data may be passed
        model = new me.Class({
            id: 5,
            age: '25'
        });

        //verufy attributes' values
        strictEqual(model.id.get(), 5);
        strictEqual(model.name.get(), 'John');
        strictEqual(model.age.get(), 25);

        model.destroy();
    });

    test('primary. no primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: 'xs.data.attribute.Number',
                name: 'xs.data.attribute.String',
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model = new me.Class({
            id: 1,
            name: 'max',
            age: 25
        });

        //assert, that primary is undefined
        strictEqual(model.primary(), undefined);
    });

    test('preprocessor. single primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    default: 0,
                    primary: true
                },
                name: 'xs.data.attribute.String',
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model = new me.Class({
            id: 1,
            name: 'max',
            age: 25
        });

        //assert, that primary is equal to id
        strictEqual(model.primary(), 1);
    });

    test('preprocessor. multiple primary', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    default: 0,
                    primary: true
                },
                name: {
                    type: 'xs.data.attribute.String',
                    primary: true
                },
                age: {
                    type: 'xs.data.attribute.Number'
                }
            };

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var model = new me.Class({
            id: 1,
            name: 'max',
            age: 25
        });

        //assert, that primary is id+name composite
        strictEqual(JSON.stringify(model.primary()), '{"id":1,"name":"max"}');
    });

    test('data', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    type: 'xs.data.attribute.String',
                    default: 'John'
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

        //verufy attributes' values
        strictEqual(model.id.get(), undefined);
        strictEqual(model.name.get(), 'John');
        strictEqual(model.age.get(), 0);

        model.destroy();

        //although, initial data may be passed
        model = new me.Class({
            id: 5,
            age: '25'
        });

        //verufy attributes' values
        strictEqual(model.id.get(), 5);
        strictEqual(model.name.get(), 'John');
        strictEqual(model.age.get(), 25);

        //when attribute is changed
        model.name = 555;
        strictEqual(model.name.get(), '555');
        model.age = '55';
        strictEqual(model.age.get(), 55);

        var state = '';
        //event.SetBefore is called before value is changed
        model.on(xs.data.attribute.event.SetBefore, function (event) {
            state += event.attribute + ':' + event.old + ':' + event.new + ';';

            //no change if name is number
            if (event.attribute === 'name' && xs.isNumber(event.new)) {
                return false;
            }
        });

        model.name = 5;
        strictEqual(state, 'name:555:5;');
        strictEqual(model.name.get(), '555');

        model.name = 'max';
        strictEqual(state, 'name:555:5;name:555:max;');
        strictEqual(model.name.get(), 'max');

        model.destroy();

    });

    test('destroy', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Model';

            Class.attributes = {
                id: {
                    type: 'xs.data.attribute.Number',
                    primary: true
                },
                name: {
                    type: 'xs.data.attribute.String',
                    default: 'John'
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

        model.on(xs.event.Destroy, function () {
            value = 1;
        });

        model.destroy();

        strictEqual(model.isDestroyed, true);
        strictEqual(value, 1);
    });

});