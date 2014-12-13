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
        //create simple class
        var Class = xs.Class.create(function (self, ns) {
        });

        //assign some constructor
        Class.descriptor.constructor = function (a, b) {
            this.a = a;
            this.b = b;
        };


        //compare new and factory variants

        //get instances
        var sampleNew = new Class(1, 2);
        var sampleFactory = Class.factory(1, 2);
    },function(){
        //constructor is Class
        strictEqual(sampleNew.constructor, Class);
        strictEqual(sampleFactory.constructor, Class);

        //constructor is assigned in prototype
        strictEqual(sampleNew.hasOwnProperty('constructor'), false);
        strictEqual(sampleFactory.hasOwnProperty('constructor'), false);

        //parameters assigned correctly
        strictEqual(sampleNew.a, 1);
        strictEqual(sampleNew.b, 2);
        strictEqual(sampleFactory.a, 1);
        strictEqual(sampleFactory.b, 2);
    });

    test('processors add', function () {
        //setUp
        var stack = xs.Class.preprocessors;

        //save stack items
        var save = stack.get();

        //clear stack
        xs.each(save, function (item, name) {
            stack.delete(name);
        });

        var verifier = function () {

            return true;
        };
        var handler = function () {

        };

    },function(){
        //add processor to last
        stack.add('one', verifier, handler);
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["one"]');

        //add processor to first
        stack.add('two', verifier, handler, 'first');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","one"]');

        //add processor before first
        stack.add('three', verifier, handler, 'before', 'two');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","two","one"]');

        //add processor before in middle
        stack.add('four', verifier, handler, 'before', 'one');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","two","four","one"]');

        //add processor after last
        stack.add('five', verifier, handler, 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","two","four","one","five"]');

        //add processor after in middle
        stack.add('six', verifier, handler, 'after', 'three');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","six","two","four","one","five"]');

        //check verifiers and handlers
        xs.each(stack.get(), function (item) {
            //verifier assigned
            strictEqual(item.verifier, verifier);

            //handler assigned
            strictEqual(item.handler, handler);
        });

    },function(){
        //clear stack
        xs.each(stack.get(), function (item, name) {
            stack.delete(name);
        });

        //reset stack
        xs.each(save, function (item, name) {
            stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors reorder', function () {
        var stack = xs.Class.preprocessors;

        //save stack items
        var save = stack.get();

        //clear stack
        xs.each(save, function (item, name) {
            stack.delete(name);
        });

        var verifier = function () {

            return true;
        };
        var handler = function () {

        };
    },function(){

        //add processors
        stack.add('one', verifier, handler);
        stack.add('two', verifier, handler);
        stack.add('three', verifier, handler);
        stack.add('four', verifier, handler);

        //processors added correctly
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["one","two","three","four"]');

        //reorder first
        stack.reorder('three', 'first');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","one","two","four"]');

        //reorder last
        stack.reorder('one', 'last');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["three","two","four","one"]');

        //reorder before to first
        stack.reorder('two', 'before', 'three');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","three","four","one"]');

        //reorder before in middle
        stack.reorder('four', 'before', 'three');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","four","three","one"]');

        //reorder after to last
        stack.reorder('four', 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","three","one","four"]');

        //reorder after in middle
        stack.reorder('three', 'after', 'one');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","one","three","four"]');

    },function(){

        //clear stack
        xs.each(stack.get(), function (item, name) {
            stack.delete(name);
        });

        //reset stack
        xs.each(save, function (item, name) {
            stack.add(name, item.verifier, item.handler);
        });
    });

    test('processors delete', function () {
        //setUp
        var stack = xs.Class.preprocessors;

        //save stack items
        var save = stack.get();

        //clear stack
        xs.each(save, function (item, name) {
            stack.delete(name);
        });

        var verifier = function () {

            return true;
        };
        var handler = function () {

        };

        //add processors
        stack.add('one', verifier, handler);
        stack.add('two', verifier, handler);
        stack.add('three', verifier, handler);
        stack.add('four', verifier, handler);
        stack.add('five', verifier, handler);

    },function(){

        //delete undefined
        throws(function () {
            stack.delete('unknown');
        });

        //delete first
        stack.delete('one');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","three","four","five"]');

        //delete last
        stack.delete('five');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","three","four"]');

        //delete in middle
        stack.delete('three');
        strictEqual(JSON.stringify(xs.keys(stack.get())), '["two","four"]');

    },function(){

        //clear stack
        xs.each(stack.get(), function (item, name) {
            stack.delete(name);
        });

        //reset stack
        xs.each(save, function (item, name) {
            stack.add(name, item.verifier, item.handler);
        });
    });

    test('process class', function () {
        var stack = xs.Class.preprocessors;

        //save stack items
        var save = stack.get();

        //clear stack
        xs.each(save, function (item, name) {
            stack.delete(name);
        });

        var verifier = function () {

            return true;
        };

        //add processors
        stack.add('one', verifier, function (self) {
            self.descriptor.chain = 'one';
        });
        stack.add('two', verifier, function (self, descriptor, ns, dependencies, ready) {
            self.descriptor.chain += 'two';
            setTimeout(ready, 100);

            return false;
        });
        stack.add('three', verifier, function (self, descriptor, ns, dependencies, ready) {
            self.descriptor.chain += 'three';
            setTimeout(ready, 100);

            return false;
        });

    },function(){
        xs.Class.create(function () {

        }, function (Class) {
            start();

            strictEqual(Class.descriptor.chain, 'onetwothree');
        });
    },function(){

        //clear stack
        xs.each(stack.get(), function (item, name) {
            stack.delete(name);
        });

        //reset stack
        xs.each(save, function (item, name) {
            stack.add(name, item.verifier, item.handler);
        });
    });
});