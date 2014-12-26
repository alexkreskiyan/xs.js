/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.imports', function () {

    test('imports usage chain', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.remove(Object.keys(me.paths));

        //add tests path
        xs.Loader.paths.add('tests', '/tests/resources');

        xs.define(xs.Interface, 'ns.Child', function (Interface, ns, imports) {
            this.namespace = 'tests.interface.preprocessors.imports';
            this.extends = 'ns.Base';
            this.imports = [
                {one: 'ns.One'},
                'ns.Two',
                {three: 'ns.Three'}
            ];

            //save imports reference
            me.imports = imports;
        });

        xs.onReady([
            'tests.interface.preprocessors.imports.Child',
            'tests.interface.preprocessors.imports.Base',
            'tests.interface.preprocessors.imports.One',
            'tests.interface.preprocessors.imports.Two',
            'tests.interface.preprocessors.imports.Three'
        ], me.done);


        return false;
    }, function () {
        var me = this;
        var ns = tests.interface.preprocessors.imports;

        //check imports
        strictEqual(Object.keys(me.imports).toString(), 'one,three');
        strictEqual(me.imports.one, ns.One);
        strictEqual(me.imports.three, ns.Three);

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.remove(Object.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);

        var ns = tests.interface.preprocessors.imports;

        //remove created interfacees
        xs.ContractsManager.remove(ns.One.label);
        xs.ContractsManager.remove(ns.Two.label);
        xs.ContractsManager.remove(ns.Three.label);
        xs.ContractsManager.remove(ns.Base.label);
        xs.ContractsManager.remove(ns.Child.label);
    });
});