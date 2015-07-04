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

    /** Prevent module keyword */
    this.vm.realm.global.module = void 0;

    /** Make console working again */
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
  Interpreter.prototype.run = function() {

    /** Auto compile all modules */
    if (!arguments[0]) {
      for (var module in this.modules) {
        this.vm.eval(this.compileModule(module));
      }
    /** Compile a single module */
    } else {
      this.vm.eval(this.compileModule(arguments[0]));
    }

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

    var head = this.readHead(code);

    var name = head.name;

    var description = head.description;

    var imported = head["import"];

    var require = head.require;

    var newCode = head.code;

    if (!this.modules[name]) {
      this.modules[name] = new Interpreter.Module(newCode, description, imported);
    }

    if (require && require.length) {
      this.modules[name].require = require;
    }

    this.modules[name].original = code;

    return (this.modules[name].code);

  };

  /**
   * Compile a module
   *
   * @param {string} [name] Module name
   * @method compileModule
   * @static
   */
  Interpreter.prototype.compileModule = function(name) {

    var imported = this.modules[name]["import"];

    if (imported && imported.length) {
      var injectScripts = "";
      for (var ii = 0; ii < imported.length; ++ii) {
        if (this.modules[imported[ii]]) {
          injectScripts += this.modules[imported[ii]].code;
        } else throw new Error(imported[ii] + " doesn't exist!");
        this.modules[name].compiled = injectScripts + this.modules[name].code;
      }
    } else {
      this.modules[name].compiled = this.modules[name].code;
    }

    return (this.modules[name].compiled);

  };

  /**
   * Read a modules head and parse JSON from
   *
   * @param {string} [input] Code of the module
   * @method readHead
   * @static
   */
  Interpreter.prototype.readHead = function(input) {

    var Tokens = [];

    /** Precompile lexical regular expressions */
    var KeyWords = [
      { name: "LX_MODULE",   rx: /^(module)/ },
      { name: "LX_LBRAC",    rx: /^[\\{]+/   },
      { name: "LX_RBRAC",    rx: /^[\\}]+/   },
      { name: "LX_LHBRAC",   rx: /^\[.*?/    },
      { name: "LX_RHBRAC",   rx: /^\].*?/    },
      { name: "LX_SEMIC",    rx: /^[;]+/     },
      { name: "LX_COMMA",    rx: /^,/        },
      { name: "LX_COLON",    rx: /^[:]+/     },
      { name: "LX_NUMBER",   rx: /^[-]?[0-9]+(\.\d+[0-9]*)?/ },
      { name: "LX_BOOLEAN",  rx: /^(true|false)/ },
      { name: "LX_STRING",   rx: /^"(\\\\"|[^"])(.*?)"|'"'(\\\\'|[^'])*'"/ }
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

    var record = false;

    var headStream = "";

    while (input) {

      /** Ignore blanks */
      var match = isLineBreak(input) || isBlank(input);

      for (var ii = 0e0; ii < KeyWords.length; ++ii) {

        /** Matches with a keyword regex */
        if (match = input.match(KeyWords[ii].rx)) {

          /** Start recording */
          if (KeyWords[ii].name === "LX_LBRAC" && record === false && !Tokens.length) {
            record = true;
          }

          if (record) {
            Tokens.push({
              type:  KeyWords[ii].name,
              value: match[0].trim()
            });
            headStream += match[0];
          }

        }

      }

      /** Continue if stream goes on */
      if (match && match[0]) input = input.substring(match[0].length);
      else input = input.substring(1);

      if (record) {
        if (Tokens[Tokens.length - 1].type === "LX_SEMIC" &&
            Tokens[Tokens.length - 2].type === "LX_RBRAC") {
          break;
        } else if (Tokens[Tokens.length - 1].type === "LX_RBRAC") {
          break;
        }
      }

    }

    input = input.substring(input.indexOf("\n") + 1);
    input = input.substring(input.indexOf("\n") + 1);

    var json;

    try {
      json = JSON.parse(headStream);
    } catch(err) {
      throw new Error(err);
    }

    json.code = input;

    return (json);

  };

  /**
   * Module Class
   *
   * @param {string} [code] Code
   * @param {string} [description] Description
   * @param {array} [imported] Scripts to import
   * @class Module
   * @static
   */
  Interpreter.prototype.Module = function(code, description, imported) {

    this.code = code || null;

    this.description = description || null;

    this["import"] = imported || null;

    this.active = false;

    this.activation = null;

  };

  Interpreter.prototype.Module = Interpreter.Module;

  /** Override myself */
  Interpreter = new Interpreter();