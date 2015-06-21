xs.define(xs.Class, 'ns.Stage', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        event: {
            Done: 'ns.event.Done',
            Log: 'ns.event.Log'
        },
        StageState: 'ns.StageState',
        view: {
            Container: 'ns.view.Container',
            Element: 'xs.view.Element',
            Instruction: 'ns.view.Instruction'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constant.instruction = '';

    Class.constructor = function (container, state) {
        var me = this;

        //verify, that correct container given
        self.assert.ok(container instanceof imports.view.Container, 'constructor - given `$container` is not an instance of `$Container`', {
            $container: container,
            $Container: imports.view.Container
        });

        //verify state
        self.assert.ok(imports.StageState.has(state), 'constructor - given `$state` is not a valid `$State` item', {
            $state: state,
            $State: imports.StageState
        });

        self.mixins.observable.call(me, xs.noop);

        me.private.container = container;
        me.private.state = state;
    };

    Class.property.state = {
        set: xs.noop
    };

    Class.property.isDone = {
        get: function () {
            return this.private.state === imports.StageState.Done;
        },
        set: xs.noop
    };

    Class.method.start = function () {
        var me = this;

        //add and show instruction
        var instruction = me.private.instruction = new imports.view.Instruction(me.self.instruction);
        me.private.container.instructions.insert(0, instruction);
        instruction.show();

        //if state is done - add done element
        if (me.private.state === imports.StageState.Done) {
            var element = new imports.view.Element(document.createElement('div'));
            element.classes.add('single');
            element.classes.add('done');
            me.private.container.sandbox.add(element);

            //return true to mark that stage is done
            return true;
        }

        //stage is not done
        return false;
    };

    Class.method.stop = function () {
        var me = this;

        //destroy instruction
        me.private.instruction.destroy();

        //clean up sandbox
        me.private.container.sandbox.remove();
    };

    Class.method.report = function (name, event) {
        var me = this;

        me.events.emitter.send(new imports.event.Log(name, event));
    };

    Class.method.done = function () {
        var me = this;

        //assert, that stage is not done yet
        self.assert.ok(me.private.state !== imports.StageState.Done, 'done - stage is already done');

        //change state
        me.private.state = imports.StageState.Done;

        //clean up sandbox
        me.private.container.sandbox.remove();

        //add done element
        var element = new imports.view.Element(document.createElement('div'));
        element.classes.add('single');
        element.classes.add('done');
        me.private.container.sandbox.add(element);

        //fire done event
        me.events.emitter.send(new imports.event.Done());
    };

});