/**
 * xs.view.Collection is framework class, that is used for working with view's items' collections
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.Collection
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Collection', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view';

    Class.imports = {
        Element: 'xs.view.Element'
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.mixins.enumerable = 'xs.data.Enumerable';

    Class.constructor = function (values, type) {
        var me = this;

        //call enumerable constructor
        self.mixins.enumerable.apply(me, arguments);

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);
    };

    Class.method.removeAt = function (key, flags) {
        var me = this;

        if (flags & imports.Element.Preserve) {
            me.private.preserveRemoved = true;
        }

        self.mixins.enumerable.prototype.removeAt.apply(me, arguments);

        delete me.private.preserveRemoved;

        return me;
    };

    Class.method.remove = function (value, flags) {
        var me = this;

        if (arguments.length > 1) {
            if (flags & imports.Element.Preserve) {
                me.private.preserveRemoved = true;
            }
            self.mixins.enumerable.prototype.remove.call(me, value);
        } else {
            if (value & imports.Element.Preserve) {
                me.private.preserveRemoved = true;
            }
            self.mixins.enumerable.prototype.remove.call(me);
        }


        delete me.private.preserveRemoved;

        return me;
    };

    Class.method.removeBy = function (fn, flags) {
        var me = this;

        if (flags & imports.Element.Preserve) {
            me.private.preserveRemoved = true;
        }

        self.mixins.enumerable.prototype.removeBy.apply(me, arguments);

        delete me.private.preserveRemoved;

        return me;
    };

    Class.method.destroy = function () {
        var me = this;

        //call Enumerable.destroy
        self.mixins.enumerable.prototype.destroy.call(me);

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

});