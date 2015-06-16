xs.define(xs.Class, 'ns.view.Control', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        event: {
            Click: 'tests.module.suite.event.Click'
        }
    };

    Class.extends = 'xs.view.Element';

    Class.constructor = function (data) {
        var me = this;

        //assert, that data given
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that data.name given
        self.assert.string(data.name, 'constructor - given data.name `$name` is not a string', {
            $name: data.name
        });

        //assert, that data.label given
        self.assert.string(data.label, 'constructor - given data.label `$label` is not a string', {
            $label: data.label
        });


        //call parent constructor
        self.parent.call(me, document.createElement('div'));

        //add classes
        me.classes.add('control');

        //set label
        me.private.el.innerHTML = data.label;

        me.private.el.addEventListener('click', function () {
            me.events.send(new imports.event.Click());
        });
    };

    Class.property.isDisabled = {
        get: function () {
            var me = this;

            return me.classes.has('disabled');
        },
        set: xs.noop
    };

    Class.method.enable = function () {
        var me = this;

        self.assert.ok(me.isDisabled, 'enable - control is already enabled');

        //remove disabled class
        me.classes.remove('disabled');

        //resume events stream
        me.events.resume();
    };

    Class.method.disable = function () {
        var me = this;

        self.assert.not(me.isDisabled, 'enable - control is already disabled');

        //add disabled class
        me.classes.add('disabled');

        //suspend events stream
        me.events.suspend();
    };

});