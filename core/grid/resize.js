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

"use strict"

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

    /** The current cell column has a custom height */
    if (customCell[Number]) {
      /** Update height of the custom cell column */
      cellRow.height = (this.cellArray[ii].origHeight + customCell[Number].Height) + "px";
      /** Update top position of the custom cell column */
      cellRow.top = (this.cellArray[ii].origTop) + "px";
      /** Center cell text content */
      cellRow.lineHeight = ((this.cellArray[ii].origHeight + customCell[Number].Height) - 8 ) + "px";
    }
    /** Reset height of all cells without a custom height */
    else {
      cellRow.height = this.cellArray[ii].origHeight + "px";
      cellRow.lineHeight = (this.cellArray[ii].origHeight - 8) + "px";
    }

    /** Search for custom cell rows */
    for (var kk in customCell) {

      /** Update all cell rows top position behind the customized cell column with its new height */
      if (Number > kk) {
        totalTopShift += customCell[kk].Height;
        cellRow.top = (this.cellArray[ii].origTop + totalTopShift) + "px";
      /** Update all cells before the customized cell with its top position */
      } else if (Number < kk) {
        cellRow.top = (this.cellArray[ii].origTop + totalTopShift) + "px";
      }

      /** User has scrolled the grid */
      if (this.Settings.scrolledY > 0) {

        /** Check if customized cell column is in view */
        if (kk <= this.Settings.scrolledY) {
          cellRow.top = this.cellArray[ii].origTop + "px";
        }

      }

      /** Custom cell column is not in view anymore, so substract its custom height from all cell rows behind */
      if (Number >= kk) {
        if (this.Settings.scrolledY >= kk) {
          totalTopShift -= customCell[kk].Height;
          cellRow.top = (this.cellArray[ii].origTop + totalTopShift) + "px";
        }
      }

    }

  };