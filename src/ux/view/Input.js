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
 * @class xs.ux.view.Input
 */
xs.define(xs.Class, 'ns.view.Input', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    Class.mixins.observable = 'xs.event.Observable';

    Class.implements = ['xs.event.IObservable'];

    Class.constant.events = {
        mouseOver: {
            type: 'xs.event.Event',
            domEvent: 'mouseover'
        },
        click: {
            type: 'xs.event.Event',
            domEvent: 'click'
        },
        mouseOut: {
            type: 'xs.event.Event',
            domEvent: 'mouseout'
        }
    };

    Class.constant.attributes = {

    };

});

var input = new xs.ux.view.Input();
input.attribute.value = 'aaa';