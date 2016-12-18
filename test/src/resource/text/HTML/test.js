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

        //check isLoaded
        strictEqual(resource.isLoaded, true);


        //loaded template
        //config.url must be a string
        throws(function () {
            return new xs.resource.text.HTML({
                url: null
            });
        });

        //config.data is undefined by default
        resource = new xs.resource.text.HTML({
            url: '/tests/src/resource/text/HTML/resources/demo.html'
        });

        //check data
        strictEqual(resource.data, undefined);

        //check isLoaded
        strictEqual(resource.isLoaded, false);
    });

    test('load', function () {
        var me = this;

        //init test variables
        var resource;

        //config.data is undefined by default
        resource = new xs.resource.text.HTML({
            url: 'src/resource/text/HTML/resources/demo.html'
        });

        //check data
        strictEqual(resource.data, undefined);

        //check isLoaded
        strictEqual(resource.isLoaded, false);

        var resourceData;

        //load returns a promise
        resource.load().then(function (data) {

            //check data
            strictEqual(resource.data instanceof Element, true);
            strictEqual(resource.data.outerHTML, '<div>\n    <button></button>\n</div>');

            strictEqual(resource.data, data);

            //check isLoaded
            strictEqual(resource.isLoaded, true);

            //save data
            resourceData = data;

            //try to load resource again
            return resource.load();
        }).then(function (data) {

            //check data
            //resource data is not reloaded
            strictEqual(resource.data, data);
            strictEqual(resource.data, resourceData);

            me.done();
        });

        return false;
    });

});