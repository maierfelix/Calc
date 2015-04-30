/**
 * ImportJS v0.4.5
 * www.github.com/felixmaier/ImportJS
 * @author Felix Maier
 */
(function() {
  'use strict'


  var root = this;

  /**
   * Static namespace class
   */
  var Import = Import || {};

  /**
   * Array of script paths to load
   */
  Import.scripts = null;

  /**
   * Save scripts array length
   */
  Import.scriptLength = 0;

  /**
   * Total progress
   */
  Import.progress = 0;

  /**
   * Total progress increment between each script loading
   */
  Import.step = 0;

  /**
   * What to do after loading finished
   */
  Import.after = null;

  /**
   * What to do between each loading step
   */
  Import.each = null;


  Import.me = function() {

    if (!this.scripts || !this.scripts.length) return;

    this.scriptLength = this.scripts.length;

    this.step = Math.ceil(100 / this.scripts.length);

    var _import = function(data) {

      if (data.length) {

        var script = document.createElement("script");

        script.addEventListener('load', function() {

          Import.progress += Import.step;

          if (Import.progress >= 100) Import.progress = 100;

          if (Import.each && typeof(Import.each) === "function") Import.each(Import.progress);

          _import(data);

        });

        script.src = data.shift();

        if (document.head) document.head.appendChild(script);
        else if (document.body) document.body.appendChild(script);

      } else {

        if (Import.after && typeof(Import.after) === "function") Import.after();

        Import.clean();

      }

    };

    window.addEventListener("DOMContentLoaded", _import(Import.scripts));

  };

  /**
   * Hold everythign fresh after successfully loading
   */
  Import.clean = function() {

    this.scripts = null;

    this.scriptLength = 0;

    this.progress = 0;

    this.step = 0;

  };

  /**
   * Do it global, please
   */

  root.Import = Import;

}).call(this);