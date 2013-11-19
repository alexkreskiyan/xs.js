function create(suffix) {
    xs.createClass('a' + suffix)
        .constructor(function (x) {
            this.x = x;
        }, [0])
        .protectedMethod('print', function (text) {
            console.log('print:', text, this);
        })
        .protectedMethod('empty', function (text) {
            return;
        })
        .publicMethod('achieve', function (text) {
            return this.alpha;
        })
        .privateProperty('alpha', {
            get: function () {
                return this.__get('alpha');
            },
            set: function (value) {
                this.__set('alpha', value);
            }
        }, 0);
    xs.createClass('b' + suffix)
        .constructor(function (x, y) {
            this.parent().constructor.call(this, x);
            this.y = y;
        }, [0, 0])
        .protectedMethod('print', function (text) {
            this.parent().print.call(this, text);
        })
        .protectedProperty('zz', {
            get: function () {
                return this.__get('zz') - 1;
            },
            set: function (value) {
                this.__set('zz', value + 2);
            }
        }, 0);
    xs.createClass('c' + suffix)
        .constructor(function (x, y, z) {
            this.parent().constructor.call(this, x, y);
            this.z = z;
        }, [0, 0, 0])
        .publicMethod('print', function (text) {
            this.parent().print.call(this, text);
        })
        .publicMethod('achieve', function (text) {
            this.parent().achieve.call(this, text);
        })
        .publicProperty('cc', {
            get: function () {
                return this.__get('cc') + 1;
            },
            set: function (value) {
                this.__set('cc', value * 2);
            }
        }, 0)
        .protectedProperty('zz', {
            get: function () {
                return this.__get('zz') - 1;
            },
            set: function (value) {
                this.__set('zz', value + 2);
            }
        }, 0);
    xs['b' + suffix].extend(xs['a' + suffix]);
    xs['c' + suffix].extend(xs['b' + suffix]);
    a1 = new xs['a' + suffix]();
    c1 = new xs['c' + suffix](1, 2);
    c2 = new xs['c' + suffix](5, 1, -7);
}

create('');

function test(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}