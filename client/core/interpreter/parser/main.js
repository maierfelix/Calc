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
   * The Parser
   *
   * @class PARSER
   * @static
   */
  ENGEL.PARSER = function() {

    /** Global block object */
    this.block = null;

    /** Current block global block object */
    this.currentBlock = null;

    /** Reserved functions */
    this.ReservedFunctions = ["LX_CONNECT", "LX_JSON"];

    /** Math functions */
    this.MathFunctions = ["LX_MATH"];

    /** Functions */
    this.Functions = ["LX_SUM", "LX_COUNT", "LX_COUNTIF", "LX_BETWEEN", "LX_AVERAGE"];

  };

  ENGEL.PARSER.prototype = ENGEL;

  /**
   * Evaluate the token list and generate an AST from it
   *
   * @method parse
   * @return {object} AST
   * @static
   */
  ENGEL.PARSER.prototype.parse = function(input) {

    return (this.createAST(input));

  };

  /**
   * Create an AST
   *
   * @method createAST
   * @return {object} AST
   * @static
   */
  ENGEL.PARSER.prototype.createAST = function(block) {

    if (!block[0]) return (block);

    /** Global access */
    this.block = block;

    /** Detected variable */
    if (this.block[0].type === "LX_VAR") return(this.variable());

  };

  /**
   * Create an variable AST
   *
   * @method variable
   * @return {object} variable AST
   * @static
   */
  ENGEL.PARSER.prototype.variable = function() {

    /** Shorter syntax */
    var block = this.block;

    /** Variable assignment template */
    var node = {
      AssignmentExpression: {
        id: {
          type: "Identifier",
          name: block[0].value
        },
        init: null,
        kind: "var"
      }
    };

    /** Direct scope for shorter syntax */
    var directScope = node.AssignmentExpression;

    /** Save variable */
    var variable = block[0].type === "LX_VAR" ? block[0].value : "undefined";

    /** Delete variable block */
    if (block[0].type === "LX_VAR") block.shift();

    /** Variable assignment starts */
    if (block[0] && block[0].type === "LX_ASSIGN") {

      this.shift();

      directScope.init = this.expressionStatement();

      return (node);

    }

  };

  /**
   * Create an variable expression statement AST
   *
   * @method expressionStatement
   * @return {object} expression statement AST
   * @static
   */
  ENGEL.PARSER.prototype.expressionStatement = function() {

    /** Shorter syntax */
    var block = this.block;

    /** Variable assignment template */
    var ExpressionStatement = null;

    /** Add semicolon the end */
    if (block[block.length - 1] && 
      block[block.length - 1].type !== "LX_SEMIC") this.addSemicolon();

    this.shift();

    ExpressionStatement = this.ruleExpression();

    return {ExpressionStatement: ExpressionStatement};

  };

  /**
   * Create an variable function assignment AST
   *
   * @method functionAssignment
   * @return {object} function Assignment AST
   * @static
   */
  ENGEL.PARSER.prototype.functionAssignment = function() {

    /** Shorter syntax */
    var block = this.block;

    /** Call expression template */
    var CallExpression = {
      callee: {
        Identifier: block[0].type.replace("LX_", "")
      },
      arguments: []
    };

    this.shift();

    /** Read arguments of Math function call */
    if (this.MathFunctions.indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.ruleExpression();
    }

    /** Read arguments of Function call */
    else if (this.Functions.indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.ruleExpression();
    }

    /** Read arguments of if expression */
    else if (("LX_IF").indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.ruleExpression();
    }

    return {CallExpression: CallExpression};

  };

  /**
   * Automatic semicolon insertion
   *
   * @method addSemicolon
   * @static
   */
  ENGEL.PARSER.prototype.addSemicolon = function() {

    this.block.push({
      type: "LX_SEMIC",
      value: ";"
    });

  };