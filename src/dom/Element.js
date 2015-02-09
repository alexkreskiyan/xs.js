/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Core xs.js view object
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.Element
 */
xs.define(xs.Class, 'ns.Element', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.events = {};

    Class.constructor = function (element) {
        var me = this;

        self.assert.ok(element instanceof Element, 'Given element "$element" is not an instance of Element', {
            $element: element
        });

        me.private.el = element;
    };

    Class.property.el = {
        set: xs.emptyFn
    };

});