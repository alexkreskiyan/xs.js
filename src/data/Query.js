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

        setSource.call(me, source);

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);

        //init operations stack
        me.private.stack = new xs.core.Collection();
    };

    Class.property.isExecuted = {
        set: xs.noop
    };

    Class.method.innerJoin = function (source, condition) {
        var me = this;
        var Query = self;

        var stack = me.private.stack;

        //assert, that it's an only join in stack
        self.assert.not(stack.find(function (processor) {
            return processor instanceof JoinProcessor;
        }), 'innerJoin - query already has a join condition');

        //save join condition to stack
        stack.add(new InnerJoinProcessor(source, condition));

        return new Query(me);
    };

    Class.method.outerJoin = function (source, condition, emptyValue) {
        var me = this;
        var Query = self;

        var stack = me.private.stack;

        //assert, that it's an only join in stack
        self.assert.not(stack.find(function (processor) {
            return processor instanceof JoinProcessor;
        }), 'outerJoin - query already has a join condition');

        //save join condition to stack
        stack.add(new OuterJoinProcessor(source, condition, emptyValue));

        return new Query(me);
    };

    Class.method.groupJoin = function (source, condition, alias) {
        var me = this;
        var Query = self;

        var stack = me.private.stack;

        //assert, that it's an only join in stack
        self.assert.not(stack.find(function (processor) {
            return processor instanceof JoinProcessor;
        }), 'groupJoin - query already has a join condition');

        //save join condition to stack
        stack.add(new OuterJoinProcessor(source, condition, alias));

        return new Query(me);
    };

    Class.method.where = function (selector) {
        var me = this;

        //save new where processor
        me.private.stack.add(new WhereProcessor(selector));

        return me;
    };

    Class.method.sort = function (sorter) {
        var me = this;

        //save new sort processor
        me.private.stack.add(new SortProcessor(sorter));

        return me;
    };

    Class.method.group = function (grouper) {
        var me = this;

        //save new sort processor
        me.private.stack.add(new GroupProcessor(grouper));

        return me;
    };

    Class.method.select = function (selector) {
        var me = this;

        //save new sort processor
        me.private.stack.add(new SelectProcessor(selector));

        return me;
    };

    Class.method.execute = function () {
        var me = this;

        var result = me.private.stack.reduce(function (source, processor) {
            return processor.process(source);
        }, 0, null, me.private.source);

        //set items of result
        me.private.items = result.private.items;

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

    var setSource = function (source) {
        var me = this;

        if (xs.isInstance(source) && source.self.mixins(imports.Enumerable)) {

            me.private.source = xs.lazy(function () {
                return source;
            });
        } else {

            me.private.source = xs.lazy(function () {
                return new xs.core.Collection(source);
            });
        }

    };


    var JoinProcessor = function () {
    };


    var InnerJoinProcessor = function (source, condition) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'innerJoin - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'innerJoin - given join condition `$condition` is not a function', {
            $condition: condition
        });

        me.source = source;
        me.condition = condition;
    };

    //extend from JoinProcessor
    xs.extend(InnerJoinProcessor, JoinProcessor);

    InnerJoinProcessor.prototype.process = function (source) {

        return source;
    };


    var OuterJoinProcessor = function (source, condition, emptyValue) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'outerJoin - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'outerJoin - given join condition `$condition` is not a function', {
            $condition: condition
        });

        me.source = source;
        me.condition = condition;
        me.emptyValue = emptyValue;
    };

    //extend from JoinProcessor
    xs.extend(InnerJoinProcessor, JoinProcessor);

    OuterJoinProcessor.prototype.process = function (source) {

        return source;
    };


    var GroupJoinProcessor = function (source, condition, alias) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'groupJoin - given `$source` is not an iterable', {
            $source: source
        });

        //assert, that condition is a function
        self.assert.fn(condition, 'groupJoin - given join condition `$condition` is not a function', {
            $condition: condition
        });

        //assert, that alias is a shortName
        self.assert.shortName(alias, 'groupJoin - given alias `$alias` is not valid', {
            $alias: alias
        });

        me.source = source;
        me.condition = condition;
        me.alias = alias;
    };

    //extend from JoinProcessor
    xs.extend(InnerJoinProcessor, JoinProcessor);

    GroupJoinProcessor.prototype.process = function (source) {

        return source;
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

        return source;
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

        return source;
    };


    var GroupProcessor = function (grouper) {
        var me = this;

        //assert, that grouper is a function
        self.assert.fn(grouper, 'group - given `$grouper` is not a function', {
            $grouper: grouper
        });

        me.grouper = grouper;
    };

    GroupProcessor.prototype.process = function (source) {

        return source;
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

        return source;
    };

});