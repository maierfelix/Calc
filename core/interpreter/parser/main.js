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

    return ({ ExpressionStatement });

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
        Identifier: block[0].value
      },
      arguments: []
    };

    this.shift();

    /** Read arguments of CONNECT function */
    if (this.currentBlock.type === "LX_CONNECT") {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readFunctionArguments();
    /** Read arguments of Math function call */
    } else if (this.MathFunctions.indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readFunctionArguments();
    /** Read arguments of JSON function */
    } else if (this.currentBlock.type === "LX_JSON") {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readFunctionArguments();
      /** Create array of following json operations */
      CallExpression.append = [];
      /** Delete right parenthese */
      this.shift();
      /** Delete first JSON call method */
      this.shift();
      CallExpression.append = this.readFunctionArguments();
    }

    this.shift();
    this.shift();

    return ({ CallExpression });

  };

  /**
   * Read a functions arguments
   *
   * @method readFunctionArguments
   * @return {array} function arguments array
   * @static
   */
  ENGEL.PARSER.prototype.readFunctionArguments = function() {

    /** Shorter syntax */
    var block = this.block;

    var parentArray = [];
    var array = [];
    var argumentArray = [];

    /** To ignore parentheses */
    var jumper = 0;

    /** Empty arguments */
    if (this.emptyArguments()) return ([]);

    while (block[0]) {

      /** Function call inside the arguments */
      if ((this.ReservedFunctions.concat(this.MathFunctions)).indexOf(block[0].type) >= 0) {
        parentArray.push(this.functionAssignment());
        this.shift();
        block.shift();
      }

      if (block[0].type === "LX_LPAR") jumper++;
      else if (block[0].type === "LX_RPAR") jumper--;

      if (["LX_COMMA", "LX_JSON_CALL"].indexOf(block[0].type) >= 0) {
        parentArray.push(array);
        array = [];
      } else if (["LX_RPAR", "LX_SEMIC"].indexOf(block[0].type) >= 0) {
        if (jumper <= 0) {
          parentArray.push(array);
          jumper = 0;
          break;
        }
      }

      if (["LX_COMMA", "LX_JSON_CALL"].indexOf(block[0].type) <= -1) {
        array.push(block[0]);
      }

      block.shift();

    }

    for (var ii = 0; ii < parentArray.length; ++ii) {

      /** Default argument block */
      if (!parentArray[ii].CallExpression) {

        this.block = parentArray[ii];
        this.shift();

        /** Add semicolon the end */
        this.addSemicolon();

        /** Generate AST of function parameters */
        argumentArray.push(this.ruleExpression());

      /** Function call inside the arguments, already parsed */
      } else argumentArray.push(parentArray[ii]);

    }

    this.block = block;

    return (argumentArray);

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
        this.shift();
        if (this.block[0].type === "LX_RPAR") {
          this.shift();
          this.shift();
          return (true);
        }
      }
    }

    return (false);

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