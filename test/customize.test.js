/**
 * @author Balalals
 * @date 2018-08-29
 * @Description:
 */
const app = require('./customizeServer')
const request = require('supertest')(app)
afterAll(() => {
  app.close()
})
it('customize authorizer tests', async () => {
  const response = await request
    .get('/dataset1/name')
    .set('Authorization', 'alice')
  expect(response.statusCode).toBe(200)
})
