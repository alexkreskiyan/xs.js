'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

const tasksDir = path.resolve(__dirname, 'tasks');
fs.readdirSync(tasksDir)
    .forEach(name => require(path.resolve(tasksDir, name)));

gulp.task('default', ['all']);