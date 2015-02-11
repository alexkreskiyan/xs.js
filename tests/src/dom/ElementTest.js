/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.dom.Element', function () {

    'use strict';

    test('constructor', function () {

        //Element instance is required as first argument
        throws(function () {
            return new xs.dom.Element();
        });
        throws(function () {
            return new xs.dom.Element('div');
        });

        (new xs.dom.Element(document.createElement('div'))).destroy();
    });

    test('on', function () {

        var el = new xs.dom.Element(document.createElement('div'));

        //for own event - simple observable usage
        el.on('destroy', xs.emptyFn);
        strictEqual(el.private.domHandlers.length, 0);

        //for dom event - dom handler is generated
        el.on('click', xs.emptyFn);
        strictEqual(el.private.domHandlers.length, 1);
        strictEqual(el.private.domHandlers.hasKey('click'), true);

        el.destroy();
    });

    test('off', function () {

        var el = new xs.dom.Element(document.createElement('div'));

        el.on('click', xs.emptyFn);
        el.on('dblClick', xs.emptyFn);
        el.on('destroy', xs.emptyFn);
        strictEqual(JSON.stringify(el.private.domHandlers.keys()), '["click","dblClick"]');

        //all not used dom handlers are removed
        el.off('click', function (item) {
            return item.handler === xs.emptyFn;
        });
        strictEqual(JSON.stringify(el.private.domHandlers.keys()), '["dblClick"]');
        el.off();
        strictEqual(JSON.stringify(el.private.domHandlers.keys()), '[]');

        el.destroy();
    });

    test('destroy', function () {
        var me = this;

        var el = new xs.dom.Element(document.createElement('div'));

        el.on('click', xs.emptyFn);
        el.on('dblClick', xs.emptyFn);

        el.on('destroy', function () {
            //on next tick test is ready
            xs.nextTick(me.done);
        });

        el.destroy();

        //el reference removed
        strictEqual(el.private.hasOwnProperty('el'), false);

        //all handlers are removed
        strictEqual(el.private.hasOwnProperty('domHandlers'), false);
        strictEqual(el.private.hasOwnProperty('eventsHandlers'), false);
        return false;
    });

});