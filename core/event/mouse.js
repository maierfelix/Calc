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
(function() { "use strict"

  /**
   * Listen for mouse double clicks
   *
   * @method mouseDoubleClick
   * @static
   */
  CORE.Event.mouseDoubleClick = function (e) {

    /** Valid cell ? */
    if (e.target.parentNode.id === CORE.DOM.Output.id) {

      /** Get grid number and fix it */
      var attribute = e.target.getAttribute("name");

      /** Clean old double click selection */
      CORE.Grid.cleanEditSelection();

      CORE.Selector.cellFocusSwitch = false;

      CORE.Grid.getEditSelection(attribute);

    }

  };

  /**
   * Listen for mouse click
   *
   * @method mouseDown
   * @static
   */
  CORE.Event.mouseDown = function (e) {

    /** Only accept left click, prevent multiple mousedown event */
    if (e.button == 2 || e.which === 3 || CORE.Input.Mouse.Pressed) return void 0;

    /** Update empty timestamp */
    if (!this.lastMouseDown) this.lastMouseDown = e.timeStamp;

    /** Handle timestamps */
    if (this.lastMouseDown > 0) {

      /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - this.lastMouseDown;

      /** Max delay of 250 milliseconds */
      if (difference && difference <= 250) {
        if (e.target.parentNode.id === CORE.DOM.Output.id) {
          /** Prevent double mouse clicks between multiple cells */
          if (e.target.getAttribute("name") === this.lastMouseDownCell) {
            CORE.Event.mouseDoubleClick(e);
            return void 0;
          }
        }
      }

    }

    /** Cell formula input field clicked */
    if (e.target.id === "cell_input") {

      /** User selected a cell */
      if (CORE.Cells.Select.Letter && CORE.Cells.Select.Number) {
        CORE.eval();
        CORE.Grid.cleanEditSelection();
        CORE.Grid.getEditSelection(CORE.Cells.Select);
      }

      return void 0;

    }

    /** Valid cell ? */
    if (e.target.parentNode.id === CORE.DOM.Output.id) {

      /** User aborted live cell edit */
      CORE.Input.Mouse.LiveCellEdit = false;

      /** Hide live cell container */
      CORE.DOM.LiveCellContainer.style.display = "none";

      var name = e.target.getAttribute("name");
      var letter = CORE.$.alphaToNumber(name.match(CORE.REGEX.numbers).join(""));
      var number = parseInt(name.match(CORE.REGEX.letters).join(""));

      var cellName = (CORE.$.numberToAlpha(letter)) + number;

      CORE.Event.lastMouseDownCell.Letter = letter;
      CORE.Event.lastMouseDownCell.Number = number;

      CORE.Cells.Select = CORE.Event.lastMouseDownCell;

      /** Make sure the first property gets updated a maximum of 1 time per click */
      if (!CORE.Cells.Selected.First.Letter && !CORE.Cells.Selected.First.Number) {

        CORE.Cells.Selected.First = {
          Letter: letter,
          Number: number
        };

        CORE.Cells.Selected.Last = CORE.Cells.Selected.First;

        /** Update parent cell, so keypress only moving will work */
        CORE.Selector.parentSelectedCell = CORE.Cells.Selected.First;
        CORE.Grid.Settings.keyScrolledX = CORE.Grid.Settings.keyScrolledY = 0;

        /** Two selected cell coordinates */
        if (CORE.Cells.Selected.First.Letter &&
            CORE.Cells.Selected.First.Number &&
            CORE.Cells.Selected.Last.Letter &&
            CORE.Cells.Selected.Last.Number) {
          /** Only execute selection if user doesnt edit a cell at the moment */
          CORE.Selector.getSelection();
        }

        /** User edits a cell and clicked on another cell which was also edited */
        if ( CORE.Input.Mouse.Edit &&
             CORE.Cells.Edit !== CORE.Cells.Selected.First ||
             CORE.Cells.Edit !== CORE.Cells.Selected.Last  && 
             CORE.Cells.Selected.First === CORE.Cells.Selected.Last) {
          CORE.eval();
          CORE.Grid.cleanEditSelection();
        }

        /** Clean edited cells only if the current selected cell isn't edited */
        if (!CORE.Cells.Used[cellName]) CORE.Grid.cleanEditSelection();

      }

    /** User selected another cell, delete edited cell */
    } else if (CORE.Input.Mouse.Edit) {
      /** User clicked inside the cell grid */
      if (e.target.parentNode.id === CORE.DOM.Output.id) {
        CORE.Grid.cleanEditSelection();
      /** User chose the dark space */
      } else {
        CORE.Selector.getSelection();
        CORE.Grid.getEditSelection(CORE.Cells.Edit);
      }
    }

    this.lastMouseDown = e.timeStamp;

    CORE.Input.Mouse.Pressed = true;

  };

  /** Listen for mouse release */
  CORE.Event.mouseUp = function (e) {
  
    CORE.Input.Mouse.Pressed = false;

    /** Clean Selected Cells */
    CORE.Cells.Selected.First = CORE.Cells.Selected.First = {
      Letter: 0,
      Number: 0
    };

    /** User resized something */
    if (CORE.Input.Mouse.CellResize) {
      CORE.Grid.updateWidth();
      CORE.Grid.generateMenu();
      CORE.Selector.getSelection();
      CORE.Input.Mouse.CellResize = false;
    }

  };

  /**
   * Listen for mouse wipe
   *
   * @method mouseWipe
   * @static
   */
  CORE.Event.mouseWipe = function (e) {

    /** Dont execute mousemove event multiple times if position did not changed */
    if (CORE.Input.Mouse.lastMousePosition.x === e.pageX &&
        CORE.Input.Mouse.lastMousePosition.y === e.pageY) return void 0;

    /** User is wiping? */
    if (CORE.Input.Mouse.Pressed) {
      /** Valid cell ? */
      if (e.target.parentNode.id === CORE.DOM.Output.id) {

        var name = e.target.getAttribute("name");
        var letter = CORE.$.alphaToNumber(name.match(CORE.REGEX.numbers).join(""));
        var number = parseInt(name.match(CORE.REGEX.letters).join(""));
        var cellName = (CORE.$.numberToAlpha(letter)) + number;

        /** Make sure the first property gets updated a maximum of 1 time per wipe */
        if (!CORE.Cells.Selected.First.Letter && !CORE.Cells.Selected.First.Number) {

          CORE.Cells.Selected.First = {
            Letter: letter,
            Number: number
          }

        }

        /** Calm Down, dont overwrite stack value with same value again */
        //if (CORE.Cells.Selected.Last === e.target.getAttribute("name")) return;

        CORE.Cells.Selected.Last = {
          Letter: letter,
          Number: number
        }

        /** Two selected cell coordinates */
        if (CORE.Cells.Selected.First.Letter &&
            CORE.Cells.Selected.First.Number &&
            CORE.Cells.Selected.Last.Letter &&
            CORE.Cells.Selected.Last.Number) {
          /** Cell was never edited */
          if (!CORE.Cells.Used[cellName]) CORE.Selector.getSelection();
          /** Cell is in edited state */
          else {
            CORE.Grid.cleanEditSelection();
            CORE.Selector.getSelection();
          }
        }

        /** Clean edited cells only if the current selected cell isn't edited */
        if (!CORE.Cells.Used[cellName]) CORE.Grid.cleanEditSelection();

      }

    }

    /** Update mouse position */
    CORE.Input.Mouse.lastMousePosition.x = e.pageX;
    CORE.Input.Mouse.lastMousePosition.y = e.pageY;

  };

  /**
   * Listen for grid scrolling
   *
   * @method scroll
   * @static
   */
  CORE.Event.scroll = function(e) {

    /** Update empty timestamp */
    if (!this.lastMouseScroll) this.lastMouseScroll = e.timeStamp;

    /** Handle timestamps */
    if (this.lastMouseScroll > 0) {

       /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - this.lastMouseScroll;

      /** Prevent too fast mouse scrolling */
      if (difference && difference <= 30) return void 0;

    }

    var direction = 0;

    /** Make sure the grid was scrolled */
    if (e.target.parentNode.id === CORE.DOM.Output.id) {
      /** IE */
      if (e.wheelDelta) {
        if (e.wheelDelta * ( -120 ) > 0) direction = 1;
      /** Chrome, Firefox */
      } else {
        /** Chrome */
        if (e.deltaY > 0) {
          direction = 1;
        /** Firefox */
        } else if (e.detail * ( -120 ) > 0) {
          direction = 0;
        /** Firefox */
        } else if (e.detail * ( -120 ) < 0) {
          direction = 1;
        } else direction = 0;
      }

      direction = direction ? "down" : "up";

      if (direction === "down") {
        CORE.Grid.Settings.scrolledY += CORE.Settings.Scroll.Vertical;
        CORE.Grid.Settings.lastScrollY = CORE.Settings.Scroll.Vertical;
        CORE.Grid.updateHeight("down", CORE.Settings.Scroll.Vertical);
        CORE.Grid.updateMenu();
        CORE.Selector.getSelection();
      }
      else if (direction === "up") {
        if (CORE.Grid.Settings.scrolledY - CORE.Settings.Scroll.Vertical <= 0) {
          CORE.Grid.Settings.scrolledY = 0;
          CORE.Grid.Settings.lastScrollY = 0;
          CORE.Grid.updateHeight("default", CORE.Settings.Scroll.Vertical);
          CORE.Grid.updateMenu();
          CORE.Selector.getSelection();
        }
        else if (CORE.Grid.Settings.scrolledY - CORE.Settings.Scroll.Vertical >= 0) {
          CORE.Grid.Settings.scrolledY -= CORE.Settings.Scroll.Vertical;
          CORE.Grid.Settings.lastScrollY = CORE.Settings.Scroll.Vertical;
          CORE.Grid.updateHeight("up", CORE.Settings.Scroll.Vertical);
          CORE.Grid.updateMenu();
          CORE.Selector.getSelection();
        }
      }

      this.lastMouseScroll = e.timeStamp;

    }

  };

}).call(this);