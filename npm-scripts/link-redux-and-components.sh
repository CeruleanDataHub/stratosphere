#!/bin/bash

cd ..
cd react-components
npm link
cd ..
cd middleware-redux
npm link
cd ..
cd stratosphere
npm link @ceruleandatahub/middleware-redux @ceruleandatahub/react-components
