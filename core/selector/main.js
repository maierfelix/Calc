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

"use strict";

  /**
   * Selection Helper
   *
   * @class Selector
   * @static
   */
  CORE.Selector = function() {

    /** Selected cells converted into usable format */
    this.Selected = {
      /** First selected cell */
      First: {
        Letter: null,
        Number: 0
      },
      /** Last selected cell */
      Last: {
        Letter: null,
        Number: 0
      }
    };

    /** Last selected menu position */
    this.MenuSelection = {
      Horizontal: 0,
      Vertical: 0
    };

    /** Array of all processed and selected cells */
    this.SelectedCells = [];

    /** Parent cell, can only be changed by mouse or selectCell function */
    this.parentSelectedCell = {
      Letter: 0,
      Number: 0
    };

    /** Helper variable, to detect if user starts to edit a cell*/
    this.cellFocusSwitch = false;

  };

  CORE.Selector.prototype = CORE.Selector;