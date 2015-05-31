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
   * Update the grid height
   *
   * @method updateHeight
   * @static
   */
  CORE.Grid.prototype.updateHeight = function(dir, scrollAmount) {

    var width = this.Settings.x,
        height = this.Settings.y,
        br = this.Settings.y,
        helper = 0,
        calculation = 0,
        /** Cell name attributes */
        Letter = null,
        Number = 0;

    /** Speed optimization, avoid using regular expressions */
    if (this.Settings.scrolledX <= 0) Letter = CORE.DOM.Output.children[0].getAttribute("name").match(CORE.REGEX.numbers).join("");
    else Letter = CORE.$.numberToAlpha(this.Settings.scrolledX + 1);

    /** Check if safe integer, also don't go below zero */
    this.Settings.scrolledY = this.Settings.scrolledY < 0 ? 0 : CORE.$.isSafeInteger(this.Settings.scrolledY);

    for (var ii = 0; ii < width * height; ++ii) {

      /** Scroll Down */
      if (dir === "down") {
        Number = (this.Settings.scrolledY - scrollAmount) + 1;
        calculation = ( ( ii + scrollAmount ) - helper + Number);
      /** Scroll Up */
      } else if (dir === "up") {
        Number = (this.Settings.scrolledY + scrollAmount) + 1;
        calculation = ( ( ii - scrollAmount ) - helper + Number);
      /** Scroll to Default */
      } else {
        Number = 1;
        calculation = ( ( ii + this.Settings.scrolledY ) - helper + Number);
      }

      CORE.DOM.Output.children[ii].setAttribute("name", Letter + calculation);

      /** Check if cell is registered, if yes update its styling */
      if (CORE.Cells.Used[Letter + calculation]) {
        this.removeCellStyling(ii);
        this.updateCellStyling(Letter + calculation, ii);
      }
      /** Remove style of cell */
      else this.removeCellStyling(ii);

      /** Only resize grid if necessary */
      if (!CORE.Event.lastAction.scrollY) {
        /** Horizontal cell row got resized */
        this.resizeHorizontal(Letter, ii);
      }

      /** Vertical cell row got resized */
      this.resizeVertical(calculation, ii);

      if ( (ii + 1) % br === 0) {
        Letter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(Letter) + 1);
        helper = ii + 1;
      }

    }

  };

  /**
   * Update the grid width
   *
   * @method updateWidth
   * @static
   */
  CORE.Grid.prototype.updateWidth = function(dir) {

    var lastX = 0,
        lastY = 0;

    var width = this.Settings.x,
        height = this.Settings.y,
        br = this.Settings.y,
        ii = 0;

    var calculation = 0;

    var Letter = null,
        Number = 0;

    /** View fix for the width */
    width += 1;

    /** View fix for the height */
    height += 1;

    for (var xx = 0; xx < width; ++xx) {

      for (var yy = 0; yy < height; ++yy) {

        if (xx > 0) {
          if (xx !== lastX) {
            lastX = xx;
            for (var kk = 0; kk < height; ++kk) {
              /** Calculate cell node position */
              calculation = (kk + ii - (lastX) - height);
              if (CORE.DOM.Output.children[calculation]) {

                /** Calculate cell number */
                if (kk === 0) Number = (height - 1) + this.Settings.scrolledY;
                else Number = kk + this.Settings.scrolledY;

                CORE.DOM.Output.children[calculation].setAttribute("name", Letter + calculation);

                /** Check if cell is registered, if yes update its styling */
                if (CORE.Cells.Used[Letter + calculation]) {
                  this.updateCellStyling(Letter + calculation, calculation);
                }

              }
            }
          }
        }

        ii += 1;

        if (dir === "right" || dir === "left") {
          if (lastX === 0) Letter = CORE.$.numberToAlpha(this.Settings.scrolledX + 1);
          else Letter = CORE.$.numberToAlpha(lastX + (this.Settings.scrolledX + 1));
        }
        else {
          if (this.Settings.scrolledX === 0) {
            Letter = CORE.$.numberToAlpha(this.Settings.scrolledX + 1);
          } else if (this.Settings.scrolledX === 1) {
            /** Default 0 position */
            Letter = CORE.$.numberToAlpha(this.Settings.scrolledX);
          }
          else Letter = CORE.$.numberToAlpha(this.Settings.scrolledX + 1);
        }

        /** Check if safe integer */
        this.Settings.scrolledX = CORE.$.isSafeInteger(this.Settings.scrolledX)

      }

    }

    this.updateHeight("default", CORE.Settings.Scroll.Vertical);

  };

  /**
   * Update specific cell with a custom styling
   *
   * @method updateCellStyling
   * @static
   */
  CORE.Grid.prototype.updateCellStyling = function(name, ii) {

    /** Check if cell has custom content */
    if (CORE.Cells.Used[name].Content !== undefined && CORE.Cells.Used[name].Content !== null) {
      CORE.DOM.Cache[ii].innerHTML = CORE.Cells.Used[name].Content;
    }

    /** Check if cell has a custom font */
    if (CORE.Cells.Used[name].Font) {
      CORE.DOM.Cache[ii].style.fontFamily = CORE.Cells.Used[name].Font;
    }

    /** Check if cell has a custom font size */
    if (CORE.Cells.Used[name].FontSize) {
      CORE.DOM.Cache[ii].style.fontSize = CORE.Cells.Used[name].FontSize + "px";
    }

    /** Check if cell has a custom font color */
    if (CORE.Cells.Used[name].Color) {
      CORE.DOM.Cache[ii].style.color = CORE.Cells.Used[name].Color;
    }

    /** Check if cell has a custom font bold property */
    if (CORE.Cells.Used[name].FontBold) {
      CORE.DOM.Cache[ii].style.fontWeight = "bold";
    }

    /** Check if cell has a custom font italic property */
    if (CORE.Cells.Used[name].FontItalic) {
      CORE.DOM.Cache[ii].style.fontStyle = "italic";
    }

    /** Check if cells font is underlined */
    if (CORE.Cells.Used[name].FontUnderlined) {
      CORE.DOM.Cache[ii].style.textDecoration = "underline";
    }

    /** Check if cell has a custom background color */
    if (CORE.Cells.Used[name].BackgroundColor) {
      CORE.DOM.Cache[ii].style.background = CORE.Cells.Used[name].BackgroundColor;
    }

    /** Check if cell has custom border settings */
    if (CORE.Cells.Used[name].Border.used) {
      /** Left border */
      if (CORE.Cells.Used[name].Border.left) {
        CORE.DOM.Cache[ii].style.borderLeft = "2px solid black";
      }
      /** Right border */
      if (CORE.Cells.Used[name].Border.right) {
        CORE.DOM.Cache[ii].style.borderRight = "2px solid black";
      }
      /** Top border */
      if (CORE.Cells.Used[name].Border.top) {
        CORE.DOM.Cache[ii].style.borderTop = "2px solid black";
      }
      /** Bottom border */
      if (CORE.Cells.Used[name].Border.bottom) {
        CORE.DOM.Cache[ii].style.borderBottom = "2px solid black";
      }
      /** Full border */
      if (CORE.Cells.Used[name].Border.full) {
        CORE.DOM.Cache[ii].style.border = "2px solid black";
      }
    }

  };

  /**
   * Remove specific cell styling
   *
   * @method removeCellStyling
   * @static
   */
  CORE.Grid.prototype.removeCellStyling = function(ii) {

    CORE.DOM.Cache[ii].style.borderLeft = "";
    CORE.DOM.Cache[ii].style.borderRight = "";
    CORE.DOM.Cache[ii].style.borderTop = "";
    CORE.DOM.Cache[ii].style.borderBottom = "";
    CORE.DOM.Cache[ii].style.border = "";
    CORE.DOM.Cache[ii].style.fontFamily = "";
    CORE.DOM.Cache[ii].style.fontSize = 12 + "px";
    CORE.DOM.Cache[ii].style.fontStyle = "normal";
    CORE.DOM.Cache[ii].style.fontWeight = "normal";
    CORE.DOM.Cache[ii].style.textDecoration = "none";
    CORE.DOM.Cache[ii].style.background = "#fff";
    CORE.DOM.Cache[ii].style.color = "#000";
    CORE.DOM.Cache[ii].innerHTML = "";

  };