xs.createClass('a')
    .constructor(function (x) {
        this.x = x;
    }, [0])
    .protectedMethod('print', function (text) {
        console.log('print:', text, this);
    })
    .protectedMethod('empty', function (text) {
        return;
    });
xs.createClass('b')
    .constructor(function (x, y) {
        this.parent().constructor.call(this, x);
        this.y = y;
    }, [0, 0])
    .protectedMethod('print', function (text) {
        this.parent().print.call(this, text);
    });
xs.createClass('c')
    .constructor(function (x, y, z) {
        this.parent().constructor.call(this, x, y);
        this.z = z;
    }, [0, 0, 0])
    .publicMethod('print', function (text) {
        this.parent().print.call(this, text);
    })
    .publicProperty('cc', {
        get: function () {
            return cc + 1;
        },
        set: function (value) {
            cc = value * 2;
        }
    }, 0);
xs.b.extend(xs.a);
xs.c.extend(xs.b);
d1 = new xs.c(1, 2);
d2 = new xs.c(5, 1, -7);

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