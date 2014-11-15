function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
var urls = {
    local: 'server.php',
    cross: 'http://api.annium.com/1/test/demo/'
}
var native = {
    local: {
        get:  function (data) {
            send(urls.local, 'get', data);
        },
        post: function (data) {
            send(urls.local, 'post', data);
        }
    },
    cross: {
        get:  function (data) {
            send(urls.cross, 'get', data);
        },
        post: function (data) {
            send(urls.cross, 'post', data);
        }
    }
};
var ajax = {
    local: {
        get:  function (data) {
            xs.Ajax.request({
                url:    urls.local,
                method: 'get',
                params: data
            }).promise.always(onAnything).then(onResolved, onRejected);
        },
        post: function (data) {
            xs.Ajax.request({
                url:    urls.local,
                method: 'post',
                params: data
            }).promise.always(onAnything).then(onResolved, onRejected);
        }
    },
    cross: {
        get:  function (data) {
            xs.Ajax.request({
                url:    urls.cross,
                method: 'get',
                params: data
            }).promise.always(onAnything).then(onResolved, onRejected);
        },
        post: function (data) {
            xs.Ajax.request({
                url:    urls.cross,
                method: 'post',
                params: data
            }).promise.always(onAnything).then(onResolved, onRejected);
        }
    }
};
var send = function (url, method, data) {
    var xhr = new XMLHttpRequest();
    method = method.toUpperCase();
    if (method == 'GET') {
        url = urlAppend(url, data);
        data = null;
    } else {
        data = toQueryString(data, true);
    }
    xhr.open(method, url);
    if (method != 'GET') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        xhr.readyState == 4 && onComplete(xhr);
    };
    xhr.send(data);
}

var onComplete = function (xhr) {
    console.log('complete', xhr.response);
};
var onResolved = function (value) {
    console.log('resolved', value);
};
var onRejected = function (reason) {
    console.log('rejected', reason);
};
var onAnything = function () {
    console.log('completed', arguments);
};
var urlAppend = function (url, params) {
    var urlParts = url.split('?');
    var lastChar = url[url.length - 1];
    if (urlParts.length == 1) {
        url += '?';
    } else if (lastChar !== '&' && lastChar !== '?') {
        url += '&';
    }
    url += toQueryString(params, true);
    return url;
};
var toQueryObjects = function (name, object, recursive) {
    var self = toQueryObjects, objects = [];

    if (xs.isArray(object) || xs.isObject(object)) {
        xs.each(object, function (value, param) {
            if (recursive) {
                objects = objects.concat(self(name + '[' + param + ']', value, true));
            } else {
                objects.push({
                    name:  name,
                    value: value
                });
            }
        });
    } else {
        objects.push({
            name:  name,
            value: object
        });
    }

    return objects;
};

var toQueryString = function (object, recursive) {
    var paramObjects = [], params = [], value;

    xs.each(object, function (value, name) {
        paramObjects = paramObjects.concat(toQueryObjects(name, value, recursive));
    });

    xs.each(paramObjects, function (paramObject) {
        params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(paramObject.value)));
    });

    return params.join('&');
};




































