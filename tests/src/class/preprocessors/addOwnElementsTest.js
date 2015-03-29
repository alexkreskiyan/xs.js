/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.addOwnElements', function () {

    'use strict';

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.addOwnElements.constants.Base';

        //define
        me.Base = xs.Class(function () {
            this.constant.a = 1;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.addOwnElements.constants.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.constants.Base';
            this.constant.a = 2;
            this.constant.b = xs.lazy(function () {

                return 3;
            });
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.addOwnElements.constants.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.constants.Parent';
            this.constant.c = 5;
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
        var ns = window.tests.class.preprocessors.addOwnElements.constants;

        //Base
        strictEqual(ns.Base.descriptor.constant.at('a'), 1);

        //Parent
        strictEqual(ns.Parent.descriptor.constant.at('a'), 2);
        strictEqual(ns.Parent.descriptor.constant.at('b'), 3);

        //Child
        strictEqual(ns.Child.descriptor.constant.at('a'), 2);
        strictEqual(ns.Child.descriptor.constant.at('b'), 3);
        strictEqual(ns.Child.descriptor.constant.at('c'), 5);
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
        me.BaseName = 'tests.class.preprocessors.addOwnElements.staticProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class(function () {
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
        me.ParentName = 'tests.class.preprocessors.addOwnElements.staticProperties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.staticProperties.Base';
            this.static.property.a = {
                get: me.parentAGet
            };
            this.static.property.b = xs.lazy(function () {
                return {
                    set: me.parentBSet
                };
            });
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.addOwnElements.staticProperties.Child';

        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.staticProperties.Parent';
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
        var me = this;

        var ns = window.tests.class.preprocessors.addOwnElements.staticProperties;

        //init properties (will be referred to descriptor.static.property)
        var properties;

        //check static properties definition
        //Base
        properties = ns.Base.descriptor.static.property;
        //a
        strictEqual(properties.at('a').get, me.baseAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);

        //Parent
        properties = ns.Parent.descriptor.static.property;
        //a
        strictEqual(properties.at('a').get, me.parentAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);

        //Child
        properties = ns.Child.descriptor.static.property;
        //a
        strictEqual(properties.at('a').value, 2);
        strictEqual(properties.at('a').writable, true);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);
        //c
        strictEqual(properties.at('c').get, me.childCGet);
        strictEqual(properties.at('c').set, me.childCSet);
        strictEqual(properties.at('c').configurable, false);
        strictEqual(properties.at('c').enumerable, true);

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
        me.BaseName = 'tests.class.preprocessors.addOwnElements.staticMethods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
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
        me.ParentName = 'tests.class.preprocessors.addOwnElements.staticMethods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.staticMethods.Base';
            this.static.method.a = me.parentA;
            this.static.method.b = xs.lazy(function () {
                return me.parentB;
            });
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.addOwnElements.staticMethods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.staticMethods.Parent';
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
        var me = this;

        var ns = window.tests.class.preprocessors.addOwnElements.staticMethods;

        //init methods (will be referred to descriptor.static.method)
        var methods;

        //check static methods definition
        //Base
        methods = ns.Base.descriptor.static.method;
        //a
        strictEqual(methods.at('a').value, me.baseA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.static.method;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);

        //Child
        methods = ns.Child.descriptor.static.method;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);
        //c
        strictEqual(methods.at('c').value, me.childC);
        strictEqual(methods.at('c').writable, false);
        strictEqual(methods.at('c').configurable, false);
        strictEqual(methods.at('c').enumerable, true);

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
        me.BaseName = 'tests.class.preprocessors.addOwnElements.properties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class(function () {
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
        me.ParentName = 'tests.class.preprocessors.addOwnElements.properties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.properties.Base';
            this.property.a = {
                get: me.parentAGet
            };
            this.property.b = xs.lazy(function () {
                return {
                    set: me.parentBSet
                };
            });
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.addOwnElements.properties.Child';


        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.properties.Parent';
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
        var me = this;

        var ns = window.tests.class.preprocessors.addOwnElements.properties;

        //init properties (will be referred to descriptor.static.property)
        var properties;

        //check properties definition
        //Base
        properties = ns.Base.descriptor.property;
        //a
        strictEqual(properties.at('a').get, me.baseAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);

        //Parent
        properties = ns.Parent.descriptor.property;
        //a
        strictEqual(properties.at('a').get, me.parentAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);

        //Child
        properties = ns.Child.descriptor.property;
        //a
        strictEqual(properties.at('a').value, 2);
        strictEqual(properties.at('a').writable, true);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);
        //c
        strictEqual(properties.at('c').get, me.childCGet);
        strictEqual(properties.at('c').set, me.childCSet);
        strictEqual(properties.at('c').configurable, false);
        strictEqual(properties.at('c').enumerable, true);

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
        me.BaseName = 'tests.class.preprocessors.addOwnElements.methods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
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
        me.ParentName = 'tests.class.preprocessors.addOwnElements.methods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.methods.Base';
            this.method.a = me.parentA;
            this.method.b = xs.lazy(function () {
                return me.parentB;
            });
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.addOwnElements.methods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.addOwnElements.methods.Parent';
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
        var me = this;

        var ns = window.tests.class.preprocessors.addOwnElements.methods;

        //init methods (will be referred to descriptor.method)
        var methods;

        //check methods definition
        //Base
        methods = ns.Base.descriptor.method;
        //a
        strictEqual(methods.at('a').value, me.baseA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.method;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);

        //Child
        methods = ns.Child.descriptor.method;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);
        //c
        strictEqual(methods.at('c').value, me.childC);
        strictEqual(methods.at('c').writable, false);
        strictEqual(methods.at('c').configurable, false);
        strictEqual(methods.at('c').enumerable, true);

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