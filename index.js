/**
 * Creator: yeliex <yeliex@yeliex.com>
 * Description: ajax for node.js
 */
var Url = require("url");
var env = ((typeof window == "undefined") ? ("node") : ("window")); // 简单判断运行环境
var queryString = require("querystring");
(function () {
    var ajax = {
        node: function (url, method, data) {
            // 拼接get query
            url = (method === "GET" && data) ? (function () {
                var _url = Url.parse(url);
                return Url.format({
                    host: _url.host,
                    protocol: _url.protocol,
                    pathname: _url.path,
                    query: data
                });
            }()) : (url);
            url = Url.parse(url);
            if (method == "POST") {
                data = queryString.stringify(data);
            }
            var http = require("http");
            if (url.port == "443" || url.protocol == "https:") {
                http = require("https");
            }
            var _ajax = new Promise(function (recept, reject) {
                var req = http.request({
                    hostname: url.hostname,
                    port: url.port,
                    path: url.path,
                    method: (method === "GET" || method === "POST") ? (method) : ("GET"),
                    headers: ((method === "POST") ? ({
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': data.length
                    }) : (""))
                }, function (res) {
                    res.setEncoding('utf8');

                    var data = "";
                    res.on('data', function (chunk) {
                        data += chunk;
                    }).on('end', function () {
                        recept(data);
                    });
                }).on('error', function (e) {
                    reject(e);
                });
                if (method === "POST") {
                    req.write(data);
                }
                req.end();
            });
            return _ajax.then(function (res) {
                try {
                    return JSON.parse(res);
                }
                catch (e) {
                    throw e;
                }
            }).then(function (res) {
                res.status = status(res.status);
                return res;
            });
        },
        window: function (url, method, data, callback) {
            var $ = require("./jquery.ajax")();
            var async = (typeof callback == "function");
            var res = {
                status: false
            };
            var req = $.ajax(url, (method || "GET"), async, data);
            req.complete(function (response) {
                if (async) {
                    // 异步
                    callback(response);
                    res.status = true;
                } else {
                    (function (response) {
                        response = response.responseText;
                        try {
                            res = $.parseJSON(response);
                            res.status = status(code);
                        }
                        catch (e) {
                            res.error = e;
                        }
                    }());
                }
            });
            return res;
        }
    };

    function status(code) {
        return (code == "success" || code == "SUCCESS" || code == 200 || code == true || res.code == 200 || res.resultCode == 200);
    }

    module.exports = (function () {
        return ajax[env];
    }());
}());