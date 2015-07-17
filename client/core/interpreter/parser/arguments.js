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
   * Read arguments
   *
   * @method readArguments
   * @return {array} function arguments array
   * @static
   */
  ENGEL.PARSER.prototype.readArguments = function() {

    var block = arguments[0] || this.block;

    var argumentz = [];

    var args = [];

    var record = false;

    /** To ignore parentheses */
    var jumper = 0;

    /** Empty arguments */
    if (this.emptyArguments()) return ([]);

    while (block[0]) {

      if (this.currentBlock.type === "LX_MATH") {
        if (block[0].type === "LX_LPAR") {
          record = true;
        }
      }

      if (record && block[0].type === "LX_RPAR") {
        argumentz.push(this.parseArguments(args));
        args = [];
      }

      if (block[0].type === "LX_RPAR" && record) {
        record = false;
      }

      if (block[0].type === "LX_MATH") {
        if (block[0].type !== "LX_COMMA") {
          args.push(block[0]);
        }
        block.shift();
        argumentz.push(this.readArguments(block));
      }

      if (record && block[0]) {
        if (["LX_LPAR", "LX_RPAR"].indexOf(block[0].type) <= -1) {
          args.push(block[0]);
        }
      }

      block.shift();

    }

    return (argumentz[0]);

  };

  /**
   * Parse a argument
   *
   * @method parseArguments
   * @static
   */
  ENGEL.PARSER.prototype.parseArguments = function(block) {

    var args = [];

    var array = [];

    while (block[0]) {

      if (block[0].type !== "LX_COMMA") {
        array.push(block[0]);
      }

      if (block[0].type === "LX_COMMA" || block.length === 1) {
        args.push(this.injectBlock(array));
        array = [];
      }

      block.shift();

    }

    return (args);

  };

  /**
   * Inject a block array and auto parse it
   *
   * @method injectBlock
   * @static
   */
  ENGEL.PARSER.prototype.injectBlock = function(block) {

    var blockBackup = this.block.slice(0);

    this.block = block;

    this.shift();

    this.addSemicolon();

    var result = this.ruleExpression();

    this.block = blockBackup.slice(0);

    return (result);

  };

  /**
   * Check if function arguments are empty
   *
   * @method emptyArguments
   * @static
   */
  ENGEL.PARSER.prototype.emptyArguments = function() {

    if (this.block[0] && this.block[1]) {
      if (this.block[0].type === "LX_LPAR") {
        if (this.block[1].type === "LX_RPAR") {
          this.shift();
          this.shift();
          this.shift();
          return (true);
        }
      }
    }

    return (false);

  };