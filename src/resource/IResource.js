/**
 * Common resource interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.resource.IResource
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IResource', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.resource';

    Interface.method.load = function () {

    };

    Interface.property.isLoaded = {
        set: xs.noop
    };

});