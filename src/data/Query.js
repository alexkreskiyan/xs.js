/**
 * Query is a key element in xs.js data workflow. It's aim is data aggregation from several sources
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.Query
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Query', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {
            Enumerable: 'ns.Enumerable'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.mixins.enumerable = 'xs.data.Enumerable';

    Class.constructor = function (source) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'constructor - given `$source` is not an iterable', {
            $source: source
        });

        //call enumerable constructor
        self.mixins.enumerable.call(me);

        me.private.source = getSource(source);

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);

        //init operations stack
        me.private.stack = new xs.core.Collection();

        //set isExecuted to false
        me.private.isExecuted = false;
    };

    Class.property.isExecuted = {
        set: xs.noop
    };

    Class.method.innerJoin = function (source, condition) {
        var Query = self;
        var me = this;

        //join results in new query
        var query = new Query([]);

        //save join condition to stack of new query
        query.private.stack.add(new InnerJoinProcessor(me, source, condition));

        return query;
    };

    Class.method.outerJoin = function (source, condition, emptyValue) {
        var Query = self;
        var me = this;

        //join results in new query
        var query = new Query([]);

        //save join condition to stack of new query
        query.private.stack.add(new OuterJoinProcessor(me, source, condition, emptyValue));

        return query;
    };

    Class.method.groupJoin = function (source, condition, options) {
        var Query = self;
        var me = this;

        //join results in new query
        var query = new Query([]);

        //save join condition to stack of new query
        if (arguments.length > 2) {
            query.private.stack.add(new GroupJoinProcessor(me, source, condition, options));
        } else {
            query.private.stack.add(new GroupJoinProcessor(me, source, condition));
        }

        return query;
    };

    Class.method.select = function (selector) {
        var me = this;

        //save new sort processor
        me.private.stack.add(new SelectProcessor(selector));

        return me;
    };

    Class.method.where = function (selector) {
        var me = this;

        //save new where processor
        me.private.stack.add(new WhereProcessor(selector));

        return me;
    };

    Class.method.group = function (grouper, options) {
        var me = this;

        //save new sort processor
        if (arguments.length > 1) {
            me.private.stack.add(new GroupProcessor(grouper, options));
        } else {
            me.private.stack.add(new GroupProcessor(grouper));
        }

        return me;
    };

    Class.method.sort = function (sorter) {
        var me = this;

        //save new sort processor
        me.private.stack.add(new SortProcessor(sorter));

        return me;
    };

    Class.method.execute = function () {
        var me = this;

        //lazy evaluate source
        if (me.private.source instanceof xs.core.Lazy) {
            me.private.source = me.private.source.get();
        }

        //if source is a query - execute it
        if (me.private.source instanceof self) {
            me.private.source.execute();
        }

        if (me.private.stack.size) {

            var result = me.private.stack.reduce(function (source, processor) {
                return processor.process(source);
            }, 0, null, me.private.source);

            //set items of result
            me.private.items = result.private.items;
        } else {

            //set items as source's items' copy
            me.private.items = me.private.source.private.items.slice();
        }

        //set isExecuted flag
        me.private.isExecuted = true;
    };

    Class.method.destroy = function () {
        var me = this;

        //call Enumerable.destroy
        self.mixins.enumerable.prototype.destroy.call(me);

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    var getSource = function (source) {

        //if given imports.Enumerable or xs.core.Collection - use as-is
        if ((xs.isInstance(source) && source.self.mixins(imports.Enumerable)) || source instanceof xs.core.Collection) {

            return xs.lazy(function () {
                return source;
            });
        } else {

            return xs.lazy(function () {
                return new xs.core.Collection(source);
            });
        }
    };


    var findJoinItem = function (item) {
        var me = this;

        self.assert.object(item, 'findJoinItem - can not join with non object item `$item`', {
            $item: item
        });

        return me.condition(me.item, item);
    };

    var InnerJoinProcessor = function (origin, source, condition) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'innerJoin - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'innerJoin - given join condition `$condition` is not a function', {
            $condition: condition
        });

        me.origin = origin;
        me.source = getSource(source);
        me.condition = condition;
    };

    InnerJoinProcessor.prototype.process = function () {
        var me = this;

        //lazy evaluate source
        if (me.source instanceof xs.core.Lazy) {
            me.source = me.source.get();
        }

        //get origin
        var origin = me.origin;

        //execute origin query
        origin.execute();

        //get joined source
        var source = me.source;

        //if source is a query - execute it
        if (source instanceof self) {
            source.execute();
        }

        //use xs.core.Collection
        var result = new xs.core.Collection();

        origin.each(function (originItem) {

            self.assert.object(originItem, 'InnerJoinProcessor - can not join non object item `$item`', {
                $originItem: originItem
            });

            var joinedItem = source.find(findJoinItem, 0, {
                item: originItem,
                condition: me.condition
            });

            //if no match - return
            if (!joinedItem) {

                return;
            }

            result.add(xs.apply({}, originItem, joinedItem));
        });

        return result;
    };


    var OuterJoinProcessor = function (origin, source, condition, emptyValue) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'outerJoin - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'outerJoin - given join condition `$condition` is not a function', {
            $condition: condition
        });

        me.origin = origin;
        me.source = source;
        me.condition = condition;
        me.emptyValue = emptyValue;
    };

    OuterJoinProcessor.prototype.process = function () {
        var me = this;

        //lazy evaluate source
        if (me.source instanceof xs.core.Lazy) {
            me.source = me.source.get();
        }

        //get origin
        var origin = me.origin;

        //execute origin query
        origin.execute();

        //get joined source
        var source = me.source;

        //if source is a query - execute it
        if (source instanceof self) {
            source.execute();
        }

        //use xs.core.Collection
        var result = new xs.core.Collection();

        origin.each(function (originItem) {

            self.assert.object(originItem, 'OuterJoinProcessor - can not join non object item `$item`', {
                $originItem: originItem
            });

            var joinedItem = source.find(findJoinItem, 0, {
                item: originItem,
                condition: me.condition
            });

            //if no match - use default
            if (!joinedItem) {

                joinedItem = me.emptyValue instanceof xs.core.Generator ? me.emptyValue.create() : me.emptyValue;

                self.assert.object(joinedItem, 'OuterJoinProcessor - can not join with non object item `$item`', {
                    $joinedItem: joinedItem
                });
            }

            result.add(xs.apply({}, originItem, joinedItem));
        });

        return result;
    };


    var findGroupJoinItem = function (item) {
        var me = this;

        return me.condition(me.item, item);
    };


    var GroupJoinProcessor = function (origin, source, condition, options) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'GroupJoinProcessor - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'GroupJoinProcessor - given join condition `$condition` is not a function', {
            $condition: condition
        });

        me.origin = origin;
        me.source = source;
        me.condition = condition;
        me.alias = 'group';
        me.asArray = false;

        if (arguments.length < 4) {
            return;
        }

        //assert, that options is an object
        self.assert.object(options, 'GroupJoinProcessor - given options `$options` are not an object', {
            $options: options
        });

        if (options.hasOwnProperty('alias')) {

            //assert, that alias is a shortName
            self.assert.shortName(options.alias, 'GroupJoinProcessor - given options.alias `$alias` is not valid', {
                $alias: options.alias
            });

            me.alias = options.alias;
        }

        if (options.hasOwnProperty('asArray')) {

            //assert, that asArray is a boolean
            self.assert.boolean(options.asArray, 'GroupJoinProcessor - given options.asArray `$asArray` is not a boolean', {
                $asArray: options.asArray
            });

            me.asArray = options.asArray;
        }
    };

    GroupJoinProcessor.prototype.process = function () {
        var me = this;

        //lazy evaluate source
        if (me.source instanceof xs.core.Lazy) {
            me.source = me.source.get();
        }

        //get origin
        var origin = me.origin;

        //execute origin query
        origin.execute();

        //get joined source
        var source = me.source;

        //if source is a query - execute it
        if (source instanceof self) {
            source.execute();
        }

        //use xs.core.Collection
        var result = new xs.core.Collection();

        if (me.asArray) {
            origin.each(function (originItem) {

                var joinedItems = source.find(findGroupJoinItem, source.constructor.All, {
                    item: originItem,
                    condition: me.condition
                });

                var item = xs.apply({}, originItem);
                item[ me.alias ] = joinedItems.values();

                result.add(item);
            });
        } else {
            origin.each(function (originItem) {

                var joinedItems = source.find(findGroupJoinItem, source.constructor.All, {
                    item: originItem,
                    condition: me.condition
                });

                var item = xs.apply({}, originItem);
                item[ me.alias ] = new xs.core.Collection();
                item[ me.alias ].private.items = joinedItems.private.items.slice();

                result.add(item);
            });
        }

        return result;
    };


    var SelectProcessor = function (selector) {
        var me = this;

        //assert, that selector is a function
        self.assert.fn(selector, 'group - given `$selector` is not a function', {
            $selector: selector
        });

        me.selector = selector;
    };

    SelectProcessor.prototype.process = function (source) {
        var me = this;

        //map to xs.core.Collection
        var result = new xs.core.Collection();
        result.private.items = source.map(me.selector, source.constructor.All).private.items;

        return result;
    };


    var WhereProcessor = function (selector) {
        var me = this;

        //assert, that selector is a function
        self.assert.fn(selector, 'WhereProcessor - given `$selector` is not a function', {
            $selector: selector
        });

        me.selector = selector;
    };

    WhereProcessor.prototype.process = function (source) {
        var me = this;

        //find as xs.core.Collection
        var result = new xs.core.Collection();
        result.private.items = source.find(me.selector, source.constructor.All).private.items;

        return result;
    };


    var GroupProcessor = function (grouper, options) {
        var me = this;

        //assert, that grouper is a function
        self.assert.fn(grouper, 'GroupProcessor - given grouper `$grouper` is not a function', {
            $grouper: grouper
        });

        me.grouper = grouper;
        me.alias = 'group';
        me.asArray = false;

        if (arguments.length === 1) {
            return;
        }

        //assert, that options is an object
        self.assert.object(options, 'GroupProcessor - given options `$options` are not an object', {
            $options: options
        });

        if (options.hasOwnProperty('alias')) {

            //assert, that alias is a shortName
            self.assert.shortName(options.alias, 'GroupProcessor - given options.alias `$alias` is not valid', {
                $alias: options.alias
            });

            me.alias = options.alias;
        }

        if (options.hasOwnProperty('selector')) {

            //assert, that selector is a function
            self.assert.fn(options.selector, 'GroupProcessor - given options.selector `$selector` is not a function', {
                $selector: options.selector
            });

            me.selector = options.selector;
        }

        if (options.hasOwnProperty('asArray')) {

            //assert, that asArray is a boolean
            self.assert.boolean(options.asArray, 'GroupProcessor - given options.asArray `$asArray` is not a boolean', {
                $asArray: options.asArray
            });

            me.asArray = options.asArray;
        }
    };

    GroupProcessor.prototype.process = function (source) {
        var me = this;

        //create result container
        var result = new xs.core.Collection();

        var alias = me.alias;
        var selector = me.selector;
        var asArray = me.asArray;

        if (selector) {
            if (asArray) {
                source.each(function (item) {

                    //evaluate group key
                    var key = me.grouper(item);

                    //convert key to object
                    if (!xs.isObject(key)) {
                        key = {
                            key: key
                        };
                    }

                    //find group with same key
                    var group = result.find(findGroup, 0, key);

                    //add new item to group
                    if (group) {

                        //add new item to group
                        group[ alias ].push(selector(item));
                    } else {

                        //create group from key
                        key[ alias ] = [ selector(item) ];

                        //add new group to result
                        result.add(key);
                    }
                });
            } else {
                source.each(function (item) {

                    //evaluate group key
                    var key = me.grouper(item);

                    //convert key to object
                    if (!xs.isObject(key)) {
                        key = {
                            key: key
                        };
                    }

                    //find group with same key
                    var group = result.find(findGroup, 0, key);

                    //add new item to group
                    if (group) {

                        //add new item to group
                        group[ alias ].add(selector(item));
                    } else {

                        //create group from key
                        key[ alias ] = new xs.core.Collection([ selector(item) ]);

                        //add new group to result
                        result.add(key);
                    }
                });
            }
        } else {
            if (asArray) {
                source.each(function (item) {

                    //evaluate group key
                    var key = me.grouper(item);

                    //convert key to object
                    if (!xs.isObject(key)) {
                        key = {
                            key: key
                        };
                    }

                    //find group with same key
                    var group = result.find(findGroup, 0, key);

                    //add new item to group
                    if (group) {

                        //add new item to group
                        group[ alias ].push(item);
                    } else {

                        //create group from key
                        key[ alias ] = [ item ];

                        //add new group to result
                        result.add(key);
                    }
                });
            } else {
                source.each(function (item) {

                    //evaluate group key
                    var key = me.grouper(item);

                    //convert key to object
                    if (!xs.isObject(key)) {
                        key = {
                            key: key
                        };
                    }

                    //find group with same key
                    var group = result.find(findGroup, 0, key);

                    //add new item to group
                    if (group) {

                        //add new item to group
                        group[ alias ].add(item);
                    } else {

                        //create group from key
                        key[ alias ] = new xs.core.Collection([ item ]);

                        //add new group to result
                        result.add(key);
                    }
                });
            }
        }

        return result;
    };

    var findGroup = function (group) {
        var me = this;

        var keys = Object.keys(me);
        var length = keys.length;

        //check group
        for (var i = 0; i < length; i++) {
            var key = keys[ i ];

            //if group does not match key - continue
            if (!group.hasOwnProperty(key) || group[ key ] !== me[ key ]) {

                return false;
            }
        }

        return true;
    };


    var SortProcessor = function (sorter) {
        var me = this;

        //assert, that sorter is a function
        self.assert.fn(sorter, 'SortProcessor - given `$sorter` is not a function', {
            $sorter: sorter
        });

        me.sorter = sorter;
    };

    SortProcessor.prototype.process = function (source) {
        var me = this;

        //create result container
        var result = new xs.core.Collection();

        //get items copy
        var items = source.private.items.slice();

        //sort
        items.sort(function (a, b) {
            return me.sorter(a.value, b.value) ? -1 : 1;
        });

        //update indexes
        for (var i = 0; i < items.length; i++) {
            items[ i ].key = i;
        }

        //save items to result
        result.private.items = items;

        return result;
    };

});