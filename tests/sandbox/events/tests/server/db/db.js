'use strict';

var sqlite3 = require('sqlite3').verbose();

var dbName = 'tmp/tests.db';
var db = new sqlite3.Database(dbName);

module.exports = {
    name: dbName
};

//create tests table in db
(function (db, exports) {
    var fields = {
        user: 'TEXT',
        device: 'TEXT',
        name: 'TEXT',
        stages: 'TEXT'
    };
    exports.tests = {
        fields: fields
    };
    db.run('CREATE TABLE if not exists tests (' + Object.keys(fields).map(function (name) {
            return name + ' ' + fields[ name ];
        }) + ')');
})(db, module.exports);

//create log table in db
(function (db, exports) {
    var fields = {
        user: 'TEXT',
        device: 'TEXT',
        time: 'TEXT',
        category: 'TEXT',
        name: 'TEXT',
        userAgent: 'TEXT',
        browserName: 'TEXT',
        browserVersion: 'TEXT',
        browserMajor: 'INTEGER',
        browserMinor: 'INTEGER',
        cpu: 'INTEGER',
        engineName: 'TEXT',
        engineVersion: 'TEXT',
        engineMajor: 'INTEGER',
        engineMinor: 'INTEGER',
        osName: 'TEXT',
        osVersion: 'INTEGER',
        event: 'TEXT'
    };
    exports.log = {
        fields: fields
    };
    db.run('CREATE TABLE if not exists log (' + Object.keys(fields).map(function (name) {
            return name + ' ' + fields[ name ];
        }) + ')');
})(db, module.exports);

db.close();