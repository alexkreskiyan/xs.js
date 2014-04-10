/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 on/once: function(event[string], callback[function], context[object] = this)
 on/once: function(event[array], callback[function], context[object] = this)
 on / once: function(eventMap[object], context[object] = this)

 listen/listenOnce: function(object,[on/once])

 eventMap = {
    on: fn1,
    off: fn2
}

 off: function(event[string], callback[function] = null)
 off: function(event[array], callback[function] = null)
 off: function(eventMap[object])

 ignore: function(object,[off])

 trigger(event[string],arg1,arg2)
 */
xs.define('xs.util.Observable', function () {
    var unbind = function (event, callback) {
        var me = this;
        me.events[event] = xs.Array.findAll(me.events[event], function (dispatcher) {
            return dispatcher.callback != callback;
        });
    };

    var applyMap = function (map) {
        var me = this;
        xs.Object.each(map, function (dispatcher, event) {
            me.addEvent(event);
            me.events[event].push(dispatcher);
        });
    };

    return {
        constructor: function () {
            var me = this;
            me.events = {};
            me.suspendedEvents = [];
        },
        properties: {
            events: {},
            suspendedEvents: []
        },
        methods: {
            trigger: function (event) {
                var me = this;
                if (!me.hasEvent(event)) {
                    return;
                }
                var args = xs.Array.clone(arguments).slice(1);
                xs.Array.has(me.suspendedEvents, event) || xs.Array.each(me.events[event], function (dispatcher) {
                    dispatcher.handler.apply(null, args);
                });
            },
            on: function (event, callback, context) {
                var me = this,
                    eventMap = {},
                    scope;

                //build eventMap
                if (xs.isObject(event)) {
                    scope = callback || me;
                    eventMap = xs.Object.map(event, function (handler) {
                        return {
                            handler: function () {
                                handler.apply(scope, arguments);
                            },
                            callback: handler
                        };
                    });
                } else if (xs.isArray(event)) {
                    scope = context || me;
                    xs.Array.each(event, function (name) {
                        eventMap[name] = {
                            handler: function () {
                                callback.apply(scope, arguments);
                            },
                            callback: callback
                        };
                    });
                } else if (xs.isString(event)) {
                    scope = context || me;
                    eventMap[event] = {
                        handler: function () {
                            callback.apply(scope, arguments);
                        },
                        callback: callback
                    };
                } else {
                    return;
                }

                //apply eventMap
                applyMap.call(me, eventMap);
            },
            once: function (event, callback, context) {
                var me = this,
                    eventMap = {},
                    scope;

                //build eventMap
                if (xs.isObject(event)) {
                    scope = callback || me;
                    eventMap = xs.Object.map(event, function (handler, event) {
                        return {
                            handler: function () {
                                unbind.call(me, event, handler);
                                handler.apply(scope, arguments);
                            },
                            callback: handler
                        };
                    });
                } else if (xs.isArray(event)) {
                    scope = context || me;
                    xs.Array.each(event, function (event) {
                        eventMap[event] = {
                            handler: function () {
                                unbind.call(me, event, callback);
                                callback.apply(scope, arguments);
                            },
                            callback: callback
                        };
                    });
                } else if (xs.isString(event)) {
                    scope = context || me;
                    eventMap[event] = {
                        handler: function () {
                            unbind.call(me, event, callback);
                            callback.apply(scope, arguments);
                        },
                        callback: callback
                    };
                } else {
                    return;
                }

                //apply eventMap
                applyMap.call(me, eventMap);
            },
            suspend: function (event) {
                var me = this;
                me.suspendedEvents = xs.Array.unique(xs.Array.union(me.suspendedEvents, event));
            },
            resume: function (event) {
                var me = this;
                xs.isArray(event) || (event = [event]);
                me.suspendedEvents = xs.Array.findAll(me.suspendedEvents, function (name) {
                    return !xs.Array.has(event, name);
                });
            },
            off: function (event, callback) {
                var me = this;
                if (arguments.length == 0) {
                    me.deleteAllEvents();
                    return;
                }

                if (arguments.length == 1) {
                    if (xs.isObject(event)) {
                        xs.Object.each(event, function (callback, event) {
                            unbind.call(me, event, callback);
                        });
                    } else {
                        me.deleteEvent(event);
                    }
                    return;
                }

                if (xs.isArray(event)) {
                    xs.Array.each(event, function (event) {
                        unbind.call(me, event, callback);
                    });
                } else {
                    unbind.call(me, event, callback);
                }
            },
            listen: function (target, event, callback, context) {
                target.on.apply(target, arguments);
            },
            listenOnce: function (target, event, callback, context) {
                target.once.apply(target, arguments);
            },
            ignore: function (target, event, callback) {
                target.off.apply(target, arguments);
            },
            hasEvent: function (name) {
                return this.events.hasOwnProperty(name);
            },
            addEvent: function (name) {
                var me = this;
                me.events[name] || (me.events[name] = []);
            },
            deleteEvent: function (name) {
                delete this.events[name];
            },
            deleteAllEvents: function () {
                this.events = {};
            }
        }
    };
});