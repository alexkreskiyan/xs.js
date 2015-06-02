xs.define(xs.Class, 'ns.view.Group', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = [
        {
            Template: 'xs.resource.text.HTML'
        }
    ];

    Class.extends = 'xs.view.View';

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div class="group"><h2></h2><div class="items" xs-view-position="items"></div></div>'
        });
    });

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
        self.parent.call(me);

        //add class to group
        me.classes.add(data.name);

        //set group label
        me.query('h2').private.el.innerHTML = data.label;
    };

});