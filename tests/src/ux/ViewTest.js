/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ux.View', function () {

    'use strict';

    test('constructor', function () {

        //Correct DOM template string is required as first argument
        //no argument fails
        throws(function () {
            return new xs.ux.View();
        });
        //empty string fails
        throws(function () {
            return new xs.ux.View('');
        });
        //not a DOM template fails
        throws(function () {
            return new xs.ux.View('div');
        });

        //DOM template must contain a single root
        throws(function () {
            return new xs.ux.View('<div></div><span></span>');
        });

        //single root is ok
        (new xs.ux.View('<div></div>')).destroy();
    });

    setTimeout(function () {
    //window.createView = function () {
        //define view
        var view = window.view = new xs.ux.View('<button class="my_button">blabla</button>');

        //render it to body
        document.body.insertBefore(view.private.el, document.body.firstChild);

        //add some event handlers
        view.on('click', function () {
            console.log('clicked');
        });
        view.on('dblClick', function () {
            console.log('double clicked');
        });
        view.on('destroy', function () {
            console.log('destroyed');
        });
    //};
    }, 10000);

    setTimeout(function () {
    //window.removeView = function () {
        //remove view from body
        document.body.removeChild(document.body.firstChild);

        //destroy view
        window.view.destroy();

        //remove reference to view
        delete window.view;
    //};
    }, 20000);
    //
    //test('on', function () {
    //
    //    var el = new xs.ux.View(document.createElement('div'));
    //
    //    //for own event - simple observable usage
    //    el.on('destroy', xs.emptyFn);
    //    strictEqual(el.private.domHandlers.length, 0);
    //
    //    //for dom event - dom handler is generated
    //    el.on('click', xs.emptyFn);
    //    strictEqual(el.private.domHandlers.length, 1);
    //    strictEqual(el.private.domHandlers.hasKey('click'), true);
    //
    //    el.destroy();
    //});
    //
    //test('off', function () {
    //
    //    var el = new xs.ux.View(document.createElement('div'));
    //
    //    el.on('click', xs.emptyFn);
    //    el.on('dblClick', xs.emptyFn);
    //    el.on('destroy', xs.emptyFn);
    //    strictEqual(JSON.stringify(el.private.domHandlers.keys()), '["click","dblClick"]');
    //
    //    //all not used dom handlers are removed
    //    el.off('click', function (item) {
    //        return item.handler === xs.emptyFn;
    //    });
    //    strictEqual(JSON.stringify(el.private.domHandlers.keys()), '["dblClick"]');
    //    el.off();
    //    strictEqual(JSON.stringify(el.private.domHandlers.keys()), '[]');
    //
    //    el.destroy();
    //});
    //
    //test('destroy', function () {
    //    var me = this;
    //
    //    var el = new xs.ux.View(document.createElement('div'));
    //
    //    el.on('click', xs.emptyFn);
    //    el.on('dblClick', xs.emptyFn);
    //
    //    el.on('destroy', function () {
    //        //on next tick test is ready
    //        xs.nextTick(me.done);
    //    });
    //
    //    el.destroy();
    //
    //    //element is destroyed
    //    strictEqual(el.hasOwnProperty('el'), false);
    //    return false;
    //});

});