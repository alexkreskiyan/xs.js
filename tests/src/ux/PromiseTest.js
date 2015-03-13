/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ux.Promise', function () {

    'use strict';

    test('resolve basic', function () {
        //init test variables
        var promise;
        //resolve destroyed throws
        promise = new xs.ux.Promise();
        promise.destroy();
        throws(function () {
            promise.resolve();
        });

        //resolve not pending throws
        promise = new xs.ux.Promise();
        promise.resolve();
        throws(function () {
            promise.resolve();
        });
    });

    test('resolve simple plain case normal', function () {
        //simple case - three L1 handlers. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        me.source = 5;
        me.promise.then(function (data) {
            me.source *= data;
        });
        me.promise.then(function (data) {
            me.source -= data;
        });
        me.promise.then(function (data) {
            me.source /= data;
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        me.promise.then(function () {
            strictEqual(me.source, 4);
            me.done();
        });
        return false;
    });

    test('resolve simple plain case exception', function () {
        //simple case - three L1 handlers. Second L1 handler throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        me.source = 5;
        me.promise.then(function (data) {
            me.source *= data;
        });
        me.promise.then(function () {
            throw new Error('error');
        });
        me.promise.then(function (reason) {
            me.source += reason;
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        me.promise.then(function () {
            strictEqual(me.source, 30);
            me.done();
        });
        return false;
    });

    test('resolve simple chain case normal', function () {
        //simple case - promises chain with three steps. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        var value = 5;
        me.chain = me.promise.then(function (data) {
            return data * value;
        }).then(function (data) {
            return data - value;
        }).then(function (data) {
            return data / value;
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        me.chain.then(function (data) {
            strictEqual(data, 4);
            me.done();
        });
        return false;
    });

    test('resolve simple chain case exception', function () {
        //simple case - promises chain with three steps. Step two throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        var value = 5;
        me.chain = me.promise.then(function (data) {
            return data * value;
        }).then(function () {
            throw new Error('error');
        }).then(function (data) {
            return data / value;
        }, function (e) {
            return value + e.message;
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        me.chain.then(function () {
            throw new Error('failed');
        }, function (reason) {
            strictEqual(reason, '5error');
            me.done();
        });
        return false;
    });

    test('resolve complex case normal', function () {
        //complex case - promises tree 2 levels with 3 handlers each - 12 total. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        me.total = 0;
        me.promise.then(function (data) {
            return data + 2; //7
        }).then(function (data) {
            return data * 2; //14
        }).then(function (data) {
            me.total += data; //0 + 14 = 14
        });
        me.promise.then(function (data) {
            return data + 3; //8
        }).then(function (data) {
            return data / 4; //2
        }).then(function (data) {
            me.total *= data; //14 * 2 = 28
        });
        me.last = me.promise.then(function (data) {
            return data - 1; //4
        }).then(function (data) {
            return data * 4; //16
        }).then(function (data) {
            me.total -= data; //28 - 16 = 12
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        //handle last chain
        me.last.then(function () {
            strictEqual(me.total, 12);
            me.done();
        });

        return false;
    });

    test('resolve complex case exception', function () {
        //complex case - promises tree 2 levels with 3 handlers each - 12 total. Second L1 handler throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        me.total = 0;
        me.promise.then(function (data) {
            return data + 2; //7
        }).then(function (data) {
            return data * 2; //14
        }).then(function (data) {
            me.total += data; //0 + 14 = 14
        });
        me.promise.then(function () {
            throw new Error('reason');
        }).then(function (data) {
            return data / 4; //not going come here
        }, function (e) {
            return e.message;
        }).then(function (data) {
            me.total *= data; //not going to come here
        }, function (reason) {
            me.total += reason; //14 + reason = 14reason
        });
        me.last = me.promise.then(function (data) {
            return data - 1; //4
        }).then(function (data) {
            return data * 4; //16
        }).then(function (data) {
            me.total += data; //14reason + 16 = 14reason16
        });
    }, function () {
        var me = this;
        me.promise.resolve(5);
        //handle last chain
        me.last.then(function () {
            strictEqual(me.total, '14reason16');
            me.done();
        });

        return false;
    });

    test('reject basic', function () {
        //init test variables
        var promise;
        //reject destroyed throws
        promise = new xs.ux.Promise();
        promise.destroy();
        throws(function () {
            promise.reject();
        });

        //resolve not pending throws
        promise = new xs.ux.Promise();
        promise.reject();
        throws(function () {
            promise.reject();
        });
    });

    test('reject simple plain case normal', function () {
        //simple case - three L1 handlers. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        me.source = 5;
        me.promise.otherwise(function (data) {
            me.source *= data;
        });
        me.promise.otherwise(function (data) {
            me.source -= data;
        });
        me.promise.otherwise(function (data) {
            me.source /= data;
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        me.promise.otherwise(function () {
            strictEqual(me.source, 4);
            me.done();
        });
        return false;
    });

    test('reject simple plain case exception', function () {
        //simple case - three L1 handlers. Second L1 handler throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        me.source = 5;
        me.promise.otherwise(function (data) {
            me.source *= data;
        });
        me.promise.otherwise(function () {
            throw new Error('error');
        });
        me.promise.otherwise(function (reason) {
            me.source += reason;
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        me.promise.otherwise(function () {
            strictEqual(me.source, 30);
            me.done();
        });
        return false;
    });

    test('reject simple chain case normal', function () {
        //simple case - promises chain with three steps. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        var value = 5;
        me.chain = me.promise.otherwise(function (data) {
            return data * value;
        }).otherwise(function (data) {
            return data - value;
        }).otherwise(function (data) {
            return data / value;
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        me.chain.otherwise(function (data) {
            strictEqual(data, 4);
            me.done();
        });
        return false;
    });

    test('reject simple chain case exception', function () {
        //simple case - promises chain with three steps. Step two throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        var value = 5;
        me.chain = me.promise.otherwise(function (data) {
            return data * value;
        }).otherwise(function () {
            throw new Error('error');
        }).then(function (data) {
            return data / value;
        }, function (e) {
            return value + e.message;
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        me.chain.then(function () {
            throw new Error('failed');
        }, function (reason) {
            strictEqual(reason, '5error');
            me.done();
        });
        return false;
    });

    test('reject complex case normal', function () {
        //complex case - promises tree 2 levels with 3 handlers each - 12 total. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        me.total = 0;
        me.promise.otherwise(function (data) {
            return data + 2; //7
        }).otherwise(function (data) {
            return data * 2; //14
        }).otherwise(function (data) {
            me.total += data; //0 + 14 = 14
        });
        me.promise.otherwise(function (data) {
            return data + 3; //8
        }).otherwise(function (data) {
            return data / 4; //2
        }).otherwise(function (data) {
            me.total *= data; //14 * 2 = 28
        });
        me.last = me.promise.otherwise(function (data) {
            return data - 1; //4
        }).otherwise(function (data) {
            return data * 4; //16
        }).otherwise(function (data) {
            me.total -= data; //28 - 16 = 12
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        //handle last chain
        me.last.otherwise(function () {
            strictEqual(me.total, 12);
            me.done();
        });

        return false;
    });

    test('reject complex case exception', function () {
        //complex case - promises tree 2 levels with 3 handlers each - 12 total. Second L1 handler throws exception
        var me = this;
        me.promise = new xs.ux.Promise;
        me.total = 0;
        me.promise.otherwise(function (data) {
            return data + 2; //7
        }).otherwise(function (data) {
            return data * 2; //14
        }).otherwise(function (data) {
            me.total += data; //0 + 14 = 14
        });
        me.promise.otherwise(function () {
            throw new Error('reason');
        }).then(function (data) {
            return data / 4; //not going come here
        }, function (e) {
            return e.message;
        }).then(function (data) {
            me.total *= data; //not going to come here
        }, function (reason) {
            me.total += reason; //14 + reason = 14reason
        });
        me.last = me.promise.otherwise(function (data) {
            return data - 1; //4
        }).otherwise(function (data) {
            return data * 4; //16
        }).otherwise(function (data) {
            me.total += data; //14reason + 16 = 14reason16
        });
    }, function () {
        var me = this;
        me.promise.reject(5);
        //handle last chain
        me.last.otherwise(function () {
            strictEqual(me.total, '14reason16');
            me.done();
        });

        return false;
    });

    test('progress complex case', function () {
        //complex case - promises tree 2 levels with 3 handlers each - 12 total. All resolved
        var me = this;
        me.promise = new xs.ux.Promise;
        me.total = 0;
        me.promise.progress(function (data) {
            return data + 2; //4; 3
        }).progress(function (data) {
            return data * 2; //8; 6
        }).progress(function (data) {
            me.total += data; //0 + 8 = 8; -2 + 6 = 4
        });
        me.promise.progress(function (data) {
            return data + 3; //5; 4
        }).progress(function (data) {
            return data / 4; //1.25; 1
        }).progress(function (data) {
            me.total *= data; //8 * 1.25 = 10; 4 * 1 = 4
        });
        me.last = me.promise.then(xs.noop, undefined, function (data) {
            return data + 1; //3; 2
        }).then(xs.noop, undefined, function (data) {
            return data * 4; //12; 8
        }).then(xs.noop, undefined, function (data) {
            me.total -= data; //10 - 12 = -2; 4 - 8 = -4
        });
    }, function () {
        var me = this;
        var count = 2;
        var interval = setInterval(function () {
            if (count === 0) {
                clearInterval(interval);
                me.promise.resolve('n');

                return;
            }

            me.promise.update(count--);
        }, 10);
        //handle last chain
        me.last.then(function () {
            strictEqual(me.total, -4);
            me.done();
        });

        return false;
    });

    test('immediate', function () {
        var me = this;
        var promise = new xs.ux.Promise();
        promise.resolve(5);
        //handlers run immediately if promise is already done
        setTimeout(function () {
            promise.then(function (data) {
                strictEqual(data, 5);
                return data * 2;
            }).then(function (data) {
                strictEqual(data, 10);

                me.done();
            });
        }, 10);

        return false;
    });

    test('some', function () {
        var me = this;

        //promises should be non-array
        throws(function () {
            xs.ux.Promise.some({});
        });
        throws(function () {
            xs.ux.Promise.some([]);
        });

        //count should be either omitted or be number
        throws(function () {
            xs.ux.Promise.some([xs.ux.Promise.factory()], null);
        });

        //count should be in bounds: 0 < count <= promises.length
        throws(function () {
            xs.ux.Promise.some([xs.ux.Promise.factory()], 2);
        });


        //if enough promises resolve - aggregate is resolved
        var p1 = new xs.ux.Promise();
        var p2 = new xs.ux.Promise();
        var p3 = new xs.ux.Promise();
        var totalResolved = 0;
        setTimeout(function () {
            totalResolved += 1;
            p1.resolve();
        }, 0);
        setTimeout(function () {
            totalResolved *= 2;
            p2.resolve();
        }, 0);
        setTimeout(function () {
            totalResolved -= 5;
            p3.resolve();
        }, 10000);

        xs.ux.Promise.some([
            p1,
            p2,
            p3
        ], 2).then(function () {
            //only 2 first promises
            strictEqual(totalResolved, 2);
            totalResolved = 0;
        });

        //if any promise is rejected - aggregate is rejected
        var p4 = new xs.ux.Promise();
        var p5 = new xs.ux.Promise();
        var p6 = new xs.ux.Promise();
        var totalRejected = 0;
        setTimeout(function () {
            totalRejected += 1;
            p4.resolve();
        }, 110);
        setTimeout(function () {
            totalRejected *= 2;
            p5.reject('error');
        }, 110);
        setTimeout(function () {
            totalRejected -= 5;
            p6.resolve();
        }, 110);

        xs.ux.Promise.some([
            p4,
            p5,
            p6
        ], 2).then(function () {
            //promise will not reject
            throw new Error('this promise must not be resolved');
        }, function (reason) {
            strictEqual(reason, 'error');
            me.done();
        });

        return false;
    });

});