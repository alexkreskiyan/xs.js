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
    xs.template = {
        model: {},
        collection: null,
        el: '',
        events: {},
        // jQuery delegate for element lookup, scoped to DOM elements within the
        // current view. This should be preferred to global lookups where possible.
        $: function(selector) {
            return this.$el.find(selector);
        },
        // Change the view's element (`this.el` property), including event
        // re-delegation.
        setElement: function(element) {
            this.$el = element instanceof $ ? element : $(element);
            this.el = this.$el[0];
            return this;
        },
        //get view template
        template: function(id) {
            return '';
        },
        //try's to create node
        render: function(data) {
            //reference this
            var template = this;
            if (!_.isObject(data)) {
                return template;
            }
            //get uid and node hmtl
            var id = _.uniqueId('t'), node = template.template(id, data.template, data.params);
            delete data.template;
            delete data.params;
            delete data.el;
            //pos is 'after by default
            if (!data.pos) {
                data.pos = 'after';
            }
            //insert node by position
            switch (data.pos) {
                case 'replace':
                    template.$el.html(node);
                    break;
                case 'before':
                    template.$el.prepend(node);
                    break;
                case 'after':
                default:
                    template.$el.append(node);
            }
            //delete position attribute
            delete data.pos;
            //replace $el reference
            this.$el = template.$el.find('#' + id);
            var element = template.$el.get(0);
            _.each(data, function(value, key) {
                if (_.isString(value) || _.isNumber(value)) {
                    template.$el.attr(key, value);
                    element[key] = value;
                }
            });
        },
        //function binds model event to given node
        bindEvents: function(node, events) {
            //reference this
            var template = this;
            //check events
            if (!(events || (events = _.result(this, 'events'))))
                return this;
            //unbind events
            template.unbindEvents(node, events);
            //bind events
            _.each(events, function(value, key) {
                node.on(key + '.el', function() {
                    //check event handler
                    if (_.isFunction(value)) {
                        value.apply(template, arguments);
                    } else if (_.isString(value) && _.isFunction(template[value])) {
                        template[value].apply(template, arguments);
                    } else {
                        throw new Error('Model template event handler is not a function');
                    }
                });
            });
            //return this for chaining
            return template;
        },
        //function unbinds model event from given node
        unbindEvents: function(node, events) {
            //reference this
            var template = this;
            //check events
            if (!(events || (events = _.result(this, 'events'))))
                return this;
            //unbind events
            _.each(events, function(value, key) {
                node.off(key + '.el');
            });
            //return this for chaining
            return template;
        }
    };
}).call(this);