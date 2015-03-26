'use strict';

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

//define xs.reactive.event
if (!xs.reactive.event) {
    xs.reactive.event = {};
}

//save reference to module
xs.reactive.event.Event = module.Event = function () {
};