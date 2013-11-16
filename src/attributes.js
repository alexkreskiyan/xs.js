(function() {
    var root = this, xs;
    // Require xs, if not present or return
    if (!(xs = root.xs) && (typeof require !== 'undefined' && !(xs = require('xs'))))
        return;
    var array = [];
    var push = array.push;
    var slice = array.slice;
    var splice = array.splice;
    var _ = xs._;
    //apply mixin
    xs.attributes = {
        _attributes: {},
        // A hash of attributes whose current and previous value differ.
        _changed: {},
        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
            return _.clone(this._attributes);
        },
        // Get the value of an attribute.
        get: function(attr) {
            return this._attributes[attr];
        },
        // Get the HTML-escaped value of an attribute.
        escape: function(attr) {
            return _.escape(this.get(attr));
        },
        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function(attr) {
            return _.has(this._attributes, attr);
        },
        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function(key, val, options) {
            if (key === null)
                return this;
            // Handle both `"key", value` and `{key: value}` -style arguments.
            var attrs;
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }
            options || (options = {});
            //if validation mixed - validate
            if (_.isFunction(this._validate)) {
                // Run validation
                if (!this._validate(attrs, options))
                    return false;
            }
            // Extract attributes and options.
            var unset = options.unset;
            var silent = options.silent;
            var changes = [];
            var changing = this._changing;
            this._changing = true;
            if (!changing) {
                this._previousAttributes = _.clone(this._attributes);
                this._changed = {};
            }
            var current = this._attributes, prev = this._previousAttributes;
            // For each `set` attribute, update or delete the current value.
            for (var attr in attrs) {
                val = attrs[attr];
                if (!_.isEqual(current[attr], val))
                    changes.push(attr);
                if (!_.isEqual(prev[attr], val)) {
                    this._changed[attr] = val;
                } else {
                    delete this._changed[attr];
                }
                unset ? delete current[attr] : current[attr] = val;
            }
            // Trigger all relevant attribute changes.
            if (!silent && _.isFunction(this.trigger)) {
                if (changes.length)
                    this._pending = true;
                for (var i = 0; i < changes.length; i++) {
                    this.trigger('change:' + changes[i], this, current[changes[i]], options);
                }
            }
            // You might be wondering why there's a `while` loop here. Changes can
            // be recursively nested within `"change"` events.
            if (changing)
                return this;
            if (!silent && _.isFunction(this.trigger)) {
                while (this._pending) {
                    this._pending = false;
                    this.trigger('change', this, options);
                }
            }
            this._pending = false;
            this._changing = false;
            return this;
        },
        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {unset: true}));
        },
        // Clear all attributes on the model, firing `"change"`.
        clear: function(options) {
            var attrs = {};
            for (var key in this._attributes)
                attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, {unset: true}));
        },
        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function(attr) {
            if (attr === null)
                return !_.isEmpty(this._changed);
            return _.has(this._changed, attr);
        },
        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
            if (!diff)
                return this.hasChanged() ? _.clone(this._changed) : false;
            var val, changed = false;
            var old = this._changing ? this._previousAttributes : this._attributes;
            for (var attr in diff) {
                if (_.isEqual(old[attr], (val = diff[attr])))
                    continue;
                (changed || (changed = {}))[attr] = val;
            }
            return changed;
        },
        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function(attr) {
            if (attr === null || !this._previousAttributes)
                return null;
            return this._previousAttributes[attr];
        },
        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function() {
            return _.clone(this._previousAttributes);
        },
        // **parse** converts a response into the hash of attributes to be `set` on
        // the model. The default implementation is just to pass the response along.
        parse: function(resp, options) {
            return resp;
        },
        // Create a new model with identical attributes to this one.
        clone: function() {
            return new this.constructor(this._attributes);
        }
    };
    // Mix in each Underscore method as a proxy to `attributes#_attributes`.
    _.each(['keys', 'values', 'pairs', 'invert', 'pick', 'omit'], function(method) {
        xs.attributes[method] = function() {
            var args = slice.call(arguments);
            args.unshift(this._attributes);
            return _[method].apply(_, args);
        };
    });
}).call(this);