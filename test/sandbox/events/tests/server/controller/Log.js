'use strict';

var Message = {
    Incoming: require('../message/Incoming'),
    Outgoing: require('../message/Outgoing')
};
var Promise = require('promise');

var log = require('../db/log');

var Controller = function () {
};
module.exports = Controller;

Controller.prototype.handle = function (message) {
    return new Promise(function (resolve, reject) {
        switch (message.action) {
            case 'add':
                log.add(message.data).then(function () {
                    resolve(new Message.Outgoing(message.id, message.controller, message.action, true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, message.controller, message.action, false, [ reason ], null));
                });
                break;
        }
    });
};