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
