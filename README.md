Koa-Authz 
====
[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/9defa882-898c-4dcb-91a6-7e8f061ccaac)](https://codebeat.co/projects/github-com-node-casbin-koa-authz-master)
[![Build Status](https://travis-ci.org/node-casbin/koa-authz.svg?branch=master)](https://travis-ci.org/node-casbin/koa-authz)
[![Coverage Status](https://coveralls.io/repos/github/node-casbin/koa-authz/badge.svg?branch=master)](https://coveralls.io/github/node-casbin/koa-authz?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/lobby)

[npm-image]: https://img.shields.io/npm/v/koa-authz.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-authz
[download-image]: https://img.shields.io/npm/dm/koa-authz.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-authz

Koa-Authz is an authorization middleware for [Koa](https://github.com/koajs/koa), it's based on ``Node-Casbin``: [https://github.com/casbin/node-casbin](https://github.com/casbin/node-casbin).

## Installation

```shell
npm install --save koa-authz
```

## Simple Example

```js
const { Enforcer } = require('casbin')
const Koa = require('koa')
const app = new Koa()
const authz = require('koa-authz')

// response
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  console.log(new Date() - start)
})

// use authz middleware
app.use(authz({
  newEnforcer: async() => {
    // load the casbin model and policy from files, database is also supported.
    const enforcer = await Enforcer.newEnforcer('authz_model.conf', 'authz_policy.csv')
    return enforcer
  }
}))

// reload routes
const router = require('koa-router')({prefix: '/user'})
router.get('/', (ctx) => {
  ctx.body = {name: 'Chalin', age: 26}
})
router.put('/', (ctx) => {
  ctx.body = {status: 'success'}
})
app.use(router.routes(), router.allowedMethods())

app.listen(3000)
```

## Use a customized authorizer

This package provides ``BasicAuthorizer``, it uses ``HTTP Basic Authentication`` as the authentication method.
If you want to use another authentication method like OAuth, you needs to extends ``BasicAuthorizer`` as below:

```js
class MyAuthorizer extends BasicAuthorizer {
  // override function
  getUserName () {
    const { username } = this.ctx.state.user
    return username
  }
}

app.use(authz({
  newEnforcer: async () => {
    // load the casbin model and policy from files, database is also supported.
    const enforcer = await Enforcer.newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv')
    return enforcer
  },
  authorizer: (ctx, option) => new MyAuthorizer(ctx, option)
}))
```

## How to control the access

The authorization determines a request based on ``{subject, object, action}``, which means what ``subject`` can perform what ``action`` on what ``object``. In this plugin, the meanings are:

1. ``subject``: the logged-on user name
2. ``object``: the URL path for the web resource like "dataset1/item1"
3. ``action``: HTTP method like GET, POST, PUT, DELETE, or the high-level actions you defined like "read-file", "write-blog"


For how to write authorization policy and other details, please refer to [the Casbin's documentation](https://casbin.org).

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

## License

This project is licensed under the [Apache 2.0 license](LICENSE).
