require([
    'xs.lang.Detect',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.class.Class'
], function () {
    'use strict';
    module('xs.Class');
    test('create', function () {
        //test create without descriptor fails
        throws(xs.Class.create);

        //test class descriptor
        var descriptor = {};
        var Class = xs.Class.create(function (self, ns) {
            xs.extend(descriptor, {
                self: self,
                ns:   ns
            });
            return descriptor;
        });

        //class is function
        strictEqual(xs.isFunction(Class), true);

        //class descriptor is assigned correctly
        strictEqual(Class.descriptor, descriptor);

        //self is saved
        strictEqual(Class.descriptor.self, Class);

        //ns is saved
        strictEqual(xs.isObject(Class.descriptor.ns), true);
    });
    test('processors add', function () {

    });
    test('processors get', function () {

    });
    test('processors delete', function () {

    });
    test('process class', function () {

    });
});