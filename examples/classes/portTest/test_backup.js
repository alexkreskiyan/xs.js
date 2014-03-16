function create(suffix) {
    xs.createClass('a' + suffix)
        .constructor(function (x) {
            this.x = x;
        }, [0])
        .protectedMethod('print', function (text) {
            console.log('print:', text, this);
        })
        .protectedMethod('empty', function () {
            return;
        })
        .privateMethod('denied', function (ext) {
            return;
        })
        .protectedMethod('getAlpha', function () {
            return this.alpha;
        })
        .protectedMethod('setAlpha', function (alpha) {
            return this.alpha = alpha;
        })
        .publicMethod('getPriv', function () {
            return this.self().priv;
        })
        .publicMethod('setPriv', function (value) {
            return this.self().priv = value;
        })
        .privateProperty('alpha', {
            get: function () {
                return this.__get('alpha');
            },
            set: function (value) {
                this.__set('alpha', value);
            }
        }, 0)
        .privateStaticProperty('priv', {
            get: function () {
                return this.__get('priv') + '$';
            },
            set: function (value) {
                this.__set('priv', '$' + value);
            }
        }, 0)
        .publicStaticProperty('apub', {
            get: function () {
                return '<=' + this.__get('apub') + '=>';
            },
            set: function (value) {
                this.__set('apub', value);
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
        }, 0)
        .publicStaticMethod('getProt', function () {
            return this.self().prot;
        })
        .publicStaticMethod('setProt', function (value) {
            return this.self().prot = value;
        })
        .protectedStaticProperty('prot', {
            get: function () {
                return this.__get('prot') + '?';
            },
            set: function (value) {
                this.__set('prot', '?' + value);
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
        .publicMethod('getAlpha', function () {
            return this.parent().getAlpha.call(this);
        })
        .publicMethod('setAlpha', function (alpha) {
            return this.parent().setAlpha.call(this, alpha);
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
        }, 0)
        .protectedProperty('abc', {
            get: function () {
                return this.__get('abc') - 1;
            },
            set: function (value) {
                this.__set('abc', value + 2);
            }
        }, 0)
        .protectedProperty('anture', {
            get: function () {
                return this.__get('anture') - 1;
            },
            set: function (value) {
                this.__set('anture', value + 2);
            }
        }, 0)
        .protectedProperty('blabla', {
            get: function () {
                return this.__get('blabla') - 1;
            },
            set: function (value) {
                this.__set('blabla', value + 2);
            }
        }, 0)
        .protectedProperty('gammga', {
            get: function () {
                return this.__get('gammga') - 1;
            },
            set: function (value) {
                this.__set('gammga', value + 2);
            }
        }, 0)
        .publicStaticMethod('getParentProt', function () {
            return this.parent().getProt.call(this);
        })
        .publicStaticMethod('setParentProt', function (value) {
            return this.parent().setProt.call(this, value);
        })
        .publicStaticMethod('getProt', function () {
            return this.self().prot;
        })
        .publicStaticMethod('setProt', function (value) {
            return this.self().prot = value;
        })
        .publicStaticProperty('pub', {
            get: function () {
                return this.__get('pub') + '!';
            },
            set: function (value) {
                this.__set('pub', '!' + value);
            }
        }, 0);
    xs['b' + suffix].extend(xs['a' + suffix]);
    xs['c' + suffix].extend(xs['b' + suffix]);
    a1 = new xs['a' + suffix]();
    a2 = new xs['a' + suffix](4);
    b1 = new xs['b' + suffix](3);
    b2 = new xs['b' + suffix](6, 9);
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