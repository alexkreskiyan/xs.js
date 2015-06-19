'use strict';

var Message = function (raw) {
    var me = this;

    var data = JSON.parse(raw);

    me.controller = data.controller;
    me.action = data.action;
    me.data = data.data;
};
module.exports = Message;
Message.prototype.toString = function () {
    var me = this;

    return JSON.stringify({
        controller: me.controller,
        action: me.action,
        data: me.data
    });
};