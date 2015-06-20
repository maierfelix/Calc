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
   * Receive and process a action to the sheet
   *
   * @method sheetAction
   * @static
   */
  CORE.Commander.prototype.sheetAction = function(caller, action, data) {

    console.log(caller, action, data);

  };