/**
 * JS2PNG v0.1.2
 * www.github.com/felixmaier/JS2PNG
 * @author Felix Maier
 */
(function() { 'use strict'

  var root = this;

  var JS2PNG = JS2PNG || {};

  var BYTE_STORE = {};
  
  BYTE_STORE.init = function() {

    this.mode   = arguments[0];
    this.data   = arguments[1];
    this.prefix = arguments[2];
    this.size   = this.data.length;

    var width  = Math.floor(Math.sqrt(this.size)),
        height = Math.ceil(this.size / width);

    return (this.create_8b(this.mode, 'square', width, height));

  };

  BYTE_STORE.create_8b = function() {

    var mode   = arguments[0],
        type   = arguments[1],
        width  = arguments[2],
        height = arguments[3];

    var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(width, height);

    var cols = [];

    for (var ii = 0; ii < 256; ++ii) {
      cols[ii] = ii;
    }

    var data = this[this.prefix + mode];

    var ii = 0;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
        
        var b1 = parseInt(data[ii]),
          col = cols[b1] ? cols[b1] : 0;

        col = JS2PNG.DEC2HEX(col);

        ctx.fillStyle = col;
        ctx.fillRect(x, y, 1, 1);

        ii++;
      }
    }

    return (canvas);

  };

  /**
   * Convert decimal to hex color
   */
  JS2PNG.DEC2HEX = function(number) {
    if (number < 0) {
      number = 0xFFFFFFFF + number + 1;
    }
    var result = number.toString(16).toUpperCase();

    return "#" + result + result + result;
  };

  JS2PNG.Encode = function() {
  
    var results = [];

    var data   = arguments[0],
        prefix = arguments[1] || "undefined",
        size   = data.length;

    if (!data || !data.length) return;

    for (var ii = 0, bytes = []; ii < size; ++ii) {
      bytes.push(data.charCodeAt(ii));
    }

    BYTE_STORE[prefix + "_ascii"] = bytes;

    return (BYTE_STORE.init("_ascii", data, prefix));

  };

  JS2PNG.Decode = function(element, resolve) {

    if (!element || !element.src) return;

    var image = new Image();
        image.src = element.src;

    image.addEventListener('load', function() {

      var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          data, 
          content = '';

        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        data = context.getImageData(0, 0, this.width, this.height).data;

        for (var ii = 0; ii < data.length; ii += 4) {
          if (data[ii]) {
            content += String.fromCharCode(data[ii])
          } else break;
        }

      resolve(content);

    });

  };

  root.JS2PNG = JS2PNG;

}).call(this);