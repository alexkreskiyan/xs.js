(function () {

    'use strict';

    var me = this;
    var logContainer;

    document.addEventListener('DOMContentLoaded', function () {
        logContainer = document.createElement('div');
        var root = document.querySelector('body');
        root.insertBefore(logContainer, root.firstChild);
        window.onerror = function () {
            me.write.error.call(undefined, JSON.stringify(arguments));
        };
    });

    var createLogEntry = function (text) {
        var node = document.createElement('div');
        node.classList.add('messageLine');
        node.innerHTML = getTime() + '&nbsp;&nbsp;&nbsp;&nbsp;' + text;
        logContainer.appendChild(node);

        return node;
    };

    var getTime = function () {
        var date = new Date();
        return [
                date.getDate(),
                date.getMonth(),
                date.getFullYear()
            ].join('-') + ' ' + [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ].join(':');
    };

    me.write = {
        log: function (text) {
            var entry = createLogEntry(text);
            entry.classList.add('log');
        },
        info: function (text) {
            var entry = createLogEntry(text);
            entry.classList.add('info');
        },
        warn: function (text) {
            var entry = createLogEntry(text);
            entry.classList.add('warn');
        },
        error: function (text) {
            var entry = createLogEntry(text);
            entry.classList.add('error');
        }
    };

    me.clearScreen = function () {
        var root = document.querySelector('body');
        while (root.lastChild) {
            root.removeChild(root.lastChild);
        }
    };

}).call(window);