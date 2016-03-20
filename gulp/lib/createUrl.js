'use strict';

var path = require('path');
var config = require('../config');

module.exports = function(task, type, runTimestamp) {
    var res = false;
    var url = [];

    // check task in config
    if (task in config.tasks && type in config.tasks[task]) {
        // forming url array
        url[url.length] = (type in config.root) ? config.root[type] : config.root.baseDir;
        if (type === 'dist') url[url.length] = (runTimestamp) ? 'build_' + runTimestamp : 'build';
        url[url.length] = config.tasks[task][type];

        res = path.join.apply(null, url);
    }

    return res;
};