'use strict';

var database = require('./db');
var Promise = require('promise');
var pool = require('./pool');

var create = function (data) {
    return new Promise(function (resolve, reject) {
        //verify, that test does not exist yet
        pool.run(data.dbName, 'get', 'SELECT COUNT(*) AS count FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }).then(function (row) {
            if (row.count) {
                return reject('test already exists');
            }

            var sql = 'INSERT INTO tests VALUES (' + Object.keys(database.tests.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            pool.run(data.dbName, 'run', sql, {
                $user: data.user,
                $device: data.device,
                $name: data.name,
                $stages: JSON.stringify(data.stages)
            }).then(resolve, reject);
        }, reject);
    });
};

var read = function (data) {
    return new Promise(function (resolve, reject) {
        //verify, that test exists
        pool.run(data.dbName, 'get', 'SELECT * FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }).then(function (row) {
            if (row) {
                row.stages = JSON.parse(row.stages);
                resolve(row);
            } else {
                reject('not found');
            }
        }, reject);
    });
};

var readAll = function (data) {
    return new Promise(function (resolve, reject) {
        //verify, that test exists
        pool.run(data.dbName, 'all', 'SELECT * FROM tests WHERE user=$user AND device=$device', {
            $user: data.user,
            $device: data.device
        }).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                data[ i ].stages = JSON.parse(data[ i ].stages);
            }

            resolve(data);
        }, reject);
    });
};

var update = function (data) {
    return new Promise(function (resolve, reject) {
        //verify, that test does not exist yet
        pool.run(data.dbName, 'get', 'SELECT COUNT(*) AS count FROM tests WHERE user=$user AND device=$device AND name=$name', {
            $user: data.user,
            $device: data.device,
            $name: data.name
        }).then(function (row) {
            if (!row.count) {
                return reject('test missing');
            }

            var sql = 'UPDATE tests SET stages=$stages WHERE user=$user AND device=$device AND name=$name';
            pool.run(data.dbName, 'run', sql, {
                $user: data.user,
                $device: data.device,
                $name: data.name,
                $stages: JSON.stringify(data.stages)
            }).then(resolve, reject);
        }, reject);
    });

};

module.exports = {
    create: create,
    read: read,
    readAll: readAll,
    update: update
};