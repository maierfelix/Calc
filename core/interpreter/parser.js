(function() {
  "use strict"

  /**
   * The Parser
   *
   * @class PARSER
   * @static
   */
  ENGEL.PARSER = function() {

    /** Ast template */
    this.AST = [];

    /** Block object template */
    this.BLOCK = {
      type: "LX_BLOCK",
      children: []
    };

  };

  ENGEL.PARSER.prototype = ENGEL;

  /**
   * Evaluate the token list and generate a ast from it
   *
   * @method parse
   * @return {Object} AST
   * @static
   */
  ENGEL.PARSER.prototype.parse = function(input) {

    this.AST = [];

    this.BLOCK = {
      type: "LX_BLOCK",
      children: []
    };

    var self = this;

    var _selfBlock = this.BLOCK;

    var Statement;

    var _current;

    /** Build a block */
    var _buildBlock = function(data) {

      var _currentStatement,
        _validatedBlock;

      while (_currentStatement = _nextBlock()) {

        if (!_currentStatement || !_currentStatement.length) break;

        Statement = _currentStatement;

        _validatedBlock = _createAst(_currentStatement);

        if (_validatedBlock) _selfBlock.children.push(_validatedBlock);

      }

      return _selfBlock;

    };

    /** Go to the next block, break on semicolons */
    var _nextBlock = function() {

      var _block = [],
        _currentStatement;

      while (_currentStatement = input.shift()) {
        _block.push(_currentStatement);
        if (!_currentStatement || _currentStatement.type === "LX_SEMIC") break;
      }

      return _block;

    };

    var _accept = function(block) {
      if (!_current) return false;
      if (typeof block === "string") {
        if (_current.type === block) return true;
      } else {
        for (var ii = 0; ii < block.length; ++ii) {
          if (_current.type === block[ii]) return true;
        }
      }
      return false;
    };

    var _expect = function(block) {
      if (_accept(block)) return true;
      return false;
    };

    var _shift = function() {
      _current = Statement.shift();
    };

    var _ruleTerm = function() {

      var node,
        parent;

      node = _ruleFactor();

      while (_accept(["LX_MULT", "LX_DIV", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE", "LX_AND", "LX_OR"])) {
        parent = {
          operator: _current.type,
          left: node
        };
        _shift();
        parent.right = _ruleFactor();
        node = parent;
      }

      return node;
    };

    var _ruleFactor = function() {

      var node,
        mode;

      if (_accept(["LX_NUMBER", "LX_VAR", "LX_STRING"])) {
        if (["LX_NUMBER", "LX_STRING"].indexOf(_current.type) >= 0) mode = "Literal";
        else mode = "Identifier";
        node = {};
        node[mode] = {
          value: self.TypeMaster(_current.value).value
        };
        _shift();
      } else if (_accept("LX_LPAR")) {
        _shift();
        node = _ruleExpression();
        if (_expect("LX_RPAR")) _shift();
      }

      return node;

    };

    /** Rule expression */
    var _ruleExpression = function() {

      var parent,
        node;

      if (!_accept("LX_MINUS")) {
        if (_accept("LX_PLUS")) {
          _shift();
        } else {
          node = _ruleTerm();
        }
      }
      while (_accept(["LX_PLUS", "LX_MINUS", "LX_EQ", "LX_NEQ", "LX_GR", "LX_GRE", "LX_LW", "LX_LWE", "LX_AND", "LX_OR"])) {
        parent = {
          operator: _current.type,
          left: node
        };
        _shift();
        parent.right = _ruleTerm();
        node = parent;
      }

      return node;

    };

    /** Create ast from a block */
    var _createAst = function(block) {

      if (!block[0]) return block;

      /** If statement */
      if (["LX_IF"].indexOf(block[0].type) >= 0) {

        var _node = {
          IfStatement: {
            body: [],
            condition: {}
          }
        };

        var directScope = _node.IfStatement;

        block.shift();
        _shift();

        directScope.condition = _ruleExpression();

        var directbody = directScope.body;
        var bodyBlock = [];

        /** Combine function body block with the future block */
        bodyBlock = bodyBlock.concat(Statement);

        var futureBlock;

        /** Get the remaining function body, join it with the old body block */
        first: while (futureBlock = _nextBlock()) {

          bodyBlock = bodyBlock.concat(futureBlock);

          for (var ii = 0; ii < bodyBlock.length; ++ii) {
            if (bodyBlock[ii].type === "LX_RBRAC") break first;
          }

          if (!futureBlock || !futureBlock.length) break;

        }

        Statement = block = bodyBlock;

        var newBlocks = [];

        while (block[0] && block[0].type !== "LX_RBRAC") {

          if (block[0].type !== "LX_SEMIC") {
            newBlocks.push(block[0]);
          } else {
            newBlocks.push(block[0]);
            Statement = newBlocks;
            directbody.push(_createAst(newBlocks));
          }

          block.shift();

        }

        Statement = block;

      }

      /** Direct binary expression */
      else if (["LX_NUMBER"].indexOf(block[0].type) >= 0) {

        _shift();

        var _node = {
          DirectiveBinaryExpression: {
            init: _ruleExpression()
          }
        };

      }

      /** Variable Assignment START */
      else if (["LX_VAR", "LX_CONST"].indexOf(block[0].type) >= 0) {

        var variableCall = block[0];

        var _node = {
          AssignmentExpression: {
            expressions: [],
            kind: block[0].type === "LX_VAR" ? "var" : "const"
          }
        };

        var directScope = _node.AssignmentExpression.expressions;

        /** Assign multiple variable assignments */
        while (block[0] && ["LX_ASSIGN", "LX_SEMIC"].indexOf(block[0].type) < 0) {
 
          if (["LX_COMMA", "LX_SEMIC"].indexOf(block[0].type) < 0) {
            _node.AssignmentExpression.expressions.push({
              type: "SequenceExpression",
              id: {
                type: "Identifier",
                name: block[0].value
              },
              init: null
            });
          }

          block.shift();

        }

        if (block[0] && block[0].type === "LX_ASSIGN") {

          /** Assign a function */
          if (["LX_FUNC_CALL", "LX_MATH"].indexOf(block[1].type) >= 0) {

            block.shift();

            directScope[directScope.length - 1].init = {};

            directScope[directScope.length - 1].init = _createAst(block);
            directScope[directScope.length - 1].init.ExpressionStatement.variableCall = variableCall.value;

            /** Assign a binary expression */
          } else {

            block.shift();
            _shift();

            directScope[directScope.length - 1].init = {
              BinaryExpression: _ruleExpression()
            };

          }

        }

      }
      /** Variable Assignment END */

      /** Methods START */
      else if (["LX_PRINT", "LX_LOG", "LX_MATH"].indexOf(block[0].type) >= 0) {

        var variableCall = block[0];

        var _node = {
          ExpressionStatement: {
            expression: {
              type: "CallExpression",
              callee: {
                type: null,
                name: null
              }
            },
            arguments: [],
          }
        };

        var directScope = _node.ExpressionStatement;

        while (block[0]) {

          /** Log method detected */
          if (["LX_LOG"].indexOf(block[0].type) >= 0) {
            directScope.expression.callee.name = block[0].value;
            directScope.expression.callee.type = "Identifier";

            /** Math method detected */
          } else if (["LX_MATH"].indexOf(block[0].type) >= 0) {
            directScope.expression.callee.name = block[0].value;
            directScope.expression.callee.type = "Identifier";

            /** Push method arguments into the node array */
          } else if (["LX_VAR", "LX_NUMBER", "LX_STRING"].indexOf(block[0].type) >= 0) {
            if (block[0].type === "LX_VAR") block[0].type = "Identifier";
            else block[0].type = "Literal";
            directScope.arguments.push(block[0]);
          }

          block.shift();

        }

      }

      block.shift();

      _createAst(block);

      return _node;

    };

    return (_buildBlock(input));

  };

}).call(this);