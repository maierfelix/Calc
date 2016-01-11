/**
 * This file is part of the Calc project.
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
   * Selection Helper
   *
   * @class Selector
   * @static
   */
  NOVAE.Selector = function() {

    /** Selected cells converted into usable format */
    this.Selected = {
      /** First selected cell */
      First: {
        Letter: 1,
        Number: 1
      },
      /** Last selected cell */
      Last: {
        Letter: 1,
        Number: 1
      }
    };

    /** All cells are selected */
    this.allSelected = false;

    /** Last selected menu position */
    this.MenuSelection = {
      Horizontal: 0,
      Vertical: 0
    };

    /** Array of all processed and selected cells */
    this.SelectedCells = [];

    /** Parent cell, can only be changed by mouse or selectCell function */
    this.parentSelectedCell = {
      Letter: 1,
      Number: 1
    };

    /** Helper variable, to detect if user starts to edit a cell */
    this.cellFocusSwitch = false;

    /** Helper to difference between selection modes */
    this.selectionMode = null;

    /** Selected cells -> First: L:0, N:0 | Last: L:0, N:0 */
    this.Selected = {
      First: {
        Letter: 0,
        Number: 0
      },
      /** Last selected cell */
      Last: {
        Letter: 0,
        Number: 0
      }
    };

    /** Selection helper */
    this.Select = {
      Letter: 0,
      Number: 0
    };

    /** Detect reversed selections */
    this.reversed = false;

    /** Currently edited cell */
    this.Edit = null;

  };

  NOVAE.Selector.prototype = NOVAE.Selector;
  NOVAE.Selector.prototype.constructor = NOVAE.Selector;