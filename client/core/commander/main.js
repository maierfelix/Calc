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
   * The Commander
   *
   * @class Commander
   * @static
   */
  CORE.Commander = function() {

    this.Stack = {
      /** Save DO commands */
      redoCommands: [],
      /** Save UNDO commands */
      undoCommands: []
    };

    this.Settings = {
      /** Maximum redo amount */
      maxRedo: 250,
      /** Maximum undo amount */
      maxUndo: 250,
      /** Current redo stack position */
      redoPosition: 0,
      /** Current undo stack position */
      undoPosition: 0
    };

  };

  CORE.Commander.prototype = CORE.Commander;
  CORE.Commander.prototype.constructor = CORE.Commander;

  /**
   * Redo
   *
   * @method redo
   * @static
   */
  CORE.Commander.prototype.redo = function() {

    console.log("Redo!");

  };

  /**
   * Undo
   *
   * @method undo
   * @static
   */
  CORE.Commander.prototype.undo = function() {

    console.log("Undo!");

    /** Limited undo stack size.. */
    if ( (this.Stack.undoCommands.length + 1) >= this.Settings.maxUndo ) {
      /** Remove oldest undo command */
      this.Stack.undoCommand.shift();
    }

    this.executeUndo(this.lastUndoCommand());

  };

  /**
   * Push a REDO command into the stack
   *
   * @method pushRedoCommand
   * @static
   */
  CORE.Commander.prototype.pushRedoCommand = function(cmd) {

    this.Stack.redoCommands.push(cmd);

  };

  /**
   * Shift the REDO command stack
   *
   * @method shiftRedoCommand
   * @static
   */
  CORE.Commander.prototype.shiftRedoCommand = function() {

    return (this.Stack.redoCommands.pop());

  };

  /**
   * Push a UNDO command into the stack
   *
   * @method pushUndoCommand
   * @static
   */
  CORE.Commander.prototype.pushUndoCommand = function(cmd) {

    this.Stack.undoCommands.push(cmd);

  };

  /**
   * Shift the UNDO command stack
   *
   * @method lastUndoCommand
   * @static
   */
  CORE.Commander.prototype.lastUndoCommand = function() {

    return (this.Stack.undoCommands.pop());

  };

  /**
   * Execute a undo command
   *
   * @method executeUndo
   * @static
   */
  CORE.Commander.prototype.executeUndo = function(cmd) {

    /** Nothing to undo */
    if (!cmd) return void 0;

    switch (cmd.caller) {
      case "Selector":
        switch (cmd.action) {
          case "select":
            this.reverseSelection(cmd.data);
            break;
        }
        break;
    }

  };