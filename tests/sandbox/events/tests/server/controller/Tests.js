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
                    resolve(new Message.Outgoing(message.id, 'tests', 'create', true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, 'tests', 'create', false, [ reason ], null));
                });
                break;
            case 'read':
                tests.read(message.data).then(function (data) {
                    resolve(new Message.Outgoing(message.id, 'tests', 'read', true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, 'tests', 'read', false, [ reason ], null));
                });
                break;
            case 'readAll':
                tests.readAll(message.data).then(function (data) {
                    resolve(new Message.Outgoing(message.id, 'tests', 'readAll', true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, 'tests', 'readAll', false, [ reason ], null));
                });
                break;
            case 'update':
                tests.update(message.data).then(function () {
                    resolve(new Message.Outgoing(message.id, 'tests', 'update', true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing(message.id, 'tests', 'update', false, [ reason ], null));
                });
                break;
        }
    });
};