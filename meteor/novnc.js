NoVnc = {
  state: new ReactiveVar({state: 'stopped', msg: ''})
};

Template.noVnc.rendered = function () {
  var self = this;
  // prevent double render
  if (self.wasRendered) {
    return;
  } else {
    self.wasRendered = true;
  }

  self.data = _.extend({
    id: 'NoVnc-canvas',
    inheritWidthFromParent: true,
    fitTo: 'width', // 'width', 'height' or undefined
    connectOnRendered: true,
    width: 400,
    height: 300,

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

  }, self.data || {});
  NoVnc.options = self.data;

  var canvas = self.find('canvas');
  if (self.data.inheritWidthFromParent) {
    self.data.width = canvas.parentNode.clientWidth;
  }

  function updateState (rfb, state, oldstate, msg) {
    NoVnc.state.set({
      state: state,
      msg: msg
    });
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

  NoVnc.rfb = new RFB({
    target:              canvas,
    focusContainer:      canvas,
    encrypt:             self.data.encrypt,
    repeaterID:          self.data.repeaterId,
    true_color:          self.data.trueColor,
    local_cursor:        self.data.localCursor,
    shared:              self.data.shared,
    view_only:           self.data.viewOnly,
    onUpdateState:       updateState,
    onFBResize:          fbResize,
    onPasswordRequired:  passwordRequired
  });

  if (self.data.connectOnRendered) {
    NoVnc.rfb.connect(self.data.host, self.data.port,
      self.data.password, self.data.path);
  }
};

Template.noVnc.helpers({
  canvasId: function () {
    return this.id || 'NoVnc-canvas';
  },
  height: function () {
    return this.data && this.data.height || 200; // Some dummy value
  },
  width: function () {
    return this.data && this.data.width || 200; // Some dummy value;
  }
});
