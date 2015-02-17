/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.imports', function () {

    'use strict';

    test('imports usage chain', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.remove(Object.keys(me.paths));

        //add tests path
        xs.Loader.paths.add('tests', 'resources');

        xs.define(xs.Interface, 'ns.Child', function () {
            this.namespace = 'tests.interface.preprocessors.imports';
            this.extends = 'ns.Base';
            this.imports = [
                {one: 'ns.One'},
                'ns.Two',
                {three: 'ns.Three'}
            ];
        });

        xs.onReady([
            'tests.interface.preprocessors.imports.Child',
            'tests.interface.preprocessors.imports.Base'
        ], me.done);


        return false;
    }, function () {
        //here Base is already imported - all ok
        expect(0);

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.remove(Object.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);

        var ns = window.tests.interface.preprocessors.imports;

        //remove created interfaces
        xs.ContractsManager.remove(ns.Base.label);
        xs.ContractsManager.remove(ns.Child.label);
    });

});