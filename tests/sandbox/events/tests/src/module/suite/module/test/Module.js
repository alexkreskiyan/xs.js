xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        data: {
            model: {
                Test: 'tests.module.suite.data.model.Test'
            }
        },
        event: {
            Click: 'tests.module.suite.event.Click',
            Done: 'ns.event.Done',
            Progress: 'ns.event.Progress',
            StageChange: 'ns.event.StageChange'
        },
        Stage: 'ns.Stage',
        StageState: 'ns.StageState',
        view: {
            Container: 'ns.view.Container',
            Control: 'ns.view.Control',
            ProgressMeter: 'ns.view.ProgressMeter'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (test) {
        var me = this;

        //assert, that test is a imports.model.Test instance
        self.assert.ok(test instanceof imports.data.model.Test, 'constructor - given test `$test` is not a valid `$Test` instance', {
            $test: test,
            $Test: imports.data.model.Test
        });

        self.mixins.observable.call(me, xs.noop);

        //save model to private
        var model = me.private.model = test;

        //add container
        var container = me.private.container = new imports.view.Container();

        //add stages to test
        var stages = me.private.stages = new xs.core.Collection();
        var savedStates = model.stages.get();
        me.self.stages.each(function (Stage, name) {
            var stageState;

            if (savedStates.hasKey(name)) {
                stageState = savedStates.at(name);
            } else {
                stageState = imports.StageState.Undone;
                savedStates.add(name, stageState);
            }

            //create new stage with evaluated state
            var stage = new Stage(container, stageState);

            //send progress immediately, if stage is done
            if (stage.state === imports.StageState.Done) {
                xs.nextTick(function () {
                    sendProgress.call(me, name);
                });
            } else {
                //bind to stage `Done` event
                stage.on(imports.event.Done, function () {

                    //off stage with event.Done
                    stage.off(imports.event.Done);

                    //send progress
                    sendProgress.call(me, name);
                }, {
                    scope: me
                });
            }

            //add stage to test
            stages.add(name, stage);
        });

        //add controls
        addControls.call(me);
    };

    Class.property.model = {
        set: xs.noop
    };

    Class.property.container = {
        set: xs.noop
    };

    Class.method.show = function () {
        var me = this;

        var stages = me.private.stages;

        //start first stage if test has at least one stage
        if (stages.size) {
            changeStage.call(me, stages.first());
        }

        return me.private.container.show();
    };

    Class.method.hide = function () {
        var me = this;

        var stages = me.private.stages;

        //hide active stage
        if (stages.size) {
            changeStage.call(me, null);
        }

        return me.private.container.hide();
    };

    var addControls = function () {
        var me = this;

        var container = me.private.container;
        var stages = me.private.stages;


        //add progress meter
        var progress = new imports.view.ProgressMeter({
            total: stages.size,
            foreground: '#f0f0f0',
            background: '#ffffff'
        });
        container.controls.add(progress);
        me.on(imports.event.Progress, function (event) {
            var me = this;
            me.progress = event.done;
        }, {
            scope: progress
        });
        me.on(imports.event.StageChange, function (event) {
            var me = this;

            me.current = event.index;
        }, {
            scope: progress
        });


        //add close control
        var close = new imports.view.Control({
            name: 'close',
            label: 'Закрыть'
        });
        container.controls.add(close);
        close.on(imports.event.Click, function () {
            me.hide();
        });


        //return if stages count is less than 2
        if (stages.size < 2) {

            return;
        }


        //add prev control
        var prev = new imports.view.Control({
            name: 'prev',
            label: '<<'
        });
        container.controls.insert(0, prev);
        prev.classes.add('navigation');

        //bind events
        prev.on(imports.event.Click, function () {
            changeStage.call(me, stages.at(stages.keyOf(me.private.activeStage, xs.core.Collection.Index) - 1, xs.core.Collection.Index));
        });
        me.on(imports.event.StageChange, function (event) {
            var me = this;

            if (event.index === 1 && !me.isDisabled) {
                me.disable();
            } else if (event.index > 1 && me.isDisabled) {
                me.enable();
            }
        }, {
            scope: prev
        });


        //add next control
        var next = new imports.view.Control({
            name: 'next',
            label: '>>'
        });
        container.controls.insert(1, next);
        next.classes.add('navigation');

        //bind events
        next.on(imports.event.Click, function () {
            changeStage.call(me, stages.at(stages.keyOf(me.private.activeStage, xs.core.Collection.Index) + 1, xs.core.Collection.Index));
        });
        me.on(imports.event.StageChange, function (event) {
            var me = this;

            if (event.index === event.total && !me.isDisabled) {
                me.disable();
            } else if (event.index < event.total && me.isDisabled) {
                me.enable();
            }
        }, {
            scope: next
        });
    };

    var changeStage = function (stage) {
        var me = this;

        //validate stage
        self.assert.ok(xs.isNull(stage) || (stage instanceof imports.Stage), 'changeStage - stage is incorrect');

        //stop current stage, if any
        if (me.private.activeStage) {
            me.private.activeStage.stop();
            delete me.private.activeStage;
        }

        //return if no new stage
        if (!stage) {
            return;
        }

        //activate new stage
        stage.start();

        //save as active
        me.private.activeStage = stage;

        var stages = me.private.stages;

        //send `StageChange` event
        me.events.emitter.send(new imports.event.StageChange({
            stage: stage,
            index: stages.keyOf(stage, xs.core.Collection.Index) + 1,
            total: stages.size
        }));
    };

    var sendProgress = function (name) {
        var me = this;

        //update stage progress in model
        me.model.stages.get().set(name, imports.StageState.Done);

        var stages = me.private.stages;

        var done = stages.find(function (stage) {
            return stage.state === imports.StageState.Done;
        }, xs.core.Collection.All).size;

        var total = stages.size;

        //send progress event
        me.events.emitter.send(new imports.event.Progress({
            done: done,
            total: total
        }));

        //if all done - send done event
        if (done === total) {
            me.events.emitter.send(new imports.event.Done());
        }
    };

});