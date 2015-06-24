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

  /**
   * NovaeCalc Javascript Interpreter Emulator
   *
   * @class Interpreter
   * @static
   */
  var Interpreter = function() {

    /** Create a closure and open a try catch statement */
    this.scriptOpen = "(function(){";
    this.scriptOpen += "try {";

    /** Catch errors and pass it to the interpreter error handler */
    this.scriptClose = "} catch(err) {Interpreter.error(err.name, err.message);}";
    this.scriptClose += "})();";

    /** Disable all security risk scopes */
    this.scriptSecurity = 'var window = void 0, alert = void 0,';
    this.scriptSecurity += 'NOVAE = void 0, AJAX = void 0, ENGEL = void 0,';
    this.scriptSecurity += ' Import = void 0, NOVAE_Interpreter = void 0, NOVAE_UI = void 0;';

  };

  Interpreter.prototype = Interpreter;
  Interpreter.prototype.constructor = Interpreter;

  /**
   * Run a script
   *
   * @method run
   * @static
   */
  Interpreter.prototype.run = function() {

    var stream = this.scriptOpen + this.scriptSecurity + arguments[0] + this.scriptClose;

    var script = document.createElement('script');
        script.setAttribute("typus", "custom");
        script.src = 'data:text/javascript,' + encodeURIComponent(stream);

    document.body.appendChild(script);

    var removeScript = document.querySelector('script[typus="custom"]');
    removeScript.parentNode.removeChild(removeScript);

  };

  /**
   * Throw a error
   *
   * @method error
   * @static
   */
  Interpreter.prototype.error = function(name, msg) {
    console.error(name, msg);
  };

  /** Override myself */
  Interpreter = new Interpreter();