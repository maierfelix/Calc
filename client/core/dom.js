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

  /** Cache the grid dom here */
  NOVAE.DOM.Cache = {};

  /** Select and prepare the file output container */
  NOVAE.DOM.FileOutput = document.querySelector("#file");

  /** Select and prepare the main container */
  NOVAE.DOM.MainContainer = document.querySelector("#container");

  /** Select and prepare the output container */
  NOVAE.DOM.Output = document.querySelector("#output");

  /** Select and prepare the vertical menu */
  NOVAE.DOM.VerticalMenu = document.querySelector("#number_menu");

  /** Select and prepare the horizontal menu */
  NOVAE.DOM.HorizontalMenu = document.querySelector("#letter_menu");

  /** Select and prepare the current cell container */
  NOVAE.DOM.CurrentCell = document.querySelector("#current_cell");

  /** Select and prepare the debug container */
  NOVAE.DOM.DebugContainer = document.querySelector("#debug");

  /** Select and prepare the font change container */
  NOVAE.DOM.ChangeFont = document.querySelector("#change_font");

  /** Select and prepare the font change ul container */
  NOVAE.DOM.ChangeFontUl = document.querySelector("#change_font_ul");

  /** Select and prepare the font size container */
  NOVAE.DOM.ChangeFontSize = document.querySelector("#change_fontSize");

  /** Select and prepare the font change ul container */
  NOVAE.DOM.ChangeFontSizeUl = document.querySelector("#change_fontSize_ul");

  /** Select and prepare font color container */
  NOVAE.DOM.ChangeFontColor = document.querySelector("#change_fontColor");

  /** Select and prepare the font bold change container */
  NOVAE.DOM.ChangeFontBold = document.querySelector("#change_bold");

  /** Select and prepare the font italic change container */
  NOVAE.DOM.ChangeFontItalic = document.querySelector("#change_italic");

  /** Select and prepare the font underline change container */
  NOVAE.DOM.ChangeFontUnderline = document.querySelector("#change_underline");

  /** Select and prepare the cell ilive cell container */
  NOVAE.DOM.ChangeLiveCell = document.querySelector("#change_livecell");

  /** Select and prepare the live cell output container */
  NOVAE.DOM.LiveCellOutput = document.querySelector("#livecell_current");

  /** Select and prepare the whole live cell container */
  NOVAE.DOM.LiveCellContainer = document.querySelector("#livecell_current_container");

  /** Select and prepare border settings container */
  NOVAE.DOM.ChangeCellBorder = document.querySelector("#change_border");

  /** Select and prepare border settings menu container */
  NOVAE.DOM.ChangeCellBorderMenu = document.querySelector("#border_settings_menu");

  /** Select and prepare border settings menu items container */
  NOVAE.DOM.ChangeCellBorderMenuItems = document.querySelector("#border_settings_menu_items");

  /** Select and prepare background cell settings container */
  NOVAE.DOM.ChangeCellBackground = document.querySelector("#change_background");

  /** Select and prepare the insert column button */
  NOVAE.DOM.InsertColumn = document.querySelector("#insert_column");

  /** Select and prepare the delete column button */
  NOVAE.DOM.DeleteColumn = document.querySelector("#delete_column");

  /** Select and prepare the insert row button */
  NOVAE.DOM.InsertRow = document.querySelector("#insert_row");

  /** Select and prepare the delete row button */
  NOVAE.DOM.DeleteRow = document.querySelector("#delete_row");

  /** Select and prepare the add sheet button */
  NOVAE.DOM.AddSheet = document.querySelector("#add_sheet");

  /** Select and prepare the current sheets container */
  NOVAE.DOM.Sheets = document.querySelector("#current_sheets");

  /** Select and prepare the redo button */
  NOVAE.DOM.RedoButton = document.querySelector("#button_redo");

  /** Select and prepare the undo button */
  NOVAE.DOM.UndoButton = document.querySelector("#button_undo");

  /** Select and prepare the redo menu button */
  NOVAE.DOM.RedoMenuButton = document.querySelector("#menu_redo");

  /** Select and prepare the undo menu button */
  NOVAE.DOM.UndoMenuButton = document.querySelector("#menu_undo");

  /** Select and prepare the cell input container */
  NOVAE.DOM.CellInput = document.querySelector("#cell_input");

  /** Select and prepare the script manager button */
  NOVAE.DOM.ScriptButton = document.querySelector("#script_button");