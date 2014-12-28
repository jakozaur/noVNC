NoVNC = {};

Template.noVNC.rendered = function () {
  var self = this;
  var canvas = self.find('canvas');

  this.data = _.extend({
    id: 'NoVNC_canvas',
    width: 400, // 1366,
    height: 300, //,
    inheritWidthFromParent: true,
    fitTo: 'width', // 'width', 'height' or undefined
    encrypt: (window.location.protocol === "https:"),
    repeaterId: '',
    trueColor: true,
    localCursor: true,
    shared: false,
    viewOnly: false,

    host: 'localhost',
    port: 6080,
    password: '',
    path: 'websockify'

  }, this.data || {});

  if (this.data.inheritWidthFromParent) {
    this.data.width = canvas.parentNode.clientWidth;
  }

  var rfb;

  function xvpInit (ver) {
    // No-op
  }

  function updateState (rfb, state, oldstate, msg) {
    console.log("State ", state, "msg", msg);
  }

  function passwordRequired (rfb) {
    var result = prompt("Please enter password to VNC", "empty");
    rfb.sendPassword(result);
  }

  function fbResize (rfb, width, height) {
    var scale = 1.0;
    if (self.data.fitTo == 'width') {
      scale = self.data.width / width;
    } else {
      scale = self.data.height / height;
    }
    rfb.get_display().resize(width, height);
    rfb.get_display().set_scale(scale);
    rfb.get_mouse().set_scale(scale);
  }

  rfb = new RFB({'target':         canvas,
                 'focusContainer': canvas,
                 'encrypt':        self.data.encrypt,
                 'repeaterID':     self.data.repeaterId,
                 'true_color':     self.data.trueColor,
                 'local_cursor':   self.data.localCursor,
                 'shared':         self.data.shared,
                 'view_only':      self.data.viewOnly,
                 'onUpdateState':  updateState,
                 'onXvpInit':      xvpInit,
                 'onFBResize':     fbResize,
                 'onPasswordRequired':  passwordRequired});
  rfb.connect(this.data.host, this.data.port, this.data.password,
    this.data.path);
};

Template.noVNC.helpers({
  canvasId: function () {
    return this.id || 'NoVNC_canvas';
  },
  height: function () {
    return this.data && this.data.height || 200; //768;
  },
  width: function () {
    return this.data && this.data.width || 200; //1366;
  }
});
