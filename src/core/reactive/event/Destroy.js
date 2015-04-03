'use strict';

var Destroy = xs.core.reactive.event.Destroy = function () {
};

//extend Destroy from module.Event
xs.extend(Destroy, module.Event);