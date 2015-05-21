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
    if (this.block[0].type === "LX_VAR") return (this.variable());

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

    /** Save variable */
    var variable = block[0].type === "LX_VAR" ? block[0].value : "undefined";

    /** Delete variable block */
    if (block[0].type === "LX_VAR") block.shift();

    /** Variable assignment starts */
    if (block[0] && block[0].type === "LX_ASSIGN") {

      this.shift();

      /** Only shift, if we got no function call */
      if (this.ReservedFunctions.indexOf(block[0].type) <= -1) return (this.expressionAssignment(variable));

      /** Function call variable assignment */
      if (this.ReservedFunctions.indexOf(block[0].type) >= 0) return (this.functionAssignment(variable));

    }

  };

  /**
   * Create an variable expression assignment AST
   *
   * @method expressionAssignment
   * @return {object} expression Assignment AST
   * @static
   */
  ENGEL.PARSER.prototype.expressionAssignment = function() {

    /** Shorter syntax */
    var block = this.block;

    /** Variable AST template */
    var node = {
      AssignmentExpression: {
        id: {
          type: "Identifier",
          name: ""
        },
        init: null,
        kind: "var"
      }
    };

    /** Direct scope for shorter syntax */
    var directScope = node.AssignmentExpression;

    /** Update variable to update value */
    directScope.id.name = arguments[0];

    /** Add semicolon the end */
    if (block[block.length - 1] && 
      block[block.length - 1].type !== "LX_SEMIC") this.addSemicolon();

    this.currentBlock = block.shift();

    directScope.init = {
      AssignmentExpression: this.ruleExpression()
    };

    return (node);

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

    console.log(block[0]);

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