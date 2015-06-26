xs.define(xs.Class, 'ns.tests.xs.pointer.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            ContextMenu: 'ns.tests.xs.pointer.stage.ContextMenu',
            DoubleTap: 'ns.tests.xs.pointer.stage.DoubleTap',
            Enter: 'ns.tests.xs.pointer.stage.Enter',
            Move: 'ns.tests.xs.pointer.stage.Move',
            Tap: 'ns.tests.xs.pointer.stage.Tap',
            TapEnd: 'ns.tests.xs.pointer.stage.TapEnd',
            TapStart: 'ns.tests.xs.pointer.stage.TapStart'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'pointer';

    Class.constant.testLabel = 'pointer';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            tap: imports.stage.Tap,
            doubleTap: imports.stage.DoubleTap,
            tapStart: imports.stage.TapStart,
            tapEnd: imports.stage.TapEnd,
            contextMenu: imports.stage.ContextMenu,
            move: imports.stage.Move,
            enter: imports.stage.Enter
        });
    });

});