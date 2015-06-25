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

    this.modules = {};

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
   * @param {string} [code] Code to be executed
   * @method run
   * @static
   */
  Interpreter.prototype.run = function(code) {

    this.vm.eval(arguments[0]);

  };

  /**
   * Lexical analysis of a modules code
   * Tries to retreive the modules name
   *
   * @param {string} [code] Code
   * @method lex
   * @static
   */
  Interpreter.prototype.lex = function(code) {

    var headerName = "";

    var headerDescription = "";

    var poundRegex = /\#(.*)\#/g;

    var lineBreak = /^[\r\n]+/;

    var match = code.match(poundRegex);

    var headerIntro = "";

    var array = [];

    var length = 0;

    /** Get first line */
    while (code && !code.match(lineBreak)) {
      headerIntro += code[0];
      code = code.substring(1);
    }

    var ii = 0;

    /** Get first line inside */
    while (code && code.length) {
      match = code.match(poundRegex);
      if (match) {
        if (match[0] === headerIntro) {
          code = code.substring(headerIntro.length);
          ii++;
        } else {
          name = match[0].replace(/#/g, "");
        }
      }
      if (ii >= 2) break;
      if (!headerName && ii === 0) {
        headerName = name;
      }
      if (!headerDescription && ii === 1) {
        headerDescription = name;
      }
      code = code.substring(1);
    }

    code = code.substring(code.indexOf("\n"));
    code = code.replace(/^\s+|\s+$/g,"");

    return ([headerName.trim(), headerDescription.trim(), code]);

  };

  /**
   * Register a new module
   *
   * @param {string} [code] Code of the module
   * @method registerModule
   * @static
   */
  Interpreter.prototype.registerModule = function(code) {

    var lexed = this.lex(code);

    var name = lexed[0];

    var description = lexed[1];

    code = lexed[2];

    if (!this.modules[name]) {
      this.modules[name] = {
        code: code,
        description: description
      }
    }

    return (this.modules[name].code);

  };

  /** Override myself */
  Interpreter = new Interpreter();