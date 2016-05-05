# node.ajax

[![npm](https://img.shields.io/npm/v/node.ajax.svg?style=flat-square)](https://www.npmjs.com/package/node.ajax)

ajax for node

## Installation
```
$ npm install node.ajax
```

## Use with node
```js
var ajax = require("node.ajax");

var res = yield ajax("http://domain:port","GET",{
    params: value
},{'Content-Type': 'application/x-www-form-urlencoded'},"utf8")
````

## Use with window

```js
var ajax = require("node.ajax");

// async (need a callback,return true)
var res = ajax("http://domain:port","GET",{
    params: value
},function(res){
    // do something ....
});

// sync (return response data)
var res = ajax("http://domain:port","GET",{
    params: value
});
````

## jQuery like:
```js
var $ = {
    ajax: require("node.ajax")
}
````
