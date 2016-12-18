'use strict';

var Message = {
    Incoming: require('../message/Incoming'),
    Outgoing: require('../message/Outgoing')
};
var Promise = require('promise');

var tests = require('../db/tests');

var Controller = function () {
};
module.exports = Controller;

Controller.prototype.handle = function (message) {
    return new Promise(function (resolve, reject) {
        switch (message.action) {
            case 'create':
                tests.create(message.data).then(function () {
                    resolve(new Message.Outgoing(message.id, message.controller, message.action, true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, message.controller, message.action, false, [ reason ], null));
                });
                break;
            case 'read':
                tests.read(message.data).then(function (data) {
                    resolve(new Message.Outgoing(message.id, message.controller, message.action, true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, message.controller, message.action, false, [ reason ], null));
                });
                break;
            case 'readAll':
                tests.readAll(message.data).then(function (data) {
                    resolve(new Message.Outgoing(message.id, message.controller, message.action, true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, message.controller, message.action, false, [ reason ], null));
                });
                break;
            case 'update':
                tests.update(message.data).then(function () {
                    resolve(new Message.Outgoing(message.id, message.controller, message.action, true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, message.controller, message.action, false, [ reason ], null));
                });
                break;
        }
    });
};