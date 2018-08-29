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

const app = require('./server')
const request = require('supertest')(app)

afterAll(() => {
  app.close()
})

describe('pass through tests', () => {
  it('test: p, alice, /dataset1/*, GET', async () => {
    const response = await request
      .get('/dataset1/name')
      .set('Authorization', 'alice')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, alice, /dataset1/resource1, POST', async () => {
    const response = await request
      .post('/dataset1/resource1')
      .set('Authorization', 'alice')
    expect(response.statusCode).toBe(200)
  })

  it('test: bob, /dataset2/folder1/*, POST', async () => {
    const response = await request
      .post('/dataset2/folder1/file')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, bob, /dataset2/resource1, * - GET', async () => {
    const response = await request
      .get('/dataset2/resource1')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, bob, /dataset2/resource1, * - POST', async () => {
    const response = await request
      .post('/dataset2/resource1')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, bob, /dataset2/resource1, * - PUT', async () => {
    const response = await request
      .put('/dataset2/resource1')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, bob, /dataset2/resource1, * - DELETE', async () => {
    const response = await request
      .delete('/dataset2/resource1')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p, bob, /dataset2/resource2, GET', async () => {
    const response = await request
      .get('/dataset2/resource2')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(200)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - GET', async () => {
    const response = await request
      .get('/dataset1/resource')
      .set('Authorization', 'cathy')
    expect(response.statusCode).toBe(200)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - POST', async () => {
    const response = await request
      .post('/dataset1/resource')
      .set('Authorization', 'cathy')
    expect(response.statusCode).toBe(200)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - PUT', async () => {
    const response = await request
      .put('/dataset1/resource')
      .set('Authorization', 'cathy')
    expect(response.statusCode).toBe(200)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - DELETE', async () => {
    const response = await request
      .delete('/dataset1/resource')
      .set('Authorization', 'cathy')
    expect(response.statusCode).toBe(200)
  })
})

describe('success through tests', () => {
  it('test: p, alice, /dataset1/*, GET - 403', async () => {
    const response = await request
      .post('/dataset1/users')
      .set('Authorization', 'alice')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, alice, /dataset1/resource1, POST - 403', async () => {
    const response = await request
      .post('/dataset1/resource')
      .set('Authorization', 'alice')
    expect(response.statusCode).toBe(403)
  })

  it('test: bob, /dataset2/folder1/*, POST', async () => {
    const response = await request
      .put('/dataset2/folder1/file')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, bob, /dataset2/resource1, * - GET', async () => {
    const response = await request
      .get('/dataset2/resource')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, bob, /dataset2/resource1, * - POST', async () => {
    const response = await request
      .post('/dataset2/resource')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, bob, /dataset2/resource1, * - PUT', async () => {
    const response = await request
      .put('/dataset2/resource')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, bob, /dataset2/resource1, * - DELETE', async () => {
    const response = await request
      .delete('/dataset2/resource')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p, bob, /dataset2/resource2, GET', async () => {
    const response = await request
      .post('/dataset2/resource2')
      .set('Authorization', 'bob')
    expect(response.statusCode).toBe(403)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - GET', async () => {
    const response = await request
      .get('/dataset1/resource')
      .set('Authorization', 'chalin')
    expect(response.statusCode).toBe(403)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - POST', async () => {
    const response = await request
      .post('/dataset1/resource')
      .set('Authorization', 'chalin')
    expect(response.statusCode).toBe(403)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - PUT', async () => {
    const response = await request
      .put('/dataset1/resource')
      .set('Authorization', 'chalin')
    expect(response.statusCode).toBe(403)
  })

  it('test: p & g, dataset1_admin, /dataset1/*, * - DELETE', async () => {
    const response = await request
      .delete('/dataset1/resource')
      .set('Authorization', 'chalin')
    expect(response.statusCode).toBe(403)
  })
})
