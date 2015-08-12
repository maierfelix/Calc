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

  /** Initialize the font change menu */
  NOVAE_UI.initFontChangeMenu = function() {

    /** Initialize color picker */
    var pickers = document.querySelector("#font_colorpicker");

    var picker = new EightBitColorPicker({ el: pickers });

    /** Font family */
    for (var ii = 0; ii < NOVAE.DOM.ChangeFontUl.children.length; ++ii) {
      NOVAE.DOM.ChangeFontUl.children[ii].addEventListener(NOVAE.Events.mouseDown, function(e) {
        NOVAE.Styler.fontFamily(e.target.innerHTML);
        /** Dont loose the selection */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      });
    }

    /** Font size */
    for (var ii = 0; ii < NOVAE.DOM.ChangeFontSizeUl.children.length; ++ii) {
      NOVAE.DOM.ChangeFontSizeUl.children[ii].addEventListener(NOVAE.Events.mouseDown, function(e) {
        NOVAE.Styler.fontSize(e.target.innerHTML);
        /** Dont loose the selection */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      });
    }

    /** Fix selection loss on click */
    NOVAE.DOM.ChangeFontSize.addEventListener(NOVAE.Events.mouseDown, function(e) {

      /** Dont loose the selection */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

    });

    /** Initialize font bold menu item */
    NOVAE.DOM.ChangeFontBold.addEventListener(NOVAE.Events.mouseDown, function(e) {

      NOVAE.Styler.fontBold();

    });

    /** Initialize font italic menu item */
    NOVAE.DOM.ChangeFontItalic.addEventListener(NOVAE.Events.mouseDown, function(e) {

      NOVAE.Styler.fontItalic();

    });

    /** Initialize font underline menu item */
    NOVAE.DOM.ChangeFontUnderline.addEventListener(NOVAE.Events.mouseDown, function(e) {

      NOVAE.Styler.fontUnderline();

    });

    /** Apply color change */
    picker.addEventListener('colorChange', function(e) {

      pickers.style.display = "block";
      picker.show();

      NOVAE.Styler.fontColor(NOVAE.$.hexToRgba(e.detail.picker.getHexColor()));

    });

    /** Initialize font color menu */
    NOVAE.DOM.ChangeFontColor.addEventListener(NOVAE.Events.mouseDown, function(e) {

      /** Display the color picker */
      pickers.style.display = "block";
      picker.show();

    });

  };