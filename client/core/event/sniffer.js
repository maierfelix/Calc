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
  NOVAE.Event.inEditMode = function() {

    /** Check if user edits a cell, if yes, sniff for input stream */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit) {
      /** User edits a valid cell */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit) {
        /** Check if edited cell got successfully registered inside the cell edit stack */
        var letter = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit.match(NOVAE.REGEX.numbers).join("");
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit]) return (true);
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
  NOVAE.Event.pressedArrowKey = function(keyCode) {

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
  NOVAE.Event.pressedEnter = function(keyCode) {

    /** User finished cell edit and pressed [ENTER] */
    if (keyCode === 13) {
      /** User is in edit mode? */
      if (NOVAE.Event.inEditMode()) {
        NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
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
  NOVAE.Event.sniffCellInput = function(keyCode) {

    var jumps = 0;

    /** User is in edit mode? */
    if (NOVAE.Event.inEditMode()) {
      /** Go to the end of a cell text if edit first time */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cellFocusSwitch = false;

      var letter = NOVAE.$.alphaToNumber(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit.match(NOVAE.REGEX.numbers).join(""));
      var number = ~~(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit.match(NOVAE.REGEX.letters).join(""));

      /** Get cell content and pass it into the cell edit cell stack */
      jumps = NOVAE.$.getCell({ letter: letter, number: number });
      if (jumps >= 0) {
        NOVAE.Cells.Used.updateCell(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit, {property: "Content", value: NOVAE.DOM.CellInput.value}, NOVAE.CurrentSheet);
      }
    }

    /** Check if user pressed [ENTER] */
    if (!NOVAE.Event.pressedEnter(keyCode)) {
      /** User pressed another key then [ENTER] */

      /** Fetch the current selected cell */
      NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();
      NOVAE.Sheets[NOVAE.CurrentSheet].getEditSelection({ Letter: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter, Number: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number });

      /** Async input processing */
      this.processCellContent();

    /** User pressed enter */
    } else NOVAE.Event.navigateTo("down", 1);

  };

  /**
   * Check if cell content is a formula
   *
   * @method isFormula
   * @static
   */
  NOVAE.Event.isFormula = function() {

    var editCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit;

    /** User is in edit mode? */
    if (NOVAE.Event.inEditMode()) {
      var letter = editCell.match(NOVAE.REGEX.numbers).join("");
      var number = editCell.match(NOVAE.REGEX.letters).join("");
      var cellEditContent = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Content ? NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Content : undefined;
      /** Check if cell is filled and valid */
      if (cellEditContent !== null) {
        /** Cell starts with a "=" and will be interpreted as a formula */
        if (cellEditContent && cellEditContent[0] === "=") {

          var lexed = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Formula.Lexed;

          NOVAE.Cells.Used.updateCell(editCell, {property: "Formula", value: {
            Lexed: lexed,
            Stream: cellEditContent
          }}, NOVAE.CurrentSheet);

          /** Inherit cell formula to slave sheets */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
            NOVAE.Styler.inheritCellValue({letter: letter, number: number, value: NOVAE.DOM.CellInput.value, type: "Formula"});
          }

        /** Cell has no formula anymore */
        } else {

          /** Clean the cell formula if it has content */
          NOVAE.Cells.Used.updateCell(editCell, {property: "Formula", value: {
            Lexed: null,
            Stream: null
          }}, NOVAE.CurrentSheet);

          NOVAE.Cells.Used.updateCell(editCell, {property: "Content", value: NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Content}, NOVAE.CurrentSheet);

          /** Inherit cell content to slave sheets */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
            NOVAE.Styler.inheritCellValue({letter: letter, number: number, value: NOVAE.DOM.CellInput.value, type: "Content"});
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
  NOVAE.Event.processCellContent = function() {

    var editCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit;
    var element = null;
    var jumps = 0;
    var letter = editCell.match(NOVAE.REGEX.numbers).join("");
    var number = editCell.match(NOVAE.REGEX.letters).join("");

    /** Focus the cell input field on start typing */
    NOVAE.DOM.CellInput.focus();

    setTimeout(function() {
      NOVAE.Cells.Used.registerCell(letter + number, NOVAE.CurrentSheet);
      jumps = NOVAE.$.getCell({ letter: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter, number: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number });
      if (jumps >= 0) element = NOVAE.DOM.Cache[jumps];
      /** Update cell used stack value with cell input fields value */
      if (NOVAE.Cells.Used.cellExists(editCell, NOVAE.CurrentSheet)) {
        NOVAE.Cells.Used.updateCell(editCell, {property: "Content", value: NOVAE.DOM.CellInput.value}, NOVAE.CurrentSheet);
      }
      /** Cell is not in view, register it anyway */
      else NOVAE.Cells.Used.registerCell(editCell, NOVAE.CurrentSheet);
      /** Update cell content with cell used stack value */
      if (element) {
        element.innerHTML = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Content;
        if (!isNaN(element.innerHTML)) {
          element.style.textAlign = "right";
        } else {
          element.style.textAlign = "left";
        }
      }
      /** Check if cell is a formula */
      NOVAE.Event.isFormula();
      /** Move cursor to end of cell content text */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell] &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][editCell].Content &&
          NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cellFocusSwitch) {
          NOVAE.Sheets[NOVAE.CurrentSheet].goToEndOfCellText();
      }
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.cellFocusSwitch = true;
      /** Focus the cell input field while typing */
      NOVAE.DOM.CellInput.focus();

      /** Share cell changes */
      if (NOVAE.Connector.connected) {
        NOVAE.Connector.action("updateCell", { cell: editCell, value: NOVAE.DOM.CellInput.value, property: "Content" });
      }

    }, 1);

  };

  /**
   * User edited a cell and wants to navigate to another
   *
   * @method navigateTo
   * @static
   */
  NOVAE.Event.navigateTo = function(direction, amount) {

    /** Run the interpreter */
    NOVAE.eval();

    NOVAE.Sheets[NOVAE.CurrentSheet].getEditSelection({ Letter: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter, Number: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number });

    NOVAE.Sheets[NOVAE.CurrentSheet].cleanEditSelection();

    /** Take selection and move it */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.moveSelection(direction, amount);

    /** Leave the input */
    NOVAE.DOM.CellInput.blur();

  };