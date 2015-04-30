(function() { "use strict"

  var root = this;

  /** Namespace class */
  var AJAX = AJAX || {};

  /** Cross browser ajax request */
  AJAX.init = function() {

    var activexmodes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];

    if (window.ActiveXObject) {
      for (var ii = 0; ii < activexmodes.length; ++ii) {
        try {
          return new window.ActiveXObject(activexmodes[ii]);
        } catch (e) {
          throw new Error(e);
        }
      }
    } 
    else if (window.XMLHttpRequest) return new window.XMLHttpRequest();
    else return false;
  };

  /** Ajax POST */
  AJAX.POST = function(data, url, resolve) {
    var request = new AJAX.init();
    request.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(this.responseText);
      } else {
        throw new Error("Status code was " + this.status);
      }
    };
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("data=" + data);
  };

  /** Ajax POST */
  AJAX.GET = function(url, resolve) {
    var request = new AJAX.init();
    request.onload = function() {
      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        throw new Error("Status code was " + this.status);
      }
    };
    request.open("GET", url + "?" + (new Date()).getTime(), true);
    request.send(null);
  };

  /** Assign it global */
  root.AJAX = AJAX;

}).call(this);