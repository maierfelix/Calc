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
    this.Functions = ["LX_SUM"];

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
        Identifier: block[0].value
      },
      arguments: []
    };

    this.shift();

    /** Read arguments of Math function call */
    if (this.MathFunctions.indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readArguments();
    }

    /** Read arguments of Function call */
    else if (this.Functions.indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readArguments();
    }

    /** Read arguments of if expression */
    else if ("LX_IF".indexOf(this.currentBlock.type) >= 0) {
      if (block[0].type === "LX_LPAR") CallExpression.arguments = this.readArguments();
    }

    this.shift();

    return {CallExpression: CallExpression};

  };

  /**
   * Read arguments
   *
   * @method readArguments
   * @return {array} function arguments array
   * @static
   */
  ENGEL.PARSER.prototype.readArguments = function() {

    /** Shorter syntax */
    var block = arguments[0] || this.block;

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
        if (this.currentBlock && this.currentBlock.type === "LX_RPAR") {
          this.shift();
        }
      }

      /** Function call inside the arguments */
      else if ((this.Functions.concat(this.Functions)).indexOf(block[0].type) >= 0) {
        parentArray.push(this.functionAssignment());
        if (this.currentBlock && this.currentBlock.type === "LX_RPAR") {
          this.shift();
        }
      }

      /** Function call inside the arguments */
      else if (block[0].type === "LX_IF") {
        parentArray.push(this.functionAssignment());
        if (this.currentBlock && this.currentBlock.type === "LX_RPAR") {
          this.shift();
        }
      }

      if (!block[0]) break;

      if (block[0].type === "LX_LPAR") jumper++;
      else if (block[0].type === "LX_RPAR") jumper--;

      if (["LX_COMMA"].indexOf(block[0].type) >= 0) {
        parentArray.push(array);
        array = [];
      } else if (["LX_RPAR"].indexOf(block[0].type) >= 0) {
        if (jumper <= 0) {
          parentArray.push(array);
          jumper = 0;
          break;
        } else {
          array.push(block[0]);
        }
      } else {
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
      } else {
        argumentArray.push(parentArray[ii]);
      }

    }

    this.block = block;
    this.shift();

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