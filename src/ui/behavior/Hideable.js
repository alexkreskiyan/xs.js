xs.define(xs.Class, 'ns.behavior.Hideable', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ui';

    Class.imports = {
        Element: 'xs.view.Element'
    };

    Class.constructor = function () {
        var me = this;

        self.assert.instance(me, imports.Element, 'constructor - instance, behavior `$Behavior` is applied to, is not an instance of `$Element`', {
            $instance: me,
            $Behavior: self,
            $Element: imports.Element
        });
    };

    Class.property.isVisible = {
        set: xs.noop,
        get: function () {
            return !this.classes.has('hidden');
        }
    };

    Class.method.show = function () {
        var me = this;

        //assert, that element is disabled
        self.assert.not(me.isVisible, 'show - element `$element` is already visible', {
            $element: me
        });

        me.classes.remove('hidden');
    };

    Class.method.hide = function () {
        var me = this;

        //assert, that element is enabled
        self.assert.ok(me.isVisible, 'hide - element `$element` is already hidden', {
            $element: me
        });

        me.classes.add('hidden');
    };

});