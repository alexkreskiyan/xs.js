xs.createClass('a')
    .constructor(function (x) {
        this.x = x;
    })
    .options([0])
    .protectedMethod('print', function (text) {
        console.log('print:', text, this);
    });
xs.createClass('b')
    .constructor(function (x, y) {
        this.parent().constructor.call(this, x);
        this.y = y;
    })
    .options([0, 0])
    .publicMethod('print', function (text) {
        this.parent().print.call(this, text);
    });
xs.createClass('c')
    .constructor(function (x, y, z) {
        this.parent().constructor.call(this, x, y);
        this.z = z;
    })
    .options([0, 0, 0])
    .publicMethod('print', function (text) {
        this.parent().print.call(this, text);
    });
xs.b.extend(xs.a);
xs.c.extend(xs.b);
demo = new xs.c(1, 2);

start = Date.now();
for (var i = 0, n = 100000; i < n; i++) {
    new xs.c(1, 2)
}
duration = Date.now() - start;
console.log('duration: ', duration, 'ms for ', n, 'operations');
console.log('median: ', duration / n, 'ms per operation');
console.log('mark: about', n / duration, 'operation per ms');