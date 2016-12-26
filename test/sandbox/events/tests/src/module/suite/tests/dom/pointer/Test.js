xs.define(xs.Class, 'ns.tests.dom.pointer.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            ContextMenu: 'ns.tests.dom.pointer.stage.ContextMenu',
            DoubleTap: 'ns.tests.dom.pointer.stage.DoubleTap',
            Move: 'ns.tests.dom.pointer.stage.Move',
            Tap: 'ns.tests.dom.pointer.stage.Tap'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'pointer';

    Class.constant.testLabel = 'pointer';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            contextMenu: imports.stage.ContextMenu,
            doubleTap: imports.stage.DoubleTap,
            move: imports.stage.Move,
            tap: imports.stage.Tap
        });
    });

});