# Koa-Authz 

[![Build Status](https://travis-ci.org/gin-contrib/authz.svg)](https://travis-ci.org/gin-contrib/authz)
[![codecov](https://codecov.io/gh/gin-contrib/authz/branch/master/graph/badge.svg)](https://codecov.io/gh/gin-contrib/authz)
[![Go Report Card](https://goreportcard.com/badge/github.com/gin-contrib/authz)](https://goreportcard.com/report/github.com/gin-contrib/authz)
[![GoDoc](https://godoc.org/github.com/gin-contrib/authz?status.svg)](https://godoc.org/github.com/gin-contrib/authz)
[![Join the chat at https://gitter.im/gin-gonic/gin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gin-gonic/gin)

Koa-Authz is an authorization middleware for [Koa](https://github.com/koajs/koa), it's based on [https://github.com/casbin/node-casbin](https://github.com/casbin/node-casbin).

## Installation

```
npm install koa-authz
```

## Simple Example

```js
const { Enforcer } = require('casbin')
const Koa = require('koa')
const app = new Koa()
const authz = require('koa-authz')

// response
app.use((ctx, next) => {
  const start = new Date()
  await next()
  console.log(new Date() - start)
})

// use authz middleware
app.use(authz(async() => {
  // load the casbin model and policy from files, database is also supported.
  const enforcer = await Enforcer.newEnforcer("authz_model.conf", "authz_policy.csv")
  return enforcer
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

## Documentation

The authorization determines a request based on ``{subject, object, action}``, which means what ``subject`` can perform what ``action`` on what ``object``. In this plugin, the meanings are:

1. ``subject``: the logged-on user name
2. ``object``: the URL path for the web resource like "dataset1/item1"
3. ``action``: HTTP method like GET, POST, PUT, DELETE, or the high-level actions you defined like "read-file", "write-blog"


For how to write authorization policy and other details, please refer to [the Casbin's documentation](https://github.com/casbin/casbin).

## Getting Help

- [Casbin](https://github.com/casbin/casbin)

## License

This project is under MIT License. See the [LICENSE](LICENSE) file for the full license text.
