NoVNC = {};

Template.noVNC.rendered = function () {
  var self = this;

  this.data = _.extend({
    id: 'NoVNC_canvas',
    width: 400, // 1366,
    height: 300, //,
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

  }, this.data || {});
  //this.id = this.id || 'NoVNC_canvas';
  // Initialization code

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
    var scale = self.data.width / width;
    //rfb.get_display().resizeAndScale(width, height, scale);
    console.log("Resize", self.data.width, self.data.height, width, height);
    var canvas = self.find('canvas');
    console.log("Canvas", canvas.width, canvas.height);
    //rfb.get_display().resize(self.data.width, self.data.height);
    rfb.get_display().set_scale(scale);

  }

  rfb = new RFB({'target':       this.find('canvas'),
                 'encrypt':      this.data.encrypt,
                 'repeaterID':   this.data.repeaterId,
                 'true_color':   this.data.trueColor,
                 'local_cursor': this.data.localCursor,
                 'shared':       this.data.shared,
                 'view_only':    this.data.viewOnly,
                 'onUpdateState':  updateState,
                 'onXvpInit':    xvpInit,
                 'onFBResize':   fbResize,
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
