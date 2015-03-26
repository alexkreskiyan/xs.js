'use strict';

var Event = module.Event;

var Data = xs.reactive.event.Data = function (data) {
    var me = this;

    Event.call(me, data);
};

//extend Data from Event
xs.extend(Data, Event);