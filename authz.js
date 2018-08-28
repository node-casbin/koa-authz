// Copyright 2014 Manu Martinez-Almeida.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const { Enforcer } = require('casbin')
const BasicAuthorizer = require('./BasicAuthorizer')
// authz returns the authorizer, uses a Casbin enforcer as input
module.exports = function authz (options) {
  return async (ctx, next) => {
    try {
      const {newEnforcer, authorizer} = options
      const enforcer = await newEnforcer()
      if (!(enforcer instanceof Enforcer)) {
        throw new Error('Invalid enforcer')
      }
      const authzorizer = authorizer ? authorizer(ctx, enforcer) : new BasicAuthorizer(ctx, enforcer)
      if (!(authzorizer instanceof BasicAuthorizer)) {
        throw new Error('Plase extends BasicAuthorizer class')
      }
      if (!authzorizer.checkPermission()) {
        ctx.status = 403
      }
      await next()
    } catch (e) {
      throw e
    }
  }
}
