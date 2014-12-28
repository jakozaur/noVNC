NoVnc = {};

Template.noVnc.rendered = function () {
  var self = this;
  var canvas = self.find('canvas');

  self.data = _.extend({
    id: 'NoVnc-canvas',
    inheritWidthFromParent: true,
    fitTo: 'width', // 'width', 'height' or undefined
    connectOnCreate: true,
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
    password: 'empty',
    path: 'websockify'

  }, self.data || {});

  if (self.data.inheritWidthFromParent) {
    self.data.width = canvas.parentNode.clientWidth;
  }

  NoVnc.state = new ReactiveVar({state: 'initialized', msg: ''})
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

  var rfb = new RFB({
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

  if (self.data.connectOnCreate) {
    rfb.connect(self.data.host, self.data.port,
      self.data.password, self.data.path);
  }

  NoVnc.rfb = rfb;
  NoVnc.options = self.data;
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
