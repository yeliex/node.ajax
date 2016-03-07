# node.ajax

[![npm](https://img.shields.io/npm/v/node.ajax.svg?style=flat-square)](https://www.npmjs.com/package/node.ajax)

ajax for node

## Installation
```
$ npm install node.ajax
```

## Usage
```js
var ajax = require("node.ajax");
var result = yield ajax("http://domain:port","GET",{
    params: value
})
````
jQuery like:
```js
var $ = {
    ajax: require("node.ajax")
}
````
