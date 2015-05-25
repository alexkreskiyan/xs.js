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

    var createLogEntry = function (args) {
        var fragments = [];

        for (var i = 0; i < args.length; i++) {
            fragments.push(serialize(args[ i ], 1));
        }

        var node = document.createElement('div');
        node.classList.add('messageLine');
        node.innerHTML = getTime() + '&nbsp;&nbsp;&nbsp;&nbsp;' + fragments.join(' ');
        logContainer.appendChild(node);

        return node;
    };

    var serialize = function (item, depth) {
        if (typeof item !== 'object' || item === null) {

            return String(item);
        }

        var result = {};
        var keys = Object.keys(item);
        var i, key;

        if (depth <= 1) {

            for (i = 0; i < keys.length; i++) {
                key = keys[ i ];
                result[ key ] = String(item[ key ]);
            }

        } else {

            for (i = 0; i < keys.length; i++) {
                key = keys[ i ];
                result[ key ] = serialize(item[ key ], depth - 1);
            }

        }

        return JSON.stringify(result);
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
        log: function () {
            var entry = createLogEntry(arguments);
            entry.classList.add('log');
        },
        info: function () {
            var entry = createLogEntry(arguments);
            entry.classList.add('info');
        },
        warn: function () {
            var entry = createLogEntry(arguments);
            entry.classList.add('warn');
        },
        error: function () {
            var entry = createLogEntry(arguments);
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