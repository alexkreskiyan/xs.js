xs.define(xs.Class, 'ns.view.Row', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.Element';

    Class.constructor = function (data) {
        var me = this;

        //assert, that object given
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        var row = document.createElement('div');

        //call parent constructor
        self.parent.call(me, row);

        //add class
        me.classes.add('row');


        //add fields to row
        (new xs.core.Collection(data)).each(function (value) {
            var field = document.createElement('div');
            field.classList.add('field');
            field.innerHTML = value;
            row.appendChild(field);
        });
    };

});