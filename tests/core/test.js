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
function speedAsync(fn, n, duration) {
    var start = Date.now();
    duration || (duration = 0);
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
//'use strict';
module('xs.Base');
var after = function (Class) {
    console.log('Class ', Class.label, 'ready!');
};
xs.define('gcapi.Map', {
    extend: 'xs.Base',
    const: {
        VERSION: '1.0'
    },
    static: {
        properties: {
            a: 1
        },
        methods: {
            b: function () {
                return this.a;
            }
        }
    },
    properties: {
        c: 1
    },
    methods: {
        d: function () {
            return this.c;
        }
    }
}, function () {
    xs.define('gcapi.BaseMap', {
        extend: 'xs.Base',
        mixins: 'gcapi.Map'
    }, after);
});