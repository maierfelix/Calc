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
   * Handle expressions
   *
   * @method evalExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalExpression = function(node, name) {

    var self = this;

    var callee = node.callee;

    var args = node.arguments;

    callee.Identifier = callee.Identifier.toLowerCase();

    /** Built in functions */
    if (this.preDefFunc.func.indexOf(callee.Identifier) >= 0) {

      /** Final result */
      var result = null;

      /** Compiled arguments */
      var argumentArray = [];

      /** Compile arguments */
      for (var ii = 0; ii < args.length; ++ii) {
        if (!args[ii] || !args[ii].CallExpression) {
          argumentArray.push(this.interpretExpression(args[ii]));
        } else {
          /** Evaluate the function call, dont pass over a variable name to update! */
          argumentArray.push(this.evalExpression(args[ii].CallExpression));
        }
      }

      switch (callee.Identifier) {

        /** SUM */
        case "sum":
          /** Default arguments */
          if (typeof argumentArray[0] === "number") {
            result += argumentArray[0];
          } else {
            /** Seems like we got a range */
            if (argumentArray[0] instanceof Array) {
              result += NOVAE.$.getValueFromCoordinates(argumentArray[0]);
            }
          }
        break;

        /** COUNT */
        case "count":
          var length = 0;
          /** Require a range */
          if (argumentArray[0] instanceof Array) {
            var array = NOVAE.$.getSelectionCellProperty(argumentArray[0], "Content");
            for (var ii = 0; ii < array.length; ++ii) {
              /** Only count valid numbers */
              if (array[ii].value && array[ii].value !== "" && !isNaN(array[ii].value)) {
                length++;
              }
            }
          }
          result = length;
        break;

        /** BETWEEN */
        case "between":
          var a = argumentArray[0];
          var b = argumentArray[1];
          var c = argumentArray[2];
          /** Why not also support ranges? */
          if (typeof a === "number") {
            if (a <= b && a >= c) {
              result = true;
            } else {
              result = false;
            }
          }
        break;

        /** AVERAGE */
        case "average":
          var calc = [];
          /** Get content of range */
          var array = NOVAE.$.getSelectionCellProperty(argumentArray[0], "Content");
          for (var ii = 0; ii < array.length; ++ii) {
            /** Only count valid numbers */
            if (array[ii].value && array[ii].value !== "" && !isNaN(array[ii].value)) {
              calc.push(array[ii].value);
            }
          }
          if (calc.length) {
            result = Math.average(calc);
          }
          console.log(result);
        break;

      }

      /** Update variable in the stack */
      if (name && ENGEL.STACK.get(name)) {
        ENGEL.STACK.update(name, {
          raw: result,
          value: self.TypeMaster(result).value,
          type: typeof result
        });
      }

      return (result);

    }

    /** Math api */
    if (this.preDefFunc.math.indexOf(callee.Identifier) >= 0) {

      /** Final result */
      var result = null;

      /** Compiled arguments */
      var argumentArray = [];

      for (var ii = 0; ii < node.arguments.length; ++ii) {
        if (!node.arguments[ii] || !node.arguments[ii].CallExpression) {
          argumentArray.push(this.interpretExpression(node.arguments[ii]));
        } else {
          /** Evaluate the function call, dont pass over a variable name to update! */
          argumentArray.push(this.evalExpression(node.arguments[ii].CallExpression));
        }
      }

      /** Check if math api function exists */
      if (window.Math[callee.Identifier]) {

        if (argumentArray && argumentArray.length) {
          result = Math[callee.Identifier].apply(null, argumentArray);
        } else result = Math[callee.Identifier].apply(null, null);

      }

      /** Update variable in the stack */
      if (name && ENGEL.STACK.get(name)) {
        ENGEL.STACK.update(name, {
          raw: result,
          value: self.TypeMaster(result).value,
          type: typeof result
        });
      }

      return (result);

    }

    /** CONNECT */
    if (this.preDefFunc.ajax.indexOf(callee.Identifier) >= 0) {

      var urlValue = "",
          timeValue = 0;

      /** Process url argument */
      urlValue = this.interpretExpression(node.arguments[0]);

      /** Process time argument */
      timeValue = this.interpretExpression(node.arguments[1]);

      if (timeValue <= 0) {
        console.info(name + ": Invalid refresh time value, reset to " + 1000 + "!");
        timeValue = 1000;
      }

      /** Register live cell */
      if (!NOVAE.Cells.Live[name]) NOVAE.registerLiveCell(name);

      /** Check if live cell got registered, if yes update its url */
      if (NOVAE.Cells.Live[name]) {
        NOVAE.Cells.Live[name].Url = urlValue;
        NOVAE.Cells.Live[name].RefreshTime = timeValue;
      }

      NOVAE.Awakener.evalLive();

      return void 0;

    }

    /** JSON */
    if (this.preDefFunc.json.indexOf(callee.Identifier) >= 0) {

      /** Get variable to fetch data from */
      var dataTarget = node.arguments[0].Identifier.value;

      /** Data variable */
      var result = null;

      /** Search for live cell json data */
      if (NOVAE.Cells.Live[dataTarget]) {
        /** Compile appended JSON pipeline */
        for (var ii = 0; ii < node.append.length; ++ii) {
          node.append[ii] = this.interpretExpression(node.append[ii]);
        }
        if (NOVAE.Cells.Live[dataTarget].Data) {
          result = this.readJSONTree(NOVAE.Cells.Live[dataTarget].Data, node.append);
        }
      }

      /** Update variable in the stack */
      if (ENGEL.STACK.get(name)) {
        ENGEL.STACK.update(name, {
          raw: result,
          value: self.TypeMaster(result).value,
          type: typeof result
        });
      }

      return void 0;

    }

  };

  /**
   * Recursively read a json tree
   *
   * @method readJSONTree
   * @static
   */
  ENGEL.EVAL.prototype.readJSONTree = function(data, index) {

    var value = null;

    /** Check if property exists */
    if (data[index[0]] !== undefined || data[index[0]] !== null) {
      value = index.shift();
      if (index.length >= 1) return (this.readJSONTree(data[value], index));
    }

    return (data[value]);

  };