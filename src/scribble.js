!function(obj, util) {
  var Scribble = util.Fidel.extend({
    init: function() {
      var self = this;
      if (!this.strokeWidth)
        this.strokeWidth = 2;
      this._points = [];
      this.origin = [0,0];
      this.canvas = this.el[0]; 
      this.context = this.canvas.getContext('2d');

      this.clear();

      if (!this.readonly) {
        this._loop();
      }
    },
    /* DRAWING */
    events: {
      "mousedown": "_start",
      "mousemove": "_move",
      "mouseup": "_end",
      "touchstart": "_start",
      "touchmove": "_move",
      "touchend": "_end"
    },
    _getPoint: function(ev) {
      var x,y;
      if (this._offset === null) {
        /*var margin = (window.innerWidth <= 480)?0:15;*/
        var margin = 0;
        this._offset = [this.el[0].offsetLeft + margin, this.el[0].offsetTop + margin];
      }
      if (ev.touches) {
        x = ev.touches[0].clientX - this.offset[0] - window.scrollX;
        y = ev.touches[0].clientY - this.offset[1] - window.scrollY;
      } else {
        x = ev.clientX - this._offset[0];
        y = ev.clientY - this._offset[1];
      }
      return [x, y];
    },
    _start: function(e) {
      this._drawing = true;
      var p = this._getPoint(e);
      this._lastPoint = p;
      this._points.push(p);
      return e.preventDefault();
    },
    _move: function(e) {
      if (this._drawing) {
        this._moved = true;
        this._points.push(this._getPoint(e));
      }
    },
    _end: function(e) {
      if (this._drawing) {
        if (!this._moved)
          this._points.push(this._lastPoint, [this._lastPoint[0]+2, this._lastPoint[1]+2]);
        this._drawing = false;
        this._moved = false;
        this._points.push(null);
      }
    },
    /* END DRAWING */
    /* CANVAS LOOP */
    _loop: function() {
      var self = this;
      var done = false;
      var drawIndex = 0;
      setInterval(function __drawLoop() {
        if (self._points.length === 0)
          return;
        self.context.beginPath(); 
        while (self._points.length > drawIndex) {
          var p = self._points[drawIndex];
          if (!p) {
            done = true;
          } else {
            self.drawPoints([self._lastPoint, p]);
            self._lastPoint = p;
          }
          drawIndex++;
        }
        self.context.stroke();
        if (done) {
          self.strokes.push(self._points);
          self._points = [];
          drawIndex = 0;
          done = false;
          self.trigger("end");
        }
      }, 30);
    },
    /* END CANVAS LOOP */
    drawPoints: function(points) {
      this.context.lineWidth = this.strokeWidth;
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
      for (var i = 0, c = points.length; i < c; i++) {
        var point = points[i];
        if (!point)
          continue;
        if (i === 0) {
          this.context.moveTo(point[0] - this.origin[0], point[1] - this.origin[1]);
        } else {
          this.context.lineTo(point[0] - this.origin[0], point[1] - this.origin[1]);
        }
      }
    },
    redraw: function() {
      this.canvas.width = this.canvas.width;
      var self = this;
      
      this.context.beginPath();
      for (var i = 0; i < this.strokes.length; i++) {
        var s = this.strokes[i];
        this.drawPoints(s);
      }
      this.context.stroke();
    },
    load: function(json, origin) {
     /*this.clear();*/
      this.origin = origin || [0, 0];
      this.strokes = json;
      this.redraw();
    },
    toJSON: function() {
      return this.strokes;
    },
    imageData: function() {
      return this.canvas.toDataURL();
    },
    clear: function() {
      this._offset = null;
      this.strokes = [];
      this.context.clearRect(0, 0, this.el[0].clientWidth, this.el[0].clientHeight);
      this.canvas.width = this.el[0].clientWidth;
      this.canvas.height = this.el[0].clientHeight;
      this.trigger("clear");
    }
  });
  var o = obj.Scribble;
  Scribble.noConflict = function() {
    obj.Scribble = o;
    return this;
  };
  obj.Scribble = Scribble;
}(this, ender || this);
