var Pad = $.Fidel.extend({
  events: {
    'click [data-action="clear"]': 'clear'
  },
  init: function() {
    var self = this;
    document.addEventListener("touchmove", function(e) { e.preventDefault(); }, false);
    this.scribble = new Scribble({ el:this.find("canvas"), strokeWidth: 1.5 });
    this.scribble.bind("end", function() {
      self.saveScribble();
    });
    this.scribble.bind("clear", function() {
      self.saveScribble();
    });
    this.loadScribble();
  },
  saveScribble: function() {
    var data = JSON.stringify(this.scribble.strokes);
    localStorage.scribble = data;
  },
  loadScribble: function() {
    if (localStorage.scribble) {
      var data = JSON.parse(localStorage.scribble);
      this.scribble.load(data);
    }
  },
  clear: function() {
    this.scribble.clear();
  }
});
