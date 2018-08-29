// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Koa = require('koa')
const { Enforcer } = require('casbin')
const authz = require('../authz')
const app = new Koa()
const BasicAuthorizer = require('../BasicAuthorizer')

// set userinfo
app.use(async (ctx, next) => {
  try {
    const username = ctx.get('Authorization') || 'anonymous'
    ctx.state.user = {username}
    await next()
    ctx.body = {status: true}
  } catch (e) {
    ctx.status = 503
  }
})

// use CustomizeAuthorizer
class CustomizeAuthorizer extends BasicAuthorizer {
  // override function
  getUserName () {
    const { username } = this.ctx.state.user
    return username
  }
  // checkPermission () {
  //   const {ctx, enforcer} = this
  //   const {originalUrl: path, method} = ctx
  //   const user = this.getUserName()
  //   return enforcer.enforce(user, path, method)
  // }
}

app.use(authz({
  newEnforcer: async () => {
    // load the casbin model and policy from files, database is also supported.
    const enforcer = await Enforcer.newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv')
    return enforcer
  },
  authorizer: (ctx, option) => new CustomizeAuthorizer(ctx, option)
}))

module.exports = app.listen(3001)
