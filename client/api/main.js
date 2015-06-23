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

  var code = "var sheet = Spreadsheet.getActiveSheet();";

  code += "var values = sheet.getRange('A1:B10');";
  code += "values.get('Content');";

  code += "var newBackgroundColor = sheet.getRange('A1:B10').set('BackgroundColor', '#000');";

  code += "log(selection); log(sheet);";

  code += "sheet.addListener('click', 1);";

  setTimeout(function() {
    var myInterpreter = new Interpreter(code, init).run();
  }, 5000);

};