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

    /** Make includes working */
    this.vm.realm.global.console = console;

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
  Interpreter.prototype.lex = function(input) {

    var originalInput = input;

    var Tokens = [];

    /** Precompile lexical regular expressions */
    var KeyWords = [
      { name: "LX_HASH",   rx: /^\#(.*)\#/ }
    ];

    /** Precompile regex */
    var blank = /^[ \t\v\f]+/;

    /** Precompile regex */
    var notBlank = /^\S+/;

    /** Precompile regex */
    var lineBreak = /^[\r\n]+/;

    /** Is blank */
    var isBlank = function() { return arguments[0e0].match(blank); };

    /** Is not blank */
    var isNotBlank = function() { return arguments[0e0].match(notBlank); };

    /** Is line break */
    var isLineBreak = function() { return arguments[0e0].match(lineBreak); };

    while (input) {

      /** Ignore blanks */
      var match = isLineBreak(input) || isBlank(input);

      for (var ii = 0e0; !match && ii < KeyWords.length; ++ii) {

        /** Matches with a keyword regex */
        if (match = input.match(KeyWords[ii].rx)) {

          Tokens.push({
            type:  KeyWords[ii].name,
            value: match[0].trim()
          });

        }

      }

      /** Continue if stream goes on */
      if (match && match[0]) input = input.substring(match[0].length);
      else break;

    }

    for (var ii = 0; ii < Tokens.length; ++ii) {
      Tokens[ii] = Tokens[ii].value.replace(/#/g, "").trim();
      originalInput = originalInput.substring(originalInput.indexOf("\n") + 1);
    }

    originalInput = originalInput.replace(/^\s+|\s+$/g,"");

    Tokens.shift();
    Tokens.pop();
 
    return([Tokens[0], Tokens[1], Tokens[2], originalInput]);

  };

  /**
   * Register a new module
   *
   * TODO: Make includes not dependent of input order
   *
   * @param {string} [code] Code of the module
   * @method registerModule
   * @static
   */
  Interpreter.prototype.registerModule = function(code) {

    var included = [];

    var lexed = this.lex(code);

    var name = lexed[0];

    var description = lexed[1];

    var includes = lexed[2];

    code = lexed[3];

    if (!this.modules[name]) {
      this.modules[name] = {
        code: code,
        description: description
      }
    }

    if (includes) {
      includes = includes.replace("include", "");
      includes = (/<(.*?)>/g).exec(includes)[1];
      includes = includes.split(",");
      for (var ii = 0; ii < includes.length; ++ii) {
        includes[ii] = includes[ii].trim();
        included.push(includes[ii]);
      }
    }

    if (included.length) {
      for (var ii = 0; ii < included.length; ++ii) {
        if (this.modules[included[ii]]) {
          this.modules[name].code = this.modules[included[ii]].code + this.modules[name].code;
        } else throw new Error(included[ii] + " doesn't exist!");
      }
    }

    return (this.modules[name].code);

  };

  /** Override myself */
  Interpreter = new Interpreter();