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

  /** Initialize the cell style menu */
  NOVAE_UI.initCellStyleMenu = function() {

    /** Font styling menu */
    NOVAE_UI.initFontChangeMenu();

    /** Border styling menu */
    NOVAE_UI.initBorderChangeMenu();

    /** Background styling menu */
    NOVAE_UI.initBackgroundChangeMenu();

    /** Insert columns and rows menu */
    NOVAE_UI.initInjectionButtons();

  };