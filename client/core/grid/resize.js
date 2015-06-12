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
   * Detect cell column enlargement on horizontal alphabetical row
   *
   * @method resizeHorizontal
   * @static
   */
  CORE.Grid.prototype.resizeHorizontal = function(Letter, ii) {

    var customCell = this.customCellSizes.alphabetical;
    /** Total amount of shifting cell rows to left */
    var totalLeftShift = 0;
    /** DOM caching */
    var cellRow = CORE.DOM.Cache[ii].style;

    /** The current cell column has a custom width */
    if (customCell[Letter]) {
      /** Update width of the custom cell column */
      cellRow.width = (this.cellArray[ii].origWidth + customCell[Letter].Width) + "px";
      /** Update left position of the custom cell column */
      cellRow.left = (this.cellArray[ii].origLeft) + "px";
    }
    /** Reset width of all cells without a custom width */
    else cellRow.width = this.cellArray[ii].origWidth + "px";

    var letterToNumber = CORE.$.alphaToNumber(Letter);

    /** Search for custom cell rows */
    for (var kk in customCell) {

      var kkToNumber = CORE.$.alphaToNumber(kk);

      /** Update all cell rows left position behind the customized cell column with its new width */
      if (letterToNumber > kkToNumber) {
        totalLeftShift += customCell[kk].Width;
        cellRow.left = (this.cellArray[ii].origLeft + totalLeftShift) + "px";
      }

      /** User has scrolled the grid */
      if (this.Settings.scrolledX > 0) {

        /** Check if customized cell column is in view */
        if (kkToNumber <= this.Settings.scrolledX) {
          cellRow.left = this.cellArray[ii].origLeft + "px";
        }

      }

      /** Custom cell column is not in view anymore, so substract its custom width from all cell rows behind */
      if (letterToNumber >= kkToNumber) {
        if (this.Settings.scrolledX >= kkToNumber) {
          totalLeftShift -= customCell[kk].Width;
          cellRow.left = (this.cellArray[ii].origLeft + totalLeftShift) + "px";
        }
      }

    }

  };

  /**
   * Detect cell column enlargement on vertical numeric row
   *
   * @method resizeVertical
   * @static
   */
  CORE.Grid.prototype.resizeVertical = function(Number, ii) {

    var customCell = this.customCellSizes.numeric;
    /** Total amount of shifting cell rows to top */
    var totalTopShift = 0;
    /** DOM caching */
    var cellRow = CORE.DOM.Cache[ii].style;
    /** Cache cell object height */
    var cellHeight = this.cellArray[ii].origHeight;
    /** Cache cell object top position */
    var cellTop = this.cellArray[ii].origTop;

    /** The current cell column has a custom height */
    if (customCell[Number]) {
      /** Update height of the custom cell column */
      cellRow.height = (cellHeight + customCell[Number].Height) + "px";
      /** Update top position of the custom cell column */
      cellRow.top = (cellTop) + "px";
    }
    /** Reset height of all cells without a custom height */
    else cellRow.height = cellHeight + "px";

    if (!this.verticalInView(Number)) return void 0;

    /** Search for custom cell rows */
    for (var kk in customCell) {

      /** Update all cell rows top position behind the customized cell column with its new height */
      if (Number > kk) totalTopShift += customCell[kk].Height;

      cellRow.top = (cellTop + totalTopShift) + "px";

      /** User has scrolled the grid */
      if (this.Settings.scrolledY > 0) {
        /** Check if customized cell column is in view */
        if (kk <= this.Settings.scrolledY) {
          cellRow.top = cellTop + "px";
        }
      }

      /** Custom cell column is not in view anymore, so substract its custom height from all cell rows behind */
      if (Number >= kk) {
        if (this.Settings.scrolledY >= kk) {
          totalTopShift -= customCell[kk].Height;
          cellRow.top = (cellTop + totalTopShift) + "px";
        }
      }

    }

  };

  /**
   * Check if a cell is in view
   *
   * @method verticalInView
   * @static
   */
  CORE.Grid.prototype.verticalInView = function(number) {

    var length = this.customCellSizes.array.length;

    for (var ii = 0; ii < length; ++ii) {

      if (this.customCellSizes.array[ii] <= (this.Settings.scrolledY + (this.Settings.y + this.Settings.lastScrollY))) {
        if (this.customCellSizes.array[ii] >= (this.Settings.scrolledY - (this.Settings.lastScrollY))) {
          return (true);
        }
      }

    }

    return (false);

  };