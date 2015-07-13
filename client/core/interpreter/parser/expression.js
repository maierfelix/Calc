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
   * Create an expression AST
   *
   * @method ruleExpression
   * @return {object} expression AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleExpression = function() {

    var parent;
    var node;

    if (!this.accept("LX_MINUS")) {
      if (this.accept("LX_PLUS")) {
        this.shift();
      } else {
        node = this.ruleTerm();
      }
    }

    if (this.accept("LX_IF")) {
      return (this.ruleIf());
    }

    while (this.accept(["LX_PLUS", "LX_MINUS", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE", "LX_AND", "LX_OR"])) {
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.ruleTerm();
      node = parent;
    }

    return (node);

  };

  /**
   * Create an if statement expression AST
   *
   * @method ruleIf
   * @return {object} if AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleIf = function() {

    var node = {
      IfStatement: {}
    };

    if (this.accept("LX_IF")) {
      node.IfStatement.operator = this.currentBlock.type;
      this.shift();
      if (!this.expect("LX_LPAR")) return void 0;
      node.IfStatement.arguments = this.readIfArguments();
      this.shift();
    }

    return (node);

  };

  /**
   * Create an if arguments AST
   *
   * @method readIfArguments
   * @return {object} ifArguments AST
   * @static
   */
  ENGEL.PARSER.prototype.readIfArguments = function() {

    var args = [];

    var argument = [];

    /** Read if argument blocks */
    while (this.block && this.block[0]) {
      if (["LX_COMMA", "LX_RPAR"].indexOf(this.block[0].type) <= -1) {
        argument.push(this.block[0]);
      } else if (argument.length) {
        args.push(argument);
        argument = [];
      }
      this.shift();
    }

    for (var ii = 0; ii < args.length; ++ii) {
      this.block = args[ii];
      this.block.unshift(this.block[0]);
      this.shift();
      this.shift();
      this.addSemicolon();
      args[ii] = this.ruleExpression();
    }

    return args;

  };

  /**
   * Create an term expression AST
   *
   * @method ruleTerm
   * @return {object} term AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleTerm = function() {

    var node;
    var parent;

    node = this.ruleFactor();

    /** Check for a following calculation */
    while (this.accept(["LX_POW", "LX_MULT", "LX_DIV"])) {
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.ruleFactor();
      node = parent;
    }

    return (node);

  };

  /**
   * Create a single factor expression AST
   *
   * @method ruleFactor
   * @return {object} factor AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleFactor = function() {

    var node;
    var mode;

    /** Numbers, variables and strings are allowed */
    if (this.accept(["LX_NUMBER", "LX_VAR", "LX_STRING"])) {
      /** Handle numbers and strings the same */
      if (["LX_NUMBER", "LX_STRING"].indexOf(this.currentBlock.type) >= 0) mode = "Literal";
      /** Variable */
      else mode = "Identifier";
      node = {};
      node[mode] = {
        value: ENGEL.TypeMaster(this.currentBlock.value).value
      };
      /** Range */
      if (this.block[0].type === "LX_COLON") {
        node = {
          Range: {
            value: this.currentBlock.value + this.block[0].value + this.block[1].value
          }
        };
        this.shift();
        this.shift();
      }
      this.shift();
    /** Bracket calculation */
    } else if (this.accept("LX_LPAR")) {
      this.shift();
      /** Calculate inner bracket */
      node = this.ruleExpression();
      if (this.expect("LX_RPAR")) this.shift();
    /** Operator precedence */
    } else if (this.accept(["LX_UPLUS", "LX_UMINUS"])) {
      node = {
        operator: this.currentBlock.type
      };
      this.shift();
      /** Calculate inner bracket */
      node.init = this.ruleFactor();
    /** Function call */
    } else if (this.accept(this.ReservedFunctions.concat(this.MathFunctions))) {
      /** Add math function name to block start */
      this.block.unshift(this.currentBlock);
      node = this.functionAssignment();
    } else if (this.accept(this.Functions.concat(this.Functions))) {
      /** Add function name to block start */
      this.block.unshift(this.currentBlock);
      node = this.functionAssignment();
    }

    return (node);

  };

  /**
   * Accept a block or not
   *
   * @method accept
   * @static
   */
  ENGEL.PARSER.prototype.accept = function(type) {

    if (!this.block[0]) return (false);

    if (typeof type === "string") {
      /** Single accept argument */
      if (this.currentBlock && this.currentBlock.type === type) return (true);
    } else {
      /** Loop through the type array */
      for (var ii = 0; ii < type.length; ++ii) {
        if (this.currentBlock && this.currentBlock.type === type[ii]) return true;
      }
    }

    return (false);

  };

  /**
   * Shift the current block
   *
   * @method shift
   * @static
   */
  ENGEL.PARSER.prototype.shift = function() {

    this.currentBlock = this.block.shift();

  };

  /**
   * Expect a specific block
   *
   * @method expect
   * @static
   */
  ENGEL.PARSER.prototype.expect = function(type) {

    if (this.accept(type)) return (true);

    return (false);

  };