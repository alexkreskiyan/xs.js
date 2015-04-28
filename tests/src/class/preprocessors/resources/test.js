/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.imports', function () {

    'use strict';

    test('resources usage chain', function () {
        var me = this;

        window.Class = me.Class = xs.define(xs.Class, 'ns.Child', function () {

            var Class = this;

            Class.namespace = 'tests.class.preprocessors.resources';

            Class.resources = {
                demo: new xs.resource.text.HTML({
                    url: 'src/class/preprocessors/resources/resources/demo.html'
                }),
                demo2: new xs.resource.text.HTML({
                    url: 'src/class/preprocessors/resources/resources/demo2.html'
                })
            };
        }, me.done);


        return false;
    }, function () {
        var me = this;

        strictEqual(Object.keys(me.Class.resources).toString(), 'demo,demo2');

        //check demo resource
        strictEqual(me.Class.resources.demo.isLoaded, true);
        strictEqual(me.Class.resources.demo.data.outerHTML, '<div>\n    <button></button>\n</div>');

        //check demo2 resource
        strictEqual(me.Class.resources.demo2.isLoaded, true);
        strictEqual(me.Class.resources.demo2.data.outerHTML, '<div>\n    <span></span>\n</div>');
    });

});