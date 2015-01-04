/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.Interface', function () {

    'use strict';

    test('create', function () {
        //test create without descriptor fails
        throws(xs.Interface);

        var Interface = xs.Interface(function (self, ns) {
        });

        //interface is function
        strictEqual(xs.isFunction(Interface), true);
    });

    test('processors add', function () {
        var me = this;
        //setUp
        me.stack = xs.interface.preprocessors;

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
        me.stack.add('two', me.verifier, me.handler, 'first');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","one"]');

        //add processor before first
        me.stack.add('three', me.verifier, me.handler, 'before', 'two');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","one"]');

        //add processor before in middle
        me.stack.add('four', me.verifier, me.handler, 'before', 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one"]');

        //add processor after last
        me.stack.add('five', me.verifier, me.handler, 'after', 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one","five"]');

        //add processor after in middle
        me.stack.add('six', me.verifier, me.handler, 'after', 'three');
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
        me.stack = xs.interface.preprocessors;

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
        me.stack.reorder('three', 'first');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","one","two","four"]');

        //reorder last
        me.stack.reorder('one', 'last');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["three","two","four","one"]');

        //reorder before to first
        me.stack.reorder('two', 'before', 'three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","four","one"]');

        //reorder before in middle
        me.stack.reorder('four', 'before', 'three');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","four","three","one"]');

        //reorder after to last
        me.stack.reorder('four', 'after', 'one');
        strictEqual(JSON.stringify(me.stack.get().keys()), '["two","three","one","four"]');

        //reorder after in middle
        me.stack.reorder('three', 'after', 'one');
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
        me.stack = xs.interface.preprocessors;

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

    test('process interface', function () {
        var me = this;

        me.stack = xs.interface.preprocessors;

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
        xs.Interface(function () {

        }, function (Interface) {
            strictEqual(Interface.descriptor.chain, 'onetwothree');

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