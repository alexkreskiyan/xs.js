'use strict';

var Destroy = xs.reactive.event.Destroy = function () {
};

//extend Destroy from module.Event
xs.extend(Destroy, module.Event);