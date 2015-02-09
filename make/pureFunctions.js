module.exports = {
    log: {
        internal: [
            'log.trace',
            'log.profile'
        ],
        contract: [
            'self.log.trace',
            'self.log.profile'
        ]
    },
    assert: {
        internal: [
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
            'assert.Class',
            'assert.Interface',
            'assert.instance',
            'assert.implements'
        ],
        contract: [
            'self.assert.equal',
            'self.assert.ok',
            'self.assert.not',
            'self.assert.object',
            'self.assert.array',
            'self.assert.fn',
            'self.assert.string',
            'self.assert.number',
            'self.assert.boolean',
            'self.assert.regExp',
            'self.assert.error',
            'self.assert.null',
            'self.assert.iterable',
            'self.assert.primitive',
            'self.assert.numeric',
            'self.assert.defined',
            'self.assert.empty',
            'self.assert.Class',
            'self.assert.Interface',
            'self.assert.instance',
            'self.assert.implements'
        ]
    }
};