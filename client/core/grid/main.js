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
   * The Grid
   *
   * @class Grid
   * @static
   */
  NOVAE.Grid = function() {

    /** Object holds size of the current grid */
    this.Settings = {
      /** Master sheet */
      master: false,
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
      lastScrollY: 0,
      /** Redraw the grid 1 time, if scrolledY amount is <= 1 */
      redrawOnZero: false
    };

    /** Define Cell sizes */
    this.CellTemplate = {
      Width: 100,
      Height: 25
    };

    /** Helper to detect mouse scroll direction */
    this.mouseMoveDirection = {
      oldX: 0,
      oldY: 0,
      directionX: null,
      directionY: null,
      lastAction: null
    };

    /** Save each grid cell */
    this.cellArray = []

    /** Different action on desktop and mobile */
    this.mouseMode = !NOVAE.Settings.Mobile ? "mouseover" : "touchmove";

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

    /** Input thingys */
    this.Input = {
      Touch: {
        /** Detect vertical scroll direction */
        lastY: 0,
        /** Detect horizontal scroll direction */
        lastX: 0
      },
      Mouse: {
        /** Mouse pressed or not? Also prevent multiple execution of mousedown event */
        Pressed: false,
        /** Prevent multiple execution of mousemove event */
        lastMousePosition: {
          x: 0,
          y: 0
        },
        /** User resizes a cell */
        CellResize: false,
        /** User edits a cell */
        Edit: false,
        /** User extends a selection */
        Extend: false,
        /** User edits a script */
        ScriptEdit: false,
        /** Save last mouse click to identify single and double clicks */
        lastMouseDown: 0,
        /** Save last clicked cell */
        lastMouseDownCell: {
          Letter: 1,
          Number: 1
        },
        /** Save last mouse scroll timestamp */
        lastMouseScroll: new Date().getTime(),
        /** User started wiping */
        startedMouseWipe: false
      },
      Keyboard: {
        /** [SHIFT] key pressed */
        Shift: false,
        /** [STRG] key pressed */
        Strg: false,
        /** [TAB] key pressed */
        Tab: false,
        /** Save last key down timestamp */
        lastKeyPress: 0
      },
      /** Save latest action to prevent unnecessary grid redrawing */
      lastAction: {
        scrollY: false,
        scrollX: false
      }
    };

    /** Detect active modals */
    this.activeModal = false;

    /** Auto calculate grid */
    this.calculateGrid();

  };

  NOVAE.Grid.prototype = NOVAE.Grid;
  NOVAE.Grid.prototype.constructor = NOVAE.Grid;

  /**
   * Calculate the new grid sizes
   *
   * @method calculateGrid
   * @static
   */
  NOVAE.Grid.prototype.calculateGrid = function() {

    var resizedX = this.getResizedX();
    var resizedY = this.getResizedY();

    /** Round down */
    this.Settings.x = Math.ceil( - ( NOVAE.Settings.Width / this.CellTemplate.Width) );
    this.Settings.y = Math.ceil( - ( NOVAE.Settings.Height / this.CellTemplate.Height) );

    /** - to + conversion */
    this.Settings.x = ( ~ this.Settings.x + 1 ) + 1;
    this.Settings.y = ( ~ this.Settings.y + 1 ) - 3;

    /** Preload */
    this.Settings.y *= 3;

    /** Expand grid width if columns got resized smaller */
    if (resizedX <= 0) {
      this.Settings.x += ( ~ Math.floor(resizedX / this.CellTemplate.Width) + 1 ) + 1;
    }

    /** Expand grid height if rows got resized smaller */
    if (resizedY <= 0) {
      this.Settings.y += ( ~ Math.floor(resizedY / this.CellTemplate.Height) + 1 ) + 1;
    }

    /** Speed up scrolling */
    if (this.Settings.x + this.Settings.y >= 100) {
      NOVAE.SystemSpeed = 5;
    } else if (this.Settings.x + this.Settings.y >= 150) {
      NOVAE.SystemSpeed = 10;
    }

    /** Remove grid animation if grid is larger than 65 */
    if (this.Settings.x + this.Settings.y >= 65) {
      NOVAE.Event.resetMouseScrollAnimation();
    }

  };

  /**
   * Get the whole resize X factor
   *
   * @method getResizedX
   * @static
   */
  NOVAE.Grid.prototype.getResizedX = function() {

    var x = 0;

    var columns = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Columns;

    for (var cell in columns) {
      x += columns[cell].Width;
    }

    return (x);

  };

  /**
   * Get the whole resize Y factor
   *
   * @method getResizedY
   * @static
   */
  NOVAE.Grid.prototype.getResizedY = function() {

    var y = 0;

    var rows = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Rows;

    for (var cell in rows) {
      y += rows[cell].Height;
    }

    return (y);

  };

  /**
   * Debugging..
   *
   * @method cellHover
   * @static
   */
  NOVAE.Grid.prototype.cellHover = function(e) {

    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit) NOVAE.DOM.CurrentCell.innerHTML = e.target.getAttribute("name");

  };

  /**
   * Show the currently hovered cell
   *
   * @method addCellListeners
   * @static
   */
  NOVAE.Grid.prototype.addCellListeners = function() {

    /*for (var ii = 0; ii < NOVAE.DOM.Output.children.length; ++ii) {
      NOVAE.DOM.Output.children[ii].addEventListener(this.mouseMode, this.cellHover, false);
    }*/

  };

  /**
   * Generate grid cells
   *
   * @method generateCells
   * @static
   */
  NOVAE.Grid.prototype.generateCells = function() {

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
          Letter = NOVAE.$.numberToAlpha(Breaks);
        /** Counter is above the first breakpoint and a modulo */
        } else if (ii % this.Settings.y === 1) {
          Breaks += 1;
          Letter = NOVAE.$.numberToAlpha(Breaks);
        }

        style = "height: " + styleHeight + "px; width: " + styleWidth + "px;";
        style += " left:" + x + "px; top: " + y + "px;";

        /** !Evil DOM Content */
        output += '<' + this.Templates.Cell.element + ' class="' + this.Templates.Cell.class + '" style="' + style + '">';
        /** Check if cell contains custom content */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter][Letter + Number]) {
          output += NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter][Letter + Number].Content;
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

    NOVAE.DOM.Output.innerHTML = output;

    this.cacheDOM();

    this.addCellListeners();

    /** User was in edit mode */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit) this.getEditSelection(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First);

  };

  /**
   * Check if myself is a master sheet
   *
   * @method isMasterSheet
   * @static
   */
  NOVAE.Grid.prototype.isMasterSheet = function(e) {

    if (this.Settings.master) return (true);
    return (false);

  };