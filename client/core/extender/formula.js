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
   * Extend a formula
   *
   * @method extendFormulas
   * @static
   */
  NOVAE.Extender.prototype.extendFormulas = function(Cells, extendStack) {

    var tokens = extendStack[0].value.tokens;

    var length = tokens.length;

    var startNumber = null;

    for (var ii = 0; ii < length; ++ii) {
      if (tokens[ii].type === "LX_VAR") {
        var letter = NOVAE.$.getLetters(tokens[ii].value);
        var number = NOVAE.$.getNumbers(tokens[ii].value);
        if (startNumber === null) {
          startNumber = number;
        }
      }
    }

  };