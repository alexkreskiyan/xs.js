'use strict';

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

//define xs.reactive.event
if (!xs.reactive.event) {
    xs.reactive.event = {};
}

var Event = function (data) {
    var me = this;

    //save data reference
    me.data = data;
};

//save reference to module
module.Event = Event;