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
  NOVAE.Event.mouseDoubleClick = function (e) {

    /** Valid cell ? */
    if (e.target.parentNode.id === NOVAE.DOM.Output.id) {

      /** Get grid number and fix it */
      var attribute = e.target.getAttribute("name");

      /** Clean old double click selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();

      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cellFocusSwitch = false;

      NOVAE.Sheets[NOVAE.CurrentSheet].getEditSelection(attribute);

    }

  };

  /**
   * Listen for mouse click
   *
   * @method mouseDown
   * @static
   */
  NOVAE.Event.mouseDown = function (e) {

    /** User aborted script edit */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.ScriptEdit) return void 0;

    /** Only accept left click, prevent multiple mousedown event */
    if (e.button === 1 || /** Middle click */
        e.button === 2 || /** Right click */
        e.which  === 3 || /** Right click */
        e.which  === 2 || /** Middle click */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed) {
          e.preventDefault();
          /** Dont loose selection */
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
          return void 0;
        }

    /** Update empty timestamp */
    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDown) NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDown = e.timeStamp;

    /** Handle timestamps */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDown > 0) {

      /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDown;

      /** Max delay of 250 milliseconds */
      if (difference && difference <= 250) {
        if (e.target.parentNode.id === NOVAE.DOM.Output.id) {
          /** Prevent double mouse clicks between multiple cells */
          if (e.target.getAttribute("name") === NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell) {
            NOVAE.Event.mouseDoubleClick(e);
            return void 0;
          }
        }
      }

    }

    /** Cell formula input field clicked */
    if (e.target.id === "cell_input") {

      /** User selected a cell */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Select.Letter && NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Select.Number) {
        NOVAE.eval();
        NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
        NOVAE.Sheets[NOVAE.CurrentSheet].getEditSelection(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Select);
      }

      /** Dont loose selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

      return void 0;

    }

    /** Vertical menu clicked */
    if (e.target.parentNode.id === NOVAE.DOM.VerticalMenu.id) return void 0;

    /** Horizontal menu clicked */
    if (e.target.parentNode.id === NOVAE.DOM.HorizontalMenu.id) return void 0;

    /** Valid cell ? */
    if (e.target.parentNode.id === NOVAE.DOM.Output.id) {

      /** Abort all selection */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellHoverEffect();
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected = false;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      }

      /** User aborted master selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Current = null;

      /** Hide live cell container */
      NOVAE.DOM.LiveCellContainer.style.display = "none";

      /** User can start to mouse wipe now */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.startedMouseWipe = true;

      var name = NOVAE.$.getNameFromDOMCell(e.target);

      var letter = name.letter;
      var number = name.number;

      var cellName = (NOVAE.$.numberToAlpha(letter)) + number;

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell.Letter = letter;
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell.Number = number;

      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Select = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell;

      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First = {
        Letter: letter,
        Number: number
      };

      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First;

      /** Update parent cell, so keypress only moving will work */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.parentSelectedCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First;
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY = 0;

      /** Two selected cell coordinates */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter &&
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number &&
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Letter &&
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Number) {
        /** Only execute selection if user doesnt edit a cell at the moment */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      }

      /** User edits a cell and clicked on another cell which was also edited */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit &&
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit !== NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First ||
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit !== NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last  && 
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First === NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last) {
        NOVAE.eval();
        NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
      }

      /** Clean edited cells only if the current selected cell isn't edited */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][NOVAE.$.numberToAlpha(letter)]) {
        if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][NOVAE.$.numberToAlpha(letter)][cellName]) NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
      }

    /** User selected another cell, delete edited cell */
    } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit) {
      /** User clicked inside the cell grid */
      if (e.target.parentNode.id === NOVAE.DOM.Output.id) {
        NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
      /** User chose the dark space */
      } else {
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
        NOVAE.Sheets[NOVAE.CurrentSheet].getEditSelection(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit);
      }
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDown = e.timeStamp;

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed = true;

  };

  /** Listen for mouse release */
  NOVAE.Event.mouseUp = function (e) {

    var currentSheet = NOVAE.Sheets[NOVAE.CurrentSheet];
  
    currentSheet.Input.Mouse.Pressed = false;

    /** Finish and abort extending */
    if (currentSheet.Input.Mouse.Extend) {
      currentSheet.Input.Mouse.Extend = false;
      NOVAE.Extender.extend();
      /** Redraw the grid, since edits were made */
      currentSheet.updateWidth("default");
      currentSheet.Selector.getSelection();
    }

    /** User resized something */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.CellResize) {
      NOVAE.Event.redraw();
      currentSheet.Input.Mouse.CellResize = false;
      /** Hide resize helpers */
      NOVAE.DOM.ColumnResizeHelper.style.display = "none";
      NOVAE.DOM.RowResizeHelper.style.display = "none";
    }

    /** Seems like user selected something */
    if (e.target.parentNode && e.target.parentNode.id === NOVAE.DOM.Output.id) {

      if (currentSheet.Selector.Selected.First.Letter &&
          currentSheet.Selector.Selected.First.Number &&
          currentSheet.Selector.Selected.Last.Letter  &&
          currentSheet.Selector.Selected.Last.Number) {

      /** Create a new command */
      var command = NOVAE.newCommand();
          command.caller = "Selector";
          command.action = "select";
          command.data = {
            first: currentSheet.Selector.Selected.First,
            last: currentSheet.Selector.Selected.Last
          };
          /** Push current selection state into the commander stack */
          currentSheet.Commander.pushUndoCommand(command, true);

      }

    }

  };

  /**
   * Listen for mouse wipe
   *
   * @method mouseWipe
   * @static
   */
  NOVAE.Event.mouseWipe = function (e) {

    var currentSheet = NOVAE.Sheets[NOVAE.CurrentSheet];

    /** Dont execute mousemove event multiple times if position did not changed */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.x === e.pageX &&
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.y === e.pageY) return void 0;

    /** Detect mouse move direction */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed) {

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
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed) {

      /** Valid cell ? */
      if (e.target.parentNode && e.target.parentNode.id === NOVAE.DOM.Output.id) {

      var cellName = (NOVAE.$.numberToAlpha(letter)) + number;

        var name = NOVAE.$.getNameFromDOMCell(e.target);
        var letter = name.letter;
        var number = name.number;
        var compiledLetter = NOVAE.$.numberToAlpha(letter);
        var cellName = compiledLetter + number;

        /** Calm Down, dont overwrite stack value with same value again */
        if ( (NOVAE.$.numberToAlpha(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Letter) + NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Number) === cellName) return void 0;

        /** Make sure the first property gets updated a maximum of 1 time per wipe */
        if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.startedMouseWipe) {
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First = {
            Letter: NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell.Letter,
            Number: NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseDownCell.Number
          };
        }

        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last = {
          Letter: letter,
          Number: number
        };

        /** Two selected cell coordinates */
        if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter &&
            NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number &&
            NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Letter &&
            NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.Last.Number) {
            /** Cell was never edited */
            if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][compiledLetter] || 
                 NOVAE.Cells.Used[NOVAE.CurrentSheet][compiledLetter][compiledLetter + number] ||
                !NOVAE.Cells.Used[NOVAE.CurrentSheet][compiledLetter][cellName]) {
                  NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
                }
                /** Cell is in edited state */
                else {
                  NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
                  NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
                }
        }

        /** Clean edited cells only if the current selected cell isn't edited */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][NOVAE.$.numberToAlpha(letter)]) {
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][NOVAE.$.numberToAlpha(letter)][cellName]) NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
        }

      }

    }

    /** Update mouse position */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.x = e.pageX;
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.y = e.pageY;

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.startedMouseWipe = true;

  };

  /**
   * Listen for grid scrolling
   *
   * @method scroll
   * @static
   */
  NOVAE.Event.scroll = function(e) {

    /** Disable zooming */
    //e.preventDefault();

    /** Detect horizontal scrolling */
    var horizontalScroll = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift ? true : false;

    var direction = 0;

    /** We're on a mobile device */
    if (NOVAE.Settings.Mobile) {

      var currentY = e.touches[0].clientY;
      var currentX = e.touches[0].clientX;

      var lastY = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY;
      var lastX = NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX;

      if (currentY > lastY) {
        direction = 0;
      } else if (currentY < lastY) {
        direction = 1;
      } else {
        if (lastX > -1 && currentX > -1) {
          if (lastX < currentX) {
            direction = 0;
            horizontalScroll = true;
          } else if (lastX > currentX) {
            direction = 1;
            horizontalScroll = true;
          }
        }
      }

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastY = currentY;
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Touch.lastX = currentX;

    }

    /** Update empty timestamp */
    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll) NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    /** Abort if [STRG] key pressed */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg) return void 0;

    var calcDifference = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * (NOVAE.SystemSpeed - 0.5));

    var amount = 0;

    /** Make sure the grid was scrolled */
    if (e.target.parentNode.id === NOVAE.DOM.Output.id) {

      /** Only calculate that way, if not on mobile */
      if (!NOVAE.Settings.Mobile) {
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
      }

      direction = direction ? "down" : "up";

      /** Handle timestamps */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll > 0) {

         /** Calculate difference between this and last timestamp */
        var difference = e.timeStamp - NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll;

        var selectedCellsLength = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells.length;

        /** Mobile device */
        if (!NOVAE.Settings.Mobile) {
          /** Large selection slows scrolling, below code fixes that */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells.length >= 1e3) {
            /** Only do large scrolling if user presses the mouse */
            if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed) {
              NOVAE.Settings.Scroll.Vertical = calcDifference + (Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) * 100);
              /** TODO: Slow scrolling on pressed mouse */
            /** Go back to default mouse scroll amount */
            } else {
              /** Fast scroll depending on selection length, the larger the selection the greater the fast scroll chance */
              if (difference / NOVAE.SystemSpeed <= calcDifference * Math.ceil(Math.log(selectedCellsLength + 1) / Math.LN10) / NOVAE.SystemSpeed) {
                NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
              /** Large selection, dont care just scroll fast */
              } else if (difference <= 75 && selectedCellsLength >= 1e4) {
                NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
              /** Slow scroll */
              } else {
                NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical;
              }
            }
          /** Fast scrolling */
          } else if (difference <= 75) {
            NOVAE.Settings.Scroll.Vertical = Math.floor(amount);
          /** Slow scrolling */
          } else {
            NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical * Math.ceil(NOVAE.SystemSpeed);
          }
        /** Mobile device scroll amount */
        } else {
          NOVAE.Settings.Scroll.Vertical = NOVAE.Settings.Scroll.OriginalVertical + 2;
        }

      }

      /** Only animate scrolling if grid is smaller than 65 and we're not on mobile */
      var largeGrid = NOVAE.Event.isLargeGrid();

      /** Calculate a scroll amount, divisible by 25 */
      var scrollAmount = Math.roundTo(NOVAE.Settings.Scroll.Vertical * 5, 25);

      /** User scrolled up or down, dont redraw */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = true;

      if (direction === "down") {

        if (largeGrid) scrollAmount *= 2;

        NOVAE.DOM.VerticalMenu.scrollTop += scrollAmount;
        NOVAE.DOM.Output.scrollTop += scrollAmount;

        /** Horizontal scrolling */
        if (horizontalScroll) {

          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX += NOVAE.Settings.Scroll.Horizontal;
          NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;

          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("right", NOVAE.Settings.Scroll.Horizontal);

        /** Vertical scrolling */
        } else {

          var downSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 2.5);

          var downReRender = Math.floor(NOVAE.DOM.Output.scrollTop / 25) + downSettingsY;

          if (downReRender >= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) {

            var value = 0;
            NOVAE.DOM.VerticalMenu.scrollTop = value;
            /** Make sure both elements are synchonous scrolled */
            if (value !== NOVAE.DOM.VerticalMenu.scrollTop) value = NOVAE.DOM.VerticalMenu.scrollTop;
            NOVAE.DOM.Output.scrollTop = value;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += Math.floor((downReRender - downSettingsY) + 1);
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
            NOVAE.Event.redraw();

          }

          /** Animate, since slow scrolled */
          if (difference > 75 || difference > calcDifference * 2) {
            //NOVAE.Event.animateMouseDown();
          }

        }

      }
      else if (direction === "up") {

        if (largeGrid) scrollAmount *= 2;

        NOVAE.DOM.VerticalMenu.scrollTop -= scrollAmount;
        NOVAE.DOM.Output.scrollTop -= scrollAmount;

        /** Horizontal scrolling */
        if (horizontalScroll) {

          if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX - NOVAE.Settings.Scroll.Horizontal <= 0) {

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX = 0;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = 0;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

            NOVAE.Event.redraw();

          } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX - NOVAE.Settings.Scroll.Horizontal >= 0) {

            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX -= NOVAE.Settings.Scroll.Horizontal;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("left");

          }

        /** Vertical scrolling */
        } else {

          var upSettingsY = Math.floor(NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y / 2.5);

          var upReRender = Math.floor(NOVAE.DOM.Output.scrollTop / 25) - upSettingsY;

          if (upReRender < 0) upReRender = upReRender * -1;

          if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY > 0 && upReRender === upSettingsY) {

            var value = Math.floor(upSettingsY * 2.5) * 100;
            NOVAE.DOM.Output.scrollTop = Math.floor(upSettingsY * 2.5) * 100;
            /** Make sure both elements are synchonous scrolled */
            if (NOVAE.DOM.Output.scrollTop !== value) value = NOVAE.DOM.Output.scrollTop;
            NOVAE.DOM.VerticalMenu.scrollTop = value;
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= Math.floor(upReRender + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y);
            NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = NOVAE.Settings.Scroll.Vertical;
            NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);
            NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
            NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

          }

          /** Animate, since slow scrolled */
          if (difference > 75 || difference > calcDifference * 2) {
            //NOVAE.Event.animateMouseUp();
          }

        }

      }

      /** Make sure user scrolled */
      if (direction) {

        /** Share scrolling */
        if (NOVAE.Connector.connected) {
          NOVAE.Connector.action("scrolling", {direction: direction, amount: NOVAE.Settings.Scroll.Vertical, position: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY});
        }

        /** Simulate mouse move to display the scrolled selection */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.x = Math.random();
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMousePosition.y = Math.random();
        /** Only simulate if we're on desktop */
        if (!NOVAE.Settings.Mobile) NOVAE.Event.mouseWipe(e);

        /** Make sure scroll amounts are synchronous */
        if (NOVAE.DOM.VerticalMenu.scrollTop !== NOVAE.DOM.Output.scrollTop) {
          NOVAE.DOM.Output.scrollTop = NOVAE.DOM.VerticalMenu.scrollTop;
          if (NOVAE.DOM.Output.scrollTop !== NOVAE.DOM.VerticalMenu.scrollTop) {
            NOVAE.DOM.VerticalMenu.scrollTop = NOVAE.DOM.Output.scrollTop;
          }
        }

      }

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.lastMouseScroll = e.timeStamp;

    }

  };