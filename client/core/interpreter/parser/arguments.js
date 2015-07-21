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
   * Create an argument array AST
   *
   * @method readArgs
   * @return {object} argument AST
   * @static
   */
  ENGEL.PARSER.prototype.readArgs = function() {

    var node = [];

    /** Empty arguments */
    if (this.block[0].type === "LX_RPAR") {
      this.shift();
      this.shift();
      return (node);
    }

    /** Read arguments */
    while (this.accept(["LX_LPAR", "LX_COMMA"])) {
      this.shift();
      node.push(this.ruleExpression());
    }

    this.shift();

    return (node);

  };

  /**
   * Create an argument array AST
   *
   * @method ruleArguments
   * @return {object} argument array AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleArguments = function() {

    var node;
    var parent;
    var name;

    /** Only optimize math function calls */
    if ((this.MathFunctions).indexOf(this.currentBlock.type) <= -1) {
      name = this.currentBlock.type.replace("LX_", "");
    } else {
      name = this.currentBlock.value;
    }

    this.shift();

    node = this.readArgs();

    var CallExpression = {
      CallExpression: {
        arguments: node,
        callee: { Identifier: name }
      }
    };

    return (CallExpression);

  };

  /**
   * Create an if argument array AST
   *
   * @method ruleIfArguments
   * @return {object} argument array AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleIfArguments = function() {

    var node;
    var parent;

    var name = {
      type: this.currentBlock.type,
      value: this.currentBlock.value
    };

    this.shift();

    node = this.readArgs();

    var IfStatement = {
      IfStatement: {
        arguments: node,
        operator: name.type
      }
    };

    return (IfStatement);

  };