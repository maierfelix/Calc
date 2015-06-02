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

  /** Initialize the column and row injection buttons */
  CORE_UI.initInjectionButtons = function() {

    /** Initialize insert column button */
    CORE.DOM.InsertColumn.addEventListener('click', CORE.Injector.insertColumn);

    /** Initialize insert row button */
    CORE.DOM.InsertRow.addEventListener('click', CORE.Injector.insertRow);

  };