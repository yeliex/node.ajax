const env = ((typeof window == "undefined") ? ("node") : ("window")); // 简单判断运行环境
(function () {
  const ajax = {
    node: function (url, method, data, headers, code) {
      const Url = require("url");
      const qs = require('qs');
      code = code || "utf-8";
      // 拼接get query
      url = (method === "GET" && data) ? (function () {
        const _url = Url.parse(url);
        return Url.format({
          host: _url.host,
          protocol: _url.protocol,
          pathname: _url.path,
          query: data
        });
      }()) : (url);
      url = Url.parse(url);
      if (method == "POST") {
        data = typeof data === 'string' ? data : qs.stringify(data);
      }
      let http = require("http");
      if (url.port == "443" || url.protocol == "https:") {
        http = require("https");
      }
      const _ajax = new Promise(function (recept, reject) {
        const req = http.request({
          hostname: url.hostname,
          port: url.port,
          path: url.path,
          method: (method === "GET" || method === "POST") ? (method) : ("GET"),
          headers: ((method === "POST") ? Object.assign({}, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
          }, headers) : (headers))
        }, function (res) {
          res.setEncoding(code);
          let data = "";
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
          return {
            status: false,
            error: "Parse Error",
            syntax: e,
            data: res
          }
        }
      }).then(function (res) {
        res.status = status(res.status || res.code || res.result);
        return res;
      });
    },
    window: function (url, method, data, callback) {
      const $ = require("./../jquery.ajax.js");
      const async = (typeof callback == "function");
      let res = {
        status: false
      };
      const req = $.ajax(url, {
        method: (method || "GET"),
        async: async,
        data: data
      });
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
              res.status = status(res.status || res.code || res.result);
            }
            catch (e) {
              res.error = e;
              res.data = response;
            }
          }(response));
        }
      });
      return res;
    }
  };

  function status(code) {
    return (code == "success" || code == "SUCCESS" || code <= 400);
  }

  module.exports = (function () {
    return ajax[env];
  }());
}());
