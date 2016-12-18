(function () {

    'use strict';

    var me = this;

    document.addEventListener('DOMContentLoaded', function () {
        window.onerror = function () {
            me.write.error.call(undefined, JSON.stringify(arguments));
        };
    });

    var createLogEntry = function (args) {
        var fragments = [];

        for (var i = 0; i < args.length; i++) {
            fragments.push(serialize(args[ i ]));
        }

        return getTime() + '&nbsp;&nbsp;&nbsp;&nbsp;' + fragments.join(' ');
    };

    var stringified = [
        Window,
        Document,
        Date,
        CSSStyleDeclaration
    ];

    var serialize = function (item, parents) {
        if (xs.isNull(item) || !xs.isDefined(item)) {
            return item;
        } else if (item instanceof Element) {
            return getDomPath(item);
        } else if (stringified.filter(function (Ancestor) {
                return item instanceof Ancestor;
            }).length) {
            return item.toString();
        } else if (!xs.isObject(item) && !xs.isArray(item)) {
            return xs.isFunction(item) ? 'fn ' + (item.name ? item.name : 'anonymous') : item;
        }

        var result = {};

        //add root if needed
        if (!parents.size) {
            parents.add('root', item);
        }

        for (var key in item) {
            var value;

            try {
                value = item[ key ];
            } catch (e) {
                value = e.toString();
            }

            //if circular reference detected - mark it specially
            if (parents.has(value)) {
                result[ key ] = parents.keyOf(value);

                //else if value is picked - go deeper
            } else if (doPick(key, value)) {
                result[ key ] = serialize(value, parents.clone().add(parents.reduce(getName, 0, null, 'ref ' + key), value));
            }
        }

        return result;
    };

    function getDomPath(element) {
        var parent = element;
        var path = [];

        while (parent) {
            path.splice(0, 0, getNodeInfo(parent));
            parent = parent.parentElement;
        }

        return path;
    }

    function getNodeInfo(element) {
        var info = element.tagName.toLowerCase();

        if (element.id) {
            info += '#' + element.id;
        }

        if (element.classList.length) {
            info += '.' + element.className.split(' ').join('.');
        }

        return info;
    }

    function getName(memo, value, key) {
        return memo + '.' + key;
    }

    function doPick(key, value) {
        return key !== 'private';
    }

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
            alert('log:' + createLogEntry(arguments));
            console.log(createLogEntry(arguments));
        },
        info: function () {
            alert('info:' + createLogEntry(arguments));
            console.info(createLogEntry(arguments));
        },
        warn: function () {
            alert('warn:' + createLogEntry(arguments));
            console.warn(createLogEntry(arguments));
        },
        error: function () {
            alert('error:' + createLogEntry(arguments));
            console.error(createLogEntry(arguments));
        }
    };

    me.clearScreen = function () {
        var root = document.querySelector('body');

        while (root.lastChild) {
            root.removeChild(root.lastChild);
        }
    };

}).call(window);