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
   * Handle expressions
   *
   * @method evalExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalExpression = function(node, name) {

    var self = this;

    var callee = node.callee;

    var args = node.arguments;

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
      if (!CORE.Cells.Live[name]) CORE.registerLiveCell(name);

      /** Check if live cell got registered, if yes update its url */
      if (CORE.Cells.Live[name]) {
        CORE.Cells.Live[name].Url = urlValue;
        CORE.Cells.Live[name].RefreshTime = timeValue;
      }

      CORE.Awakener.evalLive();

    /** JSON */
    } else if (this.preDefFunc.json.indexOf(callee.Identifier) >= 0) {

      /** Get variable to fetch data from */
      var dataTarget = node.arguments[0].Identifier.value;

      /** Data variable */
      var result = null;

      /** Search for live cell json data */
      if (CORE.Cells.Live[dataTarget]) {
        /** Compile appended JSON pipeline */
        for (var ii = 0; ii < node.append.length; ++ii) {
          node.append[ii] = this.interpretExpression(node.append[ii]);
        }
        if (CORE.Cells.Live[dataTarget].Data) {
          result = this.readJSONTree(CORE.Cells.Live[dataTarget].Data, node.append);
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
    if (data[index[0]] !== "undefined" || data[index[0]] !== "null") {
      value = index.shift();
      if (index.length >= 1) return (this.readJSONTree(data[value], index));
    }

    return (data[value]);

  };

}).call(this);