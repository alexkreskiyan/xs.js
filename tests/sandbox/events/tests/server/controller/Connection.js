'use strict';

var Message = {
    Incoming: require('../message/Incoming'),
    Outgoing: require('../message/Outgoing')
};

var TestsController = require('./Tests');
var LogController = require('./Log');

var Controller = function (connection) {
    var me = this;

    me.tests = new TestsController();
    me.log = new LogController();
    me.connection = connection;

    connection.on('message', function (message) {
        me.handle(new Message.Incoming(message));
    });
};
module.exports = Controller;

Controller.prototype.handle = function (message) {
    var me = this;

    var handler;

    switch (message.controller) {
        case 'tests':
            handler = me.tests;
            break;
        case 'log':
            handler = me.log;
            break;
        default:
            return;
    }

    handler.handle(message).then(function (response) {
        me.connection.send(response.toString());
    });
};