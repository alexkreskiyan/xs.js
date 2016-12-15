'use strict';

module.exports = options => [
    ['clean', 'debug'],
    () => { options.gulp.watch('src/**/*', ['clean', 'debug']) }
];