const Koa = require('koa');
const { Enforcer } = require('casbin')
const authz  = require('../authz')

console.log('Starting koa-authz test server on http://localhost:3000/')
console.log('')
console.log('You can test the server by issuing curl commands like the following:')
console.log('')
console.log('curl http://localhost:3000/dataset1/resource1?username=alice  # should succeed (return 200 and {status: true})')
console.log('curl http://localhost:3000/dataset1/resource1?username=chalin # should fail (return 403)')
console.log('')

const app = new Koa();

app.use(async(ctx, next) => {
  const {username} = ctx.query
  ctx.user = {username}
  await next()
  ctx.body = {status: true}
})

app.use(authz(async() => {
  const enforcer = await Enforcer.newEnforcer('../authz_model.conf', '../authz_policy.csv')
  return enforcer
}))

app.listen(3000)