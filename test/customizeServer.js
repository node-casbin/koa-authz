/**
 * @author Balalals
 * @date 2018-08-29
 * @Description:
 */
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

module.exports = app.listen(3000)
