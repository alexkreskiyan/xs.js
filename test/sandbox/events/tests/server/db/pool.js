'use strict';

var database = require('./db');
var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();

var pool;

var run = function (dbName, method, sql, data) {
    return new Promise(function (resolve, reject) {
        pool.run(dbName, method, sql, data, resolve, reject);
    });
};
module.exports = {
    run: run
};

pool = (function (database) {
    var me = {};
    var db;
    var isProcessing = false;
    var stack = [];

    me.run = function (dbName, method, sql, data, resolve, reject) {
        if (database.names.indexOf(dbName) < 0) {
            return reject('unknown database');
        }

        //push task to stack
        stack.push({
            method: method,
            sql: sql,
            data: data,
            resolve: resolve,
            reject: reject
        });

        if (!isProcessing) {
            isProcessing = true;
            db = new sqlite3.Database(database.getDbPath(dbName));
            db.serialize(function () {
                process();
            });
        }
    };

    var process = function () {
        if (stack.length) {
            execute(stack.shift(), process);
        } else {
            isProcessing = false;
            db.close();
        }
    };

    var execute = function (task, callback) {
        db[ task.method ](task.sql, task.data, function (error, data) {

            if (error) {
                task.reject(error);
            } else {
                task.resolve(data);
            }

            //go to next task
            callback();
        });
    };

    return me;
})(database);