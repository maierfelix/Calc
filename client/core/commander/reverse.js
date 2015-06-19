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
   * Reverse a selection
   *
   * @method reverseSelection
   * @static
   */
  CORE.Commander.prototype.reverseSelection = function(data) {

    CORE.Sheets[CORE.CurrentSheet].Selector.select(data);

  };