/**
 * DOM fullscreen manager
 *
 * @author
 *
 * @private
 *
 * @class xs.ux.Fullscreen
 *
 * @extends xs.class.Base
 *
 * @mixins xs.event.StaticObservable
 */
xs.define(xs.Class, 'ns.Manager', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.fullscreen';

    Class.mixins.observable = 'xs.event.StaticObservable';

    Class.abstract = true;

    Class.static.property.stack = {
        get: function () {
            var me = this;

            if (!me.private.stack) {
                me.private.stack = new xs.core.Collection();
            }

            return me.private.stack;
        },
        set: xs.noop
    };

    //get state of fullscreen
    Class.static.property.isActive = {
        get: function () {
            if (document.IsFullScreen != undefined) {
                return document.IsFullScreen;
            } else if (document.msIsFullScreen != undefined) {
                return document.msIsFullScreen;
            } else if (document.mozFullScreen != undefined) {
                return document.mozFullScreen;
            } else if (document.webkitIsFullScreen != undefined) {
                return document.webkitIsFullScreen;
            }
        },
        set: xs.noop
    };

    Class.static.property.isAvailable = {
        get: function () {
            if (document.fullscreenEnabled != undefined) {
                return document.fullscreenEnabled;
            } else if (document.msFullscreenEnabled != undefined) {
                return document.msFullscreenEnabled;
            } else if (document.mozFullScreenEnabled != undefined) {
                return document.mozFullScreenEnabled;
            } else if (document.webkitFullscreenEnabled != undefined) {
                return document.webkitFullscreenEnabled;
            }
        }
    };

    //get fullscreen element
    Class.static.property.Element = {
        get: function () {
            if (document.fullscreenElement) {
                return document.fullscreenElement;
            } else if (document.msFullscreenElement) {
                return document.msFullscreenElement;
            } else if (document.mozFullScreenElement) {
                return document.mozFullScreenElement;
            } else if (document.webkitFullscreenElement) {
                return document.webkitFullscreenElement;
            } else {
                console.log('Fullscreen API is not supported');
            }
        }
    };

    //request full screen
    Class.static.method.show = function (el) {
        if (xs.ux.Fullscreen.isActive) {
            console.log('fullscreen is on');
        } else {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            } else {
                console.log('Fullscreen API is not supported');
            }
        }
    };

    //reset full screen
    Class.static.method.cancel = function () {
        if (xs.ux.Fullscreen.isActive) {
            console.log('fullscreen is on');
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    var getUnifiedName = function (el, name) {
        var upperName = upperCaseFirst(name);
        var variants = [
            name,
            'ms' + upperName,
            'moz' + upperName,
            'webkit' + upperName
        ];

        var variant;

        for (var i = 0; i < variants.length; i++) {
            variant = variants[ i ];

            if (variant in el) {
                break;
            }
            variant = undefined;
        }

        self.assert.ok(variant, 'getUnifiedName - no support for `$name` in context', {
            $name: name
        });

        return variant;
    };

    var upperCaseFirst = function (name) {
        return name[ 0 ].toUpperCase() + name.slice(1);
    };

});