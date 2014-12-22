/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.Class', function () {

    test('create', function () {
        //test create without descriptor fails
        throws(xs.Class.create);

        var Class = xs.Class.create(function (self, ns) {
        });

        //class is function
        strictEqual(xs.isFunction(Class), true);
    });

    test('factory', function () {
        var me = this;
        //create simple class
        me.Class = xs.Class.create(function (self, ns) {
        });

        //assign some constructor
        me.Class.descriptor.constructor = function (a, b) {
            this.a = a;
            this.b = b;
        };


        //compare new and factory variants

        //get instances
        me.sampleNew = new me.Class(1, 2);
        me.sampleFactory = me.Class.factory(1, 2);
    }, function () {
        var me = this;
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
        me.stack = xs.Class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        xs.each(me.save, function (item, name) {
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
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["one"]');

        //add processor to first
        me.stack.add('two', me.verifier, me.handler, 'first');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","one"]');

        //add processor before first
        me.stack.add('three', me.verifier, me.handler, 'before', 'two');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","two","one"]');

        //add processor before in middle
        me.stack.add('four', me.verifier, me.handler, 'before', 'one');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","two","four","one"]');

        //add processor after last
        me.stack.add('five', me.verifier, me.handler, 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","two","four","one","five"]');

        //add processor after in middle
        me.stack.add('six', me.verifier, me.handler, 'after', 'three');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","six","two","four","one","five"]');

        //check verifiers and handlers
        xs.each(me.stack.get(), function (item) {
            //verifier assigned
            strictEqual(item.verifier, me.verifier);

            //handler assigned
            strictEqual(item.handler, me.handler);
        });

    }, function () {
        var me = this;
        //clear stack
        xs.each(me.stack.get(), function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        xs.each(me.save, function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors reorder', function () {
        var me = this;
        me.stack = xs.Class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        xs.each(me.save, function (item, name) {
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
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["one","two","three","four"]');

        //reorder first
        me.stack.reorder('three', 'first');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","one","two","four"]');

        //reorder last
        me.stack.reorder('one', 'last');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["three","two","four","one"]');

        //reorder before to first
        me.stack.reorder('two', 'before', 'three');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","three","four","one"]');

        //reorder before in middle
        me.stack.reorder('four', 'before', 'three');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","four","three","one"]');

        //reorder after to last
        me.stack.reorder('four', 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","three","one","four"]');

        //reorder after in middle
        me.stack.reorder('three', 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","one","three","four"]');

    }, function () {
        var me = this;

        //clear stack
        xs.each(me.stack.get(), function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        xs.each(me.save, function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors remove', function () {
        var me = this;
        //setUp
        me.stack = xs.Class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        xs.each(me.save, function (item, name) {
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
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","three","four","five"]');

        //remove last
        me.stack.remove('five');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","three","four"]');

        //remove in middle
        me.stack.remove('three');
        strictEqual(JSON.stringify(xs.keys(me.stack.get())), '["two","four"]');

    }, function () {
        var me = this;

        //clear stack
        xs.each(me.stack.get(), function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        xs.each(me.save, function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });

    test('process class', function () {
        var me = this;
        me.stack = xs.Class.preprocessors;

        //save stack items
        me.save = me.stack.get();

        //clear stack
        xs.each(me.save, function (item, name) {
            me.stack.remove(name);
        });

        me.verifier = function () {

            return true;
        };

        //add processors
        me.stack.add('one', me.verifier, function (self) {
            self.descriptor.chain = 'one';
        });
        me.stack.add('two', me.verifier, function (self, descriptor, ns, dependencies, ready) {
            self.descriptor.chain += 'two';
            setTimeout(ready, 100);

            return false;
        });
        me.stack.add('three', me.verifier, function (self, descriptor, ns, dependencies, ready) {
            self.descriptor.chain += 'three';
            setTimeout(ready, 100);

            return false;
        });

    }, function () {
        var me = this;
        xs.Class.create(function () {

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
        xs.each(me.stack.get(), function (item, name) {
            me.stack.remove(name);
        });

        //reset stack
        xs.each(me.save, function (item, name) {
            me.stack.add(name, item.verifier, item.handler);
        });
    });
});