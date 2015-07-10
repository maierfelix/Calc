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
  NOVAE.Grid.prototype.resizeHorizontal = function(Letter, ii) {

    var customCell = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Columns;
    /** Total amount of shifting cell rows to left */
    var totalLeftShift = 0;
    /** DOM caching */
    var cellColumn = {};

    /** The current cell column has a custom width */
    if (customCell[Letter]) {
      /** Update width of the custom cell column */
      cellColumn.width = (this.cellArray[ii].origWidth + customCell[Letter].Width);
      /** Update left position of the custom cell column */
      cellColumn.left = (this.cellArray[ii].origLeft);
    }
    /** Reset width of all cells without a custom width */
    else cellColumn.width = this.cellArray[ii].origWidth;

    var letterToNumber = NOVAE.$.alphaToNumber(Letter);

    if (!this.horizontalInView(letterToNumber)) {
      if (cellColumn.hasOwnProperty("left")) NOVAE.DOM.Cache[ii].style.left = cellColumn.left + "px";
      if (cellColumn.hasOwnProperty("width")) NOVAE.DOM.Cache[ii].style.width = cellColumn.width + "px";
      return void 0;
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].Settings.redrawOnZero = true;

    /** Search for custom cell rows */
    for (var kk in customCell) {

      var kkToNumber = NOVAE.$.alphaToNumber(kk);

      /** Update all cell rows left position behind the customized cell column with its new width */
      if (letterToNumber > kkToNumber) {
        totalLeftShift += customCell[kk].Width;
        cellColumn.left = (this.cellArray[ii].origLeft + totalLeftShift);
      }

      /** User has scrolled the grid */
      if (this.Settings.scrolledX > 0) {

        /** Check if customized cell column is in view */
        if (kkToNumber <= this.Settings.scrolledX) {
          cellColumn.left = this.cellArray[ii].origLeft;
        }

      }

      /** Custom cell column is not in view anymore, so substract its custom width from all cell rows behind */
      if (letterToNumber >= kkToNumber) {
        if (this.Settings.scrolledX >= kkToNumber) {
          totalLeftShift -= customCell[kk].Width;
          cellColumn.left = (this.cellArray[ii].origLeft + totalLeftShift);
        }
      }

    }

    if (cellColumn.hasOwnProperty("left")) NOVAE.DOM.Cache[ii].style.left = cellColumn.left + "px";
    if (cellColumn.hasOwnProperty("width")) NOVAE.DOM.Cache[ii].style.width = cellColumn.width + "px";

  };

  /**
   * Detect cell column enlargement on vertical numeric row
   *
   * @method resizeVertical
   * @static
   */
  NOVAE.Grid.prototype.resizeVertical = function(Number, ii) {
 
    var customCell = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Rows;
    /** Total amount of shifting cell rows to top */
    var totalTopShift = 0;
    /** DOM caching */
    var cellRow = {};
    /** Cache cell object height */
    var cellHeight = this.cellArray[ii].origHeight;
    /** Cache cell object top position */
    var cellTop = this.cellArray[ii].origTop;

    /** The current cell column has a custom height */
    if (customCell[Number]) {
      /** Update height of the custom cell column */
      cellRow.height = (cellHeight + customCell[Number].Height);
      /** Update top position of the custom cell column */
      cellRow.top = (cellTop);
    }
    /** Reset height of all cells without a custom height */
    else cellRow.height = cellHeight;

    if (!this.verticalInView(Number)) {
      if (cellRow.hasOwnProperty("top")) NOVAE.DOM.Cache[ii].style.top = cellRow.top + "px";
      if (cellRow.hasOwnProperty("height")) NOVAE.DOM.Cache[ii].style.height = cellRow.height + "px";
      return void 0;
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].Settings.redrawOnZero = true;

    /** Search for custom cell rows */
    for (var kk in customCell) {

      /** Update all cell rows top position behind the customized cell column with its new height */
      if (Number > kk) totalTopShift += customCell[kk].Height;

      cellRow.top = (cellTop + totalTopShift);

      /** User has scrolled the grid */
      if (this.Settings.scrolledY > 0) {
        /** Check if customized cell column is in view */
        if (kk <= this.Settings.scrolledY) {
          cellRow.top = cellTop;
        }
      }

      /** Custom cell column is not in view anymore, so substract its custom height from all cell rows behind */
      if (Number >= kk) {
        if (this.Settings.scrolledY >= kk) {
          totalTopShift -= customCell[kk].Height;
          cellRow.top = (cellTop + totalTopShift);
        }
      }

    }

    if (cellRow.hasOwnProperty("top")) NOVAE.DOM.Cache[ii].style.top = cellRow.top + "px";
    if (cellRow.hasOwnProperty("height")) NOVAE.DOM.Cache[ii].style.height = cellRow.height + "px";

  };

  /**
   * Check if a cell is in view
   *
   * @method verticalInView
   * @static
   */
  NOVAE.Grid.prototype.verticalInView = function(number) {

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var length = customCellSizes.rowArray.length;

    for (var ii = 0; ii < length; ++ii) {

      if (customCellSizes.rowArray[ii] <= (this.Settings.scrolledY + (this.Settings.y + this.Settings.lastScrollY))) {
        if (customCellSizes.rowArray[ii] >= (this.Settings.scrolledY - (this.Settings.lastScrollY))) {
          return (true);
        }
      }

    }

    return (false);

  };

  /**
   * Check if a cell is in view
   *
   * @method horizontalInView
   * @static
   */
  NOVAE.Grid.prototype.horizontalInView = function(number) {

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var length = customCellSizes.columnArray.length;

    for (var ii = 0; ii < length; ++ii) {

      if (customCellSizes.columnArray[ii] <= (this.Settings.scrolledX + (this.Settings.x + this.Settings.lastScrollX))) {
        if (customCellSizes.columnArray[ii] >= (this.Settings.scrolledX - (this.Settings.lastScrollX))) {
          return (true);
        }
      }

    }

    return (false);

  };