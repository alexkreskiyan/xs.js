/**
 * DOM Events common interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.view.event.content.IEvent
 *
 * @extends xs.view.event.IEvent
 */
xs.define(xs.Interface, 'ns.content.IEvent', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.view.event';

    Interface.extends = 'ns.IEvent';

});