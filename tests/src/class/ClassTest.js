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
        var stack = xs.Class.preProcessors;

        var size = xs.size(stack.get());
        var verifier = function () {
            return true;
        };
        var handler = function () {

        };

        //add processor
        stack.add('demo', verifier, handler);

        //processor added
        strictEqual(xs.size(stack.get()), size + 1);
        var items = stack.get();

        //position is last
        strictEqual(xs.keys(items).pop(), 'demo');

        //verifier assigned
        strictEqual(items.demo.verifier, verifier);

        //handler assigned
        strictEqual(items.demo.handler, handler);

        //remove processor
        stack.delete('demo');
    });
    test('processors reorder', function () {

    });
    test('processors delete', function () {

    });
    test('process class', function () {

    });
});