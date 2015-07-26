/**
 * Common class for all application modules
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.app.Module
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Module', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.app';

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);
    };

    Class.method.destroy = function () {
        var me = this;

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);

    };

});