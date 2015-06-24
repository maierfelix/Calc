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

    var self = this;

    this.vm = new Vm();

    /** Allow access to the spreadsheet */
    this.vm.realm.global.SpreadSheet = SpreadSheet;

    /** Make setInterval working */
    this.vm.realm.global.setInterval = function(cb, time) {
      if (typeof time === "number" && time >= 0) {
        setInterval(function() {
          if (self.vm.killed) return;
          cb();
        }, time);
      }
    };

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

    this.vm.eval(arguments[0]);

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