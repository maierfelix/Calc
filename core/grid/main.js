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
   * The Grid
   *
   * @class Grid
   * @static
   */
  CORE.Grid = function() {

    /** Object holds size of the current grid */
    this.Settings = {
      x: 0,
      y: 0,
      /** Mouse scrolled amount */
      scrolledX: 0,
      scrolledY: 0,
      /** Key scrolled amount */
      keyScrolledX: 0,
      keyScrolledY: 0,
      /** Total resized cell amount */
      cellResizedX: 0,
      cellResizedY: 0,
      /** Last scroll amount */
      lastScrollX: 0,
      lastScrollY: 0
    };

    /** Define Cell sizes */
    this.CellTemplate = {
      Width: 100,
      Height: 25
    };

    /** Helper to detect mouse scroll direction */
    this.mouseScrollDirection = {
      oldX: 0,
      oldY: 0,
      directionX: null,
      directionY: null
    };

    /** Save cells which got a custom width or height */
    this.customCellSizes = {
      /** Alphabetical menu */
      alphabetical: {},
      /** Numeric menu */
      numeric: {},
      /** Fast access array */
      array: []
    };

    /** Save each grid cell */
    this.cellArray = []

    /** Different action on desktop and mobile */
    this.mouseMode = !CORE.Settings.Mobile ? "mouseover" : "click";

    /** Template Object */
    this.Templates = {
      Cell: {
        element: "div",
        class: "row",
        style: {
          height: this.CellTemplate.Height,
          width: this.CellTemplate.Width
        }
      },
      /** Menu templates */
      Menu: {
        Alphabetical: {
          element: "div",
          class: "row cell_dark_alpha",
          style: {
            height: this.CellTemplate.Height,
            width: this.CellTemplate.Width
          }
        },
        Numeric: {
          element: "div",
          class: "row cell_dark_number",
          style: {
            height: this.CellTemplate.Height,
            width:  (this.CellTemplate.Width / 2)
          }
        }
      }
    };

    this.calculateGrid();

  };

  CORE.Grid.prototype = CORE.Grid;
  CORE.Grid.prototype.constructor = CORE.Grid;

  /**
   * Calculate the new grid sizes
   *
   * @method calculateGrid
   * @static
   */
  CORE.Grid.prototype.calculateGrid = function() {

    /** Round down */
    this.Settings.x = Math.ceil( - ( CORE.Settings.Width / this.CellTemplate.Width ) );
    this.Settings.y = Math.ceil( - ( CORE.Settings.Height / this.CellTemplate.Height ) );

    /** - to + conversion */
    this.Settings.x = ( ~ this.Settings.x + 1 ) + 1;
    this.Settings.y = ( ~ this.Settings.y + 1 ) - 2;

  };

  /**
   * Debugging..
   *
   * @method addCellListeners
   * @static
   */
  CORE.Grid.prototype.addCellListeners = function() {

    for (var ii = 0; ii < CORE.DOM.Output.children.length; ++ii) {
      CORE.DOM.Output.children[ii].addEventListener(this.mouseMode, function(e) {
        if (!CORE.Input.Mouse.Edit) CORE.DOM.CurrentCell.innerHTML = e.target.getAttribute("name");
      });
    }

  };

  /**
   * Generate grid cells
   *
   * @method generateCells
   * @static
   */
  CORE.Grid.prototype.generateCells = function() {

    /** Detect breakpoints and switch between pre-letters */
    var Breaks = 1,
        Number = 0,
        Letter = null;

    var ii = 0;

    /** Clean counter */
    var kk = 0;

    var x, y = 0;

    var style = null;

    var styleWidth = this.Templates.Cell.style.width,
        styleHeight = this.Templates.Cell.style.height;

    var output = "";

    /** Preallocate required memory */
    this.cellArray = new Array(this.Settings.x * this.Settings.y);

    this.generateMenu();

    for (var xx = 0; xx < this.Settings.x; ++xx) {

      for (var yy = 0; yy < this.Settings.y; ++yy) {

        /** Calculate position */
        x = this.CellTemplate.Width * xx;
        y = this.CellTemplate.Height * yy;

        ii += 1;
        Number += 1;

        /** Counter is below the first breakpoint */
        if (ii < this.Settings.y) {
          Letter = CORE.$.numberToAlpha(Breaks);
        /** Counter is above the first breakpoint and a modulo */
        } else if (ii % this.Settings.y === 1) {
          Breaks += 1;
          Letter = CORE.$.numberToAlpha(Breaks);
        }

        style = "height: " + styleHeight + "px; width: " + styleWidth + "px;";
        style += " left:" + x + "px; top: " + y + "px;";

        /** !Evil DOM Content */
        output += '<' + this.Templates.Cell.element + ' name="' + Letter + Number + '" id="' + ii + '" class="' + this.Templates.Cell.class + '" style="' + style + '">';
        /** Check if cell contains custom content */
        if (CORE.Cells.Used[CORE.CurrentSheet][Letter] && CORE.Cells.Used[CORE.CurrentSheet][Letter][Letter + Number]) {
          output += CORE.Cells.Used[CORE.CurrentSheet][Letter][Letter + Number].Content;
        }
        output += '</' + this.Templates.Cell.element + '>';

        /** Reset grid number if counter is exactly the modulo */
        if (ii % this.Settings.y === 0) Number = 0;

        /** Save current user view */
        this.cellArray[kk] = {
          id: ii,
          x: xx,
          y: yy,
          /** Original width */
          origWidth: styleWidth,
          /** Original height */
          origHeight: styleHeight,
          /** Original top position */
          origTop: y,
          /** Original left position */
          origLeft: x
        };

        kk++;

      }

    }

    CORE.DOM.Output.innerHTML = output;

    this.cacheDOM();

    this.addCellListeners();

    CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

    /** User was in edit mode */
    if (CORE.Input.Mouse.Edit) this.getEditSelection(CORE.Cells.Edit);

  };