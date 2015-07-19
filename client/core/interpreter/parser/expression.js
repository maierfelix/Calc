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

    while (this.accept(["LX_PLUS", "LX_MINUS", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE"])) {
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

    /** Conditions */
    while (this.accept(["LX_OR", "LX_AND"])) {
      parent = node;
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.ruleExpression();
      node = parent;
    }

    return (node);

  };

  /**
   * Create an pow expression AST
   *
   * @method rulePow
   * @return {object} pow AST
   * @static
   */
  ENGEL.PARSER.prototype.rulePow = function() {

    var node;
    var parent;

    node = this.ruleFactor();

    /** Check for a following calculation */
    while (this.accept("LX_POW")) {
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.rulePow();
      node = parent;
    }

    return (node);

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

    node = this.rulePow();

    /** Check for a following calculation */
    while (this.accept(["LX_MULT", "LX_DIV"])) {
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.rulePow();
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
      node = this.ruleArguments();
    } else if (this.accept(this.Functions.concat(this.Functions))) {
      node = this.ruleArguments();
    } else if (this.accept("LX_IF")) {
      node = this.ruleIfArguments();
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