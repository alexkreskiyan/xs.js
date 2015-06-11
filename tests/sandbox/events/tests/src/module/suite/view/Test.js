xs.define(xs.Class, 'ns.view.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
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
        me.classes.add(data.name);

        //add label as innerHTML
        me.private.el.innerHTML = data.label;
    };

});