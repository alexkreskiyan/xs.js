/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.resource.text.HTML', function () {

    'use strict';

    test('constructor', function () {
        //init test variables
        var resource;

        //config must be given as an object
        throws(function () {
            return new xs.resource.text.HTML();
        });

        //if no data given, url must be given
        throws(function () {
            return new xs.resource.text.HTML({});
        });


        //preloaded template
        //config.data must be a string
        throws(function () {
            return new xs.resource.text.HTML({
                data: null
            });
        });

        //config.data is saved as resource.data
        resource = new xs.resource.text.HTML({
            data: '<div></div>'
        });

        //check data
        strictEqual(resource.data instanceof Element, true);
        strictEqual(resource.data.outerHTML, '<div></div>');


        //loaded template
        //config.url must be a string
        throws(function () {
            return new xs.resource.text.HTML({
                url: null
            });
        });

        //config.data is undefined by default
        resource = new xs.resource.text.HTML({
            url: '/tests/resources/resource/text/HTML/demo.html'
        });

        //check data
        strictEqual(resource.data, undefined);
    });

});