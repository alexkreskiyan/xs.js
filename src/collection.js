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
    xs.collection = {
        model: {},
        _models: [],
        _length: 0,
        _byId: {},
        // The JSON representation of a Collection is an array of the
        // models' attributes.
        toJSON: function(options) {
            return this.map(function(model) {
                return model.toJSON(options);
            });
        },
        // Add a model, or list of models to the set.
        add: function(models, options) {
            return this.set(models, _.extend({merge: false}, options, {add: true, remove: false}));
        },
        // Remove a model, or a list of models from the set.
        remove: function(models, options) {
            var singular = !_.isArray(models);
            models = singular ? [models] : _.clone(models);
            options || (options = {});
            var i, l, index, model;
            for (i = 0, l = models.length; i < l; i++) {
                model = models[i] = this.get(models[i]);
                if (!model)
                    continue;
                delete this._byId[model.cid];
                index = this.indexOf(model);
                this._models.splice(index, 1);
                this._length--;
                if (!options.silent) {
                    options.index = index;
                    if (_.isFunction(model.trigger)) {
                        model.trigger('remove', model, this, options);
                    }
                }
                this._removeReference(model);
            }
            return singular ? models[0] : models;
        },
        // Update a collection by `set`-ing a new list of models, adding new ones,
        // removing models that are no longer present, and merging models that
        // already exist in the collection, as necessary. Similar to **Model#set**,
        // the core operation for updating the data contained by the collection.
        set: function(models, options) {
            options = _.defaults({}, options, {add: true, remove: true, merge: true});
            if (options.parse)
                models = this.parse(models, options);
            var singular = !_.isArray(models);
            models = singular ? (models ? [models] : []) : _.clone(models);
            var i, l, id, model, attrs, existing, sort;
            var at = options.at;
            var sortable = this.comparator && (at === null) && options.sort !== false;
            var sortAttr = _.isString(this.comparator) ? this.comparator : null;
            var toAdd = [], toRemove = [], modelMap = {};
            var add = options.add, merge = options.merge, remove = options.remove;
            var order = !sortable && add && remove ? [] : false;
            // Turn bare objects into model references, and prevent invalid models
            // from being added.
            for (i = 0; i < models.length; i++) {
                attrs = models[i];
                id = attrs.cid;
                // If a duplicate is found, prevent it from being added and
                // optionally merge it into the existing model.
                existing = this.get(id);
                if (existing) {
                    if (remove)
                        modelMap[existing.cid] = true;
                    if (merge) {
                        if (options.parse)
                            attrs = existing.parse(attrs, options);
                        existing.set(attrs, options);
                        if (sortable && !sort && existing.hasChanged(sortAttr))
                            sort = true;
                    }
                    models[i] = existing;
                    // If this is a new, valid model, push it to the `toAdd` list.
                } else if (add) {
                    model = models[i] = this._prepareModel(attrs, options);
                    if (!model)
                        continue;
                    toAdd.push(model);

                    // Index models for lookup by `cid`.
                    this._byId[model.cid] = model;
                }
                if (order)
                    order.push(existing || model);
            }
            // Remove nonexistent models if appropriate.
            if (remove) {
                for (i = 0, l = this._length; i < l; ++i) {
                    if (!modelMap[(model = this._models[i]).cid])
                        toRemove.push(model);
                }
                if (toRemove.length)
                    this.remove(toRemove, options);
            }
            // See if sorting is needed, update `length` and splice in new models.
            if (toAdd.length || (order && order.length)) {
                if (sortable)
                    sort = true;
                this._length += toAdd.length;
                if (at !== null) {
                    for (i = 0, l = toAdd.length; i < l; i++) {
                        this._models.splice(at + i, 0, toAdd[i]);
                    }
                } else {
                    if (order)
                        this._models.length = 0;
                    var orderedModels = order || toAdd;
                    for (i = 0, l = orderedModels.length; i < l; i++) {
                        this._models.push(orderedModels[i]);
                    }
                }
            }
            // Silently sort the collection if appropriate.
            if (sort)
                this.sort({silent: true});
            // Unless silenced, it's time to fire all appropriate add/sort events.
            if (!options.silent && _.isFunction(this.trigger)) {
                if (_.isFunction(this.model.trigger))
                    for (i = 0, l = toAdd.length; i < l; i++) {
                        (model = toAdd[i]).trigger('add', model, this, options);
                    }
                if (sort || (order && order.length))
                    this.trigger('sort', this, options);
            }
            // Return the added (or merged) model (or models).
            return singular ? models[0] : models;
        },
        // When you have more items than you want to add or remove individually,
        // you can reset the entire set with a new list of models, without firing
        // any granular `add` or `remove` events. Fires `reset` when finished.
        // Useful for bulk operations and optimizations.
        reset: function(models, options) {
            options || (options = {});
            for (var i = 0, l = this._models.length; i < l; i++) {
                this._removeReference(this._models[i]);
            }
            options.previousModels = this._models;
            this._reset();
            models = this.add(models, _.extend({silent: true}, options));
            if (!options.silent && _.isFunction(this.trigger))
                this.trigger('reset', this, options);
            return models;
        },
        // Add a model to the end of the collection.
        push: function(model, options) {
            return this.add(model, _.extend({at: this._length}, options));
        },
        // Remove a model from the end of the collection.
        pop: function(options) {
            var model = this.at(this._length - 1);
            this.remove(model, options);
            return model;
        },
        // Add a model to the beginning of the collection.
        unshift: function(model, options) {
            return this.add(model, _.extend({at: 0}, options));
        },
        // Remove a model from the beginning of the collection.
        shift: function(options) {
            var model = this.at(0);
            this.remove(model, options);
            return model;
        },
        // Slice out a sub-array of models from the collection.
        slice: function() {
            return slice.apply(this._models, arguments);
        },
        // Get a model from the set by id.
        get: function(cid) {
            if (cid === null)
                return void 0;
            return this._byId[cid];
        },
        // Get the model at the given index.
        at: function(index) {
            return this._models[index];
        },
        // Return models with matching attributes. Useful for simple cases of
        // `filter`.
        where: function(attrs, first) {
            if (_.isEmpty(attrs))
                return first ? void 0 : [];
            return this[first ? 'find' : 'filter'](function(model) {
                for (var key in attrs) {
                    if (attrs[key] !== model.get(key))
                        return false;
                }
                return true;
            });
        },
        // Return the first model with matching attributes. Useful for simple cases
        // of `find`.
        findWhere: function(attrs) {
            return this.where(attrs, true);
        },
        // Force the collection to re-sort itself. You don't need to call this under
        // normal circumstances, as the set will maintain sort order as each item
        // is added.
        sort: function(options) {
            if (!this.comparator)
                throw new Error('Cannot sort a set without a comparator');
            options || (options = {});
            // Run sort based on type of `comparator`.
            if (_.isString(this.comparator) || this.comparator.length === 1) {
                this._models = this.sortBy(this.comparator, this);
            } else {
                this._models.sort(_.bind(this.comparator, this));
            }
            if (!options.silent && _.isFunction(this.trigger))
                this.trigger('sort', this, options);
            return this;
        },
        // Pluck an attribute from each model in the collection.
        pluck: function(attr) {
            return _.invoke(this._models, 'get', attr);
        },
        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function(resp, options) {
            return resp;
        },
        // Create a new collection with an identical list of models as this one.
        clone: function() {
            return new this.constructor(this._models);
        },
        // Private method to reset all internal state. Called when the collection
        // is first initialized or reset.
        _reset: function() {
            this._length = 0;
            this._models = [];
            this._byId = {};
        },
        // Prepare a hash of attributes (or other model) to be added to this
        // collection.
        _prepareModel: function(attrs, options) {
            if (attrs instanceof this.model) {
                if (!attrs.collection)
                    attrs.collection = this;
                return attrs;
            }
            options = options ? _.clone(options) : {};
            options.collection = this;
            return new this.model(attrs, options);
        },
        // Internal method to sever a model's ties to a collection.
        _removeReference: function(model) {
            if (this === model.collection)
                delete model.collection;
        }
    };
    // Underscore methods that we want to implement on the Collection.
    // Mix in each Underscore method as a proxy to `Collection#models`.
    _.each(['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
        'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
        'lastIndexOf', 'isEmpty', 'chain'], function(method) {
        xs.collection[method] = function() {
            var args = slice.call(arguments);
            args.unshift(this._models);
            return _[method].apply(_, args);
        };
    });
    // Underscore methods that take a property name as an argument.
    // Use attributes instead of properties.
    _.each(['groupBy', 'countBy', 'sortBy'], function(method) {
        xs.collection[method] = function(value, context) {
            var iterator = _.isFunction(value) ? value : function(model) {
                return model.get(value);
            };
            return _[method](this._models, iterator, context);
        };
    });
}).call(this);