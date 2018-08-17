const Koa = require('koa');
const { Enforcer } = require('casbin')
const authz  = require('../authz')

const app = new Koa()

// set userinfo
app.use(async(ctx, next) => {
  try {
    const username = ctx.get('Authorization') || 'anonymous'
    ctx.user = {username}
    await next()
    ctx.body = {status: true}
  } catch (e) {
    ctx.status = 503
  }
})
// use authz middleware
app.use(authz({
  newEnforcer: async() => {
    // load the casbin model and policy from files, database is also supported.
    const enforcer = await Enforcer.newEnforcer("authz_model.conf", "authz_policy.csv")
    return enforcer
  }
}))

module.exports = app
