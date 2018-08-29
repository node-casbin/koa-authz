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

module.exports = BasicAuthorizer
