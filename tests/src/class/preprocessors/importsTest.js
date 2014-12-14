/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.imports', function () {

    test('imports usage chain', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

        //add tests path
        xs.Loader.paths.add('tests', '/tests/resources');

        xs.define('ns.Child', function (Class, ns, imports) {
            this.namespace = 'tests.class.preprocessors.imports';
            this.extends = 'ns.Base';
            this.imports = [
                {one: 'ns.One'},
                'ns.Two',
                {three: 'ns.Three'}
            ];

            //save imports reference
            me.imports = imports;
        });

        xs.onReady(me.done);

        return false;
    }, function () {
        var me = this;
        var ns = tests.class.preprocessors.imports;

        //check imports
        strictEqual(xs.keys(me.imports).toString(), 'one,three');
        strictEqual(me.imports.one, ns.One);
        strictEqual(me.imports.three, ns.Three);

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);

        var ns = tests.class.preprocessors.imports;

        //delete created classes
        xs.ClassManager.delete(ns.One.label);
        xs.ClassManager.delete(ns.Two.label);
        xs.ClassManager.delete(ns.Three.label);
        xs.ClassManager.delete(ns.Base.label);
        xs.ClassManager.delete(ns.Child.label);
    });
});