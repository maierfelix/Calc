/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

var NOVAE_Interpreter = function(callback) {

  var dir = "./api/test/";

  var scripts = [dir + "helper.js", dir + "flashingBackground.js", dir + "fillContent.js", dir + "run.js"];

  var length = scripts.length;

  for (var ii = 0; ii < scripts.length; ++ii) {

    /** Load script */
    AJAX.GET(scripts[ii], function(ii, data) {

      length--;

      /** Register script as a module */
      scripts[ii] = Interpreter.registerModule(data);

      length <= 0 && run(scripts);

    }.bind(this, ii));

  }

  /** Execute scripts */
  var run = function(scripts) {

    callback();

    /** Run all scripts */
    //Interpreter.run();

  };

};