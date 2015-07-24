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
   * Update the grid height
   *
   * @method updateHeight
   * @static
   */
  NOVAE.Grid.prototype.updateHeight = function(dir, scrollAmount) {

    var width = this.Settings.x;
    var height = this.Settings.y;
    var br = this.Settings.y;
    var helper = 0;
    var calculation = 0;
    /** Cell name attributes */
    var Letter;
    var Number = 0;

    /** Create letter of major first column in view from the left */
    Letter = NOVAE.$.numberToAlpha(this.Settings.scrolledX + 1);

    /** Check if safe integer, also don't go below zero */
    this.Settings.scrolledY = this.Settings.scrolledY < 0 ? 0 : this.Settings.scrolledY;

    var length = width * height;

    for (var ii = 0; ii < length; ++ii) {

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

      /** Remove style of cell */
      this.removeCellStyling(ii);

      /** Append all styling */
      this.updateCellAllStyling(calculation, ii);

      /** Master selection column */
      if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[Letter]) {
        this.updateCellMasterStyling(Letter, ii);
      /** Master selection row */
      } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[calculation]) {
        this.updateCellMasterStyling(calculation, ii);
      }

      /** Check if cell is registered, if yes update its styling */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter][Letter + calculation]) {
        /** Higher priority than master styling */
        this.updateCellStyling(Letter, Letter + calculation, ii);
      }

      if ( (ii + 1) % br === 0) {
        Letter = NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(Letter) + 1);
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
  NOVAE.Grid.prototype.updateWidth = function(dir) {

    this.updateHeight("default", NOVAE.Settings.Scroll.Vertical);

  };

  /**
   * Update specific cell with a custom styling
   *
   * @method updateCellStyling
   * @static
   */
  NOVAE.Grid.prototype.updateCellStyling = function(name, cell, ii) {

    if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][name]) return void 0;

    if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell]) return void 0;

    /** Check if cell has custom content */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Content !== undefined && NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Content !== null) {
      NOVAE.DOM.Cache[ii].innerHTML = NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Content;
    }

    /** Check if cell has a custom font */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Font) {
      NOVAE.DOM.Cache[ii].style.fontFamily = NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Font;
    }

    /** Check if cell has a custom font size */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].FontSize) {
      NOVAE.DOM.Cache[ii].style.fontSize = NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].FontSize + "px";
    }

    /** Check if cell has a custom font color */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Color) {
      NOVAE.DOM.Cache[ii].style.color = NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Color;
    }

    /** Check if cell has a custom font bold property */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].FontBold) {
      NOVAE.DOM.Cache[ii].style.fontWeight = "bold";
    }

    /** Check if cell has a custom font italic property */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].FontItalic) {
      NOVAE.DOM.Cache[ii].style.fontStyle = "italic";
    }

    /** Check if cells font is underlined */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].FontUnderlined) {
      NOVAE.DOM.Cache[ii].style.textDecoration = "underline";
    }

    /** Check if cell has a custom background color */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].BackgroundColor) {
      NOVAE.DOM.Cache[ii].style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].BackgroundColor;
    }

    /** Check if cell has custom border settings */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.used) {
      /** Left border */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.left) {
        NOVAE.DOM.Cache[ii].style.borderLeft = "2px solid black";
      }
      /** Right border */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.right) {
        NOVAE.DOM.Cache[ii].style.borderRight = "2px solid black";
      }
      /** Top border */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.top) {
        NOVAE.DOM.Cache[ii].style.borderTop = "2px solid black";
      }
      /** Bottom border */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.bottom) {
        NOVAE.DOM.Cache[ii].style.borderBottom = "2px solid black";
      }
      /** Full border */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][name][cell].Border.full) {
        NOVAE.DOM.Cache[ii].style.border = "2px solid black";
      }
    }

  };

  /**
   * Update specific cell with a master selection styling
   *
   * @method updateCellMasterStyling
   * @static
   */
  NOVAE.Grid.prototype.updateCellMasterStyling = function(name, ii) {

    /** Switch between columns and rows */
    var data = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[name] || NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[name];

    /** Check if cell has a custom font */
    if (data.Font) {
      NOVAE.DOM.Cache[ii].style.fontFamily = data.Font;
    }

    /** Check if cell has a custom font size */
    if (data.FontSize) {
      NOVAE.DOM.Cache[ii].style.fontSize = data.FontSize + "px";
    }

    /** Check if cell has a custom font color */
    if (data.Color) {
      NOVAE.DOM.Cache[ii].style.color = data.Color;
    }

    /** Check if cell has a custom font bold property */
    if (data.FontBold) {
      NOVAE.DOM.Cache[ii].style.fontWeight = "bold";
    }

    /** Check if cell has a custom font italic property */
    if (data.FontItalic) {
      NOVAE.DOM.Cache[ii].style.fontStyle = "italic";
    }

    /** Check if cells font is underlined */
    if (data.FontUnderlined) {
      NOVAE.DOM.Cache[ii].style.textDecoration = "underline";
    }

    /** Check if cell has a custom background color */
    if (data.BackgroundColor) {
      NOVAE.DOM.Cache[ii].style.background = data.BackgroundColor;
    }

    /** Check if cell has custom border settings */
    if (data.Border && data.Border.used) {
      /** Left border */
      if (data.Border.left) {
        NOVAE.DOM.Cache[ii].style.borderLeft = "2px solid black";
      }
      /** Right border */
      if (data.Border.right) {
        NOVAE.DOM.Cache[ii].style.borderRight = "2px solid black";
      }
      /** Top border */
      if (data.Border.top) {
        NOVAE.DOM.Cache[ii].style.borderTop = "2px solid black";
      }
      /** Bottom border */
      if (data.Border.bottom) {
        NOVAE.DOM.Cache[ii].style.borderBottom = "2px solid black";
      }
      /** Full border */
      if (data.Border.full) {
        NOVAE.DOM.Cache[ii].style.border = "2px solid black";
      }
    }

  };

  /**
   * Update specific cell with a all styling
   *
   * @method updateCellAllStyling
   * @static
   */
  NOVAE.Grid.prototype.updateCellAllStyling = function(name, ii) {

    /** Switch between columns and rows */
    var data = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell;

    /** Check if cell has a custom font */
    if (data.Font) {
      NOVAE.DOM.Cache[ii].style.fontFamily = data.Font;
    }

    /** Check if cell has a custom font size */
    if (data.FontSize) {
      NOVAE.DOM.Cache[ii].style.fontSize = data.FontSize + "px";
    }

    /** Check if cell has a custom font color */
    if (data.Color) {
      NOVAE.DOM.Cache[ii].style.color = data.Color;
    }

    /** Check if cell has a custom font bold property */
    if (data.FontBold) {
      NOVAE.DOM.Cache[ii].style.fontWeight = "bold";
    }

    /** Check if cell has a custom font italic property */
    if (data.FontItalic) {
      NOVAE.DOM.Cache[ii].style.fontStyle = "italic";
    }

    /** Check if cells font is underlined */
    if (data.FontUnderlined) {
      NOVAE.DOM.Cache[ii].style.textDecoration = "underline";
    }

    /** Check if cell has a custom background color */
    if (data.BackgroundColor) {
      NOVAE.DOM.Cache[ii].style.background = data.BackgroundColor;
    }

    /** Check if cell has custom border settings */
    if (data.Border && data.Border.used) {
      /** Left border */
      if (data.Border.left) {
        NOVAE.DOM.Cache[ii].style.borderLeft = "2px solid black";
      }
      /** Right border */
      if (data.Border.right) {
        NOVAE.DOM.Cache[ii].style.borderRight = "2px solid black";
      }
      /** Top border */
      if (data.Border.top) {
        NOVAE.DOM.Cache[ii].style.borderTop = "2px solid black";
      }
      /** Bottom border */
      if (data.Border.bottom) {
        NOVAE.DOM.Cache[ii].style.borderBottom = "2px solid black";
      }
      /** Full border */
      if (data.Border.full) {
        NOVAE.DOM.Cache[ii].style.border = "2px solid black";
      }
    }

  };

  /**
   * Remove specific cell styling
   *
   * @method removeCellStyling
   * @static
   */
  NOVAE.Grid.prototype.removeCellStyling = function(ii) {

    if (NOVAE.DOM.Cache[ii]) {
      NOVAE.DOM.Cache[ii].setAttribute("style", "");
      NOVAE.DOM.Cache[ii].innerHTML = "";
    }

  };