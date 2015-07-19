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
   * Create an term expression AST
   *
   * @method ruleTerm
   * @return {object} term AST
   * @static
   */
  ENGEL.PARSER.prototype.ruleArguments = function() {

    var node;
    var parent;

    var name = this.currentBlock.value;

    this.shift();

    node = this.readArgs();

    /** Left */
    var CallExpression = {
      CallExpression: {
        arguments: node,
        callee: { Identifier: name }
      }
    };

    return (CallExpression);

  };
