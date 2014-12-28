NoVNC = {};

Template.noVNC.rendered = function () {
  var self = this;
  var canvas = self.find('canvas');

  self.data = _.extend({
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
    password: 'empty',
    path: 'websockify',

    connectOnCreate: true

  }, self.data || {});

  if (self.data.inheritWidthFromParent) {
    self.data.width = canvas.parentNode.clientWidth;
  }

  var rfb;

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
                 'onFBResize':     fbResize,
                 'onPasswordRequired':  passwordRequired});

  if (self.data.connectOnCreate) {
    rfb.connect(self.data.host, self.data.port,
      self.data.password, self.data.path);
  }

  NoVNC.rfb = rfb;
  NoVNC.options = self.data;
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
