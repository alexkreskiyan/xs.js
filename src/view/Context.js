/**
 * Internal core view object. Represents an abstract view context, including some basics from both document and window objects
 *
 * Fires events:
 * xs.view.event.context.Resize
 * xs.view.event.context.DisplayChange
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.view.Context
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.Observable
 */
xs.define(xs.Class, 'ns.Context', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view';

    Class.imports = {
        IEvent: 'ns.event.IEvent'
    };

    Class.mixins.observable = 'xs.event.StaticObservable';

    Class.abstract = true;

    Class.constant.events = xs.generator(function () {
        var stream = new xs.reactive.Stream(xs.noop);

        //define event captures collection
        var captures = new xs.core.Collection();

        //handle stream Resume and Suspend events
        stream.on(xs.reactive.event.Resume, function (event) {
            event = event.event;

            if (xs.isClass(event) && event.implements(imports.IEvent)) {
                //save capture
                captures.add(event, event.capture(self));
            }
        });
        stream.on(xs.reactive.event.Suspend, function (event) {
            event = event.event;

            if (xs.isClass(event) && event.implements(imports.IEvent)) {
                //get saved capture
                var capture = captures.at(event);

                //remove from captures
                captures.removeAt(event);

                //release capture
                event.release(self, capture);
            }
        });

        //return event stream
        return stream;
    });

    //set private.el to window, like in xs.view.Element
    self.private.el = window;
    self.private.body = document.querySelector('body');

    Class.static.property.isVisible = {
        get: function () {
            return document.visibilityState === 'visible';
        },
        set: xs.noop
    };

    Class.static.property.outerWidth = {
        get: function () {
            return window.outerWidth;
        },
        set: xs.noop
    };

    Class.static.property.outerHeight = {
        get: function () {
            return window.outerHeight;
        },
        set: xs.noop
    };

    Class.static.property.innerWidth = {
        get: function () {
            return window.innerWidth;
        },
        set: xs.noop
    };

    Class.static.property.innerHeight = {
        get: function () {
            return window.innerHeight;
        },
        set: xs.noop
    };

    Class.static.property.pageWidth = {
        get: function () {
            return document.documentElement.scrollWidth;
        },
        set: xs.noop
    };

    Class.static.property.pageHeight = {
        get: function () {
            return document.documentElement.scrollHeight;
        },
        set: xs.noop
    };

    Class.static.property.scrollX = {
        get: function () {
            return this.private.body.scrollLeft;
        },
        set: function (position) {

            //assert, that position is a number
            self.assert.number(position, 'scrollX:set - given position `$position` is not a number', {
                $position: position
            });

            //set scrollLeft
            this.private.body.scrollLeft = position;
        }
    };

    Class.static.property.scrollY = {
        get: function () {
            return this.private.body.scrollTop;
        },
        set: function (position) {

            //assert, that position is a number
            self.assert.number(position, 'scrollY:set - given position `$position` is not a number', {
                $position: position
            });

            //set scrollLeft
            this.private.body.scrollTop = position;
        }
    };

});