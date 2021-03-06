#!/usr/bin/env bash

#
# Copyright 2019 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -e
set -o pipefail

# create an electron dist to test against
PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`
cd clients/default && NO_INSTALLER=`[[ "$TRAVIS_OS_NAME" == linux ]] && echo true` npm run build:electron -- ${PLATFORM} # we want to test Mac DMG Build

if [ "$PLATFORM" == linux ]; then
  ls dist/electron/*darwin* && exit 1 || exit 0
elif [ "$PLATFORM" == darwin ]; then
  ls dist/electron/*linux* && exit 1 || exit 0
fi
