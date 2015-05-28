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

"use strict"

  /** Initialize the cell style menu */
  CORE_UI.initCellStyleMenu = function() {

    /** Font styling menu */
    CORE_UI.initFontChangeMenu();

    /** Border styling menu */
    CORE_UI.initBorderChangeMenu();

    /** Background styling menu */
    CORE_UI.initBackgroundChangeMenu();

  };