'use strict';

//save reference to module
module.send = function send(handlers, target, data) {

    //return whether handlers processing was cancelled
    return !handlers.find(function (item) {

        //ignore, if item is suspended or has another target
        if (item.suspended || !(item.target & target)) {

            return;
        }

        //if handler returns false - it cancels processing
        return item.handler.call(item.scope, data) === false;
    });
};