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
      CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();

      CORE.Sheets[CORE.CurrentSheet].Selector.cellFocusSwitch = false;

      CORE.Sheets[CORE.CurrentSheet].getEditSelection(attribute);

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
    if (e.button === 1 || /** Middle click */
        e.button === 2 || /** Right click */
        e.which  === 3 || /** Right click */
        e.which  === 2 || /** Middle click */
        CORE.Input.Mouse.Pressed) {
          e.preventDefault();
          /** Dont loose selection */
          CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
          return void 0;
        }

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
      if (CORE.Sheets[CORE.CurrentSheet].Selector.Select.Letter && CORE.Sheets[CORE.CurrentSheet].Selector.Select.Number) {
        CORE.eval();
        CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
        CORE.Sheets[CORE.CurrentSheet].getEditSelection(CORE.Sheets[CORE.CurrentSheet].Selector.Select);
      }

      /** Dont loose selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

      return void 0;

    }

    /** Vertical menu clicked */
    if (e.target.parentNode.id === CORE.DOM.VerticalMenu.id) return void 0;

    /** Horizontal menu clicked */
    if (e.target.parentNode.id === CORE.DOM.HorizontalMenu.id) return void 0;

    /** Valid cell ? */
    if (e.target.parentNode.id === CORE.DOM.Output.id) {

      /** User aborted live cell edit */
      CORE.Input.Mouse.LiveCellEdit = false;

      /** User aborted master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;

      /** Hide live cell container */
      CORE.DOM.LiveCellContainer.style.display = "none";

      var name = e.target.getAttribute("name");
      var letter = CORE.$.alphaToNumber(name.match(CORE.REGEX.numbers).join(""));
      var number = ~~(name.match(CORE.REGEX.letters).join(""));

      var cellName = (CORE.$.numberToAlpha(letter)) + number;

      CORE.Event.lastMouseDownCell.Letter = letter;
      CORE.Event.lastMouseDownCell.Number = number;

      CORE.Sheets[CORE.CurrentSheet].Selector.Select = CORE.Event.lastMouseDownCell;

        CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First = {
          Letter: letter,
          Number: number
        };

        CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

        /** Update parent cell, so keypress only moving will work */
        CORE.Sheets[CORE.CurrentSheet].Selector.parentSelectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;
        CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX = CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY = 0;

        /** Two selected cell coordinates */
        if (CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Number) {
          /** Only execute selection if user doesnt edit a cell at the moment */
          CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
        }

        /** User edits a cell and clicked on another cell which was also edited */
        if ( CORE.Input.Mouse.Edit &&
             CORE.Sheets[CORE.CurrentSheet].Selector.Edit !== CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First ||
             CORE.Sheets[CORE.CurrentSheet].Selector.Edit !== CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last  && 
             CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First === CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last) {
          CORE.eval();
          CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
        }

        /** Clean edited cells only if the current selected cell isn't edited */
        if (CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)]) {
          if (!CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)][cellName]) CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
        }

    /** User selected another cell, delete edited cell */
    } else if (CORE.Input.Mouse.Edit) {
      /** User clicked inside the cell grid */
      if (e.target.parentNode.id === CORE.DOM.Output.id) {
        CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
      /** User chose the dark space */
      } else {
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
        CORE.Sheets[CORE.CurrentSheet].getEditSelection(CORE.Sheets[CORE.CurrentSheet].Selector.Edit);
      }
    }

    this.lastMouseDown = e.timeStamp;

    CORE.Input.Mouse.Pressed = true;

  };

  /** Listen for mouse release */
  CORE.Event.mouseUp = function (e) {
  
    CORE.Input.Mouse.Pressed = false;

    /** Clean Selected Cells */
    CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First = {
      Letter: CORE.Sheets[CORE.CurrentSheet].Selector.Select.Letter,
      Number: CORE.Sheets[CORE.CurrentSheet].Selector.Select.Number
    };

    /** User resized something */
    if (CORE.Input.Mouse.CellResize) {
      CORE.Sheets[CORE.CurrentSheet].updateWidth();
      CORE.Sheets[CORE.CurrentSheet].generateMenu();
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
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
        var number = ~~(name.match(CORE.REGEX.letters).join(""));
        var cellName = (CORE.$.numberToAlpha(letter)) + number;

        /** Make sure the first property gets updated a maximum of 1 time per wipe */
        if (!CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter && !CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number) {

          CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First = {
            Letter: letter,
            Number: number
          }

        }

        /** Calm Down, dont overwrite stack value with same value again */
        if ( (CORE.$.numberToAlpha(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Letter) + CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Number) === cellName) return void 0;

        CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last = {
          Letter: letter,
          Number: number
        }

        /** Two selected cell coordinates */
        if (CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Number) {
          /** Cell was never edited */
          if (!CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)]) CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
          else if (!CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)][cellName]) CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
          /** Cell is in edited state */
          else {
            CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
            CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
          }
        }

        /** Clean edited cells only if the current selected cell isn't edited */
        if (CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)]) {
          if (CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)][cellName]) CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
        }

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

    /** Abort if [STRG] key pressed */
    if (CORE.Input.Keyboard.Strg) return void 0;

    var calcDifference = Math.floor(CORE.Sheets[CORE.CurrentSheet].Settings.y * 1.5);

    /** Handle timestamps */
    if (this.lastMouseScroll > 0) {

       /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - this.lastMouseScroll;

      /** Scroll increment, if user scrolls fast */
      if (difference <= calcDifference) {
        CORE.Settings.Scroll.Vertical += Math.floor(CORE.Settings.Scroll.OriginalVertical * 1.5);
      /** Otherwise, reset scroll amount */
      } else {
        CORE.Settings.Scroll.Vertical = CORE.Settings.Scroll.OriginalVertical;
      }

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

      /** User scrolled up or down, dont redraw */
      CORE.Event.lastAction.scrollY = true;

      if (direction === "down") {
        CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY += CORE.Settings.Scroll.Vertical;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = CORE.Settings.Scroll.Vertical;

        /** Animate */
        if (difference > calcDifference * 2) {
          CORE.DOM.Output.classList.remove("moveDown");
          CORE.DOM.VerticalMenu.classList.remove("moveDown");
          CORE.DOM.Output.classList.remove("moveUp");
          CORE.DOM.VerticalMenu.classList.remove("moveUp");
          setTimeout( function() {
            CORE.DOM.Output.classList.add("moveUp");
            CORE.DOM.VerticalMenu.classList.add("moveUp");
          }, 55);
        }

        CORE.Sheets[CORE.CurrentSheet].updateHeight("down", CORE.Settings.Scroll.Vertical);
      }
      else if (direction === "up") {
        if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY - CORE.Settings.Scroll.Vertical <= 0) {
          CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY = 0;
          CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = 0;
          CORE.Sheets[CORE.CurrentSheet].updateHeight("default", CORE.Settings.Scroll.Vertical);

          /** Animate */
          CORE.DOM.Output.classList.remove("moveDown");
          CORE.DOM.VerticalMenu.classList.remove("moveDown");
          CORE.DOM.Output.classList.remove("moveUp");
          CORE.DOM.VerticalMenu.classList.remove("moveUp");
          CORE.DOM.Output.style.top = "0px";
          CORE.DOM.VerticalMenu.style.top = "100px";

        }
        else if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY - CORE.Settings.Scroll.Vertical >= 0) {
          CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY -= CORE.Settings.Scroll.Vertical;
          CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = CORE.Settings.Scroll.Vertical;
          CORE.Sheets[CORE.CurrentSheet].updateHeight("up", CORE.Settings.Scroll.Vertical);

          /** Animate */
          if (difference > calcDifference * 2) {
            CORE.DOM.Output.classList.remove("moveDown");
            CORE.DOM.VerticalMenu.classList.remove("moveDown");
            CORE.DOM.Output.classList.remove("moveUp");
            CORE.DOM.VerticalMenu.classList.remove("moveUp");
            setTimeout( function() {
              CORE.DOM.Output.classList.add("moveDown");
              CORE.DOM.VerticalMenu.classList.add("moveDown");
              CORE.DOM.Output.style.top = "-25px";
              CORE.DOM.VerticalMenu.style.top = "75px";
            }, 1);
          }

        }

      }

      /** Make sure user scrolled */
      if (direction) {
        /** Update menu, get new selection */
        CORE.Sheets[CORE.CurrentSheet].updateMenu();
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

        /** Simulate mouse move to display the scrolled selection */
        CORE.Input.Mouse.lastMousePosition.x = Math.random();
        CORE.Input.Mouse.lastMousePosition.y = Math.random();
        CORE.Event.mouseWipe(e);
      }

      this.lastMouseScroll = e.timeStamp;

    }

  };