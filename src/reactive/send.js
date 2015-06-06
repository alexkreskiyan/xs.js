'use strict';

//save reference to module
module.send = function send(handlers, data) {
    var dataHasConstructor = data !== undefined && data !== null;

    //return whether handlers processing was cancelled
    return !handlers.find(function (item) {

        //ignore, if item is suspended
        if (item.suspended) {

            return;

        }

        //if event given
        if (item.event) {

            //ignore, if data has no constructor
            if (!dataHasConstructor) {

                return;
            }

            //ignore, if event does not match data.constructor
            if (item.event !== data.constructor) {

                return;
            }

        } else {

            //ignore, if destroy event given
            if (data instanceof xs.reactive.event.Destroy) {

                return;
            }
        }

        //if handler returns false - it cancels processing
        return item.handler.call(item.scope, data) === false;
    });
};