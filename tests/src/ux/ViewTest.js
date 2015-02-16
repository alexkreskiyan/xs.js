/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ux.View', function () {

    'use strict';

    test('multiple root template', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div></div><span></span>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //can not create view from multiple-rooted template
        throws(function () {
            return new me.Class();
        });
    });

    test('non-element template root', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = 'text here';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //can not create view from template with non-element root
        throws(function () {
            return new me.Class();
        });
    });

    test('simple constructor', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<input type="text" placeholder="search">';

        }, me.done);

        return false;
    }, function () {
        var me = this, view;

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

    test('duplicate positions in template', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="body"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //can not create view from template with duplicate position names
        throws(function () {
            return new me.Class();
        });
    });

    test('simple positions', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this, view;

        //view has 2 positions. positions are xs.util.collection.Collection instances
        view = new me.Class();
        strictEqual(JSON.stringify(view.private.positions.keys()), '["title","body"]');
        strictEqual(view.at('title') instanceof xs.util.collection.Collection, true);
        strictEqual(view.at('body') instanceof xs.util.collection.Collection, true);
        view.destroy();
    });

    test('add', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var view = new me.Class();
        var title = view.at('title');
        var body = view.at('body');

        //add two views to title and one - to body
        var titleA = new me.Class(), elementTitleA = titleA.private.el;
        var titleB = new me.Class(), elementTitleB = titleB.private.el;
        var bodyA = new me.Class(), elementBodyA = bodyA.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.length, 0);
        strictEqual(body.length, 0);

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
        strictEqual(title.length, 2);
        strictEqual(title.at(0), titleA);
        strictEqual(title.at(1), titleB);
        strictEqual(title.private.el.childNodes.length, 2);
        strictEqual(body.length, 1);
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

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var view = new me.Class();
        var title = view.at('title');
        var body = view.at('body');

        //add two views to title and one - to body
        var titleA = new me.Class(), elementTitleA = titleA.private.el;
        var titleB = new me.Class(), elementTitleB = titleB.private.el;
        var bodyA = new me.Class(), elementBodyA = bodyA.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.length, 0);
        strictEqual(body.length, 0);

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
        strictEqual(title.length, 1);
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
        strictEqual(title.length, 1);
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

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var view = new me.Class();
        var title = view.at('title');
        var body = view.at('body');

        //use two views
        var titleA = new me.Class(), elementTitleA = titleA.private.el;
        var titleB = new me.Class(), elementTitleB = titleB.private.el;

        //verify initial state
        //view
        strictEqual(view.private.hasOwnProperty('container'), false);
        strictEqual(title.length, 0);
        strictEqual(body.length, 0);

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
        strictEqual(title.length, 1);
        strictEqual(title.at(0), titleA);
        strictEqual(title.private.el.childNodes.length, 1);
        strictEqual(body.length, 0);

        //elements
        //titleA
        strictEqual(titleA.isDestroyed, false);
        strictEqual(elementTitleA.parentElement, title.private.el);


        //process remove via a set
        body.add(titleB);
        title.set(0, titleB);

        //verify middle state
        //view
        strictEqual(title.length, 1);
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
        strictEqual(title.length, 0);
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

            Class.extends = 'xs.ux.View';

            Class.constant.template = '<div><div><xs-view-position name="title"></xs-view-position></div><div><xs-view-position name="body"></xs-view-position></div></div>';

        }, me.done);

        return false;
    }, function () {
        var me = this;

        var view = new me.Class();
        var title = view.at('title');
        var body = view.at('body');

        //add two views to title and one - to body
        var titleA = new me.Class(), elementTitleA = titleA.private.el;
        var titleB = new me.Class(), elementTitleB = titleB.private.el;
        var bodyA = new me.Class(), elementBodyA = bodyA.private.el;
        title.add(titleA).add(titleB);
        body.add(bodyA);

        //verify view
        //title
        strictEqual(title.length, 2);
        strictEqual(title.at(0), titleA);
        strictEqual(title.at(1), titleB);
        strictEqual(title.private.el.childNodes.length, 2);
        strictEqual(elementTitleA.parentElement, title.private.el);
        strictEqual(elementTitleB.parentElement, title.private.el);

        strictEqual(body.length, 1);
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

    var go = 0;

    var createView = function () {
        var containers = window.containers = [];
        for (var i = 0; i < 1; i++) {
            var div = document.createElement('div');
            div.innerHTML = '<div style="float:left;width:50%"><xs-view-position name="left"/></div><div style="float:right;width:50%"><xs-view-position name="right"/></div>';

            //render container to body
            document.body.insertBefore(div, document.body.firstChild);

            //get view as wrapper around container
            var container = new xs.ux.View(div);

            container.classes.add('login');
            container.style.width = '100%';
            container.style.height = '25px';
            container.style.border = '2px dashed grey';
            /**
             * Cases:
             * 1. View is added to position
             * 1.1 View is already destroyed
             * - error is thrown
             * 1.2 View has no parent collection (new one)
             * - parent collection is set up
             * - view is added to collection
             * - view.el is inserted according to it's position in collection
             * 1.3 View has parent collection
             * - view is removed from previous collection
             * - parent collection is set up
             * - view is added to collection
             * - view.el is inserted according to it's position in collection
             * 2. View replaces some other view in position
             * 2.1 View is already destroyed
             * - error is thrown
             * 2.2 View has no parent collection (new one)
             * - previous view is removed from collection
             * - parent collection is set up
             * - view is added to collection
             * - view.el is inserted according to it's position in collection
             * 2.3 View has parent collection
             * - previous view is removed from collection
             * - view is removed from previous collection
             * - parent collection is set up
             * - view is added to collection
             * - view.el is inserted according to it's position in collection
             * 3. View is removed from position
             * 3.1 View is already destroyed
             * - error is thrown
             * 3.2 View has no new parent collection (is destroyed)
             * - view is removed from collection
             * - view.el is removed from it's parentElement
             * - view is destroyed
             * 3.3 View has new parent collection (is moved)
             * - view is removed from collection
             * - view.el is removed from it's parentElement
             * 4. View is destroyed
             * 4.1 View has parent collection
             * - view is removed from parent collection
             */


            var left = container.at('left');
            var right = container.at('right');

            //create label
            var label = new xs.ux.View(document.createElement('label'));
            label.private.el.innerHTML = 'label';

            //add label to left
            left.add(label);

            //move label to right
            right.add(label);


            //create label2
            var label2 = new xs.ux.View(document.createElement('label'));
            label2.private.el.innerHTML = 'label';

            //add label to left
            left.add(label2);


            //replace label2 with label
            left.set(0, label);


            //create input
            var input = new xs.ux.View(document.createElement('input'));
            input.attributes.set('type', 'text');
            input.attributes.set('placeholder', 'search');

            //add input to right
            right.add(input);


            //create button
            var button = new xs.ux.View(document.createElement('button'));
            button.private.el.innerHTML = 'go!';

            //replace input with button
            right.set(0, button);

            ////create labels
            //var label = new xs.ux.View(document.createElement('label'));
            //label.private.el.innerHTML = 'label';
            //var label2 = new xs.ux.View(document.createElement('label'));
            //label2.private.el.innerHTML = 'label2';
            //
            ////create input
            //var input = new xs.ux.View(document.createElement('input'));
            //input.attributes.set('type', 'text');
            //input.attributes.set('placeholder', 'search');
            //
            ////create button
            //var button = new xs.ux.View(document.createElement('button'));
            //button.private.el.innerHTML = 'go!';
            //
            //form.at('body').add(input);
            //form.at('body').add(button);
            //form.at('body').insert(0, label2);
            //form.at('body').set(0, label);

            containers.push(container);
        }
    };

    var removeView = function () {
        //destroy container
        window.containers.forEach(function (container) {
            container.destroy();
        });

        //remove reference to containers
        delete window.containers;
    };

    //run create and remove view to compile code
    //createView();
    //removeView();

    if (go) {
        setTimeout(createView, 10000);
        setTimeout(removeView, 20000);
    } else {
        window.createView = createView;
        window.removeView = removeView;
    }

});