xs.define(xs.Class, 'ns.tests.dom.interaction.Test', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        stage: {
            Composition: 'ns.tests.dom.interaction.stage.Composition',
            Content: 'ns.tests.dom.interaction.stage.Content',
            Element: 'ns.tests.dom.interaction.stage.Element',
            Scroll: 'ns.tests.dom.interaction.stage.Scroll'
        }
    };

    Class.extends = 'ns.module.test.Module';

    Class.constant.testName = 'interaction';

    Class.constant.testLabel = 'interaction';

    Class.constant.stages = xs.lazy(function () {
        return new xs.core.Collection({
            composition: imports.stage.Composition,
            content: imports.stage.Content,
            element: imports.stage.Element,
            scroll: imports.stage.Scroll
        });
    });

});