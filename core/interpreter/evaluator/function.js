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
  ENGEL.EVAL.prototype.evalExpression = function(node) {

    var self = this;

    var callee = node.callee;

    var args = node.arguments;

    if (this.preDefFunc.ajax.indexOf(callee.Identifier) >= 0) {

      var urlValue = "",
          timeValue = 0;

      /** Process url argument */
      urlValue = this.interpretExpression(node.arguments[0]);

      /** Process time argument */
      timeValue = this.interpretExpression(node.arguments[1]);

      /** Register live cell */
      if (!CORE.Cells.Live[node.variableCall]) CORE.registerLiveCell(node.variableCall);

      /** Check if live cell got registered, if yes update its url */
      if (CORE.Cells.Live[node.variableCall]) {
        CORE.Cells.Live[node.variableCall].Url = urlValue;
        CORE.Cells.Live[node.variableCall].RefreshTime = timeValue;
      }

      CORE.Awakener.evalLive();

    }

  };

}).call(this);