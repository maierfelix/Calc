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

  /** Initialize the column and row injection buttons */
  NOVAE_UI.initInjectionButtons = function() {

    /** Initialize insert column button */
    NOVAE.DOM.InsertColumn.addEventListener(NOVAE.Events.mouseDown, function() {
      NOVAE.Injector.insertColumn();
    });

    /** Initialize delete column button */
    NOVAE.DOM.DeleteColumn.addEventListener(NOVAE.Events.mouseDown, function() {
      NOVAE.Injector.deleteColumn();
    });

    /** Initialize insert row button */
    NOVAE.DOM.InsertRow.addEventListener(NOVAE.Events.mouseDown, function() {
      NOVAE.Injector.insertRow();
    });

    /** Initialize delete row button */
    NOVAE.DOM.DeleteRow.addEventListener(NOVAE.Events.mouseDown, function() {
      NOVAE.Injector.deleteRow();
    });

  };