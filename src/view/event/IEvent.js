/**
 * DOM Events common interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.view.event.IEvent
 *
 * @extends xs.event.IEvent
 */
xs.define(xs.Interface, 'ns.IEvent', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.view.event';

    Interface.extends = 'xs.event.IEvent';

    Interface.static.method.capture = function (element) {

    };

    Interface.static.method.release = function (capture) {

    };

});