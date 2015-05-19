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
(function() { "use strict"

  /** Select and prepare the file output container */
  CORE.DOM.FileOutput = document.querySelector("#file");

  /** Select and prepare the main container */
  CORE.DOM.MainContainer = document.querySelector("#container");

  /** Select and prepare the output container */
  CORE.DOM.Output = document.querySelector("#output");

  /** Select and prepare the vertical menu */
  CORE.DOM.VerticalMenu = document.querySelector("#number_menu");

  /** Select and prepare the horizontal menu */
  CORE.DOM.HorizontalMenu = document.querySelector("#letter_menu");

  /** Select and prepare the current cell container */
  CORE.DOM.CurrentCell = document.querySelector("#current_cell");

  /** Select and prepare the debug container */
  CORE.DOM.DebugContainer = document.querySelector("#debug");

  /** Select and prepare the font change container */
  CORE.DOM.ChangeFont = document.querySelector("#change_font");

  /** Select and prepare the font size container */
  CORE.DOM.ChangeFontSize = document.querySelector("#change_fontSize");

  /** Select and prepare font color container */
  CORE.DOM.ChangeFontColor = document.querySelector("#change_fontColor");

  /** Select and prepare font color preview container */
  CORE.DOM.ChangeFontColorPreview = document.querySelector("#font_color_preview");

  /** Select and prepare the font bold change container */
  CORE.DOM.ChangeFontBold = document.querySelector("#change_bold");

  /** Select and prepare the font bold preview container */
  CORE.DOM.ChangeFontBoldPreview = document.querySelector("#change_bold_preview");

  /** Select and prepare the font italic change container */
  CORE.DOM.ChangeFontItalic = document.querySelector("#change_italic");

  /** Select and prepare the font italic change container */
  CORE.DOM.ChangeFontItalicPreview = document.querySelector("#change_italic_preview");

  /** Select and prepare the cell ilive cell container */
  CORE.DOM.ChangeLiveCell = document.querySelector("#change_livecell");

  /** Select and prepare the live cell preview container */
  CORE.DOM.ChangeLiveCellPreview = document.querySelector("#change_livecell_preview");

  /** Select and prepare the live cell output container */
  CORE.DOM.LiveCellOutput = document.querySelector("#livecell_current");

  /** Select and prepare the whole live cell container */
  CORE.DOM.LiveCellContainer = document.querySelector("#livecell_current_container");

  /** Select and prepare border settings container */
  CORE.DOM.ChangeCellBorder = document.querySelector("#change_border");

  /** Select and prepare border settings menu container */
  CORE.DOM.ChangeCellBorderMenu = document.querySelector("#border_settings_menu");

  /** Select and prepare border settings menu items container */
  CORE.DOM.ChangeCellBorderMenuItems = document.querySelector("#border_settings_menu_items");

  /** Select and prepare background cell settings container */
  CORE.DOM.ChangeCellBackground = document.querySelector("#change_background");

  /** Select and prepare the cell input container */
  CORE.DOM.CellInput = document.querySelector("#cell_input");

}).call(this);