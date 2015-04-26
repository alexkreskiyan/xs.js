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

        xs.define(xs.Interface, 'ns.Child', function () {
            this.namespace = 'tests.interface.preprocessors.imports';
            this.extends = 'ns.resources.Base';
        }, me.done);


        return false;
    }, function () {
        //here Base is already imported - all ok
        expect(0);

    }, function () {
        var me = this;

        var ns = window.tests.interface.preprocessors.imports;

        //remove created interfaces
        xs.ContractsManager.remove(ns.resources.Base.label);
        xs.ContractsManager.remove(ns.Child.label);
    });

});