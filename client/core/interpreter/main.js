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
   * @return {object}
   * @static
   */
  ENGEL.prototype.interpret = function(stream) {

    /** Lexical analysis */
    this.lexed = this.Lexer.lex(stream);

    /** Save tokens to prevent unnecessary lexical analysis in future */
    var tokens = this.lexed.tokens.slice(0);

    //for (var ii = 0; ii < this.lexed.tokens.length; ++ii) console.log(this.lexed.tokens[ii]);

    /** Generate AST */
    this.ast = this.Parser.parse(this.lexed.tokens);

    console.log(this.ast);

    /** Evaluate the AST */
    this.Evaluator.evaluate(this.ast);

    return ({
      Stack: ENGEL.STACK,
      Variables: this.lexed.variables,
      Tokens: tokens
    });

  };

  /**
   * Token interpretation procedure
   *
   * @method interpretTokens
   * @return {object}
   * @static
   */
  ENGEL.prototype.interpretTokens = function(tokens) {

    var tokenList = tokens.slice(0);

    /** Generate AST */
    this.ast = this.Parser.parse(tokenList);

    console.log(this.ast);

    /** Evaluate the AST */
    this.Evaluator.evaluate(this.ast);

    return ({ Stack: ENGEL.STACK });

  };

  /**
   * Transform tokens back to stream
   *
   * @method tokensToStream
   * @return {string}
   * @static
   */
  ENGEL.prototype.tokensToStream = function(tokens) {

    var stream = "";

    for (var ii = 0; ii < tokens.length; ++ii) {
      /** Ignore variable assignment */
      if (ii >= 1) {
        if (tokens[ii].type === "LX_SPACE") {
          stream += " ";
        } else if (tokens[ii].type === "LX_SHEET") {
          stream += tokens[ii].value + "::";
        } else {
          stream += tokens[ii].value;
        }
      }
    }

    return (stream);

  };

  /** Assign it global */
  root.ENGEL = ENGEL;