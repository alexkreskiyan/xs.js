/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.Class', function () {

    'use strict';

    test('create', function () {
        //test create without descriptor fails
        throws(xs.Class);

        var Class = xs.Class(function (self, ns) {
        });

        //class is function
        strictEqual(xs.isFunction(Class), true);
    });

    test('factory', function () {
        var me = this;
        //create simple class
        me.Class = xs.Class(xs.noop, me.done);

        //assign some constructor
        me.Class.descriptor.constructor = function (a, b) {
            this.a = a;
            this.b = b;
        };

        return false;
    }, function () {
        var me = this;

        //compare new and factory variants

        //get instances
        me.sampleNew = new me.Class(1, 2);
        me.sampleFactory = me.Class.factory(1, 2);

        //constructor is Class
        strictEqual(me.sampleNew.constructor, me.Class);
        strictEqual(me.sampleFactory.constructor, me.Class);

        //constructor is assigned in prototype
        strictEqual(me.sampleNew.hasOwnProperty('constructor'), false);
        strictEqual(me.sampleFactory.hasOwnProperty('constructor'), false);

        //parameters assigned correctly
        strictEqual(me.sampleNew.a, 1);
        strictEqual(me.sampleNew.b, 2);
        strictEqual(me.sampleFactory.a, 1);
        strictEqual(me.sampleFactory.b, 2);
    });

    test('processors add', function () {
        var me = this;
        //setUp
        me.stack = xs.class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        me.save.each(function (item, name) {
            me.stack.remove(name);
        });

        me.verifier = function () {

            return true;
        };
        me.handler = function () {

        };

    }, function () {
        var me = this;
        //add processor to last
        me.stack.add('one', me.verifier, me.handler);
        strictEqual(JSON.stringify(me.stack.get().keys()), '["one"]');

        //add processor to first
        me.stack.add('two', me.verifier, me.handler, xs.core.Collection.First);
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","one"]');

        //add processor before first
        me.stack.add('three', me.verifier, me.handler, xs.core.Collection.Before, 'two');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","one"]');

        //add processor before in middle
        me.stack.add('four', me.verifier, me.handler, xs.core.Collection.Before, 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one"]');

        //add processor after last
        me.stack.add('five', me.verifier, me.handler, xs.core.Collection.After, 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one","five"]');

        //add processor after in middle
        me.stack.add('six', me.verifier, me.handler, xs.core.Collection.After, 'three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","six","two","four","one","five"]');

        //check verifiers and handlers
        me.stack.get().each(function (item) {
            //verifier assigned
            strictEqual(item.verifier, me.verifier);

            //handler assigned
            strictEqual(item.handler, me.handler);
        });

    }, function () {
        var me = this;
        //clear stack
        me.stack.get().each(function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        me.save.each(function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors reorder', function () {
        var me = this;
        me.stack = xs.class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        me.save.each(function (item, name) {
            me.stack.remove(name);
        });

        me.verifier = function () {

            return true;
        };
        me.handler = function () {

        };
    }, function () {
        var me = this;

        //add processors
        me.stack.add('one', me.verifier, me.handler);
        me.stack.add('two', me.verifier, me.handler);
        me.stack.add('three', me.verifier, me.handler);
        me.stack.add('four', me.verifier, me.handler);

        //processors added correctly
        strictEqual(JSON.stringify(me.stack.get().keys()), '["one","two","three","four"]');

        //reorder first
        me.stack.reorder('three', xs.core.Collection.First);
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","one","two","four"]');

        //reorder last
        me.stack.reorder('one', xs.core.Collection.Last);
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one"]');

        //reorder before to first
        me.stack.reorder('two', xs.core.Collection.Before, 'three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","four","one"]');

        //reorder before in middle
        me.stack.reorder('four', xs.core.Collection.Before, 'three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","four","three","one"]');

        //reorder after to last
        me.stack.reorder('four', xs.core.Collection.After, 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","one","four"]');

        //reorder after in middle
        me.stack.reorder('three', xs.core.Collection.After, 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","one","three","four"]');

    }, function () {
        var me = this;

        //clear stack
        me.stack.get().each(function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        me.save.each(function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors remove', function () {
        var me = this;
        //setUp
        me.stack = xs.class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        me.save.each(function (item, name) {
            me.stack.remove(name);
        });

        me.verifier = function () {

            return true;
        };
        me.handler = function () {

        };

        //add processors
        me.stack.add('one', me.verifier, me.handler);
        me.stack.add('two', me.verifier, me.handler);
        me.stack.add('three', me.verifier, me.handler);
        me.stack.add('four', me.verifier, me.handler);
        me.stack.add('five', me.verifier, me.handler);

    }, function () {
        var me = this;

        //remove undefined
        throws(function () {
            me.stack.remove('unknown');
        });

        //remove first
        me.stack.remove('one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","four","five"]');

        //remove last
        me.stack.remove('five');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","four"]');

        //remove in middle
        me.stack.remove('three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","four"]');

    }, function () {
        var me = this;

        //clear stack
        me.stack.get().each(function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        me.save.each(function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('process class', function () {
        var me = this;

        me.stack = xs.class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        me.save.each(function (item, name) {
            me.stack.remove(name);
        });

        me.verifier = function () {

            return true;
        };

        //add processors
        me.stack.add('one', me.verifier, function (self) {
            self.descriptor.chain = 'one';
        });
        me.stack.add('two', me.verifier, function (self, descriptor, dependencies, ready) {
            self.descriptor.chain += 'two';
            setTimeout(ready, 100);

            return false;
        });
        me.stack.add('three', me.verifier, function (self, descriptor, dependencies, ready) {
            self.descriptor.chain += 'three';
            setTimeout(ready, 100);

            return false;
        });

    }, function () {
        var me = this;
        xs.Class(function () {

        }, function (Class) {
            strictEqual(Class.descriptor.chain, 'onetwothree');

            //continue
            me.done();
        });

        //return false - mark async run
        return false;
    }, function () {
        var me = this;

        //clear stack
        me.stack.get().each(function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        me.save.each(function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

});