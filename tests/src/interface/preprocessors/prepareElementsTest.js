/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareElements', function () {

    'use strict';

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.constants.Base';

        //define
        me.Base = xs.Interface(function () {
            this.constant = [
                'a'
            ];
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.constants.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.constants.Base';
            this.constant = [
                'a',
                'b'
            ];
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.constants.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.constants.Parent';
            this.constant = [
                'a',
                'b',
                'c'
            ];
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.constants;

        //Base
        strictEqual(ns.Base.descriptor.constant.values().toString(), 'a');

        //Parent
        strictEqual(ns.Parent.descriptor.constant.values().toString(), 'a,b');

        //Child
        strictEqual(ns.Child.descriptor.constant.values().toString(), 'a,b,c');
    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.staticProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Interface(function () {
            this.static.property.a = {
                get: me.baseAGet
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.staticProperties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.staticProperties.Base';
            this.static.property.a = {
                get: me.parentAGet
            };
            this.static.property.b = {
                set: me.parentBSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.staticProperties.Child';

        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.staticProperties.Parent';
            this.static.property.a = 2;
            this.static.property.c = {
                get: me.childCGet,
                set: me.childCSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.staticProperties;

        //init properties (will be referred to descriptor.static.property)
        var properties;

        //check static properties definition
        //Base
        properties = ns.Base.descriptor.static.property;
        //a
        strictEqual(properties.at('a').isAccessed, true);
        strictEqual(properties.at('a').isReadonly, false);

        //Parent
        properties = ns.Parent.descriptor.static.property;
        //a
        strictEqual(properties.at('a').isAccessed, true);
        strictEqual(properties.at('a').isReadonly, false);
        //b
        strictEqual(properties.at('b').isAccessed, true);
        strictEqual(properties.at('b').isReadonly, false);

        //Child
        properties = ns.Child.descriptor.static.property;
        //a
        strictEqual(properties.at('a').isAssigned, true);
        //b
        strictEqual(properties.at('b').isAccessed, true);
        strictEqual(properties.at('b').isReadonly, false);
        //c
        strictEqual(properties.at('c').isAccessed, true);
        strictEqual(properties.at('c').isReadonly, false);

    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.staticMethods.Base';

        me.baseA = function (base, a) {

            return base + a;
        };

        //define
        me.Base = xs.Interface(function () {
            this.static.method.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.staticMethods.Parent';

        me.parentA = function (parent, a) {

            return parent + a;
        };
        me.parentB = function (parent, b) {

            return parent + b;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.staticMethods.Base';
            this.static.method.a = me.parentA;
            this.static.method.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.staticMethods.Child';

        me.childC = function (child, c) {

            return child + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.staticMethods.Parent';
            this.static.method.c = me.childC;
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.staticMethods;

        //init methods (will be referred to descriptor.static.method)
        var methods;

        //check static methods definition
        //Base
        methods = ns.Base.descriptor.static.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'base,a');

        //Parent
        methods = ns.Parent.descriptor.static.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');

        //Child
        methods = ns.Child.descriptor.static.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');
        //c
        strictEqual(methods.at('c').args.toString(), 'child,c');

    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

    test('constructor chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.constructor.Base';

        me.constructor = function (a, b) {

        };

        me.constructor2 = function (b, c) {

        };

        //define
        me.Base = xs.Interface(function () {
            this.constructor = me.constructor;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.constructor.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.constructor.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.constructor.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.constructor.Parent';
            this.constructor = me.constructor2;
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.constructor;

        //check chain
        //Base
        strictEqual(ns.Base.descriptor.constructor.args.toString(), 'a,b');

        //Parent
        strictEqual(ns.Parent.descriptor.constructor.args.toString(), 'a,b');

        //Child
        strictEqual(ns.Child.descriptor.constructor.args.toString(), 'b,c');

    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

    test('properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.properties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Interface(function () {
            this.property.a = {
                get: me.baseAGet
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.properties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.properties.Base';
            this.property.a = {
                get: me.parentAGet
            };
            this.property.b = {
                set: me.parentBSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.properties.Child';


        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.properties.Parent';
            this.property.a = 2;
            this.property.c = {
                get: me.childCGet,
                set: me.childCSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.properties;

        //init properties (will be referred to descriptor.static.property)
        var properties;

        //check properties definition
        //Base
        properties = ns.Base.descriptor.property;
        //a
        strictEqual(properties.at('a').isAccessed, true);
        strictEqual(properties.at('a').isReadonly, false);

        //Parent
        properties = ns.Parent.descriptor.property;
        //a
        strictEqual(properties.at('a').isAccessed, true);
        strictEqual(properties.at('a').isReadonly, false);
        //b
        strictEqual(properties.at('b').isAccessed, true);
        strictEqual(properties.at('b').isReadonly, false);

        //Child
        properties = ns.Child.descriptor.property;
        //a
        strictEqual(properties.at('a').isAssigned, true);
        //b
        strictEqual(properties.at('b').isAccessed, true);
        strictEqual(properties.at('b').isReadonly, false);
        //c
        strictEqual(properties.at('c').isAccessed, true);
        strictEqual(properties.at('c').isReadonly, false);

    }, function () {
        var me = this;

        //tearDown
        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareElements.methods.Base';

        me.baseA = function (base, a) {

            return base + a;
        };

        //define
        me.Base = xs.Interface(function () {
            this.method.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareElements.methods.Parent';

        me.parentA = function (parent, a) {

            return parent + a;
        };
        me.parentB = function (parent, b) {

            return parent + b;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.methods.Base';
            this.method.a = me.parentA;
            this.method.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareElements.methods.Child';

        me.childC = function (child, c) {

            return child + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareElements.methods.Parent';
            this.method.c = me.childC;
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = window.tests.interface.preprocessors.prepareElements.methods;

        //init methods (will be referred to descriptor.method)
        var methods;

        //check methods definition
        //Base
        methods = ns.Base.descriptor.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'base,a');

        //Parent
        methods = ns.Parent.descriptor.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');

        //Child
        methods = ns.Child.descriptor.method;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');
        //c
        strictEqual(methods.at('c').args.toString(), 'child,c');

    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

});