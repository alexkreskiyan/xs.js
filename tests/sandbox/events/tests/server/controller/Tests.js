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
                create(message.data).then(function () {
                    resolve(new Message.Outgoing('tests', 'create', true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing('tests', 'create', false, [ reason ], null));
                });
                break;
            case 'read':
                read(message.data).then(function (data) {
                    resolve(new Message.Outgoing('tests', 'read', true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing('tests', 'read', false, [ reason ], null));
                });
                break;
            case 'readAll':
                readAll(message.data).then(function (data) {
                    resolve(new Message.Outgoing('tests', 'readAll', true, [], data));
                }, function (reason) {
                    reject(new Message.Outgoing('tests', 'readAll', false, [ reason ], null));
                });
                break;
            case 'update':
                update(message.data).then(function () {
                    resolve(new Message.Outgoing('tests', 'update', true, [], null));
                }, function (reason) {
                    reject(new Message.Outgoing('tests', 'update', false, [ reason ], null));
                });
                break;
        }
    });
};

function create(data) {
    console.log('create test', data);

    return tests.create({
        user: data.user,
        device: data.device,
        name: data.name,
        stages: data.stages
    });
}

function read(data) {
    console.log('read test', data);

    return tests.read({
        user: data.user,
        device: data.device,
        name: data.name
    });
}

function readAll(data) {
    console.log('read all tests', data);

    return tests.readAll({
        user: data.user,
        device: data.device
    });
}

function update(data) {
    console.log('update test', data);

    return tests.update({
        user: data.user,
        device: data.device,
        name: data.name,
        stages: data.stages
    });
}