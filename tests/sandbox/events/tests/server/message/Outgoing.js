'use strict';

var Message = function (controller, action, status, messages, data) {
    var me = this;

    me.controller = controller;
    me.action = action;
    me.status = status;
    me.messages = messages;
    me.data = data;
};
module.exports = Message;

Message.prototype.toString = function () {
    var me = this;

    return JSON.stringify({
        controller: me.controller,
        action: me.action,
        status: me.status,
        messages: me.messages,
        data: me.data
    });
};