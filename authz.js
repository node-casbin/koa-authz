// Copyright 2014 Manu Martinez-Almeida.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const { Enforcer } = require('casbin')
const BasicAuthorizer = require('./BasicAuthorizer')
// authz returns the authorizer, uses a Casbin enforcer as input
module.exports = function authz (options) {
  return async (ctx, next) => {
    try {
      const {newEnforcer, basicAuthorizer} = options
      const enforcer = await newEnforcer()
      if (!(enforcer instanceof Enforcer)) {
        throw new Error('Invalid enforcer')
      }
      if (!(basicAuthorizer instanceof BasicAuthorizer)) {
        throw new Error('Plase extends BasicAuthorizer class')
      }
      const authzorizer = basicAuthorizer || new BasicAuthorizer(ctx, enforcer)
      if (!authzorizer.checkPermission()) {
        ctx.status = 403
      }
      await next()
    } catch (e) {
      throw e
    }
  }
}
