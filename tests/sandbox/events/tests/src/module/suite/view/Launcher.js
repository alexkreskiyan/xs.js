xs.define(xs.Class, 'ns.view.Launcher', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Click: 'ns.event.Click'
        },
        Template: 'xs.resource.text.HTML'
    };

    Class.extends = 'xs.view.View';

    Class.constant.template = xs.lazy(function () {

        return new imports.Template({
            data: '<div class="test-launcher"></div>'
        });
    });

    Class.constructor = function (data) {
        var me = this;

        //assert data is an object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert data.name is a string
        self.assert.string(data.name, 'constructor - given data.name `$name` is not a string', {
            $name: data.name
        });

        //assert data.label is a string
        self.assert.string(data.label, 'constructor - given data.label `$label` is not a string', {
            $label: data.label
        });


        //call parent
        self.parent.call(me);

        //add name as class
        me.private.name = data.name;
        me.classes.add(data.name);

        //add label as innerHTML
        me.private.label = data.label;
        me.private.el.innerHTML = data.label;

        //bind click event
        me.private.el.addEventListener('click', function () {
            me.events.emitter.send(new imports.event.Click());
        });
    };

    Class.property.name = {
        set: function (name) {
            var me = this;

            //assert, that name is a string
            self.assert.string(name, 'name:set - given name `$name` is not a string', {
                $name: name
            });

            //replace name
            me.classes.remove(me.private.name);
            me.private.name = name;
            me.classes.add(me.private.name);
        }
    };

    Class.property.label = {
        set: function (label) {
            var me = this;

            //assert, that label is a string
            self.assert.string(label, 'label:set - given label `$label` is not a string', {
                $label: label
            });

            //replace label
            me.classes.remove(me.private.label);
            me.private.label = label;
            me.classes.add(me.private.label);
        }
    };

});