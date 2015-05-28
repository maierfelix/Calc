/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */
(function() { "use strict"

  /**
   * Function to compare mathematical results of ENGEL
   * and the javascript interpreter
   */
  var interpret = function() {

    var test = null;

    var engelResult = 0;
    var jsResult = 0;
    var failures = 0;

    var array = [
      /** Plus */
      "a = 2 + 2",
      /** Minus */
      "a = 2 - 2",
      /** Mult */
      "a = 2 * 2",
      /** Division */
      "a = 10 / 2",
      /** Operator predecence */
      "a = 5 + 5 * 2",
      /** Negative numbers */
      "a = -20",
      /** Parenthesis */
      "a = -(2 * 2) + 10",
      "a = -( (2*2) + -(5+2) )",
      "a = -( (-5*5) + (7*7) + -(-9) )",
      "a = -( -(2*2) + 5 )"
    ];

    for (var ii = 0; ii < array.length; ++ii) {

      engelResult = ENGEL.interpret(array[ii]).VAR["A"].value.value;
      jsResult = parseInt(window.eval(array[ii].slice(4)));

      if (engelResult !== jsResult) {
        failures++;
        console.log("#### Results doesn't match! => " + (array[ii].slice(4)) + " ####");
        console.log( "ENGEL:", engelResult);
        console.log( "JS:   ", jsResult);
      }

    }

    if (!failures) console.log("All tests passed successfully!");

  };

  Import.scripts = [
    /** Interpreter */
    "../core/interpreter/main.js",
    "../core/interpreter/stack.js",
    "../core/interpreter/lexer.js",
    "../core/interpreter/parser/main.js",
    "../core/interpreter/parser/expression.js",
    "../core/interpreter/evaluator/main.js",
    "../core/interpreter/evaluator/expression.js",
    "../core/interpreter/evaluator/function.js",
    "../core/interpreter/type.js"
  ];

  Import.after = function() {
    ENGEL.init();
    interpret();
  };

  Import.me();

}).call(this);