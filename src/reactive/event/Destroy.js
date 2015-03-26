'use strict';

var Event = module.Event;

var Destroy = xs.reactive.event.Destroy = function () {
    var me = this;

    Event.call(me);
};

//extend Destroy from Event
xs.extend(Destroy, Event);