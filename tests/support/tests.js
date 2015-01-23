(function () {

    'use strict';

    var me = this;
    var logContainer;
    var createLogEntry = function (text) {
        var node = document.createElement('div');
        node.classList.add('messageLine');
        node.innerHTML = text;
        logContainer.appendChild(node);

        return node;
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

    var log = me.write.log;
    var info = me.write.info;
    var warn = me.write.warn;
    var error = me.write.error;


    me.clearScreen = function () {
        var root = document.querySelector('body');
        while (root.lastChild) {
            root.removeChild(root.lastChild);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        logContainer = document.createElement('div');
        var root = document.querySelector('body');
        root.insertBefore(logContainer, root.firstChild);
        window.onerror = function () {
            error.apply(undefined, JSON.stringify(arguments));
        };

        run();
    });

    var run = function () {
        testOnline();
    };

    var testOnline = function () {
        window.addEventListener('online', function () {
            log('Became online');
        });
        window.addEventListener('offline', function () {
            log('Gone offline');
        });
    };

}).call(window);