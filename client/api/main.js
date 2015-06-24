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

  /** Load test script */
  AJAX.GET("./api/flashingBackground.js", function(content) {

    /** Run the test script */
    var myInterpreter = Interpreter.run(content);

    /*var myCodeMirror = CodeMirror(document.body, {
      value: content,
      mode:  "javascript",
      lineNumbers: true
    });*/

  });

};