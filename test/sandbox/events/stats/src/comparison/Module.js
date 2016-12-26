xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.comparison';

    Class.imports = {
        view: {
            Container: 'ns.view.Container',
            Entry: 'ns.view.Entry'
        },
        Query: 'xs.data.Query'
    };

    Class.constructor = function (controls) {
        var me = this;

        self.assert.object(controls, 'constructor - given controls `$controls` are not an object', {
            $controls: controls
        });

        //collect fields
        me.fields = new xs.core.Collection();
        controls.each(function (config) {
            (new xs.core.Collection(config.fields)).each(function (field) {
                me.fields.add(field);
            });
        });
        me.attributes = me.fields.map(function (field) {

            return field.field;
        }).values();

        //create container
        me.container = new imports.view.Container(me.fields);
        me.container.attributes.set('id', 'comparison');
    };

    Class.method.compare = function (selection) {
        var me = this;

        selection.each(function (model) {
            me.container.items.add(new imports.view.Entry(model, me.attributes));
        });

        //show container
        me.container.show();
    };

});