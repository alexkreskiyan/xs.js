/**
 * DOM Events common interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.view.event.element.IEvent
 *
 * @extends xs.view.event.IEvent
 */
xs.define(xs.Interface, 'ns.element.IEvent', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.view.event';

    Interface.extends = 'ns.IEvent';

});