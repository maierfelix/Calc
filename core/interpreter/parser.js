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
    var variable = block[0];

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

    /** Delete variable block */
    if (block[0].type === "LX_VAR") {
      /** Assign variable name */
      directScope.id.name = block[0].value;
      block.shift();
    }

    /** Variable assignment starts */
    if (block[0] && block[0].type === "LX_ASSIGN") {

      /** Delete variable assignment block */
      block.shift();
      /** Add semicolon the end */
      this.addSemicolon();

      this.shift();

      directScope.init = {
        AssignmentExpression: this.ruleExpression()
      };

    }

    return (node);

  };

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

    while (this.accept(["LX_PLUS", "LX_MINUS", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE", "LX_AND", "LX_OR"])) {
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

    node = this.ruleFactor();

    /** Check for a following calculation */
    while (this.accept(["LX_MULT", "LX_DIV", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE", "LX_AND", "LX_OR"])) {
      /** Left */
      parent = {
        operator: this.currentBlock.type,
        left: node
      };
      /** Right */
      this.shift();
      parent.right = this.ruleFactor();
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
      this.shift();
    /** Bracket calculation */
    } else if (this.accept("LX_LPAR")) {
      this.shift();
      /** Calculate inner bracket */
      node = this.ruleExpression();
      if (this.expect("LX_RPAR")) this.shift();
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

  /**
   * Add a semicolon to a block end
   *
   * @method addSemicolon
   * @static
   */
  ENGEL.PARSER.prototype.addSemicolon = function() {

    this.block.push({
      type: "LX_SEMIC",
      value: ","
    });

  };

}).call(this);