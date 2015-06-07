/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.view.Element', function () {

    'use strict';

    test('constructor', function () {

        //Element instance is required as first argument
        throws(function () {
            return new xs.view.Element();
        });
        throws(function () {
            return new xs.view.Element('div');
        });

        (new xs.view.Element(document.createElement('div'))).destroy();
    });

    test('on', function () {
        var me = this;

        var el = new xs.view.Element(document.createElement('div'));

        //observable is applied correctly
        el.on(xs.reactive.event.Destroy, me.done);

        strictEqual(el.events.isActive, false);

        el.destroy();

        return false;
    });

    test('destroy', function () {
        var me = this;

        var el = new xs.view.Element(document.createElement('div'));

        el.on(xs.reactive.event.Destroy, me.done);

        //element is destroyed
        strictEqual(el.hasOwnProperty('el'), false);

        el.destroy();

        return false;
    });

});