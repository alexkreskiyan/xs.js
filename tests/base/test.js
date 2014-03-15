function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
function xsStart(suffix) {
    xs.define('demo.Base' + suffix, {
        constructor: function (a, b) {
            this.propA = a;
            this.propB = b;
        },
        defaults: [1, 3],
        const: {
            a: function () {
                return 'aa!!';
            }
        },
        static: {
            properties: {
                propA: {
                    get: function () {
                        return this.__get('propA') + '!';
                    },
                    set: function (value) {
                        return this.__set('propA', '?' + value);
                    }
                },
                propB: 15
            },
            methods: {
                metA: function (a, b) {
                    return a + b;
                },
                metB: {
                    fn: function (a, b) {
                    },
                    defaults: [1, 2]
                }
            }
        },
        properties: {
            propA: {
                get: function () {
                    return this.__get('b') + '!';
                },
                set: function (value) {
                    return this.__set('b', '?' + value);
                }
            },
            propB: 15

        },
        methods: {
            metA: function (a, b) {
                return a + b;
            },
            metB: {
                fn: function (a, b) {
                },
                defaults: [1, 2]
            }
        }
    });
    xs.define('demo.Parent' + suffix, {
        constructor: function (a, b, c) {
            this.propA = a;
            this.propB = b;
            this.propC = c;
        },
        defaults: [1, 3],
        const: {
            a: function () {
                return 'aa!!';
            },
            b: function () {
                return 'bb!!';
            }
        },
        static: {
            properties: {
                propA: {
                    get: function () {
                        return this.__get('b') + '!';
                    },
                    set: function (value) {
                        return this.__set('b', '?' + value);
                    }
                },
                propB: 15,
                propB: {
                    set: function (value) {
                        return this.__set('b', '?' + value);
                    }
                }
            },
            methods: {
                metA: function (a, b) {
                    return a + b;
                },
                metB: {
                    fn: function (a, b) {
                    },
                    defaults: [1, 2]
                }
            }
        },
        properties: {
            propA: {
                get: function () {
                    return this.__get('b') + '!';
                },
                set: function (value) {
                    return this.__set('b', '?' + value);
                }
            },
            propB: 15

        },
        methods: {
            metA: function (a, b) {
                return a + b;
            },
            metB: {
                fn: function (a, b) {
                },
                defaults: [1, 2]
            }
        }
    });
    xs.define('demo.Child' + suffix, {
        constructor: function (a, b) {
            this.propA = a;
            this.propB = b;
        },
        defaults: [1, 3],
        const: {
            a: function () {
                return 'aa!!';
            }
        },
        static: {
            properties: {
                propA: {
                    get: function () {
                        return this.__get('b') + '!';
                    },
                    set: function (value) {
                        return this.__set('b', '?' + value);
                    }
                },
                propB: 15
            },
            methods: {
                metA: function (a, b) {
                    return a + b;
                },
                metB: {
                    fn: function (a, b) {
                    },
                    defaults: [1, 2]
                }
            }
        },
        properties: {
            propA: {
                get: function () {
                    return this.__get('b') + '!';
                },
                set: function (value) {
                    return this.__set('b', '?' + value);
                }
            },
            propB: 15

        },
        methods: {
            metA: function (a, b) {
                return a + b;
            },
            metB: {
                fn: function (a, b) {
                },
                defaults: [1, 2]
            }
        }
    });
}

speed(function () {
    xsStart('');
}, 1);
/**
 * Tests:
 * 1. Define basics
 *  - define completes
 *  - createdFn called
 * 2. Define in namespace
 *  - define completes
 * 3. Define tree
 *  - define inherited tree
 *  - check parental/child linkage
 * 4. Creation simple
 *  - Object is instance
 * 5. Creation with attributes
 * 6. Constants
 *  - sample
 *  - inheritance
 * 7. Static properties
 *  - sample
 *  - inheritance
 * 8. Static methods
 *  - sample
 *  - inheritance
 * 9. Properties
 *  - sample
 *  - inheritance
 * 10.Methods
 *  - sample
 *  - inheritance
 * 11.Requires
 * 12.Mixins
 * 13.Singleton
 *  -
 */
module('1. Define basics');
test('sample', function () {
    //check create, references and recreation prevention
    var cls = xs.define('demo.Basic');
    console.log(cls);
    equal(cls, demo.Basic, 'check that class was created');
    equal(xs.define('demo.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    equal(demo.Basic.$name, 'demo.Basic', 'check class name');
    equal(demo.Basic.$namespace, null, 'check class namespace');
});
module('2. Define in namespace');
test('sample', function () {
    //check create, references and recreation prevention
    var cls = xs.define('ns.Basic', {namespace: 'demo.module'});
    equal(cls, demo.module.Basic, 'check that class was created in specified namespace');
    equal(xs.define('demo.module.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    equal(demo.module.Basic.$name, 'demo.module.Basic', 'check class name');
    equal(demo.module.Basic.$namespace, 'demo.module', 'check class namespace');
});

































