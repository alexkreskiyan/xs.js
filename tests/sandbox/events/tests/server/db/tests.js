'use strict';

var database = require('./db');
var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();

var create = function (data) {
    return new Promise(function (resolve, reject) {
        if (database.names.indexOf(data.dbName) < 0) {
            throw new Error('unknown database');
        }

        var db = new sqlite3.Database(database.getDbPath(data.dbName));

        //verify, that test does not exist yet
        db.get('SELECT COUNT(*) AS count FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }, function (err, row) {

            //reject if error or item exists
            if (err || row.count) {
                db.close();

                return reject('test already exists');
            }

            //insert
            var sql = 'INSERT INTO tests VALUES (' + Object.keys(database.tests.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            db.run(sql, {
                $user: data.user,
                $device: data.device,
                $name: data.name,
                $stages: JSON.stringify(data.stages)
            }, function () {
                db.close();
                resolve();
            });
        });
    });
};

var read = function (data) {
    return new Promise(function (resolve, reject) {
        if (database.names.indexOf(data.dbName) < 0) {
            throw new Error('unknown database');
        }

        var db = new sqlite3.Database(database.getDbPath(data.dbName));

        //verify, that test does not exist yet
        db.get('SELECT * FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }, function (err, row) {
            db.close();

            if (row) {
                row.stages = JSON.parse(row.stages);
                resolve(row);
            } else {
                reject('not found');
            }
        });
    });
};

var readAll = function (data) {
    return new Promise(function (resolve, reject) {
        if (database.names.indexOf(data.dbName) < 0) {
            throw new Error('unknown database');
        }

        var db = new sqlite3.Database(database.getDbPath(data.dbName));

        db.all('SELECT * FROM tests WHERE user=$user AND device=$device', {
            $user: data.user,
            $device: data.device
        }, function (err, data) {
            db.close();

            if (err) {

                return reject('fail');
            }

            for (var i = 0; i < data.length; i++) {
                data[ i ].stages = JSON.parse(data[ i ].stages);
            }

            resolve(data);
        });
    });
};

var update = function (data) {
    return new Promise(function (resolve, reject) {
        if (database.names.indexOf(data.dbName) < 0) {
            throw new Error('unknown database');
        }

        var db = new sqlite3.Database(database.getDbPath(data.dbName));

        //verify, that test exists
        db.get('SELECT COUNT(*) AS count FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }, function (err, row) {

            //reject if error or item exists
            if (err || !row.count) {
                db.close();

                return reject('test missing');
            }

            //update
            var sql = 'UPDATE tests SET stages=$stages WHERE user=$user AND device=$device AND name=$name';
            db.run(sql, {
                $user: data.user,
                $device: data.device,
                $name: data.name,
                $stages: JSON.stringify(data.stages)
            }, function () {
                db.close();
                resolve();
            });
        });
    });

};

module.exports = {
    create: create,
    read: read,
    readAll: readAll,
    update: update
};