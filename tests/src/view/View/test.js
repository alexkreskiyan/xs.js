/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.view.View', function () {

    'use strict';

    test('simple constructor', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<input type="text" placeholder="search">'
            });

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var view;

        //no argument creates view from template
        view = new me.Class();

        //view element is correctly parsed from template
        strictEqual(view.private.el instanceof HTMLInputElement, true);
        strictEqual(view.private.el.getAttribute('type'), 'text');
        strictEqual(view.private.el.getAttribute('placeholder'), 'search');
        view.destroy();

        //single argument must be an Element
        throws(function () {
            return new me.Class('input');
        });

        //view can be created as a wrapper to existent element
        view = new me.Class(document.createElement('input'));
        strictEqual(view.private.el instanceof HTMLInputElement, true);
        strictEqual(view.private.el.attributes.length, 0);
        view.destroy();
    });

    test('simple positions', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
            });

            Class.positions = [
                'title',
                'body'
            ];

        }, me.done);

        return false;
    }, function () {
        var me = this;
        var view;

        //view has 2 positions. positions are xs.data.Collection instances
        view = new me.Class();
        strictEqual(JSON.stringify(Object.keys(view.private.positions)), '["title","body"]');
        strictEqual(view.title instanceof xs.data.Collection, true);
        strictEqual(view.body instanceof xs.data.Collection, true);
        view.destroy();
    });

    test('query', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
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

        var label = new xs.view.View(document.createElement('label'));
        var input = new xs.view.View(document.createElement('input'));
        var button = new xs.view.View(document.createElement('button'));

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
        var second = view.query('div', xs.view.View.Reverse);
        strictEqual(second.private.el, body.private.el);

        //all flag returns a collection
        var selection = view.query('div', xs.view.View.All);
        //repeated calls do not create new elements
        strictEqual(selection.at(0), first);
        strictEqual(selection.at(1), second);

        view.destroy();

        //after view destroy all selection elements are destroyed
        strictEqual(first.isDestroyed, true);
        strictEqual(second.isDestroyed, true);
    });

    test('add', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
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

        //add two views to title and one - to body
        var titleA = new me.Class();
        var elementTitleA = titleA.private.el;
        var titleB = new me.Class();
        var elementTitleB = titleB.private.el;
        var bodyA = new me.Class();
        var elementBodyA = bodyA.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.size, 0);
        strictEqual(body.size, 0);

        //elements
        //titleA
        strictEqual(titleA.private.hasOwnProperty('container'), false);
        strictEqual(titleA.private.el.parentElement, null);
        //titleB
        strictEqual(titleB.private.hasOwnProperty('container'), false);
        strictEqual(titleB.private.el.parentElement, null);
        //bodyA
        strictEqual(bodyA.private.hasOwnProperty('container'), false);
        strictEqual(bodyA.private.el.parentElement, null);

        //add items to view
        title.add(titleA).add(titleB);
        body.add(bodyA);

        //verify subsequent state
        //view
        strictEqual(title.size, 2);
        strictEqual(title.at(0), titleA);
        strictEqual(title.at(1), titleB);
        strictEqual(title.private.el.childNodes.length, 2);
        strictEqual(body.size, 1);
        strictEqual(body.at(0), bodyA);
        strictEqual(body.private.el.childNodes.length, 1);

        //elements
        //titleA
        strictEqual(titleA.private.container, title);
        strictEqual(elementTitleA.parentElement, title.private.el);
        //titleB
        strictEqual(titleB.private.container, title);
        strictEqual(elementTitleB.parentElement, title.private.el);
        //bodyA
        strictEqual(bodyA.private.container, body);
        strictEqual(elementBodyA.parentElement, body.private.el);

        view.destroy();
    });

    test('set', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
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

        //add two views to title and one - to body
        var titleA = new me.Class();
        var elementTitleA = titleA.private.el;
        var titleB = new me.Class();
        var elementTitleB = titleB.private.el;
        var bodyA = new me.Class();
        var elementBodyA = bodyA.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.size, 0);
        strictEqual(body.size, 0);

        //elements
        //titleA
        strictEqual(titleA.private.hasOwnProperty('container'), false);
        strictEqual(titleA.private.el.parentElement, null);
        //titleB
        strictEqual(titleB.private.hasOwnProperty('container'), false);
        strictEqual(titleB.private.el.parentElement, null);
        //bodyA
        strictEqual(bodyA.private.hasOwnProperty('container'), false);
        strictEqual(bodyA.private.el.parentElement, null);

        //process replace from new view
        title.add(titleA);
        title.set(0, titleB);

        //verify middle state
        //view
        strictEqual(title.size, 1);
        strictEqual(title.at(0), titleB);
        strictEqual(title.private.el.childNodes.length, 1);

        //elements
        //titleA
        strictEqual(titleA.isDestroyed, true);
        strictEqual(elementTitleA.parentElement, null);
        //titleB
        strictEqual(titleB.private.container, title);
        strictEqual(elementTitleB.parentElement, title.private.el);

        //process replace with existent
        body.add(bodyA);
        title.set(0, bodyA);

        //verify subsequent state
        //view
        strictEqual(title.size, 1);
        strictEqual(title.at(0), bodyA);
        strictEqual(title.private.el.childNodes.length, 1);

        //elements
        //titleB
        strictEqual(titleB.isDestroyed, true);
        strictEqual(elementTitleB.parentElement, null);
        //bodyA
        strictEqual(bodyA.private.container, title);
        strictEqual(elementBodyA.parentElement, title.private.el);

        view.destroy();
    });

    test('remove', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
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

        //use two views
        var titleA = new me.Class();
        var elementTitleA = titleA.private.el;
        var titleB = new me.Class();
        var elementTitleB = titleB.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.size, 0);
        strictEqual(body.size, 0);

        //elements
        //titleA
        strictEqual(titleA.private.hasOwnProperty('container'), false);
        strictEqual(titleA.private.el.parentElement, null);
        //titleB
        strictEqual(titleB.private.hasOwnProperty('container'), false);
        strictEqual(titleB.private.el.parentElement, null);


        //process remove via a move
        body.add(titleA);
        title.add(titleA);

        //verify middle state
        //view
        strictEqual(title.size, 1);
        strictEqual(title.at(0), titleA);
        strictEqual(title.private.el.childNodes.length, 1);
        strictEqual(body.size, 0);

        //elements
        //titleA
        strictEqual(titleA.isDestroyed, false);
        strictEqual(elementTitleA.parentElement, title.private.el);


        //process remove via a set
        body.add(titleB);
        title.set(0, titleB);

        //verify middle state
        //view
        strictEqual(title.size, 1);
        strictEqual(title.at(0), titleB);
        strictEqual(title.private.el.childNodes.length, 1);

        //elements
        //titleA
        strictEqual(titleA.isDestroyed, true);
        strictEqual(elementTitleA.parentElement, null);
        //titleB
        strictEqual(titleB.isDestroyed, false);
        strictEqual(elementTitleB.parentElement, title.private.el);


        //concrete remove
        title.remove(titleB);

        //verify subsequent state
        //view
        strictEqual(title.size, 0);
        strictEqual(title.private.el.childNodes.length, 0);

        //elements
        //titleB
        strictEqual(titleB.isDestroyed, true);
        strictEqual(elementTitleB.parentElement, null);

        view.destroy();
    });

    test('destroy', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.view.View';

            Class.constant.template = new xs.resource.text.HTML({
                data: '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>'
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

        //add two views to title and one - to body
        var titleA = new me.Class();
        var elementTitleA = titleA.private.el;
        var titleB = new me.Class();
        var elementTitleB = titleB.private.el;
        var bodyA = new me.Class();
        var elementBodyA = bodyA.private.el;
        title.add(titleA).add(titleB);
        body.add(bodyA);

        //verify view
        //title
        strictEqual(title.size, 2);
        strictEqual(title.at(0), titleA);
        strictEqual(title.at(1), titleB);
        strictEqual(title.private.el.childNodes.length, 2);
        strictEqual(elementTitleA.parentElement, title.private.el);
        strictEqual(elementTitleB.parentElement, title.private.el);

        strictEqual(body.size, 1);
        strictEqual(body.at(0), bodyA);
        strictEqual(body.private.el.childNodes.length, 1);
        strictEqual(elementBodyA.parentElement, body.private.el);

        view.destroy();


        //verify view completely

        //view is destroyed
        strictEqual(view.isDestroyed, true);

        //title is destroyed
        strictEqual(title.isDestroyed, true);

        //body is destroyed
        strictEqual(title.isDestroyed, true);

        //verify children

        //titleA
        strictEqual(titleA.isDestroyed, true);
        strictEqual(elementTitleA.parentElement, null);

        //titleB
        strictEqual(titleB.isDestroyed, true);
        strictEqual(elementTitleB.parentElement, null);

        //bodyA
        strictEqual(bodyA.isDestroyed, true);
        strictEqual(elementBodyA.parentElement, null);
    });

});