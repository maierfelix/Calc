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

var NOVAE_Interpreter = function() {

  var init = function(interpreter, scope) {

    var log = function(text) {
      return interpreter.createPrimitive(console.log(text));
    };

    interpreter.setProperty(scope, 'log', interpreter.createNativeFunction(log));

  };

  /** Load test script */
  AJAX.GET("./api/test.js", function(content) {

    /** Run the test script */
    var myInterpreter = new Interpreter(content).run();

  });

};