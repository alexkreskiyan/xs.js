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
xs.define('xs.util.Observable', {
    constructor: function () {
        this.events = {};
    },
    properties: {
        events: {}
    },
    methods: {
        trigger: function (event) {
            if (!this.hasEvent(event)) {
                return;
            }
            var args = xs.Array.clone(arguments).slice(1);
            xs.Array.each(this.events[event], function (dispatcher) {
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
            me.applyMap(eventMap);
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
                            me.unbind(event, handler);
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
                            me.unbind(event, callback);
                            callback.apply(scope, arguments);
                        },
                        callback: callback
                    };
                });
            } else if (xs.isString(event)) {
                scope = context || me;
                eventMap[event] = {
                    handler: function () {
                        me.unbind(event, callback);
                        callback.apply(scope, arguments);
                    },
                    callback: callback
                };
            } else {
                return;
            }

            //apply eventMap
            me.applyMap(eventMap);
        },
        off: function (event, callback) {
            if (arguments.length == 0) {
                this.deleteAllEvents();
                return;
            }

            if (arguments.length == 1) {
                if (xs.isObject(event)) {
                    xs.Object.each(event, function (callback, event) {
                        this.unbind(event, callback);
                    }, this);
                } else {
                    this.deleteEvent(event);
                }
                return;
            }

            if (xs.isArray(event)) {
                xs.Array.each(event, function (event) {
                    this.unbind(event, callback);
                }, this);
            } else {
                this.unbind(event, callback);
            }
        },
        unbind: function (event, callback) {
            this.events[event] = xs.Array.findAll(this.events[event], function (dispatcher) {
                return dispatcher.callback != callback;
            });
        },
        listen: function (target, event, callback, context) {
            target.on(event, callback, context || target);
        },
        listenOnce: function (target, event, callback, context) {
            target.once(event, callback, context || target);
        },
        ignore: function (target, event, callback) {
            target.off(event, callback);
        },
        hasEvent: function (name) {
            return this.events.hasOwnProperty(name);
        },
        addEvent: function (name) {
            this.events[name] || (this.events[name] = []);
        },
        deleteEvent: function (name) {
            delete this.events[name];
        },
        deleteAllEvents: function () {
            this.events = {};
        },
        applyMap: function (map) {
            xs.Object.each(map, function (dispatcher, event) {
                this.addEvent(event);
                this.events[event].push(dispatcher);
            }, this);
        }
    }
});