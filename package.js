// package metadata file for Meteor.js
'use strict';

var packageName = 'jakozaur:novnc';  // https://atmospherejs.com/jakozaur/novnc
var where = 'client';  // where to install: 'client' or 'server'. For both, pass nothing.

Package.describe({
  name: packageName,
  summary: "noVNC - VNC client using HTML5 (Web Sockets, Canvas) with encryption (wss://) support. ",
  version: '0.5.0',
  git: 'https://github.com/jakozaur/noVNC.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@1.0']);
  api.use('underscore');
  api.use("templating");
  api.addFiles([
    'include/util.js',

    'include/webutil.js',
    'include/base64.js',
    'include/websock.js',
    'include/des.js',
    'include/keysymdef.js',
    'include/keyboard.js',
    'include/input.js',
    'include/display.js',
    'include/jsunzip.js',
    'include/rfb.js',
    'include/keysym.js',

    // 'include/ui.js', // Too bloated...

    'include/logo.js',
    'include/playback.js',

    'meteor/novnc.html',
    'meteor/novnc.js'
    // 'include/base.css' // no CSS, style it yourself!
    // TODO: JM: remove globals from window?
  ], where);
  api.export('NoVNC');
});

Package.onTest(function (api) {
  api.use(packageName, where);
  api.use('tinytest', where);

  api.addFiles('meteor/test.js', where);
});
