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
    if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {

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
        if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {
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

    /** Valid cell ? */
    if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {

      /** Abort all selection */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellHoverEffect();
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected = false;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      }

      /** User aborted master selection */
      NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;

      /** Hide live cell container */
      NOVAE.DOM.LiveCellContainer.style.display = "none";

      /** User can start to mouse wipe now */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.startedMouseWipe = true;

      var column = NOVAE.$.getNameFromDOMCell(e.target, false).number - 1 - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
      var row = NOVAE.$.getNameFromDOMCell(e.target.parentNode, false).number;

      var name = {letter: column, number: row};

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
      /** Got a unprocessed resize */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Column && NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Column.length) {
        NOVAE.Sheets[NOVAE.CurrentSheet].resizeColumn(NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Column);
        NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Column = null;
      }
      if (NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Row && NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Row.length) {
        NOVAE.Sheets[NOVAE.CurrentSheet].resizeRow(NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Row);
        NOVAE.Sheets[NOVAE.CurrentSheet].lastResized.Row = null;
      }
      NOVAE.Event.redraw();
      currentSheet.Input.Mouse.CellResize = false;
      /** Hide resize helpers */
      NOVAE.DOM.ColumnResizeHelper.style.display = "none";
      NOVAE.DOM.RowResizeHelper.style.display = "none";
    }

    /** Seems like user selected something */
    if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {

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

    if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {

      var column = NOVAE.$.getNameFromDOMCell(e.target, false).number - 1 - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
      var row = NOVAE.$.getNameFromDOMCell(e.target.parentNode, false).number;

      var name = {letter: column, number: row};

      var cell = NOVAE.$.numberToAlpha(name.letter) + name.number;

      NOVAE.DOM.CurrentCell.innerHTML = cell;

    }

    /** Abort, if user is currently resizing */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.CellResize) return void 0;

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
      if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.id === NOVAE.DOM.TableBody.id) {

        var cellName = (NOVAE.$.numberToAlpha(letter)) + number;

        var column = NOVAE.$.getNameFromDOMCell(e.target, false).number - 1 - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
        var row = NOVAE.$.getNameFromDOMCell(e.target.parentNode, false).number;

        var name = {letter: column, number: row};
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