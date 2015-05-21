/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */
(function() { "use strict"

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
    this.ReservedFunctions = ["LX_CONNECT"];

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

      /** Only shift, if we got no function call */
      if (this.ReservedFunctions.indexOf(block[0].type) <= -1) {
        directScope.init = this.expressionStatement();
        return (node);
      }

      /** Function call variable assignment */
      if (this.ReservedFunctions.indexOf(block[0].type) >= 0) {
        directScope.init = this.functionAssignment();
        return (node);
      }

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

    /** Direct scope for shorter syntax */
    var directScope = node.AssignmentExpression;

    /** Call expression template */
    directScope.init = {
      CallExpression: {
        callee: {
          Identifier: block[0].value
        },
        arguments: []
      }
    };

  };

  /**
   * Add a semicolon to a block end
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

}).call(this);