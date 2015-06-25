xs.define(xs.Class, 'ns.tests.xs.pointer.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            ContextMenu: 'ns.tests.xs.pointer.stage.ContextMenu',
            DoubleTap: 'ns.tests.xs.pointer.stage.DoubleTap',
            Tap: 'ns.tests.xs.pointer.stage.Tap',
            TapStart: 'ns.tests.xs.pointer.stage.TapStart'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'pointer';

    Class.constant.testLabel = 'pointer';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            contextMenu: imports.stage.ContextMenu,
            doubleTap: imports.stage.DoubleTap,
            tap: imports.stage.Tap,
            tapStart: imports.stage.TapStart
        });
    });

});