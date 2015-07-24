xs.define(xs.Class, 'ns.behavior.Available', function (self, imports) {

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

    Class.property.isEnabled = {
        set: xs.noop,
        get: function () {
            return !this.classes.has('disabled');
        }
    };

    Class.method.enable = function () {
        var me = this;

        //assert, that element is disabled
        self.assert.not(me.isEnabled, 'enable - element `$element` is already enabled', {
            $element: me
        });

        me.classes.remove('disabled');
    };

    Class.method.disable = function () {
        var me = this;

        //assert, that element is enabled
        self.assert.ok(me.isEnabled, 'disable - element `$element` is already disabled', {
            $element: me
        });

        me.classes.add('disabled');
    };

});