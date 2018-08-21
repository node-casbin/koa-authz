// Copyright 2014 Manu Martinez-Almeida.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const { Enforcer } = require('casbin')

// authz returns the authorizer, uses a Casbin enforcer as input
module.exports = function authz (options) {
  return async (ctx, next) => {
    try {
      const {newEnforcer} = options
      const enforcer = await newEnforcer()
      if (!(enforcer instanceof Enforcer)) {
        throw new Error('Invalid enforcer')
      }
      const authzorizer = new BasicAuthorizer(ctx, enforcer)
      if (!authzorizer.checkPermission()) {
        ctx.status = 403
      }
      await next()
    } catch (e) {
      throw e
    }
  }
}

// BasicAuthorizer class stores the casbin handler
class BasicAuthorizer {
  constructor (ctx, enforcer) {
    this.ctx = ctx
    this.enforcer = enforcer
  }

  // getUserName gets the user name from the request.
  // Currently, only HTTP basic authentication is supported
  getUserName () {
    // customize to get username from context
    const {user} = this.ctx
    const {username} = user
    return username
  }

  // checkPermission checks the user/method/path combination from the request.
  // Returns true (permission granted) or false (permission forbidden)
  checkPermission () {
    const {ctx, enforcer} = this
    const {originalUrl: path, method} = ctx
    const user = this.getUserName()
    return enforcer.enforce(user, path, method)
  }
}
