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
        CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed) {
          e.preventDefault();
          /** Dont loose selection */
          CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
          return void 0;
        }

    /** Update empty timestamp */
    if (!CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDown) CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDown = e.timeStamp;

    /** Handle timestamps */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDown > 0) {

      /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDown;

      /** Max delay of 250 milliseconds */
      if (difference && difference <= 250) {
        if (e.target.parentNode.id === CORE.DOM.Output.id) {
          /** Prevent double mouse clicks between multiple cells */
          if (e.target.getAttribute("name") === CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell) {
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

      /** Abort all selection */
      if (CORE.Sheets[CORE.CurrentSheet].Selector.allSelected) {
        CORE.Sheets[CORE.CurrentSheet].Selector.deleteCellHoverEffect();
        CORE.Sheets[CORE.CurrentSheet].Selector.allSelected = false;
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
      }

      /** User aborted live cell edit */
      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.LiveCellEdit = false;

      /** User aborted master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;

      /** Hide live cell container */
      CORE.DOM.LiveCellContainer.style.display = "none";

      /** User can start to mouse wipe now */
      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.startedMouseWipe = true;

      var name = e.target.getAttribute("name");
      var letter = CORE.$.alphaToNumber(name.match(CORE.REGEX.numbers).join(""));
      var number = ~~(name.match(CORE.REGEX.letters).join(""));

      var cellName = (CORE.$.numberToAlpha(letter)) + number;

      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell.Letter = letter;
      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell.Number = number;

      CORE.Sheets[CORE.CurrentSheet].Selector.Select = CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell;

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
        if ( CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Edit &&
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
    } else if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Edit) {
      /** User clicked inside the cell grid */
      if (e.target.parentNode.id === CORE.DOM.Output.id) {
        CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
      /** User chose the dark space */
      } else {
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
        CORE.Sheets[CORE.CurrentSheet].getEditSelection(CORE.Sheets[CORE.CurrentSheet].Selector.Edit);
      }
    }

    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDown = e.timeStamp;

    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed = true;

  };

  /** Listen for mouse release */
  CORE.Event.mouseUp = function (e) {
  
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed = false;

    /** Abort extending */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Extend) {
      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Extend = false;
      /** Redraw the grid, since edits were made */
      CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
    }

    /** User resized something */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.CellResize) {
      CORE.Sheets[CORE.CurrentSheet].updateWidth();
      CORE.Sheets[CORE.CurrentSheet].generateMenu();
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.CellResize = false;
    }

  };

  /**
   * Listen for mouse wipe
   *
   * @method mouseWipe
   * @static
   */
  CORE.Event.mouseWipe = function (e) {

    var currentSheet = CORE.Sheets[CORE.CurrentSheet];

    /** Dont execute mousemove event multiple times if position did not changed */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.x === e.pageX &&
        CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.y === e.pageY) return void 0;

    /** Detect mouse move direction */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed) {

      if (e.pageX < currentSheet.mouseMoveDirection.oldX) currentSheet.mouseMoveDirection.directionX = "left";
      else if (e.pageX > currentSheet.mouseMoveDirection.oldX) currentSheet.mouseMoveDirection.directionX = "right";
      else currentSheet.mouseMoveDirection.directionX = null;

      if (e.pageY < currentSheet.mouseMoveDirection.oldY) currentSheet.mouseMoveDirection.directionY = "up";
      else if (e.pageY > currentSheet.mouseMoveDirection.oldY) currentSheet.mouseMoveDirection.directionY = "down";
      else currentSheet.mouseMoveDirection.directionY = null;

      currentSheet.mouseMoveDirection.oldY = e.pageY;

      currentSheet.mouseMoveDirection.oldX = e.pageX;
    }

    /** User is wiping? */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed) {
      /** Valid cell ? */
      if (e.target.parentNode.id === CORE.DOM.Output.id) {

        var name = e.target.getAttribute("name");
        var letter = CORE.$.alphaToNumber(name.match(CORE.REGEX.numbers).join(""));
        var number = ~~(name.match(CORE.REGEX.letters).join(""));
        var cellName = (CORE.$.numberToAlpha(letter)) + number;
        var compiledLetter = CORE.$.numberToAlpha(letter);

        /** Calm Down, dont overwrite stack value with same value again */
        if ( (CORE.$.numberToAlpha(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Letter) + CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Number) === cellName) return void 0;

        /** Make sure the first property gets updated a maximum of 1 time per wipe */
        if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.startedMouseWipe) {
          CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First = {
            Letter: CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell.Letter,
            Number: CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseDownCell.Number
          };
        }

        CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last = {
          Letter: letter,
          Number: number
        };

        /** Two selected cell coordinates */
        if (CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Letter &&
            CORE.Sheets[CORE.CurrentSheet].Selector.Selected.Last.Number) {
            /** Cell was never edited */
            if (!CORE.Cells.Used[CORE.CurrentSheet][compiledLetter] || 
                 CORE.Cells.Used[CORE.CurrentSheet][compiledLetter][compiledLetter + number] ||
                !CORE.Cells.Used[CORE.CurrentSheet][compiledLetter][cellName]) {
                  CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
                }
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

      if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Extend) CORE.Extender.extend();

    }

    /** Update mouse position */
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.x = e.pageX;
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.y = e.pageY;

    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.startedMouseWipe = true;

  };

  /**
   * Listen for grid scrolling
   *
   * @method scroll
   * @static
   */
  CORE.Event.scroll = function(e) {

    /** Update empty timestamp */
    if (!CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseScroll) CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    /** Abort if [STRG] key pressed */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg) return void 0;

    var calcDifference = Math.floor(CORE.Sheets[CORE.CurrentSheet].Settings.y * (CORE.SystemSpeed - 0.5));

    var direction = 0;

    var amount = 0;

    /** Make sure the grid was scrolled */
    if (e.target.parentNode.id === CORE.DOM.Output.id) {
      /** IE and Chrome */
      if (e.wheelDelta) {
        if (e.wheelDelta * ( -120 ) > 0) direction = 1;
        amount = Math.floor(e.wheelDelta / 10);
        amount = amount <= 0 ? amount * (-1) : amount;
      /** Chrome, Firefox */
      } else {
        /** Chrome */
        if (e.deltaY > 0) {
          direction = 1;
          amount = Math.floor(e.deltaY);
          amount = amount <= 0 ? amount * (-1) : amount;
        /** Firefox */
        } else if (e.detail * ( -120 ) > 0) {
          direction = 0;
          amount = Math.floor(e.detail * 10);
          amount = amount <= 0 ? amount * (-1) : amount;
        /** Firefox */
        } else if (e.detail * ( -120 ) < 0) {
          direction = 1;
          amount = Math.floor(e.detail * 10);
          amount = amount <= 0 ? amount * (-1) : amount;
        } else direction = 0;
      }

      direction = direction ? "down" : "up";

      /** Handle timestamps */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseScroll > 0) {

         /** Calculate difference between this and last timestamp */
        var difference = e.timeStamp - CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseScroll;

        var selectedCellsLength = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells.length;

        /** Large selection slows scrolling, below code fixes that */
        if (CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells.length >= 1e3) {
          /** Only do large scrolling if user presses the mouse */
          if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Pressed) {
            CORE.Settings.Scroll.Vertical = calcDifference + (Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) * 100);
          /** Go back to default mouse scroll amount */
          } else {
            /** Fast scroll depending on selection length, the larger the selection the greater the fast scroll chance */
            if (difference / CORE.SystemSpeed <= calcDifference * Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) / CORE.SystemSpeed) {
              CORE.Settings.Scroll.Vertical = Math.floor(amount);
            /** Large selection, dont care just scroll fast */
            } else if (selectedCellsLength >= 1e4) {
              CORE.Settings.Scroll.Vertical = Math.floor(amount);
            /** Slow scroll */
            } else {
              CORE.Settings.Scroll.Vertical = CORE.Settings.Scroll.OriginalVertical;
            }
          }
        /** Fast scrolling */
        } else if (difference <= 75) {
          CORE.Settings.Scroll.Vertical = Math.floor(amount);
        /** Slow scrolling */
        } else {
          CORE.Settings.Scroll.Vertical = CORE.Settings.Scroll.OriginalVertical;
        }

      }

      /** User scrolled up or down, dont redraw */
      CORE.Sheets[CORE.CurrentSheet].Input.lastAction.scrollY = true;

      if (direction === "down") {
        CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY += CORE.Settings.Scroll.Vertical;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = CORE.Settings.Scroll.Vertical;

        /** Animate, since slow scrolled */
        if (difference > 75 || difference > calcDifference * 2) {
          CORE.Event.animateMouseDown();
        }

        CORE.Sheets[CORE.CurrentSheet].updateHeight("down", CORE.Settings.Scroll.Vertical);
      }
      else if (direction === "up") {
        if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY - CORE.Settings.Scroll.Vertical <= 0) {
          CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY = 0;
          CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = 0;
          CORE.Sheets[CORE.CurrentSheet].updateHeight("default", CORE.Settings.Scroll.Vertical);

          CORE.Event.animateMouseUpMaximum();

        }
        else if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY - CORE.Settings.Scroll.Vertical >= 0) {
          CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY -= CORE.Settings.Scroll.Vertical;
          CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = CORE.Settings.Scroll.Vertical;
          CORE.Sheets[CORE.CurrentSheet].updateHeight("up", CORE.Settings.Scroll.Vertical);

          /** Animate, since slow scrolled */
          if (difference > 75 || difference > calcDifference * 2) {
            CORE.Event.animateMouseUp();
          }

        }

      }

      /** Make sure user scrolled */
      if (direction) {

        /** Share scrolling */
        if (CORE.Connector.connected) {
          CORE.Connector.action("scrolling", {direction: direction, amount: CORE.Settings.Scroll.Vertical, position: CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY});
        }

        /** Update menu, get new selection */
        CORE.Sheets[CORE.CurrentSheet].updateMenu();
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

        /** Simulate mouse move to display the scrolled selection */
        CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.x = Math.random();
        CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMousePosition.y = Math.random();
        CORE.Event.mouseWipe(e);
      }

      CORE.Sheets[CORE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    }

  };