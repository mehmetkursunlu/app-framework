// Load packages
var path = require('path')
var run = require('./run')
var spawn = require('./spawn')
var showOnly = require('./show-only')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')

showOnly('Preparing Firebase database rules deployment - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  showOnly('Login to Firebase - please wait ...')
  spawn.sync(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), 'firebase', ['login'], function () {
    showOnly('Deploying database rules - please wait ...')
    spawn.async(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), 'firebase', ['deploy', '--only', 'database'], function () {
      showOnly('Clean up temp files - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        showOnly('Firebase database rules deployed!')
      }, 'Firebase clean up failed')
    }, 'Firebase database rules deployment failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase database rules deployment')