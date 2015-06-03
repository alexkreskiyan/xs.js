xs.define(xs.Class, 'ns.view.event.Select', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.implements = [
        'xs.view.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} data event data
     */
    Class.constructor = function (data) {
        var me = this;

        //check data
        //assert that data is object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //if single selected
        if (!data.target.getAttribute('multiple')) {
            me.private.value = data.target.value;

            return;
        }

        me.private.value = new xs.core.Collection();
        var values = me.private.value.private.items;

        for (var i = 0; i < data.target.length; i++) {
            var item = data.target.item(i);

            if (item.selected) {
                values.push({
                    key: values.length,
                    value: item.value
                });
            }
        }
    };

    /**
     * Event `value` property. Event value is value of select control
     *
     * @property value
     *
     * @type {Object}
     */
    Class.property.value = {
        set: xs.noop
    };

});