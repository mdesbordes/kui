/*
 * Copyright 2018-19 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from 'fs'
import * as url from 'url'
import * as expandHomeDir from 'expand-home-dir'
import * as propertiesParser from 'properties-parser'

/**
 * Get the apiHost and auth key
 *
 */
export const getCreds = (wsk, options) => {
  if (options.wskprops) {
    // read from a wskprops file
    return new Promise((resolve, reject) => fs.readFile(expandHomeDir(options.wskprops), (err, data) => {
      if (err) {
        reject(err)
      } else {
        try {
          const { APIHOST, AUTH } = propertiesParser.parse(data.toString())
          resolve({ apiHost: !url.parse(APIHOST).protocol ? `https://${APIHOST}` : APIHOST, auth: AUTH })
        } catch (err) {
          reject(err)
        }
      }
    }))

  } else if (options.apiHost && options.auth) {
    // specified on command line
    return options
  } else if (options.apiHost && !options.auth || !options.apiHost && options.auth) {
    throw new Error('Please specify both --apiHost and --auth')
  } else {
    // use the global settings
    return wsk.apiHost.get().then(apiHost => ({ apiHost, auth: wsk.auth.get() }))
  }
}
