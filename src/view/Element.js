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
xs.define(xs.Class, 'ns.Element', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view';

    Class.extends = 'ns.View';

    Class.constant.events = {
    };

    Class.property.value = {
        set: function () {
            this.el.attribute.value = 'aaa';
        },
        get: function () {
            return this.el.attribute.value;
        }
    };



});

var input = new xs.ux.view.Input();
input.attribute.value = 'aaa';

//attributes are defined as simple properties
//how to define positions without additional preprocessors?
//xs.view.DOMElement needed
//query method returns DomElement or collection of DomElements. Allowed flag xs.core.Collection.All to fetch collection of elements