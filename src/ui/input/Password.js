xs.define(xs.Class, 'ns.input.Password', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ui';

    Class.extends = 'xs.view.Element';

    Class.mixins.available = 'ns.behavior.Available';

    Class.constructor = function (options) {
        var me = this;

        //assert, that options are an object
        self.assert.object(options, 'constructor - given options `$options` are not an object', {
            $options: options
        });

        //call parent
        self.parent.call(me, createElement());

        //call available mixin
        self.mixins.available.call(me);

        //set name
        me.name = options.name;

        //set placeholder, if given
        if (options.placeholder) {
            me.placeholder = options.placeholder;
        }
    };

    Class.property.name = {
        set: function (value) {
            //assert, that value is a shortName
            self.assert.shortName(value, 'name:set - given value `$value` is not a valid name', {
                $value: value
            });

            //set name
            this.private.el.name = value;
        },
        get: function () {
            return this.private.el.name;
        }
    };

    Class.property.placeholder = {
        set: function (value) {
            //assert, that value is a string
            self.assert.string(value, 'placeholder:set - given value `$value` is not a string', {
                $value: value
            });

            //set name
            this.private.el.placeholder = value;
        },
        get: function () {
            return this.private.el.placeholder;
        }
    };

    Class.property.value = {
        set: function (value) {
            //assert, that value is a string
            self.assert.string(value, 'value:set - given value `$value` is not a string', {
                $value: value
            });

            //set name
            this.private.el.value = value;
        },
        get: function () {
            return this.private.el.value;
        }
    };

    var createElement = function () {
        var el = document.createElement('input');
        el.type = 'password';

        return el;
    };

});