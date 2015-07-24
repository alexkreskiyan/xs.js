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

    test('query', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div xs-view-position="title"></div><div xs-view-position="body"></div></div>'
            });

            Class.positions = [
                'title',
                'body'
            ];

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var view = new me.Class();
        var title = view.title;
        var body = view.body;

        var label = new xs.view.Element(document.createElement('label'));
        var input = new xs.view.Element(document.createElement('input'));
        var button = new xs.view.Element(document.createElement('button'));

        title.add(label);
        body.add(input).add(button);

        //incorrect query call throws exception
        //query selector is not a string
        throws(function () {
            view.query();
        });
        //query flags are not a number
        throws(function () {
            view.query('a', null);
        });


        //simple query works in direct order
        var first = view.query('div');
        strictEqual(first.private.el, title.private.el);

        //reverse flag makes query work in reverse order
        var second = view.query('div', xs.view.Element.Reverse);
        strictEqual(second.private.el, body.private.el);

        //all flag returns a collection
        var selection = view.query('div', xs.view.Element.All);
        //repeated calls do not create new elements
        strictEqual(selection.at(0), first);
        strictEqual(selection.at(1), second);

        view.destroy();

        //after view destroy all selection elements are destroyed
        strictEqual(first.isDestroyed, true);
        strictEqual(second.isDestroyed, true);
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