(function() { "use strict"

  /**
   * The Evaluator
   *
   * @class EVAL
   * @static
   */
  ENGEL.EVAL = function() {

    var self = this;

    /** Switch between variable and function expressions */
    this.switcher = null;

    /** Function names globally visible */
    this.functionName = null;

    this.Functions = {
      LX_PLUS: function(c) {
        return self[self.switcher](c.left, self.functionName) + self[self.switcher](c.right, self.functionName);
      },
      LX_MINUS: function(c) {
        return self[self.switcher](c.left, self.functionName) - self[self.switcher](c.right, self.functionName);
      },
      LX_MULT: function(c) {
        return self[self.switcher](c.left, self.functionName) * self[self.switcher](c.right, self.functionName);
      },
      LX_DIV: function(c) {
        return self[self.switcher](c.left, self.functionName) / self[self.switcher](c.right, self.functionName);
      },
      LX_EQ: function(c) { 
        return self[self.switcher](c.left, self.functionName) == self[self.switcher](c.right, self.functionName);
      },
      LX_NEQ: function(c) { 
        return self[self.switcher](c.left, self.functionName) != self[self.switcher](c.right, self.functionName);
      },
      LX_LW: function(c) { 
        return self[self.switcher](c.left, self.functionName) < self[self.switcher](c.right, self.functionName);
      },
      LX_GR: function(c) { 
        return self[self.switcher](c.left, self.functionName) > self[self.switcher](c.right, self.functionName);
      },
      LX_LWE: function(c) { 
        return self[self.switcher](c.left, self.functionName) <= self[self.switcher](c.right, self.functionName);
      },
      LX_GRE: function(c) { 
        return self[self.switcher](c.left, self.functionName) >= self[self.switcher](c.right, self.functionName);
      },
      LX_AND: function(c) {
        var result = self[self.switcher](c.left, self.functionName);
        if (!result) return result;
        return self[self.switcher](c.right, self.functionName);
      },
      LX_OR: function(c) {
        var result = self[self.switcher](c.left, self.functionName);
        if (result) return result;
        return self[self.switcher](c.right, self.functionName);
      }
    };

    /** Pre defined functions */
    this.preDefFunc = {
      display: ["log", "print"],
      /** Math api */
      math: ["asin", "sin", "acos", "cos", "atan", "atan2", "tan", "sqrt", "cbrt", "exp", "random", "min", "max", "round", "floor", "ceil"],
      json: ["JSON"]
    };

  };

  ENGEL.EVAL.prototype = ENGEL;

  /**
   * Eval an if statement
   *
   * @method evalIfStatement
   * @static
   */
  ENGEL.EVAL.prototype.evalIfStatement = function(ast) {
    /** If condition is true, execute the if statements body */
    console.log(this.interpretExpression(ast.condition));
    if (this.interpretExpression(ast.condition)) {
      for (var ii = 0; ii < ast.body.length; ++ii) {
        this.evaluate(ast.body[ii]);
      }
    }
  };

  /**
   * Interpret Expression
   *
   * @method interpretExpression
   * @static
   */
  ENGEL.EVAL.prototype.interpretExpression = function(ast) {

    if (!isNaN(ast)) return ast;

    if (!ast) return void 0;

    this.switcher = "interpretExpression";

    if (ast.Identifier) {
      var value = ENGEL.STACK.getValue(ast.Identifier.value);
      if (value || value === "" || value === 0) return value;
      return 0;
    }

    if (ast.Literal) {
      return ast.Literal.value;
    }

    if (this.Functions[ast.operator]) {
      return this.Functions[ast.operator](ast);
    }

    return void 0;

  };

  /**
   * Handle Variables
   *
   * @method evalVariable
   * @static
   */
  ENGEL.EVAL.prototype.evalVariable = function(node) {

    var mode = node.kind;

    var nodes = node.declarations || node.expressions;

    var declared = null;

    var ii = 0;

    for (; ii < nodes.length; ++ii) {

      var variable = nodes[ii];

      /** Push Variable into Stack */
      if (variable.id.type === "Identifier") {
        if (ENGEL.STACK.VAR[variable.id.name]) {
          if (ENGEL.STACK.VAR[variable.id.name].type === "const") {
            console.info("Warning: " + variable.id.name + " is defined as a constant!");
            break;
          }
          if (ENGEL.STACK.VAR[variable.id.name].type === "var" && ENGEL.STACK.VAR[variable.id.name].type !== mode) {
            console.info("Warning: " + variable.id.name + " has not the correct type!");
            break;
          }
        } else {
          /** Initialise stack variable */
          ENGEL.STACK.VAR[variable.id.name] = {
            name: variable.id.name,
            type: mode,
            value: {
              value: null,
              type: null,
              raw: null
            }
          };
        }

      }

      /** Assign expression to variable */
      if (variable.init) {

        var rawValue;

        if (variable.init.BinaryExpression) {
          rawValue = this.interpretExpression(variable.init.BinaryExpression);
          ENGEL.STACK.update(variable.id.name, {
            raw: rawValue,
            value: this.TypeMaster(rawValue).value,
            type: typeof rawValue
          });
          declared = variable.id.name;
        } else if (variable.init.AssignmentExpression) {
          rawValue = this.interpretExpression(variable.init.AssignmentExpression);
          ENGEL.STACK.update(variable.id.name, {
            raw: rawValue,
            value: this.TypeMaster(rawValue).value,
            type: typeof rawValue
          });
          declared = variable.id.name;
        } else if (variable.init.ExpressionStatement) {
          rawValue = this.evalExpression(variable.init.ExpressionStatement);
          declared = variable.id.name;
          return;
        } else if (variable.init.SingleCallExpression) {
          rawValue = this.evalExpression(variable.init.SingleCallExpression);
          declared = variable.id.name;
        }

      }

    }

    /** Got multiple declarations, inherit parent values */
    if (ii > 1e0 && declared) {

      for (var kk = 0; kk < ii; ++kk) {

        var childValue = ENGEL.STACK.VAR[nodes[kk].id.name];

        if (childValue) {

          /** Variable declarations */
          if (!childValue.value.raw && !childValue.value.value && !childValue.value.type) {
            childValue.value = ENGEL.STACK.VAR[declared].value;
          }
          /** Variable assignments */
          else if (childValue.value.raw &&
            childValue.value.value &&
            childValue.value.type) {
            childValue.value = ENGEL.STACK.VAR[declared].value;
          }

        }

      }

    }

  };

  /**
   * Handle expressions
   *
   * @method evalDirectiveExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalDirectiveExpression = function(node) {

    ENGEL.STACK.createVariable("undefined");

    var rawValue = this.interpretExpression(node.init);

    ENGEL.STACK.update("undefined", {
      raw: rawValue,
      value: this.TypeMaster(rawValue).value,
      type: typeof rawValue
    });

  };

  /**
   * Handle expressions
   *
   * @method evalExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalExpression = function(node) {

    var self = this;

    var callee = node.expression.callee;

    var args = node.arguments;

    /** Built in display functions call */
    if (this.preDefFunc.display.indexOf(callee.name) >= 0) {

      var logArray = [];

      for (var ii = 0; ii < args.length; ++ii) {

        /** Has to be defined in the stack */
        if (args[ii].type === "Identifier") {
          logArray.push(self.TypeMaster(ENGEL.STACK.getValue(args[ii].value)).value);
        } else if (args[ii].type === "Literal") {
          logArray.push(self.TypeMaster(args[ii].value).value);
        }

      }

      if (logArray && logArray.length) {
        Function.prototype.apply.call(console.log, console, logArray);
      }

      /** Math function call */
    } else if (this.preDefFunc.math.indexOf(callee.name) >= 0) {

      /** Special case random */
      var result;

      var logArray = [];

      for (var ii = 0; ii < args.length; ++ii) {

        /** Has to be defined in the stack */
        if (args[ii].type === "Identifier") {
          logArray.push(self.TypeMaster(ENGEL.STACK.getValue(args[ii].value)).value);
        } else if (args[ii].type === "Literal") {
          logArray.push(self.TypeMaster(args[ii].value).value);
        }

      }

      if (Math[callee.name]) {
        if (logArray && logArray.length) {
          result = Math[callee.name].apply(null, logArray);
        } else result = Math[callee.name].apply(null, null);
      }

      if (node.variableCall) {
        if (ENGEL.STACK.get(node.variableCall)) {
          ENGEL.STACK.update(node.variableCall, {
            raw: result,
            value: self.TypeMaster(result).value,
            type: typeof result
          });
        }
      }

    /** JSON call */
    } else if (this.preDefFunc.json.indexOf(callee.name) >= 0) {

      var result;

      var fetchValue = self.TypeMaster(node.expression.init.value).value;

      /** Search for live cell json data */
      if (CORE.Cells.Live[node.arguments[0].value]) {
        if (CORE.Cells.Live[node.arguments[0].value].Data[fetchValue]) result = CORE.Cells.Live[node.arguments[0].value].Data[fetchValue];
      }

      if (node.variableCall) {
        if (ENGEL.STACK.get(node.variableCall)) {
          ENGEL.STACK.update(node.variableCall, {
            raw: result,
            value: self.TypeMaster(result).value,
            type: typeof result
          });
        }
      }

    }

  };

  /**
   * Evaluate AST
   *
   * @method evaluate
   * @static
   */
  ENGEL.EVAL.prototype.evaluate = function(ast) {

    var self = this;

    var _evaluate = function(node) {

      if (node.DirectiveBinaryExpression) {
        self.evalDirectiveExpression(node.DirectiveBinaryExpression);
      } else if (node.VariableDeclaration) {
        self.evalVariable(node.VariableDeclaration);
      } else if (node.AssignmentExpression) {
        self.evalVariable(node.AssignmentExpression);
      } else if (node.ExpressionStatement) {
        self.evalExpression(node.ExpressionStatement);
      } else if (node.IfStatement) {
        self.evalIfStatement(node.IfStatement);
      }

    };

    if (ast.children) {

      for (var ii = 0; ii < ast.children.length; ++ii) {

        var node = ast.children[ii];

        if (!node) return;

        _evaluate(node);

      }

    } else _evaluate(ast);

  };

}).call(this);