'use strict';

var loggers = [
    'log.trace',
    'log.profile'
];
var asserters = [
    'assert.equal',
    'assert.ok',
    'assert.not',
    'assert.object',
    'assert.array',
    'assert.fn',
    'assert.string',
    'assert.number',
    'assert.boolean',
    'assert.regExp',
    'assert.error',
    'assert.null',
    'assert.iterable',
    'assert.primitive',
    'assert.numeric',
    'assert.defined',
    'assert.empty',
    'assert.shortName',
    'assert.fullName',
    'assert.contract',
    'assert.processed',
    'assert.class',
    'assert.interface',
    'assert.instance',
    'assert.implements'
];
module.exports = {
    log: {
        internal: loggers,
        contract: loggers.map(function (logger) {

            return 'self.' + logger;
        })
    },
    assert: {
        internal: asserters,
        contract: asserters.map(function (asserter) {

            return 'self.' + asserter;
        }).concat(asserters.map(function (asserter) {

            return 'me.' + asserter;
        }))
    }
};