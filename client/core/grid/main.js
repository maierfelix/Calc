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
      redrawOnZero: false,
      /** Save current native scroll position */
      nativeScrollPosition: {
        x: 0,
        y: 0
      }
    };

    /** Define Cell sizes */
    this.CellTemplate = {
      Width: NOVAE.Settings.GridSizes.Columns,
      Height: NOVAE.Settings.GridSizes.Rows
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
        element: "td",
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
          element: "td",
          class: "row cell_dark_number",
          style: {
            height: this.CellTemplate.Height,
            width:  Math.ceil(this.CellTemplate.Width / 2)
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

    /** Save current resized column and row */
    this.lastResized = {
      Column: null,
      Row: null
    };

    /** Detect fast scrolling */
    this.fastScroll = false;

    /** Detect active modals */
    this.activeModal = false;

    /** Detect sheet name editing */
    this.changeSheetName = false;

    /** Auto calculate grid */
    this.calculateGrid();

  };

  NOVAE.Grid.prototype = NOVAE.Grid;
  NOVAE.Grid.prototype.constructor = NOVAE.Grid;

  /**
   * Calculate the grid size
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
    this.Settings.y *= 4;
    this.Settings.x *= 2;

    /** Expand grid width if columns got resized smaller */
    if (resizedX <= 0) {
      this.Settings.x += ( ~ Math.floor(resizedX / this.CellTemplate.Width) + 1 ) + 1;
    }

    /** Expand grid height if rows got resized smaller */
    if (resizedY <= 0) {
      this.Settings.y += ( ~ Math.floor(resizedY / this.CellTemplate.Height) + 1 ) + 1;
    }

    /** Recalculate the width */
    this.reCalculateWidth();

    /** Speed up scrolling */
    if (this.Settings.x + this.Settings.y >= 100) {
      NOVAE.SystemSpeed = 5;
    } else if (this.Settings.x + this.Settings.y >= 150) {
      NOVAE.SystemSpeed = 10;
    }

    /** Auto calculate scroll method */
    this.calculateScrollMethod();

  };

  /**
   * Calculate scroll method
   *
   * @method reCalculateWidth
   * @static
   */
  NOVAE.Grid.prototype.reCalculateWidth = function() {

    var minus = 0;

    var columns = NOVAE.Cells.Resized[arguments[0] || NOVAE.CurrentSheet].Columns;

    for (var cell in columns) {
      var name = NOVAE.$.alphaToNumber(cell);
      /** Resized column is not in view */
      if (name < this.Settings.scrolledX || name - this.Settings.x > this.Settings.scrolledX) {
        if (columns[cell].Width < 0) {
          minus += columns[cell].Width;
        }
      }
    }

    if (!isNaN(minus)) {
      if (minus < 0) {
        minus = ~(minus);
        this.Settings.x -= Math.floor(minus / this.CellTemplate.Width);
      }
    }

  };

  /**
   * Calculate scroll method
   *
   * @method calculateScrollMethod
   * @static
   */
  NOVAE.Grid.prototype.calculateScrollMethod = function() {

    this.fastScroll = this.Settings.x + this.Settings.y >= 100 ? true : false;

  };

  /**
   * Get the whole resize X factor
   *
   * @method getResizedX
   * @static
   */
  NOVAE.Grid.prototype.getResizedX = function() {

    var x = 0;

    var columns = NOVAE.Cells.Resized[arguments[0] || NOVAE.CurrentSheet].Columns;

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

    var rows = NOVAE.Cells.Resized[arguments[0] || NOVAE.CurrentSheet].Rows;

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
   * Generate grid cells
   *
   * @method generateCells
   * @static
   */
  NOVAE.Grid.prototype.generateCells = function() {

    /** Detect breakpoints and switch between pre-letters */
    var Breaks = 1;
    var Number = 0;
    var Letter = null;

    var ii = 0;

    /** Clean counter */
    var kk = 0;

    var x = 0;
    var y = 0;

    var styleWidth = this.Templates.Cell.style.width;
    var styleHeight = this.Templates.Cell.style.height;

    var output = "";

    /** Preallocate required memory */
    this.cellArray = new Array(this.Settings.x * this.Settings.y);

    var tdArray = [];

    /** Clean the whole menu */
    NOVAE.DOM.TableHead.innerHTML = "";
    NOVAE.DOM.TableHeadAbsolute.innerHTML = "";
    NOVAE.DOM.TableBody.innerHTML = "";
    NOVAE.DOM.TableBodyAbsolute.innerHTML = "";
    NOVAE.DOM.ColumnGroup.innerHTML = "";
    NOVAE.DOM.ColumnGroupAbsolute.innerHTML = "";

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
        }

        /** !Evil DOM Content */
        output += '<' + this.Templates.Cell.element + ' class="' + this.Templates.Cell.class + '" style="">';
        /** Check if cell contains custom content */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter][Letter + Number]) {
          output += NOVAE.Cells.Used[NOVAE.CurrentSheet][Letter][Letter + Number].Content;
        }
        output += '</' + this.Templates.Cell.element + '>';

        /** New row */
        if (ii % this.Settings.x === 0) {

          var element = document.createElement("tr");
              element.innerHTML = output;

          /** Crutch row */
          element.insertBefore(this.generateMenuRow(this.Settings.y - Breaks), element.firstChild);

          /** Generate a floating row, so its visibile on horizontal scrolling */
          var node = document.createElement("tr");
          node.insertBefore(this.generateAbsoluteMenuRow(this.Settings.y - Breaks), node.firstChild);
          NOVAE.DOM.TableBodyAbsolute.appendChild(node);

          NOVAE.DOM.TableBody.appendChild(element);

          output = "";

          Breaks += 1;

          Letter = NOVAE.$.numberToAlpha(Breaks);

        }

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

    this.cacheDOM();

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