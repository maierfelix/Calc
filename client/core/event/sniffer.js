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
   * Check if user is in edit mode
   *
   * @method inEditMode
   * @static
   */
  CORE.Event.inEditMode = function() {

    /** Check if user edits a cell, if yes, sniff for input stream */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Edit) {
      /** User edits a valid cell */
      if (CORE.Sheets[CORE.CurrentSheet].Selector.Edit) {
        /** Check if edited cell got successfully registered inside the cell edit stack */
        var letter = CORE.Sheets[CORE.CurrentSheet].Selector.Edit.match(CORE.REGEX.numbers).join("");
        if (CORE.Cells.Used[CORE.CurrentSheet][letter] && CORE.Cells.Used[CORE.CurrentSheet][letter][CORE.Sheets[CORE.CurrentSheet].Selector.Edit]) return (true);
      }
    }

    return (false);

  };

  /**
   * Check if user pressed a arrow key
   *
   * @method pressedArrowKey
   * @static
   */
  CORE.Event.pressedArrowKey = function(keyCode) {

    /** Check if user pressed an arrow key */
    if ([37, 38, 39, 40].indexOf(keyCode) >= 0) return (true);
    return (false);

  };

  /**
   * Check if user pressed the enter key
   *
   * @method pressedEnter
   * @static
   */
  CORE.Event.pressedEnter = function(keyCode) {

    /** User finished cell edit and pressed [ENTER] */
    if (keyCode === 13) {
      /** User is in edit mode? */
      if (CORE.Event.inEditMode()) {
        CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
      }
      return (true);
    }

    return (false);

  };

  /**
   * Check if user edits a cell, if yes update its content
   *
   * @method sniffCellInput
   * @static
   */
  CORE.Event.sniffCellInput = function(keyCode) {

    var jumps = 0;

    /** User is in edit mode? */
    if (CORE.Event.inEditMode()) {
      /** Go to the end of a cell text if edit first time */
      CORE.Sheets[CORE.CurrentSheet].Selector.cellFocusSwitch = false;

      var letter = CORE.$.alphaToNumber(CORE.Sheets[CORE.CurrentSheet].Selector.Edit.match(CORE.REGEX.numbers).join(""));
      var number = ~~(CORE.Sheets[CORE.CurrentSheet].Selector.Edit.match(CORE.REGEX.letters).join(""));

      /** Get cell content and pass it into the cell edit cell stack */
      jumps = CORE.$.getCell({ letter: letter, number: number });
      if (jumps >= 0) CORE.Cells.Used[CORE.CurrentSheet][CORE.$.numberToAlpha(letter)][CORE.Sheets[CORE.CurrentSheet].Selector.Edit].Content = CORE.DOM.CellInput.value;
    }

    /** Check if user pressed [ENTER] */
    if (!CORE.Event.pressedEnter(keyCode)) {
      /** User pressed another key then [ENTER] */

      /** Fetch the current selected cell */
      CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();
      CORE.Sheets[CORE.CurrentSheet].getEditSelection({ letter: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter, number: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number });

      /** Async input processing */
      this.processCellContent();

    /** User pressed enter */
    } else CORE.Event.navigateTo("down", 1);

  };

  /**
   * Check if cell content is a formula
   *
   * @method isFormula
   * @static
   */
  CORE.Event.isFormula = function() {

    var editCell = CORE.Sheets[CORE.CurrentSheet].Selector.Edit;

    /** User is in edit mode? */
    if (CORE.Event.inEditMode()) {
      var letter = editCell.match(CORE.REGEX.numbers).join("");
      var number = editCell.match(CORE.REGEX.letters).join("");
      var cellEditContent = CORE.Cells.Used[CORE.CurrentSheet][letter] && CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content ? CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content : undefined;
      /** Check if cell is filled and valid */
      if (cellEditContent !== undefined && cellEditContent !== null && cellEditContent.length) {
        /** Cell starts with a "=" and will be interpreted as a formula */
        if (cellEditContent[0] === "=") {
          CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Formula = cellEditContent;

          /** Inherit cell formula to slave sheets */
          if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
            CORE.Styler.inheritCellValue({letter: letter, number: number, value: CORE.DOM.CellInput.value, type: "Formula"});
          }

        /** Cell has no formula anymore */
        } else {
          /** Clean the cell formula if it has content */
          if (CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Formula && CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Formula.length) {
            CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Formula = null;
          }
          /** Check if cell has content, if yes pass it over to the interpreter stack */
          if (CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content && CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content.length) {
            /** Update the cell stacks content */
            CORE.updateCell(editCell, CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content);
          }

          /** Inherit cell content to slave sheets */
          if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
            CORE.Styler.inheritCellValue({letter: letter, number: number, value: CORE.DOM.CellInput.value, type: "Content"});
          }

        }
      }
    }

  };

  /**
   * Take value of input cell and pass it into the accordingly cell
   *
   * @method processCellContent
   * @static
   */
  CORE.Event.processCellContent = function() {

    var editCell = CORE.Sheets[CORE.CurrentSheet].Selector.Edit;
    var element = null;
    var jumps = 0;
    var letter = editCell.match(CORE.REGEX.numbers).join("");
    var number = editCell.match(CORE.REGEX.letters).join("");

    /** Focus the cell input field on start typing */
    CORE.DOM.CellInput.focus();

    setTimeout(function() {
      CORE.$.registerCell({ letter: letter, number: number });
      jumps = CORE.$.getCell({ letter: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter, number: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number });
      if (jumps >= 0) element = CORE.DOM.Output.children[jumps];
      /** Update cell used stack value with cell input fields value */
      if (CORE.Cells.Used[CORE.CurrentSheet][letter][editCell]) CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content = CORE.DOM.CellInput.value;
      /** Cell is not in view, register it anyway */
      else CORE.registerCell(editCell);
      /** Update cell content with cell used stack value */
      if (element) element.innerHTML = CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content;
      /** Check if cell is a formula */
      CORE.Event.isFormula();
      /** Move cursor to end of cell content text */
      if (CORE.Cells.Used[CORE.CurrentSheet][letter][editCell] && CORE.Cells.Used[CORE.CurrentSheet][letter][editCell].Content && CORE.Sheets[CORE.CurrentSheet].Selector.cellFocusSwitch) CORE.Sheets[CORE.CurrentSheet].goToEndOfCellText();
      CORE.Sheets[CORE.CurrentSheet].Selector.cellFocusSwitch = true;
      /** Focus the cell input field while typing */
      CORE.DOM.CellInput.focus();

      /** Share cell changes */
      if (CORE.Connector.connected) {
        CORE.Connector.action("updateCell", { cell: editCell, value: CORE.DOM.CellInput.value });
      }

    }, 1);

  };

  /**
   * User edited a cell and wants to navigate to another
   *
   * @method navigateTo
   * @static
   */
  CORE.Event.navigateTo = function(direction, amount) {

    /** Run the interpreter */
    CORE.eval();

    CORE.Sheets[CORE.CurrentSheet].getEditSelection({ letter: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter, number: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number });

    CORE.Sheets[CORE.CurrentSheet].cleanEditSelection();

    /** Take selection and move it */
    CORE.Sheets[CORE.CurrentSheet].Selector.moveSelection(direction, amount);

    /** Leave the input */
    CORE.DOM.CellInput.blur();

  };