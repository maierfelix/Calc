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

  var root = this;

  /** Static namespace class */
  var ENGEL = ENGEL || {};

      ENGEL.prototype = ENGEL;

      ENGEL.prototype.constructor = ENGEL;

  /**
   * Initialise lexer, parser, evaluator
   *
   * @method init
   * @static
   */
  ENGEL.prototype.init = function() {

    this.Lexer = new ENGEL.LEXER();

    this.Parser = new ENGEL.PARSER();

    this.Evaluator = new ENGEL.EVAL();

  };

  /**
   * String interpretation procedure
   *
   * @method interpret
   * @return {object} STACK
   * @static
   */
  ENGEL.prototype.interpret = function(stream) {

    //this.currentSheet = sheet;

    /** Lexical analysis */
    this.lexed = this.Lexer.lex(stream);

    //for (var ii = 0; ii < this.lexed.tokens.length; ++ii) console.log(this.lexed.tokens[ii]);

    /** Generate AST */
    this.ast = this.Parser.parse(this.lexed.tokens);

    console.log(this.ast);

    /** Evaluate the AST */
    this.Evaluator.evaluate(this.ast);

    return ({
      Stack: ENGEL.STACK,
      Variables: this.lexed.variables
    });

  };

  /** Assign it global */
  root.ENGEL = ENGEL;