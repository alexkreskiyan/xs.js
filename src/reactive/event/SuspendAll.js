'use strict';

var SuspendAll = xs.reactive.event.SuspendAll = function () {
};

//extend SuspendAll from module.Event
xs.extend(SuspendAll, module.event.Event);