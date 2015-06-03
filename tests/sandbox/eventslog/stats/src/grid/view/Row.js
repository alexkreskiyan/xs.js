xs.define(xs.Class, 'ns.view.Row', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.Element';

    Class.constructor = function (data, fields) {
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
        for (var i = 0; i < fields.length; i++) {
            var field = document.createElement('div');
            field.classList.add('field');
            field.innerHTML = data[ fields[ i ] ];
            row.appendChild(field);
        }
    };

});