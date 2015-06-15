xs.define(xs.Class, 'ns.Stage', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        view: {
            Container: 'ns.view.Container',
            Element: 'xs.view.Element',
            Instruction: 'ns.view.Instruction'
        },
        StageState: 'ns.StageState'
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

    Class.method.start = function () {
        var me = this;

        //add and show instruction
        var instruction = me.private.instruction = new imports.view.Instruction(self.instruction);
        me.private.container.instructions.add(instruction);
        instruction.show();

        //if state is done - add done element
        if (me.private.state === imports.StageState.Done) {
            var element = new imports.view.Element(document.createElement('div'));
            element.classes.add('done');
            me.private.container.sandbox.add(element);
        }
    };

    Class.method.stop = function () {
        var me = this;

        //destroy instruction after hide
        me.private.instruction.hide().then(function () {
            me.private.instruction.destroy();
        });

        //clean up sandbox
        me.private.container.sandbox.remove();
    };

});