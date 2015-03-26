'use strict';

var Data = xs.reactive.event.Data = function (data) {
    var me = this;

    //save data reference
    me.data = data;
};

//extend Data from module.Event
xs.extend(Data, module.Event);