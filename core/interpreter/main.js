(function() { "use strict"

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
   * Interpret a string
   *
   * @method interpret
   * @static
   */
  ENGEL.prototype.interpret = function(stream) {

    ENGEL.STACK.TIMER.start = performance.now();

    this.lexed = this.Lexer.lex(stream);

    this.ast = this.Parser.parse(this.lexed);

    this.Evaluator.evaluate(this.ast);

    ENGEL.STACK.TIMER.end = performance.now();

    ENGEL.STACK.TIMER.duration = ENGEL.STACK.TIMER.end - ENGEL.STACK.TIMER.start;

    return ENGEL.STACK;

  };

  /**
   * Detect type of input data, return converted data and type declaration
   *
   * @method TypeMaster
   * @return {Object}
   * @static
   */
  ENGEL.prototype.TypeMaster = function(data) {

    var object = {
      value: null,
      type: null,
      raw: data
    };

    object.value = data;

    /** Numeric */
    if (!isNaN(data)) {
      object.value = parseFloat(data);
    }

    /** String */
    else if (typeof data == "string" || (typeof data == "object" && data.constructor === String)) {
      object.value = String(data.replace(/"/g, ""));
    }

    object.type = typeof(object.value);

    return object;

  };

  /** Assign it global */
  root.ENGEL = ENGEL;

}).call(this);